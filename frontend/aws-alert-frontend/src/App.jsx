import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./pages/Home";
import UploadFile from "./pages/UploadFile";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/uploadfile" element={<UploadFile />} />
      </Routes>

      <ToastContainer />
    </>
  );
};

export default App;