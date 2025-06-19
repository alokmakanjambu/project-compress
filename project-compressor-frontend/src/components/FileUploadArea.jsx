import React, { useRef } from "react";
import { Upload } from "lucide-react";

const FileUploadArea = ({ onFilesSelected }) => {
  const inputRef = useRef(null);

  const preventDefaults = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    preventDefaults(e);
    const files = Array.from(e.dataTransfer.files);
    onFilesSelected(files);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      onFilesSelected(files);
    }

    // Reset input supaya bisa pilih file yang sama dua kali berturut-turut
    e.target.value = "";
  };

  const handleClick = () => {
    // ❌ Jangan reset value di sini, cukup buka file explorer
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div
      className="border-2 border-dashed border-[#7a7a3a] bg-[#f2e4cf] p-8 rounded-2xl text-center cursor-pointer transition hover:bg-[#ede6d6] shadow-sm max-w-xl mx-auto"
      onMouseDown={handleClick}
      onDrop={handleDrop}
      onDragOver={preventDefaults}
      onDragEnter={preventDefaults}
      onDragLeave={preventDefaults}
    >
      <input
        type="file"
        multiple
        className="hidden"
        ref={inputRef}
        onChange={handleFileChange}
        // 🟢 accept dikosongkan = semua file bisa dipilih
        // Bisa juga: accept="*/*"
        accept=""
      />
      <div className="flex flex-col items-center justify-center">
        <Upload size={48} strokeWidth={2.2} className="text-[#5c6b2f] mb-2" />
        <div className="font-semibold text-[#5c6b2f] text-lg font-reddit">
          Click to upload{" "}
          <span className="hidden md:inline">or drag files here</span>
        </div>
        <div className="text-sm mt-1 text-[#b2b28a] font-reddit">
          (MAX. 3 Files)
        </div>
      </div>
    </div>
  );
};

export default FileUploadArea;
