# youtube_downloader.py
import os
import uuid
import yt_dlp

def download_audio_from_youtube(url: str) -> str:
    try:
        print(f"[DEBUG] Downloading audio from: {url}")
        download_dir = os.path.join(os.getcwd(), "downloads")
        os.makedirs(download_dir, exist_ok=True)

        output_template = os.path.join(download_dir, f"{uuid.uuid4()}.%(ext)s")

        ydl_opts = {
            'format': 'bestaudio/best',
            'outtmpl': output_template,
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }],
            'quiet': True,
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            result = ydl.extract_info(url, download=True)
            filename = ydl.prepare_filename(result).replace(".webm", ".mp3").replace(".m4a", ".mp3")
            print(f"[INFO] Audio downloaded to: {filename}")
            return filename

    except Exception as e:
        print(f"[ERROR] Failed to download audio: {e}")
        raise e





