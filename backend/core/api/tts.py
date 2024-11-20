from fastapi import ( 
    WebSocket, 
    WebSocketDisconnect,
    APIRouter,
    Depends
)
from core.models.tts import TTSResponse
from core.ai.speech import text_to_speech
from core.utils.speech_utils import encode_wav_to_base64
from core.utils.executor_utils import executor
from sqlalchemy.ext.asyncio import AsyncSession
from core.ai.text import enhance_text_input
from core.db.database import get_session
from core.models.db import SpeechDB
from core.db.redis_client import redis_client
from dotenv import load_dotenv
import asyncio
import base64
import pickle
import json
import os

# Initialize environment variables
load_dotenv(
    dotenv_path="ops/.env"
)

tts_model = os.getenv("TTS_BASE_MODEL", "coqui-tacotron2")
              
router = APIRouter()

@router.websocket("/v1/ws/speech")
async def tts_websocket(
    websocket: WebSocket, 
    session: AsyncSession = Depends(get_session)
):
    await websocket.accept()

    try:
        user_id = websocket.client.host
        cache_key = f"tts_session:{user_id}"
        await redis_client.delete(cache_key)  # Clear any existing data for this session
        
        while True:
            message = await websocket.receive_text()
            print(f"Received message: {message}")
            message = json.loads(message)
            
            selected_language = message.get("language", "en") #This sets the lang everywhere for pipeline.
            user_id = message.get("user_id", "default_user")
            gender = message.get("gender", "female")

            if "text" in message:
                text = message["text"]
                print(f"Received text for TTS: {text}")

                enhanced_text = await asyncio.get_event_loop().run_in_executor(
                    executor, enhance_text_input, text, selected_language
                )

                wav_data = await asyncio.get_event_loop().run_in_executor(
                    executor, text_to_speech, enhanced_text, tts_model, selected_language, gender
                )
            else:
                wav_data = None

            if wav_data and tts_model.startswith("ai4bharat"):
                await redis_client.rpush(cache_key, json.dumps({"text": text, "wav_data": wav_data}))
                
                response = TTSResponse(
                    audio=wav_data,
                    original=text,
                    enhanced=enhanced_text
                )
            elif wav_data and (tts_model == "coqui-glow-tts" or tts_model == "coqui-tacotron2"):
                wav_data_pickled = pickle.dumps(wav_data)
                audio_base64 = encode_wav_to_base64(wav_data)
                wav_data_base64 = base64.b64encode(wav_data_pickled).decode('utf-8')
                
                # Cache in Redis
                await redis_client.rpush(cache_key, json.dumps({"text": text, "wav_data": wav_data_base64}))
                
                response = TTSResponse(
                    audio=wav_data,
                    original=text,
                    enhanced=enhanced_text
                )
            else:
                print("No audio data received from text_to_speech")
                return {}

            try:
                await websocket.send_json(response.model_dump())
            except ConnectionClosedOK:
                print("WebSocket connection closed by the client")
                break  # Stop the loop if the connection is closed
            except ConnectionClosedError as e:
                print(f"WebSocket connection closed unexpectedly: {e}")
                break


    except WebSocketDisconnect:
        print("TTS client disconnected")
    finally:
        await handle_cached_data_persistence(cache_key, session, user_id, selected_language)


async def handle_cached_data_persistence(cache_key, session, user_id, selected_language):
    cached_data = await redis_client.lrange(cache_key, 0, -1)
    for item in cached_data:
        item_dict = json.loads(item)
        text = item_dict["text"]
        text = await asyncio.get_event_loop().run_in_executor(
            executor, enhance_text_input, text, selected_language
        )
        wav_data_base64 = item_dict["wav_data"]
        
        # Decode and handle audio data properly
        if tts_model.startswith("ai4bharat"):
            wav_data_bytes = base64.b64decode(wav_data_base64)
        elif tts_model in ["coqui-glow-tts", "coqui-tacotron2"]:
            wav_data_bytes = base64.b64decode(wav_data_base64)
            wav_data = pickle.loads(wav_data_bytes)
        else:
            raise ValueError(f"Unknown TTS model: {tts_model}")
        
        # Save to database
        speech_record = SpeechDB(
            user_id=user_id,
            audio=wav_data_bytes,
            text=text,
            language=selected_language
        )
        session.add(speech_record)

    await session.commit()
    await redis_client.delete(cache_key)

