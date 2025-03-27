import React, { useRef, useState } from "react";
import { Eye, Plus, Save } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { processPDF } from "../../utils/processPDF";
import { useNavigate } from "react-router-dom";

function ShowPage() {
  const slides = useSelector((state) => state.slides.slides);
  const loading = useSelector((state) => state.slides.loading);
  const add = useSelector((state) => state.slides.add);
  const [loadi, setLoadi] = useState(false);
  const dispatch = useDispatch();
  const fileInputRef = useRef(null); // Create a ref for the file input
  const navigate = useNavigate();
  const showName = useSelector((state) => state.slides.showName);

  // Handle File Input
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type (PDF and PPTX only for now)
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Only PDF and PPTX files are allowed.");
      return;
    }

    // Start loading
    setLoadi(true);

    // Process PDF or PPTX
    if (file.type === "application/pdf") {
      await processPDF(file, dispatch, add, slides);
    } else if (
      file.type ===
      "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    ) {
      await processPPTX(file);
    }

    // Stop loading
    setLoadi(false);
  };

  // Trigger the file input dialog
  const triggerFileInput = () => {
    fileInputRef.current.click(); // Programmatically click the input
  };

  return (
    <div className="flex flex-col justify-center items-center text-white">
      {/* Preview Button */}
      <div className="flex justify-center items-center self-end gap-3 border rounded-sm px-4">
        <Eye />
        <span>Preview</span>
      </div>

      <div className="text-2xl mb-8">{showName}</div>

      {/* Loader */}
      {loading && <div className="text-lg">Processing your slides...</div>}

      {/* Slides from Redux */}
      {slides.length > 0 ? (
        <div className="overflow-y-auto w-full flex flex-col justify-center items-center gap-4 p-2">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className="relative flex items-center gap-4 mb-6"
            >
              {/* Image Slide */}
              <img
                src={slide.url}
                alt={`Slide ${slide.id}`}
                className="w-[550px] h-auto rounded-md shadow-md"
              />
            </div>
          ))}
          <div>
            {/* Add Button */}
            <div
              className="flex justify-center items-center gap-3 border border-green-700 px-3 py-2 bg-cyan-500 cursor-pointer"
              onClick={triggerFileInput} // Trigger the file input dialog
            >
              <Plus />
              <span>Add</span>
            </div>
            {/* Hidden File Input */}
            <input
              ref={fileInputRef} // Attach the ref to the input
              type="file"
              accept=".pdf,.pptx"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
          <button
            onClick={() => navigate("/second")}
            className="flex justify-center items-center gap-2 border border-green-700 px-3 py-2 bg-cyan-500"
          >
            <Save />
            <span>Save</span>
          </button>
        </div>
      ) : (
        <div>
          <div className="text-lg">No slides available.</div>
          <div className="text-lg">Please import some slides </div>
        </div>
      )}
    </div>
  );
}

export default ShowPage;
