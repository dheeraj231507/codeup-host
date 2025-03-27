import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { loadSlides, deleteSlide } from "../../slices/slidesSlice";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";

function FirstPage() {
  const [slides1, setSlides1] = useState([]);
  const [selectedSlide, setSelectedSlide] = useState(null); // State for the selected slide
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State for popup visibility

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSlides = async () => {
      const slidesData = await dispatch(loadSlides()).unwrap();
      if (slidesData) {
        setSlides1(slidesData);
      }
    };
    fetchSlides();
  }, [dispatch]);

  const handleSlideClick = (slide) => {
    setSelectedSlide(slide); // Set the selected slide data
    setIsPopupOpen(true); // Open the popup
  };

  const closePopup = () => {
    setIsPopupOpen(false); // Close the popup
    setSelectedSlide(null); // Clear the selected slide data
  };

  const handleDeleteSlide = async (id) => {
    await dispatch(deleteSlide(id)); // Delete the slide from IndexedDB
    const updatedSlides = await dispatch(loadSlides()).unwrap(); // Reload the slides
    setSlides1(updatedSlides); // Update the UI with the new slides
  };

  const handleOverlayClick = (e) => {
    if (e.target.id === "popup-overlay") {
      closePopup(); // Close the popup when clicking outside the content
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-1 justify-center items-center mt-4 mb-4">
        <button
          onClick={() => navigate("/second")}
          className="bg-[#2090FF] font-Montserrat px-9 py-3 border border-[#2090FF] rounded-lg text-white"
        >
          Lets make a show!!
        </button>
      </div>
      <div className="flex gap-5 flex-wrap overflow-y-auto">
        {slides1.map((slide2, index) => (
          <div
            key={index}
            className="text-white bg-green-700 p-11 w-64 text-center rounded-md cursor-pointer relative"
            onClick={() => handleSlideClick(slide2)} // Open popup with slide data
          >
            <span>{slide2.showName}</span>
            <Trash2
              onClick={(e) => {
                e.stopPropagation(); // Prevent event propagation to parent <div>
                handleDeleteSlide(slide2.id); // Delete the slide
              }}
              className="absolute right-1 top-1 cursor-pointer"
            />
          </div>
        ))}
      </div>

      {/* Popup */}
      {isPopupOpen && selectedSlide && (
        <div
          id="popup-overlay"
          className="fixed inset-0 bg-[#0B2239] bg-opacity-50 flex justify-center items-center"
          onClick={handleOverlayClick} // Close popup when clicking outside
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-[80%] max-w-3xl"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            <h2 className="text-2xl font-bold mb-4">
              {selectedSlide.showName}
            </h2>

            <div className="mb-4">
              <h3 className="text-lg font-semibold">Slides:</h3>
              <div className="flex gap-4 overflow-x-auto">
                {selectedSlide.slides.map((slide, index) => (
                  <img
                    key={index}
                    src={slide.url}
                    alt={`Slide ${index + 1}`}
                    className="w-[150px] h-auto rounded-md shadow-md"
                  />
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-semibold">Poll:</h3>
              {selectedSlide.poll.map((pollItem, index) => (
                <div key={index} className="mb-2">
                  <p className="font-semibold">{pollItem.question}</p>
                  <ul className="list-disc pl-5">
                    {pollItem.options.map((option, i) => (
                      <li key={i}>{option}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <button
              onClick={closePopup}
              className="bg-red-500 text-white px-4 py-2 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FirstPage;
