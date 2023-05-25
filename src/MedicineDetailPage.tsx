import { useState } from "react";
import "./App.css";

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

  const [medicine, setMedicine] = useState(null);

  // useEffect(() => {
  //   const fetchMedicine = async () => {
  //     try {
  //       const response = await axios.get(`/medicine/${medicine.id}`);
  //       setMedicine(response.data);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   if (medicine && medicine.id) {
  //     fetchMedicine();
  //   }
  // }, [medicine.id]);

  if (!medicine) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Medicine Details</h1>
      <h2>{product_name}</h2>
      <p>Manufacturer: {manufacturer_name}</p>
      <p>Appearance: {appearance}</p>
      <p>Length: {length}</p>
      <p>Width: {width}</p>
      <p>Thickness: {thickness}</p>
      <p>Category: {category_name}</p>
      <p>Specialized General: {specialized_general_name}</p>
      <p>Dosage Form: {dosage_form_name}</p>
    </div>
  );
};

export default MedicineDetailPage;

// export default MedicineList;
