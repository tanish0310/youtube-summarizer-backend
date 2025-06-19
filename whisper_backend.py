from fastapi import FastAPI, Request
from pydantic import BaseModel
import whisper
import yt_dlp
import os
import uuid

app = FastAPI()
model = whisper.load_model("base")

class VideoURL(BaseModel):
    url: str

def download_audio(video_url):
    uid = str(uuid.uuid4())
    output_path = f"{uid}.mp3"
    ydl_opts = {
        'format': 'bestaudio/best',
        'outtmpl': output_path,
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
        'quiet': True
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([video_url])
    return output_path

@app.post("/transcribe")
def transcribe_video(data: VideoURL):
    audio_file = download_audio(data.url)
    result = model.transcribe(audio_file)
    os.remove(audio_file)
    return {"transcript": result["text"]}
