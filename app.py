from flask import Flask, render_template, request, jsonify
import yt_dlp
import subprocess
from io import BytesIO, StringIO
from werkzeug.utils import secure_filename
import ffmpeg
import os

app = Flask(__name__)

@app.get('/')
def index():
    return render_template('index.html')

@app.post("/process")
def process():
    url = request.form.get('url', '0')
    print(url)

    if url:
        try:
            ydl_opts = {
                'format': 'best[height<=1080]+bestaudio/best[height<=1080]',
                'nocheckcertificate': True
            }

            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info_dict = ydl.extract_info(url, download=False)
                title = f"{info_dict['fulltitle'][:20]}..."
                
                channel = f"@{info_dict['channel']}"
                description = f"{info_dict['description'][:100]}..."
                if 'entries' in info_dict:
                    video_url = info_dict['entries'][0]['url']
                else:
                    video_url = info_dict['url']
            
            return jsonify({
                'url': video_url,
                'title': title,
                'channel': channel,
                'description': description
            })
        except:
            return jsonify({
                'error': "This Is Not a Video Url!"
            })
    return jsonify({
        'error': "There is No Data To Be Downloaded!"
    })

def convert_file(file_stream, convert_to, video_format = False, image_format = False):
    try:
        if video_format == True:
            try: 
                print(1)

                memfile = BytesIO() 
                memfile.write(file_stream.read())  
                memfile.seek(0) 

                print(2)
                if convert_to.lower() == "avi":
                    command = ['ffmpeg', '-i', '-','-y' , '-g', '52', '-c:a', 'aac', '-b:a', '64k', '-c:v', 'libx264', '-b:v', '448k', '-f',  f'{convert_to.lower()}', '-movflags', 'frag_keyframe+empty_moov', 'static/files/out.avi']
                elif convert_to.lower() == "mov":
                    command = ['ffmpeg', '-i', '-','-y', '-g', '52', '-c:a', 'aac', '-b:a', '64k', '-c:v', 'libx264', '-b:v', '448k', '-f',  f'{convert_to.lower()}', '-movflags', 'frag_keyframe+empty_moov', 'static/files/out.mov']

                elif convert_to.lower() == "mp4":
                    command = ['ffmpeg', '-i', '-', '-y', '-g', '52', '-c:a', 'aac', '-b:a', '64k', '-c:v', 'libx264', '-b:v', '448k', '-f',  f'{convert_to.lower()}', '-movflags', 'frag_keyframe+empty_moov', 'static/files/out.mp4']

                elif convert_to.lower() == "webm":
                    command = ['ffmpeg', '-i', '-','-y', '-f',  f'{convert_to.lower()}', 'static/files/out.webm']

                elif convert_to.lower() == "mkv":
                    command = ['ffmpeg', '-i', '-', '-y', '-vf', 'scale=1080:-1', '-acodec', 'copy',  '-threads', '12',  '-f',  'matroska', 'static/files/out.mkv']


                else:
                    raise Exception(f"Error converting video: Not Vaild Format")


                process = subprocess.Popen(command, stdin=subprocess.PIPE, stdout=subprocess.PIPE)

                new_file, errordata = process.communicate(memfile.read())

                return new_file
            except Exception as img_err:
                raise Exception(f"Error converting video: {str(img_err)}")

        # elif image_format == True:
        #     memfile = BytesIO() 
        #     memfile.write(file_stream.read())  
        #     memfile.seek(0) 

        #     # Convert the video to the desired format using ffmpeg
        #     command = ['ffmpeg', '-y', '-i', '-', '-f' , f'{convert_to.lower()}', '-']

        #     # Run the ffmpeg command and capture the output
        #     process = subprocess.Popen(command, stdin=subprocess.PIPE, stdout=subprocess.PIPE)
            
        #     new_file, errordata = process.communicate(memfile.read())

        #     if errordata:
        #         raise Exception(f"FFmpeg error: {errordata.decode('utf-8')}")

            # return new_file
        else:
            raise ValueError("Invalid conversion format")
    except Exception as e:
        raise e

@app.post("/convert")
def converter():
    file = request.files.get('file')
    convert_to = request.form.get('convert_to', '')
    
    print(file.filename, convert_to)
    if file and convert_to:
        try:
            # Assuming 'convert_file' function converts to image format for demonstration
            image_formats = ['bmp', 'eps', 'gif', 'pdf', 'im', 'jpg', 'msp', 'pcx', 'png', 'ppm', 'tiff']
            video_formats = ['mp4', 'mov', 'avi', 'webm', 'mkv']

            # if convert_to.lower() in image_formats:
            #     converted_content = convert_file(file.stream, convert_to, False, True)
            #     return send_file(
            #         BytesIO(converted_content),
            #         mimetype='image/' + convert_to,  # Update MIME type based on the converted format
            #         as_attachment=True,
            #         download_name=f"converted_file.{convert_to}"
            #     )

            if convert_to.lower() in video_formats:
                convert_file(file.stream, convert_to, True, False)
                
                return jsonify({
                'title': 'out',
                'format': f'{convert_to.lower()}'
            })
            # Sending the converted file back to the front end
        except Exception as e:
            return jsonify({'error': f"There was an error with the conversion: {str(e)}"})

    return jsonify({'error': "Invalid request data"})



@app.get("/urlpage")
def urlpage():
    return render_template('urlpage.html')

@app.get("/fileconverter")
def fileconverter():
    return render_template('fileconverter.html')

@app.get("/donate")
def donate():
    return render_template('donate.html')

@app.get("/aboutus")
def aboutus():
    return render_template('aboutus.html')
