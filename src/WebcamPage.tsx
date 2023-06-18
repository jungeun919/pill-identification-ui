import logo from "./logo.svg";
import "./App.css";
import React, { useState, useEffect, useRef, CSSProperties } from "react";
import axios from "axios";
import { css } from "@emotion/react";
import { useNavigate } from "react-router-dom";

const tempList = Array.from({ length: 20 }).map((_, i) => {
  const index = i + 1;
  return {
    id: index,
    product_name: "product_name-" + index,
    manufacturer_name: "manufacturer_name-" + index,
    appearance: "appearance-" + index,
    length: "length-" + index,
    width: "width-" + index,
    thickness: "thickness-" + index,
    category_name: "category_name-" + index,
    specialized_general_name: "specialized_general_name-" + index,
    dosage_form_name: "dosage_form_name-" + index,
  };
});

const tempMedicine = {
  id: "200808876",
  product_name: "가스디알정50밀리그램(디메크로틴산마그네슘)",
  manufacturer_name: "일동제약(주)",
  appearance: "녹색의 원형 필름코팅정",
  length: "7.6",
  width: "7.6",
  thickness: "3.6",
  category_name: "기타의 소화기관용약",
  specialized_general_name: "전문의약품",
  dosage_form_name: "당의정",
};

function WebcamPage() {
  const [medicines, setMedicines] = useState([tempMedicine, ...tempList]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const navigate = useNavigate();

  useEffect(() => {
    let intervalId: any;

    const startCapture = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      console.log(123);

      if (!video || !canvas) return;
      console.log(1234);

      const context = canvas.getContext("2d");

      if (!context) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageDataUrl = canvas.toDataURL("image/png");

      const dataUrlToBlob = (dataUrl: string) => {
        const arr = dataUrl.split(",");
        const mime = arr[0].match(/:(.*?);/);
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime ? mime[1] : "png" });
      };

      const imageDataBlob = dataUrlToBlob(imageDataUrl);
      const formData = new FormData();
      formData.append("image", imageDataBlob, "capture.png");

      axios
        .post("http://172.22.235.183:3636/api/medicine/", formData)
        .then((response) => {
          setMedicines(response.data);
        })
        .catch((e) => console.error("접근 에러", e));

      // // 이미지 데이터를 서버로 전송
      // ///#region 이곳에서 imageDataUrl를 통해 캡쳐한 사진 데이터를 전송할 수 있습니다.
      // // 과거 소스코드
      // axios
      //   .post("http://http://172.22.235.183:3636/api/medicine/", imageDataUrl)
      //   .then((response) => {
      //     setMedicines(response.data);
      //   })
      //   .catch((e) => console.error("Error accessing", e));
      // console.info(imageDataUrl);
      // data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAoAAA .. 로시작하는 데이터가 console에 찍힙니다. -> F12에서 확인가능!
      //#endregion
    };

    const startInterval = () => {
      startCapture(); // 캡쳐 및 전송
      intervalId = setInterval(() => {
        startCapture();
      }, 5000); // 5초마다 캡쳐 및 전송
    };

    if (navigator && navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (!videoRef.current) return;
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

  const onClickMore = (data: any) => {
    window.sessionStorage.setItem("data", JSON.stringify(data));
    navigate("/medicine/detail");
  };

  return (
    <div>
      {/* <h1>Medicine List</h1> */}
      <div style={{ display: "flex" }}>
        {/* <div> */}
        {/* <h2>웹캠화면</h2> */}
        <video ref={videoRef} autoPlay muted playsInline style={{ width: "100vw", height: "100vh" }} />
        {/* </div> */}
        <div>
          {/* <h2>5초마다 캡쳐 화면</h2> */}
          <canvas ref={canvasRef} />
        </div>
      </div>
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          height: 240,
          width: "100vw",
          display: "-webkit-box",
          overflowX: "scroll",
          gap: 10,
          padding: "0 10px",
        }}
      >
        {medicines.map((medicine) => (
          <div
            key={medicine.id}
            style={{
              background: "white",
              borderRadius: 12,
              border: "1px solid purple",
              width: 200,
              cursor: "pointer",
              padding: 2,
            }}
            onClick={() => onClickMore(medicine)}
          >
            {/* <div>색깔/일련번호/앞면뒷면글자</div> */}
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <img
                  src="https://picsum.photos/200/300"
                  width="60"
                  height="50"
                  alt="알약이미지"
                  style={{ borderRadius: 2 }}
                />
              </div>
              <div style={{ gap: 2, display: "flex", flexDirection: "column" }}>
                <div style={lineOverflowStyle}>의약품명: {medicine.product_name}</div>
                <div style={lineOverflowStyle}>제조사: {medicine.manufacturer_name}</div>
                <div style={lineOverflowStyle}>성상: {medicine.appearance}</div>
                <div style={lineOverflowStyle}>
                  크기: {medicine.length}cm * {medicine.width}cm * {medicine.thickness}cm
                </div>
                <div style={lineOverflowStyle}>카테고리: {medicine.category_name}</div>
                <div style={lineOverflowStyle}>구분: {medicine.specialized_general_name}</div>
                {/* <div style={lineOverflowStyle}>제형코드명: {medicine.dosage_form_name}</div> */}
              </div>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  borderTop: "1px solid black",
                  alignItems: "center",
                  padding: "4px 0",
                }}
              >
                더 보기
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const lineOverflowStyle: CSSProperties = {
  whiteSpace: "normal",
  display: "-webkit-box",
  WebkitLineClamp: 1,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
};

export type MedicineType = {
  id: number;
  product_name: string;
  manufacturer_name: string;
  appearance: string;
  length: string;
  width: string;
  thickness: string;
  category_name: string;
  specialized_general_name: string;
  dosage_form_name: string;
};
export default WebcamPage;
