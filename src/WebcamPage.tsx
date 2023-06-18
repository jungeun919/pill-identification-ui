import axios from "axios";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

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
      console.log(123, video, canvas);

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
      formData.append("frame", imageDataBlob, "capture.png");

      // 이미지 데이터를 서버로 전송
      // #region 이곳에서 imageDataUrl를 통해 캡쳐한 사진 데이터를 전송할 수 있습니다.
      // data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAoAAA .. 로시작하는 데이터가 console에 찍힙니다. -> F12에서 확인가능!
      axios
        .post(`http://10.100.154.24:3636/test`, formData)
        .then((res) => {
          console.log(res.data);
          if (res && res.data && !res.data.color_preds) setMedicines((r) => [...res.data, ...r]);
        })
        .catch((e) => console.error("접근 에러", e));
      // #endregion
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
  }, [navigator]);

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
          <canvas ref={canvasRef} style={{ zIndex: -1, position: "absolute", opacity: 0, pointerEvents: "none" }} />
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

const SHAPE_SCORE_LIST = {
  마름모형: {
    마름모형: 1,
    반원형: 0,
    사각형: 1,
    삼각형: 0,
    오각형: 0,
    육각형: 0,
    원형: 0,
    장방형: 0,
    타원형: 0,
    팔각형: 0,
    기타: 0,
  },
  반원형: {
    마름모형: 0,
    반원형: 1,
    사각형: 0,
    삼각형: 0,
    오각형: 0,
    육각형: 0,
    원형: 0.1,
    장방형: 0.1,
    타원형: 0.1,
    팔각형: 0,
    기타: 0,
  },
  사각형: {
    마름모형: 1,
    반원형: 0,
    사각형: 1,
    삼각형: 0,
    오각형: 0,
    육각형: 0,
    원형: 0,
    장방형: 0,
    타원형: 0,
    팔각형: 0,
    기타: 0,
  },
  삼각형: {
    마름모형: 0,
    반원형: 0,
    사각형: 0,
    삼각형: 1,
    오각형: 0,
    육각형: 0,
    원형: 0,
    장방형: 0,
    타원형: 0,
    팔각형: 0,
    기타: 0,
  },
  오각형: {
    마름모형: 0,
    반원형: 0,
    사각형: 0,
    삼각형: 0,
    오각형: 1,
    육각형: 0.5,
    원형: 0,
    장방형: 0,
    타원형: 0,
    팔각형: 0.5,
    기타: 0,
  },
  육각형: {
    마름모형: 0,
    반원형: 0,
    사각형: 0,
    삼각형: 0,
    오각형: 0.5,
    육각형: 1,
    원형: 0,
    장방형: 0,
    타원형: 0,
    팔각형: 0.5,
    기타: 0,
  },
  원형: {
    마름모형: 0,
    반원형: 0,
    사각형: 0,
    삼각형: 0,
    오각형: 0,
    육각형: 0,
    원형: 1,
    장방형: 0.5,
    타원형: 0.5,
    팔각형: 0.5,
    기타: 0,
  },
  장방형: {
    마름모형: 0,
    반원형: 0,
    사각형: 0,
    삼각형: 0,
    오각형: 0,
    육각형: 0,
    원형: 0,
    장방형: 1,
    타원형: 0,
    팔각형: 0,
    기타: 0,
  },
  타원형: {
    마름모형: 0,
    반원형: 0,
    사각형: 0,
    삼각형: 0,
    오각형: 0,
    육각형: 0,
    원형: 0.5,
    장방형: 1,
    타원형: 1,
    팔각형: 0,
    기타: 0,
  },
  팔각형: {
    마름모형: 0,
    반원형: 0,
    사각형: 0,
    삼각형: 0,
    오각형: 0.6,
    육각형: 0.8,
    원형: 0,
    장방형: 0,
    타원형: 0,
    팔각형: 1,
    기타: 0,
  },
  기타: {
    마름모형: 0,
    반원형: 0,
    사각형: 0,
    삼각형: 0,
    오각형: 0,
    육각형: 0,
    원형: 0,
    장방형: 0,
    타원형: 0,
    팔각형: 0,
    기타: 1,
  },
};

const COLOR_SCORE_LIST = {
  갈색: {
    갈색: 1.0,
    옅은: 0,
    진한: 0,
    투명: 0,
    검정: 0,
    남색: 0.5,
    노랑: 0,
    보라: 0.5,
    분홍: 0,
    빨강: 0,
    연두: 0,
    자주: 0,
    주황: 0,
    청록: 0.5,
    초록: 0.5,
    파랑: 0,
    하양: 0,
    회색: 0,
  },
  옅은: {
    갈색: 0,
    옅은: 1.0,
    진한: 0,
    투명: 0,
    검정: 0,
    남색: 0,
    노랑: 0,
    보라: 0,
    분홍: 0,
    빨강: 0,
    연두: 0,
    자주: 0,
    주황: 0,
    청록: 0,
    초록: 0,
    파랑: 0,
    하양: 0,
    회색: 0,
  },
  진한: {
    갈색: 0,
    옅은: 0,
    진한: 1.0,
    투명: 0,
    검정: 0,
    남색: 0,
    노랑: 0,
    보라: 0,
    분홍: 0,
    빨강: 0,
    연두: 0,
    자주: 0,
    주황: 0,
    청록: 0,
    초록: 0,
    파랑: 0,
    하양: 0,
    회색: 0,
  },
  투명: {
    갈색: 0,
    옅은: 0,
    진한: 0,
    투명: 1.0,
    검정: 0,
    남색: 0,
    노랑: 0,
    보라: 0,
    분홍: 0,
    빨강: 0,
    연두: 0,
    자주: 0,
    주황: 0,
    청록: 0,
    초록: 0,
    파랑: 0,
    하양: 0,
    회색: 0,
  },
  검정: {
    갈색: 0,
    옅은: 0,
    진한: 0,
    투명: 0,
    검정: 1.0,
    남색: 0.5,
    노랑: 0,
    보라: 0,
    분홍: 0,
    빨강: 0,
    연두: 0,
    자주: 0,
    주황: 0,
    청록: 0,
    초록: 0,
    파랑: 0,
    하양: 0,
    회색: 0,
  },
  남색: {
    갈색: 0,
    옅은: 0,
    진한: 0,
    투명: 0,
    검정: 0,
    남색: 1,
    노랑: 0,
    보라: 0.5,
    분홍: 0,
    빨강: 0,
    연두: 0,
    자주: 0,
    주황: 0,
    청록: 0,
    초록: 0,
    파랑: 0.5,
    하양: 0,
    회색: 0,
  },
  노랑: {
    갈색: 0,
    옅은: 0,
    진한: 0,
    투명: 0,
    검정: 0,
    남색: 0,
    노랑: 1.0,
    보라: 0,
    분홍: 0,
    빨강: 0,
    연두: 0,
    자주: 0,
    주황: 0.5,
    청록: 0,
    초록: 0,
    파랑: 0,
    하양: 0,
    회색: 0,
  },
  보라: {
    갈색: 0,
    옅은: 0,
    진한: 0,
    투명: 0,
    검정: 0,
    남색: 0,
    노랑: 0,
    보라: 1.0,
    분홍: 0,
    빨강: 0,
    연두: 0,
    자주: 0.5,
    주황: 0.3,
    청록: 0,
    초록: 0,
    파랑: 0,
    하양: 0,
    회색: 0,
  },
  분홍: {
    갈색: 0,
    옅은: 0,
    진한: 0,
    투명: 0,
    검정: 0,
    남색: 0,
    노랑: 0,
    보라: 0.5,
    분홍: 1.0,
    빨강: 0,
    연두: 0,
    자주: 0.5,
    주황: 0,
    청록: 0,
    초록: 0,
    파랑: 0,
    하양: 0,
    회색: 0,
  },
  빨강: {
    갈색: 0,
    옅은: 0,
    진한: 0,
    투명: 0,
    검정: 0,
    남색: 0,
    노랑: 0,
    보라: 0,
    분홍: 0.5,
    빨강: 1.0,
    연두: 0,
    자주: 0,
    주황: 0.5,
    청록: 0,
    초록: 0,
    파랑: 0,
    하양: 0,
    회색: 0,
  },
  연두: {
    갈색: 0,
    옅은: 0,
    진한: 0,
    투명: 0,
    검정: 0,
    남색: 0,
    노랑: 0,
    보라: 0,
    분홍: 0,
    빨강: 0,
    연두: 1.0,
    자주: 0,
    주황: 0,
    청록: 0.5,
    초록: 0.5,
    파랑: 0,
    하양: 0,
    회색: 0,
  },
  자주: {
    갈색: 0,
    옅은: 0,
    진한: 0,
    투명: 0,
    검정: 0,
    남색: 0,
    노랑: 0,
    보라: 0.5,
    분홍: 0.5,
    빨강: 0.2,
    연두: 0,
    자주: 1.0,
    주황: 0,
    청록: 0,
    초록: 0,
    파랑: 0,
    하양: 0,
    회색: 0,
  },
  주황: {
    갈색: 0,
    옅은: 0,
    진한: 0,
    투명: 0,
    검정: 0,
    남색: 0,
    노랑: 0,
    보라: 0,
    분홍: 0,
    빨강: 0.5,
    연두: 0,
    자주: 0,
    주황: 1.0,
    청록: 0,
    초록: 0,
    파랑: 0,
    하양: 0,
    회색: 0,
  },
  청록: {
    갈색: 0,
    옅은: 0,
    진한: 0,
    투명: 0,
    검정: 0,
    남색: 0,
    노랑: 0,
    보라: 0,
    분홍: 0,
    빨강: 0,
    연두: 0,
    자주: 0,
    주황: 0,
    청록: 1,
    초록: 0.5,
    파랑: 0,
    하양: 0,
    회색: 0,
  },
  초록: {
    갈색: 0,
    옅은: 0,
    진한: 0,
    투명: 0,
    검정: 0,
    남색: 0,
    노랑: 0,
    보라: 0,
    분홍: 0,
    빨강: 0,
    연두: 0,
    자주: 0,
    주황: 0,
    청록: 0.5,
    초록: 1,
    파랑: 0,
    하양: 0,
    회색: 0,
  },
  파랑: {
    갈색: 0,
    옅은: 0,
    진한: 0,
    투명: 0,
    검정: 0,
    남색: 0.5,
    노랑: 0,
    보라: 0,
    분홍: 0,
    빨강: 0,
    연두: 0,
    자주: 0,
    주황: 0,
    청록: 0,
    초록: 0,
    파랑: 1,
    하양: 0,
    회색: 0,
  },
  하양: {
    갈색: 0,
    옅은: 0,
    진한: 0,
    투명: 0,
    검정: 0,
    남색: 0,
    노랑: 0,
    보라: 0,
    분홍: 0,
    빨강: 0,
    연두: 0,
    자주: 0,
    주황: 0,
    청록: 0,
    초록: 0,
    파랑: 0,
    하양: 1.0,
    회색: 0.5,
  },
  회색: {
    갈색: 0,
    옅은: 0,
    진한: 0,
    투명: 0,
    검정: 0,
    남색: 0,
    노랑: 0,
    보라: 0,
    분홍: 0,
    빨강: 0,
    연두: 0,
    자주: 0,
    주황: 0,
    청록: 0,
    초록: 0,
    파랑: 0,
    하양: 0.5,
    회색: 1.0,
  },
};
export default WebcamPage;
