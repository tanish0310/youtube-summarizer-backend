def transcribe_audio(file):
    import whisper
    import tempfile
    import os

    model = whisper.load_model("base")

    if isinstance(file, (str, os.PathLike)):
        audio_path = file
        delete_after = False
    else:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as tmp:
            contents = file.read()
            tmp.write(contents)
            tmp.flush()
            audio_path = tmp.name
            delete_after = True

    try:
        result = model.transcribe(audio_path)
        return result["text"]
    finally:
        if delete_after and os.path.exists(audio_path):
            os.remove(audio_path)






