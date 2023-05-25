import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import WebcamPage from "./WebcamPage";
import MedicineDetailPage from "./MedicineDetailPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WebcamPage />}></Route>
        <Route path="/medicine/*" element={<MedicineDetailPage />}></Route>
        {/* <Route path="*" element={<NotFound />}></Route> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
