# Project Compressor Manual Book

## 1. Introduction

Project Compressor is a modern web application that allows you to easily compress PDF and image files. With a beautiful and intuitive interface, you can upload, compress, and download your files with real-time progress and clear feedback.

## 2. System Requirements

- Windows, macOS, or Linux
- Python 3.8 or higher
- Node.js 16 or higher
- Ghostscript (for PDF compression)
- Modern web browser (Chrome, Firefox, Edge, etc.)

## 3. Installation

### Backend (Flask)

1. Open terminal and navigate to the backend folder:
   ```sh
   cd project-compressor-backend
   ```
2. Create and activate a virtual environment:
   - Windows:
     ```sh
     python -m venv venv
     venv\Scripts\activate
     ```
   - macOS/Linux:
     ```sh
     python3 -m venv venv
     source venv/bin/activate
     ```
3. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
4. Make sure Ghostscript is installed and available in your PATH.
5. Start the backend server:
   ```sh
   python App.py
   ```
   The backend will run at `http://localhost:5000`.

### Frontend (React)

1. Open a new terminal and navigate to the frontend folder:
   ```sh
   cd project-compressor-frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the frontend server:
   ```sh
   npm start
   ```
   The frontend will run at `http://localhost:3000`.

## 4. How to Use

1. Open `http://localhost:3000` in your browser.
2. Click the upload area or drag & drop up to 3 files (PDF, images, etc.).
3. Click **Upload** to send files to the server.
4. Wait for the upload progress to complete.
5. Click **Compress** to start compressing your files.
6. View the compression results, including original and compressed sizes.
7. Click the **Download** button to download all compressed files.
8. Use **Erase** to clear results, or **Start Over** to reset the app.

## 5. Features Explained

- **Upload**: Select or drag up to 3 files to upload.
- **Progress Bar**: See real-time progress for upload and compression.
- **Compress**: Manually trigger compression after upload.
- **Download**: Download all compressed files with one click.
- **Erase**: Clear the current results without removing uploaded files.
- **Start Over**: Reset the app to upload new files.
- **Detailed Results**: See original and compressed sizes, and percentage saved.
- **Long Filename Handling**: Long filenames are truncated but can be viewed in full on hover.
- **Toast Notifications**: Get instant feedback for all actions (success, error, etc.).

## 6. Troubleshooting

- **Upload failed / Compression failed**: Ensure backend is running and Ghostscript is installed.
- **File type not allowed**: Only supported file types (PDF, images) can be uploaded.
- **Download not working**: Make sure both frontend and backend are running and accessible.
- **Port conflict**: If port 3000 or 5000 is in use, stop other services or change the port.
- **Long filenames not visible**: Hover over the filename to see the full name.

## 7. FAQ

**Q: Can I upload more than 3 files?**  
A: No, the app only allows up to 3 files at a time.

**Q: What file types are supported?**  
A: PDF and common image formats (JPG, PNG, etc.).

**Q: Why is my DOCX/PPTX file not compressed?**  
A: These formats are already compressed by default. The app will not reduce their size further.

**Q: Where are my uploaded files stored?**  
A: Uploaded and compressed files are stored in the backend's `upload` and `compressed` folders (created automatically).

## 8. Contact / Support

For support or questions, please contact: [your-email@example.com]

---

Enjoy using Project Compressor!
