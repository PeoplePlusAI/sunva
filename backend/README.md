# SUNVA BACKEND

## SUNVA AI Architecture

Please go through the [architecture diagram](https://www.figma.com/board/INrqk911VUw8uF29VrVnMw/Sunva-p1-flow-diagram?node-id=0-1&t=HF91DJzPwA6QnQT6-1) to understand how SUNVA AI works. Please raise your questions in the issues section if you have any.

## How to run POC

1. Clone the repository
2. Install the dependencies
```
poetry install
```
3. Install Redis and start the server in the background
```
redis-server &
```
4. Create a .env file inside ops dir and add the following variables
```
DATABASE_URL=YOURPOSTGRES_URL
GROQ_API_KEY=your_api_key
CLAUDE_API_KEY=your_api_key
OPENAI_API_KEY=your_api_key
BASE_MODEL=model_name (eg: Claude 3 Sonnet)
SPEECH_BASE_MODEL=model_name (eg: Whisper Large)
TTS_BASE_MODEL=model_name (eg: coqui-tacotron2)
JWT_SECRET_KEY=your_secret_key
```
5. Run the POC
```
uvicorn main:app --reload
```
6. Open the browser and go to
```
http://localhost:8000/
```

### Using Poetry installer

1. Run this to enter virtual env
```
poetry shell
```
2. Install the dependencies
```
poetry install
```

## How to contribute

There are few ways you can contribute to SUNVA AI.

1. By providing feedback on the POC
2. By raising issues in the issues section
3. By contributing to the codebase based on the issues
4. Join the SUNVA AI team by filling the [p+ai volunteer form](https://peopleplus.ai/volunteer) and select the SUNVA AI project.




