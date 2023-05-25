import { useEffect, useState } from "react";
import "./App.css";
import { MedicineType } from "./WebcamPage";

const MedicineDetailPage = () => {
  // 더미 데이터
  const product_name = "dummy_product_name1";
  const manufacturer_name = "dummy_manufacturer_name1";
  const appearance = "dummy_appearance1";
  const length = "dummy_length1";
  const width = "dummy_width1";
  const thickness = "dummy_thickness1";
  const category_name = "dummy_category_name1";
  const specialized_general_name = "dummy_specialized_general_name1";
  const dosage_form_name = "dummy_dosage_form_name1";

  const [medicine, setMedicine] = useState<MedicineType | null>(null);

  useEffect(() => {
    const medicineData = window.sessionStorage.getItem("data");
    if (medicineData) setMedicine(JSON.parse(medicineData));
  }, []);

  if (!medicine) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Medicine Details</h1>
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
