import "./App.css";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

function MedicineList() {
  const [medicines, setMedicines] = useState([]);

  const videoRef = useRef();
  const canvasRef = useRef();

  useEffect(() => {
    let intervalId;

    const startCapture = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageDataUrl = canvas.toDataURL("image/png");

      // 이미지 데이터를 서버로 전송
      ///#region 이곳에서 imageDataUrl를 통해 캡쳐한 사진 데이터를 전송할 수 있습니다.
      // 과거 소스코드
      //   axios
      //     .get("http://localhost:8000/api/medicine/")
      //     .then((response) => {
      //       setMedicines(response.data);
      //     })
      //     .catch((e) => console.error("Error accessing", e));
      console.info(imageDataUrl);
      // data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAoAAA .. 로시작하는 데이터가 console에 찍힙니다. -> F12에서 확인가능!
      axios
        .post("https://example.com/upload", { image: imageDataUrl })
        .then((response) => {
          console.log("Image uploaded successfully");
        })
        .catch((error) => {
          console.error("Error uploading image:", error);
        });
      //#endregion
    };

    const startInterval = () => {
      startCapture(); // 캡쳐 및 전송
      intervalId = setInterval(() => {
        startCapture();
      }, 5000); // 5초마다 캡쳐 및 전송
    };

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current
          .play()
          .then(() => {
            startInterval();
          })
          .catch((error) => {
            console.error("Error playing video:", error);
          });
      })
      .catch((error) => {
        console.error("Error accessing webcam:", error);
      });

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div>
      <h1>Medicine List</h1>
      <div style={{ display: "flex" }}>
        <div>
          <h2>웹캠화면</h2>
          <video ref={videoRef} autoPlay muted playsInline />
        </div>
        <div>
          <h2>5초마다 캡쳐 화면</h2>
          <canvas ref={canvasRef} />
        </div>
      </div>
      <ul>
        {medicines.map((medicine) => (
          <li key={medicine.id}>
            {medicine.product_name}
            {medicine.manufacturer_name}
            {medicine.appearance}
            {medicine.length}
            {medicine.width}
            {medicine.thickness}
            {medicine.appearance}
            {medicine.category_name}
            {medicine.specialized_general_name}
            {medicine.dosage_form_name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MedicineList;
