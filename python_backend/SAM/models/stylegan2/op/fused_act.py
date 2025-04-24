import torch
from torch import nn
import torch.nn.functional as F


class FusedLeakyReLU(nn.Module):
    def __init__(self, channels, bias=True, negative_slope=0.2, scale=2 ** 0.5):
        super().__init__()
        if bias:
            self.bias = nn.Parameter(torch.zeros(channels))
        else:
            self.bias = None
        self.negative_slope = negative_slope
        self.scale = scale

    def forward(self, input):
        if self.bias is not None:
            input = input + self.bias.view(1, -1, 1, 1)
        return F.leaky_relu(input, negative_slope=self.negative_slope) * self.scale


def fused_leaky_relu(input, bias=None, negative_slope=0.2, scale=2 ** 0.5):
    if bias is not None:
        input = input + bias.view(1, -1, 1, 1)
    return F.leaky_relu(input, negative_slope=negative_slope) * scale
