import React, { useState } from "react";
import "../pollpage/custom.css";
import { useDispatch } from "react-redux";
import { setPoll } from "../../slices/pollSlice";
import { useSelector } from "react-redux";
import { Save } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

function PollPage() {
  const location = useLocation();
  const poll = useSelector((state) => state.poll.poll);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Retrieve passed poll data
  const { pollItem, index } = location.state || {};

  // Initialize state with passed data or default values
  const [question, setQuestion] = useState(pollItem?.question || "");
  const [options, setOptions] = useState(pollItem?.options || ["", "", "", ""]);

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const handleAddPoll = () => {
    if (!question.trim() || options.every((opt) => !opt.trim())) {
      alert("Please add a question and at least one option.");
      return;
    }

    const newPoll = { question, options: options.filter((opt) => opt.trim()) };

    if (pollItem) {
      // Update existing poll
      const updatedPoll = [...poll];
      updatedPoll[index] = newPoll;
      dispatch(setPoll(updatedPoll));
    } else {
      // Add new poll
      dispatch(setPoll([...poll, newPoll]));
    }

    console.log("Polls:", poll);

    setQuestion("");
    setOptions(["", "", "", ""]);
  };

  return (
    <div className="flex flex-col justify-center items-center text-white ">
      <div className="text-2xl mb-8 flex justify-center items-center gap-3 self-start">
        <img src="/image3.png" alt="poll" width={20} height={20} />
        <span>Poll</span>
      </div>

      <div className="w-full max-w-md ">
        <label className="block mb-2">Question</label>
        <input
          type="text"
          placeholder="Ask question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="bg-transparent border-b border-gray-400 w-full mb-4 focus:outline-none"
        />

        <label className="block mb-2">Options</label>
        {options.map((option, index) => (
          <input
            key={index}
            type="text"
            placeholder="+ Add"
            value={option}
            onChange={(e) => handleOptionChange(index, e.target.value)}
            className="bg-transparent border-b border-gray-400 w-full mb-2 focus:outline-none"
          />
        ))}

        <button
          onClick={handleAddPoll}
          className="bg-blue-300 text-black px-4 py-2 mt-4 rounded-lg hover:bg-blue-400"
        >
          {pollItem ? "Update Poll" : "Add Poll"}
        </button>
      </div>

      <div className="mt-8 w-full max-w-md h-64 overflow-y-auto">
        {poll.map((poll1, index) => (
          <div key={index} className="bg-[#16475e] p-4 mb-4 rounded-lg">
            <p className="font-semibold">{poll1.question}</p>
            <ul className="mt-2">
              {poll1.options.map((option, i) => (
                <li key={i} className="text-sm">
                  - {option}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <button
        onClick={() => navigate("/second")}
        className="flex justify-center items-center border border-lime-800 p-2 gap-3 rounded-md bg-lime-800 mt-2 "
      >
        <Save />
        <span>Save</span>
      </button>
    </div>
  );
}

export default PollPage;
