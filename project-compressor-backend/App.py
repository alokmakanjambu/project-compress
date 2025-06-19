from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import shutil
from werkzeug.utils import secure_filename
from PIL import Image
import pikepdf
import subprocess

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
COMPRESSED_FOLDER = 'compressed'
ALLOWED_EXTENSIONS = {'pdf', 'jpg', 'jpeg', 'png', 'docx', 'pptx', 'xlsx', 'zip', 'txt'}

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(COMPRESSED_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def compress_file(input_path, output_path):
    ext = os.path.splitext(input_path)[1].lower()
    try:
        if ext == '.pdf':
            temp_output = output_path + ".tmp.pdf"
            compress_pdf_with_gs(input_path, temp_output)
            orig_size = os.path.getsize(input_path)
            comp_size = os.path.getsize(temp_output)
            if comp_size < orig_size:
                shutil.move(temp_output, output_path)
            else:
                shutil.copyfile(input_path, output_path)
                os.remove(temp_output)
        elif ext in ['.jpg', '.jpeg', '.png']:
            img = Image.open(input_path)
            img.save(output_path, optimize=True, quality=70)
        else:
            shutil.copyfile(input_path, output_path)
    except Exception as e:
        print(f"Gagal kompres {input_path}: {e}")
        shutil.copyfile(input_path, output_path)

def compress_pdf_with_gs(input_path, output_path):
    try:
        subprocess.run([
            r"C:\Program Files\gs\gs10.05.1\bin\gswin64c.exe",
            "-sDEVICE=pdfwrite",
            "-dCompatibilityLevel=1.4",
            "-dPDFSETTINGS=/screen",
            "-dNOPAUSE",
            "-dQUIET",
            "-dBATCH",
            f"-sOutputFile={output_path}",
            input_path
        ], check=True)
    except Exception as e:
        print(f'Gagal kompres PDF dengan Ghostscript: {e}')
        shutil.copyfile(input_path, output_path)

@app.route('/upload', methods=['POST'])
def upload_files():
    if 'files[]' not in request.files:
        return jsonify({'message': 'No file part in the request'}), 400

    files = request.files.getlist('files[]')
    results = []

    for file in files:
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file_path = os.path.join(UPLOAD_FOLDER, filename)
            file.save(file_path)

            # Tambahkan _compressed sebelum ekstensi
            name, ext = os.path.splitext(filename)
            compressed_filename = f"{name}_compressed{ext}"
            compressed_path = os.path.join(COMPRESSED_FOLDER, compressed_filename)
            compress_file(file_path, compressed_path)

            # Ukuran sebelum dan sesudah kompresi
            original_size = os.path.getsize(file_path)
            compressed_size = os.path.getsize(compressed_path)

            download_link = f'http://localhost:5000/download/{compressed_filename}'
            results.append({
                'filename': compressed_filename,
                'original_size': original_size,
                'compressed_size': compressed_size,
                'download_link': download_link
            })
        else:
            return jsonify({'message': f'File type not allowed: {file.filename}'}), 400

    return jsonify({'message': 'Files uploaded and compressed successfully', 'results': results})

@app.route('/download/<filename>', methods=['GET'])
def download_file(filename):
    return send_from_directory(COMPRESSED_FOLDER, filename, as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True)
