# Project Compressor

A modern web app to compress PDF and image files, with a beautiful UI built using React (Tailwind CSS) and a Flask backend. Instantly upload, compress, and download your files with progress feedback and detailed results.

## Features

- Upload up to 3 files at once (PDF, images, etc.)
- Real-time upload and compression progress
- Download compressed files with clear size savings
- Modern, responsive UI (Figma-inspired, Tailwind CSS)
- Only keeps compressed file if it is smaller than the original
- Handles long filenames gracefully
- Toast notifications for all actions

## Folder Structure

```
project-compress/
├── project-compressor-frontend/   # React + Tailwind CSS frontend
├── project-compressor-backend/    # Flask backend
```

## Getting Started

### 1. Clone the Repository

```sh
git clone https://github.com/yourusername/project-compress.git
cd project-compress
```

### 2. Backend Setup (Flask)

```sh
cd project-compressor-backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
# Make sure Ghostscript is installed and in your PATH for PDF compression
python App.py
```

- The backend will run on `http://localhost:5000` by default.

### 3. Frontend Setup (React)

```sh
cd ../project-compressor-frontend
npm install
npm start
```

- The frontend will run on `http://localhost:3000` by default.

## Example Usage

1. Open the frontend in your browser.
2. Drag & drop or click to upload up to 3 files.
3. Click **Upload** to send files to the server.
4. Click **Compress** to start compression.
5. Download your compressed files using the provided button.

## Requirements

- Python 3.8+
- Node.js 16+
- Ghostscript (for PDF compression)

## Credits

- UI inspired by Figma design
- Built with [React](https://reactjs.org/), [Tailwind CSS](https://tailwindcss.com/), [Flask](https://flask.palletsprojects.com/)
- Author: [Your Name]

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

Feel free to fork, star, and use this project for your own file compression needs!
