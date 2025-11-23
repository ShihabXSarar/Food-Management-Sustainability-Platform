import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, Camera, FileText, X, Sparkles, Check } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { analyzeInventoryImage } from "../services/ai/geminiService";
import { extractTextFromImage, parseReceiptText } from "../services/ocrService";

const UploadPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadType, setUploadType] = useState("receipt");
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [uploads, setUploads] = useState([]);

  const inputRef = useRef(null);

  const token = localStorage.getItem("token");

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
    setAnalysisResults(null); // Reset previous results
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      // Auto-analyze when file is selected
      runAIAnalysis(reader.result, uploadType);
    };
    reader.readAsDataURL(file);
  };

  const runAIAnalysis = async (base64Image, type) => {
    setAnalyzing(true);
    try {
      let results = [];
      if (type === 'receipt' || type === 'label') {
        // Use OCR + Gemini Parsing
        console.log("Starting OCR...");
        const text = await extractTextFromImage(base64Image);
        console.log("OCR Text:", text);
        if (text && text.trim().length > 0) {
          results = await parseReceiptText(text);
        } else {
          console.warn("OCR extracted no text.");
        }
      } else {
        // Use Vision AI (Direct Food Photo)
        results = await analyzeInventoryImage(base64Image);
      }
      setAnalysisResults(results);
    } catch (error) {
      console.error("AI Analysis failed:", error);
      alert("AI could not analyze the image. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("type", uploadType);

    try {
      // 1. Upload the file
      const res = await fetch("http://localhost:3000/uploads/receipt", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        // 2. If AI results exist, save them to inventory
        if (analysisResults && analysisResults.length > 0) {
          let savedCount = 0;
          for (const item of analysisResults) {
            try {
              // Parse quantity (e.g. "2 count" -> 2, "500g" -> 1 (default for now if NaN))
              let qty = parseInt(item.quantity);
              if (isNaN(qty)) qty = 1;

              // Validate and format expiryDate
              let validDate = item.expiryDate;
              const dateObj = new Date(item.expiryDate);
              if (isNaN(dateObj.getTime())) {
                // If invalid date, default to 7 days from now
                const d = new Date();
                d.setDate(d.getDate() + 7);
                validDate = d.toISOString();
              } else {
                validDate = dateObj.toISOString();
              }

              const invRes = await fetch("http://localhost:3000/inventory", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  item: item.name, // Backend will handle name-to-ID
                  quantity: qty,
                  expiryDate: validDate
                })
              });

              if (!invRes.ok) {
                const errData = await invRes.json();
                console.error("Failed to save item:", item.name, errData);
              } else {
                savedCount++;
              }
            } catch (err) {
              console.error("Failed to save item:", item.name, err);
            }
          }
          alert(`Receipt uploaded and ${savedCount} items added to inventory!`);
        } else {
          alert("Receipt uploaded successfully!");
        }

        setSelectedFile(null);
        setPreview(null);
        setAnalysisResults(null);
        fetchUploads();
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
      className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8"
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Upload & Analyze</h1>
        <p className="text-gray-600">
          Upload receipts or food photos. Our AI will detect items and expiry dates automatically.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Upload & Preview */}
        <div className="space-y-6">
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
                <option value="food">Direct Food Photo</option>
              </select>
            </div>

            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition ${dragActive
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
          </Card>

          {preview && (
            <Card>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Preview</h3>
              <div className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-auto rounded-lg shadow-md"
                />
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setPreview(null);
                    setAnalysisResults(null);
                  }}
                  className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md text-red-600 hover:text-red-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </Card>
          )}
        </div>

        {/* Right Column: AI Results */}
        <div className="space-y-6">
          <Card className="h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                AI Analysis Results
              </h3>
              {analyzing && (
                <span className="text-sm text-purple-600 animate-pulse font-medium">
                  Analyzing image...
                </span>
              )}
            </div>

            {analysisResults ? (
              <div className="space-y-4">
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                  <p className="text-sm text-purple-800 mb-2">
                    <strong>Detected {analysisResults.length} items!</strong> Review them below before saving.
                  </p>
                </div>

                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {analysisResults.map((item, index) => (
                    <div key={index} className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-gray-800">{item.name}</h4>
                        <p className="text-sm text-gray-600">Qty: {item.quantity} • Cat: {item.category}</p>
                        <p className="text-xs text-orange-600 mt-1">Expires: {item.expiryDate}</p>
                      </div>
                      <div className="p-1 bg-green-100 rounded-full">
                        <Check className="w-4 h-4 text-green-700" />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <Button
                    onClick={handleUpload}
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Confirm & Save to Inventory"}
                  </Button>
                  <p className="text-xs text-center text-gray-500 mt-2">
                    This will save the image and add items to your inventory.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center text-gray-400">
                {analyzing ? (
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
                ) : (
                  <Sparkles className="w-16 h-16 mb-4 opacity-20" />
                )}
                <p>
                  {analyzing
                    ? "AI is identifying food items..."
                    : "Upload an image to see AI insights here."}
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Recent Uploads */}
      <Card className="mt-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Uploads</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {uploads.map((upload) => (
            <motion.div
              key={upload._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center p-3 bg-white border border-gray-200 rounded-lg shadow-sm"
            >
              <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3 overflow-hidden">
                {/* Thumbnail if available, else icon */}
                <FileText className="w-5 h-5 text-gray-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 truncate">
                  {upload.originalName}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(upload.createdAt || Date.now()).toLocaleDateString()}
                </p>
              </div>
              <a
                href={upload.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100"
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
