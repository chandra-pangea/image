import React from "react";
import "./App.css";
import Layer from "./Layer";
import ImageCrop from "./ImageCrop/ImageCrop";
import ImageUploader from "./ImageUploader/ImageUploader";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Uploader = () => {
  return (
    <div className="App">
      <ImageUploader />
      <div className="button">
        <button className="btn">Move To Select Object</button>
      </div>
    </div>
  );
};

export default Uploader;
