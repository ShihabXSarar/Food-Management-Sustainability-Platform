import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, Camera, FileText, X } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

const UploadPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadType, setUploadType] = useState("receipt");
  const [loading, setLoading] = useState(false);
  const [uploads, setUploads] = useState([]);

  const inputRef = useRef(null);

  const token = localStorage.getItem("token"); // JWT token stored in localStorage

  // Fetch existing uploads
  const fetchUploads = async () => {
    try {
      const res = await fetch("http://localhost:3000/uploads/receipt", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setUploads(data.data || []);
      }
    } catch (err) {
      console.error("Error fetching uploads:", err);
    }
  };

  useEffect(() => {
    fetchUploads();
  }, []);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("type", uploadType);

    try {
      const res = await fetch("http://localhost:3000/uploads/receipt", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        alert("Receipt uploaded successfully!");
        setSelectedFile(null);
        setPreview(null);
        fetchUploads(); // Refresh the uploaded list
      } else {
        alert(data.message || "Upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Something went wrong during upload");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8"
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Upload Images</h1>
        <p className="text-gray-600">
          Upload receipts or product labels to automatically add items
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Area */}
        <Card>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Type
            </label>
            <select
              value={uploadType}
              onChange={(e) => setUploadType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="receipt">Receipt</option>
              <option value="label">Product Label</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition ${
              dragActive
                ? "border-green-500 bg-green-50"
                : "border-gray-300 bg-gray-50"
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              onChange={handleChange}
              accept="image/*"
              className="hidden"
              id="file-upload"
            />
            <div className="cursor-pointer">
              <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-700 mb-2">
                Drag and drop your image here
              </p>
              <p className="text-sm text-gray-500 mb-4">or click to browse</p>
              <Button
                variant="outline"
                type="button"
                onClick={() => inputRef.current && inputRef.current.click()}
              >
                Select File
              </Button>
            </div>
          </div>

          {selectedFile && (
            <div className="mt-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {selectedFile.name}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setPreview(null);
                  }}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <Button
                onClick={handleUpload}
                className="w-full mt-4"
                disabled={loading}
              >
                {loading ? "Uploading..." : "Upload & Process"}
              </Button>
            </div>
          )}
        </Card>

        {/* Preview Area */}
        <Card>
          <h3 className="text-xl font-bold text-gray-800 mb-4">Preview</h3>
          {preview ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative"
            >
              <img
                src={preview}
                alt="Preview"
                className="w-full h-auto rounded-lg shadow-md"
              />
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>AI Processing:</strong> Image will be analyzed to
                  extract item information automatically.
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
              <div className="text-center">
                <Camera className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No image selected</p>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Recent Uploads */}
      <Card className="mt-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Uploads</h3>
        <div className="space-y-3">
          {uploads.map((upload) => (
            <motion.div
              key={upload._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-gray-800">
                    {upload.originalName}
                  </p>
                  <p className="text-sm text-gray-600">
                    {upload.type.charAt(0).toUpperCase() + upload.type.slice(1)}{" "}
                    • {upload.size} bytes
                  </p>
                </div>
              </div>
              <a
                href={upload.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                View
              </a>
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};

export default UploadPage;
