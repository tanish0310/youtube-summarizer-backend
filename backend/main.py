from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from whisper_backend import transcribe_audio
from qa_engine import initialize_qa_engine
from youtube_downloader import download_audio_from_youtube
import os


app = FastAPI()

# Allow CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this for production!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----- Pydantic Models -----

class TranscriptInput(BaseModel):
    transcript: str

class QuestionInput(BaseModel):
    transcript: str
    question: str

class YouTubeURLInput(BaseModel):
    url: str


# ----- Endpoints -----

@app.post("/upload")
async def upload_video(file: UploadFile = File(...)):
    try:
        transcript =  transcribe_audio(file)
        print("TRANSCRIPT TYPE:", type(transcript))
        print("TRANSCRIPT SAMPLE:", transcript[:300])  # For debugging

        return {"transcript": transcript}

    except Exception as e:
        print(f"Error in /upload: {str(e)}")
        return {"error": str(e)}


@app.post("/summary")
async def generate_summary(data: TranscriptInput):
    try:
        qa_engine = initialize_qa_engine(data.transcript)
        summary = qa_engine.run("Give a concise summary of the content.")
        return {"summary": summary}
    except Exception as e:
        print(f"Error in /summary: {str(e)}")
        return {"error": str(e)}


@app.post("/ask")
async def ask_question(data: QuestionInput):
    try:
        qa_engine = initialize_qa_engine(data.transcript)
        answer = qa_engine.run(data.question)
        return {"answer": answer}
    except Exception as e:
        print(f"Error in /ask: {str(e)}")
        return {"error": str(e)}
    

@app.post("/upload-url")
async def upload_youtube_url(data: YouTubeURLInput):
    try:
        audio_path = download_audio_from_youtube(data.url)

        # Transcribe using path directly (not file object)
        with open(audio_path, "rb") as f:
            # Pass file-like object to transcribe_audio if it expects UploadFile-like object
            transcript =  transcribe_audio(f)

        os.remove(audio_path)  # Cleanup
        print("TRANSCRIPT SAMPLE:", transcript[:300])
        return {"transcript": transcript}

    except Exception as e:
        print(f"Error in /upload-url: {str(e)}")
        return {"error": str(e)}


 


