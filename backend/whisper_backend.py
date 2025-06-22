import tempfile
import os
import whisper  # Make sure you have this installed: pip install -U openai-whisper

# Load the Whisper model once (globally)
model = whisper.load_model("base")  # Or "small", "medium", "large" as needed

def asr(file_path):
    return model.transcribe(file_path)

async def transcribe_audio(file):
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as tmp:
            tmp.write(await file.read())
            tmp_path = tmp.name

        result = asr(tmp_path)
        os.remove(tmp_path)

        return result["text"]
    except Exception as e:
        print(f"[Transcription Error] {e}")
        raise



