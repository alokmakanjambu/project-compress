import React from "react";
import { CheckCircle2, Loader2, Circle, X, RotateCcw } from "lucide-react";

const FileList = ({ files, onRemove, onRetry }) => {
  if (files.length === 0) return null;

  const getProgress = (status) => {
    switch (status) {
      case "success":
        return 100;
      case "uploading":
        return 50;
      case "pending":
        return 20;
      case "failed":
        return 100;
      default:
        return 0;
    }
  };

  return (
    <div className="w-full max-w-xl mt-8">
      <ul className="space-y-3">
        {files.map((item, index) => (
          <li
            key={index}
            className="flex items-center bg-[#f7f3ea] rounded-full px-6 py-3 min-h-[64px] relative group"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-reddit font-semibold text-[#5c6b2f] text-base truncate">
                  {item.file.name}
                </span>
                <span className="text-xs text-[#b2b28a] ml-2">
                  {(item.file.size / 1024).toFixed(1)} KB
                </span>
              </div>
              <div className="w-full h-2 bg-[#e5e1d2] rounded-full mt-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    item.status === "failed" ? "bg-red-400" : "bg-[#5c6b2f]"
                  }`}
                  style={{ width: `${getProgress(item.status)}%` }}
                />
              </div>
            </div>
            <div className="flex items-center gap-2 ml-4">
              {item.status === "success" && (
                <CheckCircle2 size={24} className="text-green-600" />
              )}
              {item.status === "uploading" && (
                <Loader2 size={24} className="text-[#5c6b2f] animate-spin" />
              )}
              {item.status === "pending" && (
                <Circle size={24} className="text-yellow-500" />
              )}
              {item.status === "failed" && (
                <X size={24} className="text-red-500" />
              )}
              {item.status === "failed" && (
                <button
                  onClick={() => onRetry(index)}
                  className="text-yellow-600 hover:text-yellow-800 ml-1"
                  title="Coba ulang"
                >
                  <RotateCcw size={20} />
                </button>
              )}
              <button
                onClick={() => onRemove(index)}
                className="text-[#5c6b2f] hover:text-red-600 ml-1"
                title="Hapus file"
              >
                <X size={20} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileList;
