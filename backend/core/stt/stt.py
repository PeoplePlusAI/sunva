from io import BytesIO
from typing import Tuple, Union
from core.stt.groq_client import GroqSTT
from core.stt.bodhi_client import BodhiSTT
from core.stt.google_client import GoogleCloudSTT
from dotenv import load_dotenv
import os

load_dotenv("ops/.env")

PREFERRED_STT_MODEL = os.getenv("PREFERRED_STT_MODEL")
class STT:
    def __init__(self, language: str):
        self.language = language
        self.models = {
            "GOOGLE": {
                "en": "en-IN",  # Default model for English in Google Cloud
                "hi": "hi-IN",  # Default model for Hindi in Google Cloud
                # Add other languages and corresponding models
            },
            "GROQ": {
                "en": "whisper-large-v3",  # Default model for English
            },
            "BODHI": {
                "hi": "hi-general-v2-8khz",  # Default model for Hindi in Bodhi
                "kn": "kn-general-v2-8khz",  # Default model for Kannada
                # Add other languages and corresponding models
            }
        }
        self.preferred_model = PREFERRED_STT_MODEL
        self.model_id, self.model_enum = self._select_model()

    def _select_model(self) -> Tuple[str, str]:
        if self.preferred_model and self.preferred_model in self.models:
            if self.language in self.models[self.preferred_model]:
                return self.models[self.preferred_model][self.language], self.preferred_model

        for model_enum, lang_models in self.models.items():
            if self.language in lang_models:
                return lang_models[self.language], model_enum

        raise ValueError(f"Unsupported language: {self.language}")

    def list_models(self):
        return self.models

    async def transcribe_stream(self, audio_buffer: Union[str, BytesIO]):
        if self.model_enum == "GROQ":
            groq_stt = GroqSTT(self.model_id, language=self.language)
            async for partial_transcription in groq_stt.transcribe_stream(audio_buffer):
                yield partial_transcription
        elif self.model_enum == "BODHI":
            bodhi_stt = BodhiSTT(self.model_id, language=self.language)
            async for partial_transcription in bodhi_stt.transcribe_stream(audio_buffer):
                yield partial_transcription
        elif self.model_enum == "GOOGLE":
            print(f"Using Google Cloud STT with {self.model_id} model")
            google_stt = GoogleCloudSTT(self.model_id)
            async for partial_transcription in google_stt.transcribe_stream(audio_buffer):
                yield partial_transcription
        else:
            raise ValueError(f"Unsupported language: {self.language}")