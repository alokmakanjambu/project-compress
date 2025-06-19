import React, { useState, useEffect } from "react";
import FileUploadArea from "./components/FileUploadArea";
import FileList from "./components/FileList";
import { Download, Trash2, RotateCcw } from "lucide-react";

function Toast({ toast, onClose }) {
  if (!toast) return null;
  return (
    <div
      className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-xl shadow-lg font-reddit text-base font-semibold flex items-center gap-2 transition-all
      ${
        toast.type === "success"
          ? "bg-green-100 text-green-800 border border-green-300"
          : "bg-red-100 text-red-800 border border-red-300"
      }`}
      style={{ minWidth: 220 }}
    >
      {toast.type === "success" ? (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
          <path
            stroke="#15803d"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      ) : (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
          <path
            stroke="#b91c1c"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M18 6L6 18M6 6l12 12"
          />
        </svg>
      )}
      <span>{toast.message}</span>
      <button
        onClick={onClose}
        className="ml-2 text-lg font-bold opacity-60 hover:opacity-100"
      >
        ×
      </button>
    </div>
  );
}

function App() {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [downloadUrls, setDownloadUrls] = useState([]);
  const [pendingCompressedUrls, setPendingCompressedUrls] = useState([]);
  const [compressedResults, setCompressedResults] = useState([]);
  const [showCompressedResults, setShowCompressedResults] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressProgress, setCompressProgress] = useState(0);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const preventDefaults = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
      window.addEventListener(eventName, preventDefaults);
    });

    return () => {
      ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
        window.removeEventListener(eventName, preventDefaults);
      });
    };
  }, []);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 2500);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const handleFiles = (newFiles) => {
    const wrappedNewFiles = Array.from(newFiles).map((file) => ({
      file,
      status: "pending",
    }));

    const total = files.length + wrappedNewFiles.length;
    if (total > 3) {
      alert("Maximum 3 files allowed!");
      return;
    }

    const merged = [...files, ...wrappedNewFiles].slice(0, 3);
    setFiles(merged);
  };

  const handleRemove = (indexToRemove) => {
    const filtered = files.filter((_, i) => i !== indexToRemove);
    setFiles(filtered);
  };

  const handleUpload = () => {
    if (files.length === 0) {
      setToast({ type: "error", message: "No files to upload!" });
      return;
    }

    const formData = new FormData();
    files.forEach((item) => formData.append("files[]", item.file));

    setFiles((prev) => prev.map((item) => ({ ...item, status: "uploading" })));

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:5000/upload", true);

    setIsUploading(true);
    setUploadProgress(0);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(percent);
      }
    };

    xhr.onload = () => {
      setIsUploading(false);
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        setToast({ type: "success", message: "Upload successful!" });
        setFiles((prev) =>
          prev.map((item) => ({ ...item, status: "success" }))
        );
        if (data.results) {
          setCompressedResults(data.results);
          setPendingCompressedUrls(data.results.map((r) => r.download_link));
        } else {
          const newLinks = data.download_links || [];
          const uniqueLinks = newLinks.filter(
            (url) => !pendingCompressedUrls.includes(url)
          );
          setPendingCompressedUrls((prev) => [...prev, ...uniqueLinks]);
        }
      } else {
        setToast({ type: "error", message: "Upload failed" });
        setFiles((prev) => prev.map((item) => ({ ...item, status: "failed" })));
      }
    };

    xhr.onerror = () => {
      setIsUploading(false);
      setToast({ type: "error", message: "An error occurred during upload" });
      setFiles((prev) => prev.map((item) => ({ ...item, status: "failed" })));
    };

    xhr.send(formData);
  };

  const handleRetry = (index) => {
    const fileToRetry = files[index];
    if (!fileToRetry) return;

    const formData = new FormData();
    formData.append("files[]", fileToRetry.file);

    setFiles((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, status: "uploading" } : item
      )
    );

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:5000/upload", true);

    xhr.onload = () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        setFiles((prev) =>
          prev.map((item, i) =>
            i === index ? { ...item, status: "success" } : item
          )
        );

        const newLinks = data.download_links || [];
        const uniqueLinks = newLinks.filter(
          (url) => !downloadUrls.includes(url)
        );
        setDownloadUrls([...downloadUrls, ...uniqueLinks]);
      } else {
        setFiles((prev) =>
          prev.map((item, i) =>
            i === index ? { ...item, status: "failed" } : item
          )
        );
      }
    };

    xhr.onerror = () => {
      setFiles((prev) =>
        prev.map((item, i) =>
          i === index ? { ...item, status: "failed" } : item
        )
      );
    };

    xhr.send(formData);
  };

  const handleErase = () => {
    setDownloadUrls([]);
    setPendingCompressedUrls([]);
    setCompressedResults([]);
    setShowCompressedResults(false);
  };

  const handleStartOver = () => {
    setFiles([]);
    setDownloadUrls([]);
    setPendingCompressedUrls([]);
    setCompressedResults([]);
    setShowCompressedResults(false);
    setUploadProgress(0);
    setIsUploading(false);
  };

  const handleCompress = () => {
    setIsCompressing(true);
    setCompressProgress(0);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setCompressProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsCompressing(false);
        setDownloadUrls(pendingCompressedUrls);
        setToast({ type: "success", message: "Compression successful!" });
        setShowCompressedResults(true);
      }
    }, 180);
  };

  function formatSize(bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " kB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  }

  function percentSaved(orig, comp) {
    if (!orig || orig === 0) return "0%";
    const saved = Math.max(0, orig - comp);
    return ((saved / orig) * 100).toFixed(0) + "%";
  }

  function compressionFeedback(orig, comp) {
    if (comp > orig) {
      return (
        <span className="ml-2 text-yellow-600 font-semibold">
          (Compressed file is larger than the original, original file is kept)
        </span>
      );
    } else if (comp < orig) {
      return (
        <span className="ml-2 text-green-600 font-semibold">
          ({percentSaved(orig, comp)} smaller)
        </span>
      );
    } else {
      return (
        <span className="ml-2 text-gray-500 font-semibold">
          (File size unchanged)
        </span>
      );
    }
  }

  return (
    <div className="min-h-screen bg-[#f2e4cf] flex flex-col items-center justify-start px-4 font-reddit">
      <Toast toast={toast} onClose={() => setToast(null)} />
      <header className="w-full flex items-start justify-start pt-8 pl-6 pb-2">
        <h1 className="text-2xl md:text-3xl font-semibold text-[#222] tracking-tight font-reddit select-none">
          Project-Compressor
        </h1>
      </header>

      <main className="w-full flex flex-col items-center">
        <div className="w-full max-w-2xl bg-white/90 rounded-3xl shadow-xl border border-[#e5e1d2] px-8 py-10 mt-8 mb-16">
          <FileUploadArea onFilesSelected={handleFiles} />
          <FileList
            files={files}
            onRemove={handleRemove}
            onRetry={handleRetry}
          />

          {files.length > 0 && (
            <div className="flex flex-col items-center">
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className={`mt-8 px-10 py-3 rounded-xl font-reddit font-semibold text-[#5c6b2f] text-lg shadow transition-all duration-200
                  bg-[#e7decb] hover:bg-[#e0d3b8] active:scale-95
                  ${
                    isUploading
                      ? "opacity-60 cursor-not-allowed"
                      : "hover:shadow-lg"
                  }
                `}
              >
                {isUploading ? "Uploading..." : "Upload"}
              </button>
              {files.length > 0 &&
                files.every((f) => f.status === "success") && (
                  <>
                    <button
                      onClick={handleCompress}
                      className="mt-4 px-10 py-3 rounded-xl font-reddit font-semibold text-[#5c6b2f] text-lg shadow transition-all duration-200 bg-[#e7decb] hover:bg-[#e0d3b8] active:scale-95 hover:shadow-lg"
                    >
                      Compress
                    </button>
                    {showCompressedResults &&
                      compressedResults.length > 0 &&
                      !isCompressing &&
                      downloadUrls.length > 0 && (
                        <div className="w-full flex flex-col gap-4 mt-8">
                          {compressedResults.map((r, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-4 bg-green-50 border border-green-200 rounded-xl px-6 py-4 shadow"
                            >
                              <div className="flex-shrink-0">
                                <svg
                                  width="38"
                                  height="38"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <rect
                                    width="38"
                                    height="38"
                                    rx="10"
                                    fill="#22c55e"
                                  />
                                  <path
                                    stroke="#fff"
                                    strokeWidth="2.2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M7 13l4 4L19 7"
                                  />
                                </svg>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-green-900 font-bold text-lg flex items-center gap-2">
                                  Done
                                </span>
                                <span
                                  className="font-bold text-[#5c6b2f] text-base mt-1 truncate max-w-[260px] block"
                                  title={r.filename}
                                >
                                  {r.filename}
                                </span>
                                <span className="text-gray-500 text-sm mt-1">
                                  {formatSize(r.original_size)}
                                  <span className="mx-1">→</span>
                                  <span className="text-green-700 font-bold">
                                    {formatSize(r.compressed_size)}
                                  </span>
                                  {compressionFeedback(
                                    r.original_size,
                                    r.compressed_size
                                  )}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                  </>
                )}
            </div>
          )}

          {isUploading && (
            <div className="w-full max-w-md mt-4">
              <div className="w-full bg-gray-300 rounded-full h-4">
                <div
                  className="bg-green-600 h-4 rounded-full transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-center text-sm text-green-900 mt-1">
                {uploadProgress}%
              </p>
            </div>
          )}

          {isCompressing && (
            <div className="w-full max-w-md mt-8 flex flex-col items-center">
              <div className="bg-[#ede3d0] rounded-xl px-6 py-6 w-full flex flex-col items-center shadow">
                <span className="mb-3 text-[#5c6b2f] font-reddit font-semibold text-lg">
                  Compressing...
                </span>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-[#5c6b2f] h-4 rounded-full transition-all"
                    style={{ width: `${compressProgress}%` }}
                  />
                </div>
                <span className="mt-2 text-[#5c6b2f] font-reddit text-sm">
                  {compressProgress}%
                </span>
              </div>
            </div>
          )}

          {!isCompressing && downloadUrls.length > 0 && (
            <div className="mt-10 flex flex-col items-center w-full">
              <div className="bg-[#ede3d0] rounded-2xl px-8 py-7 flex flex-col md:flex-row items-center gap-6 shadow max-w-2xl w-full">
                <button
                  onClick={() => {
                    downloadUrls.forEach((url) => {
                      const link = document.createElement("a");
                      link.href = url;
                      link.download = url.split("/").pop();
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    });
                  }}
                  className="flex items-center gap-2 bg-[#5c6b2f] hover:bg-[#42501d] text-white font-reddit font-semibold text-lg px-7 py-3 rounded-lg shadow transition-all duration-200"
                >
                  <Download size={22} className="-ml-1" />
                  Download
                </button>
                <button
                  onClick={handleErase}
                  className="flex items-center gap-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-reddit font-semibold text-lg px-7 py-3 rounded-lg shadow transition-all duration-200"
                >
                  <Trash2 size={22} className="-ml-1" />
                  Erase
                </button>
                <button
                  onClick={handleStartOver}
                  className="flex items-center gap-2 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-reddit font-semibold text-lg px-7 py-3 rounded-lg shadow transition-all duration-200"
                >
                  <RotateCcw size={22} className="-ml-1" />
                  Start Over
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
