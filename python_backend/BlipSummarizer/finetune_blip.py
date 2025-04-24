from transformers import BlipForConditionalGeneration, BlipProcessor, Trainer, TrainingArguments
from datasets import load_dataset
import torch
from PIL import Image
import os

model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")
processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")

dataset = load_dataset("coco_captions", split="train[:1%]")
dataset = dataset.shuffle(seed=42)

def transform(example):
    image = Image.open(example['image']['path']).convert('RGB')
    caption = example['captions'][0]['text']
    
    inputs = processor(images=image, text=caption, return_tensors="pt", padding="max_length", truncation=True, max_length=128)
    inputs['labels'] = inputs['input_ids']
    return {k: v.squeeze() for k, v in inputs.items()}

dataset = dataset.map(transform)

training_args = TrainingArguments(
    output_dir="./blip_captioning",
    per_device_train_batch_size=4,
    num_train_epochs=3,
    logging_steps=10,
    save_steps=500,
    save_total_limit=2,
    fp16=torch.cuda.is_available(),
    remove_unused_columns=False
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=dataset,
    tokenizer=processor
)

trainer.train()
