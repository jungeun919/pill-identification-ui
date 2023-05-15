import './App.css';
import React, { useState, useEffect } from "react";
import axios from "axios";

function MedicineList() {
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/medicine/").then((response) => {
      setMedicines(response.data);
    });
  }, []);

  return (
    <div>
      <h1>Medicine List</h1>
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
