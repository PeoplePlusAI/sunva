import os
from dotenv import load_dotenv
import requests


load_dotenv("ops/.env")

GOOEY_API_KEY = os.getenv("GOOEY_API_KEY")

class Gooey:
    def __init__(self):
        self.api_key = GOOEY_API_KEY
    
    def translate(self, text: str, target_language: str) -> str:
        url = "https://api.gooey.ai/v2/translate"
        headers = {
            "Authorization": f"Bearer {self.api_key}",
        }
        payload = {
            "texts": [text],
            "target_language": target_language,
        }
        response = requests.post(
            url, headers=headers, json=payload
        )
        return response.json().get("output", {}).get(
            "output_texts", []
        )[0]