import os
import re
import shutil

prefixes = [
    "configs", "criteria", "datasets", "environment",
    "models", "options", "pretrained_models",
    "scripts", "training", "utils"
]

base_dir = os.path.join(os.path.dirname(__file__), "SAM")

for root, _, files in os.walk(base_dir):
    for file in files:
        if file.endswith(".py"):
            file_path = os.path.join(root, file)

            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()

            original = content

            for prefix in prefixes:
                content = re.sub(
                    rf"(?<!from SAM)\bfrom\s+{prefix}\b",
                    f"from SAM.{prefix}",
                    content
                )
                content = re.sub(
                    rf"(?<!import SAM)\bimport\s+{prefix}\b",
                    f"import SAM.{prefix}",
                    content
                )

            if content != original:
                # 🔒 Yedeklemeden asla yazma
                shutil.copy(file_path, file_path + ".bak")
                with open(file_path, "w", encoding="utf-8") as f:
                    f.write(content)
                print(f"✅ Güncellendi + Yedeklendi: {file_path}")
