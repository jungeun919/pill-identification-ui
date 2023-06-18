import { useEffect, useState } from "react";
import "./App.css";
import { MedicineType } from "./WebcamPage";

const MedicineDetailPage = () => {
  const [medicine, setMedicine] = useState<MedicineType | null>(null);

  useEffect(() => {
    const medicineData = window.sessionStorage.getItem("data");
    if (medicineData) setMedicine(JSON.parse(medicineData));
  }, []);

  if (!medicine) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ paddingLeft: "5vw" }}>
      <h1>Medicine Details</h1>
      {medicine.product_image && (
        <img src={medicine.product_image} width="500" alt="알약이미지" style={{ borderRadius: 2 }} />
      )}
      <h2>{medicine.product_name}</h2>
      <p>Manufacturer: {medicine.manufacturer_name}</p>
      <p>Appearance: {medicine.appearance}</p>
      <p>Length: {medicine.length}</p>
      <p>Width: {medicine.width}</p>
      <p>Thickness: {medicine.thickness}</p>
      <p>Category: {medicine.category_name}</p>
      <p>Specialized General: {medicine.specialized_general_name}</p>
      <p>Dosage Form: {medicine.dosage_form_name}</p>
    </div>
  );
};

export default MedicineDetailPage;

// export default MedicineList;
