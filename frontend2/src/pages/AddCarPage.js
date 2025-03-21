"use client"

import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddCarPage() {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [deposit, setDeposit] = useState("");
  const [carStatus, setCarStatus] = useState("available");
  const [color, setColor] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [productionYear, setProductionYear] = useState("");
  const [mileage, setMileage] = useState("");
  const [fuelConsumption, setFuelConsumption] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [transmissionType, setTransmissionType] = useState("");
  const [numberOfSeats, setNumberOfSeats] = useState("");
  const [address, setAddress] = useState("");
  const [termsOfUse, setTermsOfUse] = useState("");
  const [additionalFunctions, setAdditionalFunctions] = useState("");
  const [images, setImages] = useState([]); // Mảng để lưu trữ các hình ảnh
  const [documents, setDocuments] = useState([]); // Mảng để lưu trữ các tài liệu
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...files]);
  };

  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleDocumentChange = (e) => {
    const files = Array.from(e.target.files);
    setDocuments((prevDocuments) => [...prevDocuments, ...files]);
  };

  const handleRemoveDocument = (index) => {
    setDocuments((prevDocuments) => prevDocuments.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Tải lên hình ảnh lên Cloudinary
    const imageUrls = await uploadFilesToCloudinary(images);
    const documentUrls = await uploadFilesToCloudinary(documents);

    const carData = {
      brand,
      model,
      name,
      description,
      base_price: basePrice,
      deposit,
      car_status: carStatus,
      color,
      license_plate: licensePlate,
      production_years: productionYear,
      mileage,
      fuel_consumption: fuelConsumption,
      fuel_type: fuelType,
      transmission_type: transmissionType,
      number_of_seats: numberOfSeats,
      address,
      terms_of_use: termsOfUse,
      additional_functions: additionalFunctions,
      image_url: imageUrls,
      document_url: documentUrls,
    };

    try {
      const token = localStorage.getItem("token"); // Lấy token từ localStorage
      const response = await fetch("http://localhost:8386/cars/", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`, // Thêm token vào tiêu đề
          "Content-Type": "application/json",
        },
        body: JSON.stringify(carData), // Gửi dữ liệu xe
      });

      if (!response.ok) {
        throw new Error("Failed to add car. Please check your input.");
      }

      const data = await response.json();
      console.log(data); // Kiểm tra phản hồi từ API
      alert("Car added successfully!");
      navigate("/cars"); // Điều hướng về trang danh sách xe
    } catch (error) {
      console.error("Error adding car:", error);
      alert(error.message);
    }
  };

  const uploadFilesToCloudinary = async (files) => {
    const urls = [];
    const uploadPreset = "SDN302_Image_Upload"; 
    const cloudName = "dvdnw79tk";

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);
      formData.append("cloud_name", cloudName);

      try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (data.secure_url) {
          urls.push(data.secure_url); // Lưu URL vào mảng
        }
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
    return urls; // Trả về mảng URL
  };

  return (
    <div>
      <h2>Add New Car</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Brand</label>
          <input
            type="text"
            className="form-control"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Model</label>
          <input
            type="text"
            className="form-control"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Base Price</label>
          <input
            type="number"
            className="form-control"
            value={basePrice}
            onChange={(e) => setBasePrice(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Deposit</label>
          <input
            type="number"
            className="form-control"
            value={deposit}
            onChange={(e) => setDeposit(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Car Status</label>
          <select
            className="form-control"
            value={carStatus}
            onChange={(e) => setCarStatus(e.target.value)}
          >
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </div>
        <div className="form-group">
          <label>Color</label>
          <input
            type="text"
            className="form-control"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>License Plate</label>
          <input
            type="text"
            className="form-control"
            value={licensePlate}
            onChange={(e) => setLicensePlate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Production Year</label>
          <input
            type="number"
            className="form-control"
            value={productionYear}
            onChange={(e) => setProductionYear(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Mileage</label>
          <input
            type="number"
            className="form-control"
            value={mileage}
            onChange={(e) => setMileage(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Fuel Consumption</label>
          <input
            type="number"
            className="form-control"
            value={fuelConsumption}
            onChange={(e) => setFuelConsumption(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Fuel Type</label>
          <input
            type="text"
            className="form-control"
            value={fuelType}
            onChange={(e) => setFuelType(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Transmission Type</label>
          <input
            type="text"
            className="form-control"
            value={transmissionType}
            onChange={(e) => setTransmissionType(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Number of Seats</label>
          <input
            type="number"
            className="form-control"
            value={numberOfSeats}
            onChange={(e) => setNumberOfSeats(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Address</label>
          <input
            type="text"
            className="form-control"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Terms of Use</label>
          <textarea
            className="form-control"
            value={termsOfUse}
            onChange={(e) => setTermsOfUse(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Additional Functions</label>
          <textarea
            className="form-control"
            value={additionalFunctions}
            onChange={(e) => setAdditionalFunctions(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Images</label>
          <input
            type="file"
            className="form-control"
            multiple
            onChange={handleImageChange}
            required
          />
          <div className="preview-images">
            {images.map((image, index) => (
              <div key={index} className="image-preview">
                <img src={URL.createObjectURL(image)} alt={`preview ${index}`} width="100" />
                <button type="button" onClick={() => handleRemoveImage(index)}>X</button>
              </div>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label>Documents</label>
          <input
            type="file"
            className="form-control"
            multiple
            onChange={handleDocumentChange}
            required
          />
          <div className="preview-documents">
            {documents.map((document, index) => (
              <div key={index} className="document-preview">
                <span>{document.name}</span>
                <button type="button" onClick={() => handleRemoveDocument(index)}>X</button>
              </div>
            ))}
          </div>
        </div>
        <button type="submit" className="btn btn-primary">
          Add Car
        </button>
      </form>
    </div>
  );
}

export default AddCarPage;

