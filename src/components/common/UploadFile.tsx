/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useRef } from "react";
import axios from "axios";
import { UploadIcon } from "lucide-react";

interface FileUploadProps {
  onFileSelect?: (file: File) => void;
  onUploadComplete?: (url: string) => void;
}

export default function FileUpload({
  onFileSelect,
  onUploadComplete,
}: FileUploadProps) {
  const [preview, setPreview] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File) => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      onUploadComplete?.(response.data.publicId);
      return response.data.url;
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFile = async (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert("File must be smaller than 10MB");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    onFileSelect?.(file);
    await uploadFile(file);
  };

  const handleButtonClick = () => {
    // Programmatically trigger the file input click
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white rounded-2xl pt-0  p-8">
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition
          ${
            isDragging ? "border-[#FF69B4]" : "border-[#FFE135]"
          } bg-[#FFE135]/5 hover:border-[#FF69B4]`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFile(e.dataTransfer.files[0]);
        }}
      >
        {/* Hidden file input that will be triggered by the button */}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0] || null)}
          accept="image/png,image/jpeg,image/gif"
          disabled={isUploading}
        />

        {preview ? (
          <div className="relative w-full aspect-video">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-contain rounded-xl"
            />
          </div>
        ) : (
          <>
            <UploadIcon className="w-12 h-12 mx-auto mb-4 text-[#2B4570]" />
            <p className="text-[#2B4570] mb-2">Drag and drop your image here</p>
            <p className="text-[#2B4570]/60 text-sm mb-4">or</p>
            <button
              type="button"
              className="bg-[#2B4570] hover:bg-[#2B4570]/90 text-white px-6 py-2 rounded-lg transition font-serif"
              onClick={handleButtonClick}
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Choose File"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
