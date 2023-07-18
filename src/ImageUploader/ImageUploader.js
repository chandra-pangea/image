import React, { useCallback, useEffect, useState } from "react";
import Dropzone from "react-dropzone";
import { getFileDetails } from "./UploaderFunction";
import "./style.css";
import { CloudUpload } from "@mui/icons-material"; // Import the CloudUpload icon
import { Box, LinearProgress } from "@mui/material";
import { Button } from "react-bootstrap";

const ImageUploader = ({ setImageUrl }) => {
  const [uploadedImageDetails, setUploadedImageDetails] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileSize, setFileSize] = useState(0);
  const [uploadedFileSize, setUploadedFileSize] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [showImage, setShowImage] = useState(true);

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  const handleDrop = useCallback((acceptedFiles) => {
    const imageFile = acceptedFiles.find((file) =>
      file.type.startsWith("image/")
    );

    if (imageFile) {
      setIsUploading(true);
      setFileSize(imageFile.size);
      getFileDetails(imageFile, setUploadedFileSize)
        .then((details) => {
          setUploadedImageDetails(details);
          setIsUploading(false);
        })
        .catch((error) => {
          console.error("Error uploading image:", error);
          setIsUploading(false);
        });
    } else {
      setUploadedImageDetails(null);
    }
  }, []);

  useEffect(() => {
    if (uploadedImageDetails) {
      setImageUrl(uploadedImageDetails.fileURL);
      // You can do something with the uploaded image URL here if needed.
    }
  }, [uploadedImageDetails]);

  // Calculates upload percentage and updates progress bar value
  useEffect(() => {
    let uploadPercentage = (uploadedFileSize / fileSize) * 100;
    setProgress(Math.round(uploadPercentage));
  }, [uploadedFileSize, fileSize]);

  return (
    <>
      <div className="image-container">
        <div className="image-uploader-container">
          <Dropzone onDrop={handleDrop}>
            {({ getRootProps, getInputProps }) => (
              <div
                {...getRootProps()}
                className={`d-flex flex-column justify-content-center align-items-center dropzone cursor-pointer shadow-sm ${
                  hovered ? "hovered" : ""
                }`}
              >
                <div className="upload-container">
                  {uploadedImageDetails ? (
                    <div
                      className="d-flex justify-content-center p-2 w-100 h-100"
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      {hovered && (
                        <p className="hover-text">
                          Click to upload a new image
                        </p>
                      )}
                      {showImage ? (
                        <img
                          src={uploadedImageDetails.fileURL}
                          className="uploaded-image"
                          alt="Uploaded"
                        />
                      ) : (
                        <div className="d-flex justify-content-center align-items-center h-100">
                          <CloudUpload className="upload-icon" />
                        </div>
                      )}
                    </div>
                  ) : !isUploading ? (
                    <div className="d-flex justify-content-center align-items-center ">
                      <CloudUpload
                        sx={{ fontSize: "60px" }}
                        className="upload-icon"
                      />
                    </div>
                  ) : (
                    <div className="d-flex justify-content-center">
                      <Box
                        sx={{
                          width: "80%",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                        }}
                      >
                        <LinearProgress value={progress} />
                        <span className="text-center w-100 m-2">
                          {progress} %
                        </span>
                      </Box>
                    </div>
                  )}
                </div>
                <input {...getInputProps()} />
              </div>
            )}
          </Dropzone>
        </div>
      </div>
    </>
  );
};

export default ImageUploader;
