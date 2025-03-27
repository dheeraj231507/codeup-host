import {
  AlignEndHorizontal,
  FileText,
  Plus,
  Download,
  Pen,
  Circle,
  Save,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useNavigate } from "react-router-dom";
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.mjs"; // Import the worker script
import { processPDF } from "../../utils/processPDF";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  saveSlides,
  setAdd,
  setShowName,
  setSlides,
} from "../../slices/slidesSlice";
import { processPPTX } from "../../utils/processPPTX";

function SecondPage() {
  const [showPopup, setShowPopup] = useState(false);
  const slides = useSelector((state) => state.slides.slides) || []; // Use Redux store slides state

  const poll = useSelector((state) => state.poll.poll);
  const add = useSelector((state) => state.slides.add);

  const [loading, setLoading] = useState(false); // Track loading state
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const showName = useSelector((state) => state.slides.showName); // State to store the show name

  // Toggle popup visibility
  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  // Handle clicking outside popup to close it
  const handleOutsideClick = (e) => {
    if (e.target.id === "popup-overlay") {
      setShowPopup(false);
    }
  };

  // Handle File Input
  const handleFileUpload = async (e) => {
    const fileInput = e.target; // Reference to the file input element
    const file = fileInput.files[0];
    if (!file) return;

    // Validate file type (PDF and PPTX only for now)
    const notify = (message) => {
      toast(message, {
        position: "top-center",
      });
    };

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ];

    if (!allowedTypes.includes(file.type)) {
      notify("Only PDF and PPTX files are allowed.");
      fileInput.value = ""; // Reset the file input value
      return;
    }

    // Check if the file is a PPTX
    if (
      file.type ===
      "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    ) {
      notify("Please upload a PDF file."); // Show toast message for PPTX
      fileInput.value = ""; // Reset the file input value
      return; // Stop further processing
    }

    // Start loading
    setLoading(true);
    dispatch(setAdd(true));

    // Process PDF
    if (file.type === "application/pdf") {
      await processPDF(file, dispatch);
    }

    // Stop loading
    notify("File uploaded successfully!");
    setLoading(false);

    // Reset the file input value
    fileInput.value = "";
  };

  return (
    <>
      <div className="text-white flex flex-col justify-center items-center">
        <div className="border px-8 py-4 rounded-md m-4 text-Montserrat">
          <input
            type="text"
            placeholder="Enter Show Name"
            value={showName}
            onChange={(e) => dispatch(setShowName(e.target.value))} // Update state on input change
            className="bg-transparent border-none focus:outline-none text-center"
          />
        </div>

        <div className="mt-4 text-lg">
          <strong>Show Name:</strong> {showName || "No name entered"}
        </div>

        <div className="flex gap-3 text-Montserrat py-4 self-start ">
          <div className="w-10 flex justify-center items-center">
            <FileText className="w-8 h-8" />
          </div>
          <span className="text-3xl ">Slides</span>
          {slides && slides.length > 0 && (
            <Pen
              onClick={() => navigate("/show")}
              className="w-8 h-8 absolute right-0 cursor-pointer"
            />
          )}
        </div>

        {/* Loader */}
        {loading && <div className="text-lg">Processing your slides...</div>}

        {/* Conditional Rendering */}
        {slides && slides.length === 0 ? (
          // Show Import Slides Button when slides array is empty
          <label className="flex gap-3 text-Montserrat bg-[#BCDDFF] p-2 rounded-md mb-7 cursor-pointer">
            <div className="w-10 flex justify-center items-center">
              <Download className="w-8 h-8 text-[#000000]" />
            </div>
            <span className="text-2xl text-[#000000]">Import Slides</span>
            <input
              type="file"
              accept=".pdf,.pptx"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
        ) : (
          // Show Slides as Images in a Horizontal Scrollable Container
          <div className="overflow-x-auto w-full flex gap-4 p-2">
            {slides.map((slide) => (
              <img
                key={slide.id}
                src={slide.url}
                alt={`Slide ${slide.id}`}
                className="w-[250px] h-auto rounded-md shadow-md "
              />
            ))}
          </div>
        )}

        <div className="flex gap-3 text-Montserrat py-4 self-start">
          <div className="w-10 flex justify-center items-center">
            <AlignEndHorizontal className="w-8 h-8" />
          </div>
          <span className="text-3xl">Poll</span>
        </div>

        {poll.length === 0 ? (
          <button
            onClick={() => navigate("/poll")}
            className="flex gap-3 text-Montserrat bg-[#BCDDFF] px-7 py-2 rounded-md mb-7"
          >
            <div className="w-10 flex justify-center items-center">
              <AlignEndHorizontal className="w-8 h-8 text-[#000000]" />
            </div>
            <span className="text-2xl text-[#000000]">New Poll</span>
          </button>
        ) : (
          <div className="flex flex-col gap-3 justify-center items-start ">
            {poll.map((pollItem, index) => (
              <div key={index} className="flex gap-3 items-center">
                <Circle className="w-[20px]" />
                <span>
                  {(() => {
                    const text = pollItem.question; // Access the question property
                    const words = text.split(" ");
                    return words.length > 5
                      ? `${words.slice(0, 5).join(" ")}...` // Truncate if more than 5 words
                      : text; // Show full question if 5 or fewer words
                  })()}
                </span>
                <Pen
                  onClick={
                    () => navigate("/poll", { state: { pollItem, index } }) // Pass poll data and index
                  }
                  className="cursor-pointer absolute right-0"
                />
              </div>
            ))}
          </div>
        )}

        <button className="flex gap-3 border p-4 rounded-md mt-3">
          <Plus /> Add From the Library
        </button>

        <button
          onClick={togglePopup}
          className="flex gap-3 border px-4 py-2 rounded-md mt-3 self-end"
        >
          <Plus />
          <span>Add</span>
        </button>
        <button
          onClick={() => {
            dispatch(saveSlides({ slides, poll, showName, dispatch }));
          }}
          className="flex justify-center items-center gap-3 px-3 py-2 border border-lime-800 bg-lime-400 text-black rounded-md  mt-3"
        >
          <Save />
          <span>Save</span>
        </button>
        <div
          onClick={() => navigate("/")}
          className="text-white border border-cyan-800 px-5 py-3 rounded-md bg-black mt-3"
        >
          Home
        </div>
      </div>

      {/* Popup */}
      {showPopup && (
        <div
          id="popup-overlay"
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={handleOutsideClick}
        >
          <div className="bg-[#BCDDFF] w-[500px] p-9 rounded-lg shadow-lg">
            <div className="flex flex-col items-center">
              <h2 className="text-2xl font-semibold mb-4">New Poll</h2>

              <button
                onClick={() => navigate("/poll")}
                className="bg-[#0D1B2A] text-white px-6 py-2 rounded-md mb-4"
              >
                Create Poll
              </button>
              <button
                onClick={() => navigate("/show")}
                className="border border-[#0B2239] px-7 py-2 rounded-md text-[#0B2239]"
              >
                Add Slide
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SecondPage;
