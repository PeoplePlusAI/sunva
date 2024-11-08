import os
import io
import traceback
from google.cloud.speech_v2 import SpeechClient
from google.cloud.speech_v2.types import cloud_speech
import soundfile as sf
from dotenv import load_dotenv

load_dotenv(
    "ops/.env"
)

PROJECT_ID = os.getenv("GOOGLE_PROJECT_ID")

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = os.getenv("GOOGLE_PROJECT_JSON")

class GoogleCloudSTT:
    def __init__(self, language: str = "en-IN", model: str = "long"):
        self.client = SpeechClient()
        self.language = language
        self.model = model
        self.config = cloud_speech.RecognitionConfig(
            auto_decoding_config=cloud_speech.AutoDetectDecodingConfig(),
            language_codes=[self.language],
            model=self.model,
        )

    async def transcribe_stream(self, audio_buffer: io.BytesIO) -> str:
        audio_buffer.seek(0)
        content = audio_buffer.read()
        
        request = cloud_speech.RecognizeRequest(
            recognizer=f"projects/{PROJECT_ID}/locations/global/recognizers/_",
            config=self.config,
            content=content
        )
        
        try:
            response = self.client.recognize(request=request)
            transcript = ""
            for result in response.results:
                transcript += result.alternatives[0].transcript.strip() + " "
            
            yield transcript.strip()
        
        except Exception as e:
            traceback.print_exc()
            yield "<Error in transcription>"