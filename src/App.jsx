import { useState } from "react";

import FirstPage from "./components/firstpage/FirstPage";
import SecondPage from "./components/secondpage/SecondPage";
import Header from "./components/header/Header";
import ShowPage from "./components/showpage/ShowPage";
import PollPage from "./components/pollpage/PollPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";

function App() {
  return (
    <>
      <Provider store={store}>
        <Router>
          <div className="bg-[#0B2239] min-h-screen flex flex-col px-10 py-5">
            <Header />
            <Routes>
              <Route path="/" element={<FirstPage />} />
              <Route path="/second" element={<SecondPage />} />
              <Route path="/show" element={<ShowPage />} />
              <Route path="/poll" element={<PollPage />} />
            </Routes>
          </div>
        </Router>
      </Provider>
    </>
  );
}

export default App;
