import torch
import torch.nn.functional as F

def upfirdn2d_native(input, kernel, up_x, up_y, down_x, down_y, pad_x0, pad_x1, pad_y0, pad_y1):
    _, in_h, in_w, minor = input.shape
    kernel_h, kernel_w = kernel.shape

    out = input.view(-1, in_h, 1, in_w, 1, minor)
    out = F.pad(out, [0, 0, 0, up_x - 1, 0, 0, 0, up_y - 1])
    out = out.view(-1, in_h * up_y, in_w * up_x, minor)

    out = F.pad(
        out, [0, 0, max(pad_x0, 0), max(pad_x1, 0), max(pad_y0, 0), max(pad_y1, 0)]
    )
    out = out[
        :,
        max(-pad_y0, 0): out.shape[1] - max(-pad_y1, 0),
        max(-pad_x0, 0): out.shape[2] - max(-pad_x1, 0),
        :,
    ]

    out = out.permute(0, 3, 1, 2)
    out = out.reshape(
        [-1, 1, in_h * up_y + pad_y0 + pad_y1, in_w * up_x + pad_x0 + pad_x1]
    )
    w = torch.flip(kernel, [0, 1]).view(1, 1, kernel_h, kernel_w)
    out = F.conv2d(out, w)
    out = out.reshape(
        -1,
        minor,
        in_h * up_y + pad_y0 + pad_y1 - kernel_h + 1,
        in_w * up_x + pad_x0 + pad_x1 - kernel_w + 1,
    )
    out = out.permute(0, 2, 3, 1)

    return out[:, ::down_y, ::down_x, :]


# asıl çağrılan wrapper fonksiyon
def upfirdn2d(input, kernel, up=1, down=1, pad=(0, 0)):
    up_x = up_y = up if isinstance(up, int) else up
    down_x = down_y = down if isinstance(down, int) else down
    pad_x0, pad_x1 = pad if isinstance(pad, tuple) else (pad, pad)
    pad_y0, pad_y1 = pad if isinstance(pad, tuple) else (pad, pad)

    batch, channel, in_h, in_w = input.shape

    # Native fonksiyon 4 boyutlu input bekliyor: (B*C, H, W, C)
    input = input.permute(0, 2, 3, 1).contiguous()  # BCHW → BHWC
    input = input.view(-1, in_h, in_w, channel)

    out = upfirdn2d_native(
        input, kernel, up_x, up_y, down_x, down_y, pad_x0, pad_x1, pad_y0, pad_y1
    )

    out_h, out_w = out.shape[1], out.shape[2]
    out = out.view(batch, out_h, out_w, channel).permute(0, 3, 1, 2).contiguous()

    return out
