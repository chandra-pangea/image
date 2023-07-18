import React, { useEffect, useState, useRef } from "react";
import { Stage, Layer, Image, Rect } from "react-konva";
import axios from "axios";
const ImageCrop = ({ imageUrl }) => {
  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);
  const [rectangles, setRectangles] = useState([]);
  const [drawing, setDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [endPos, setEndPos] = useState({ x: 0, y: 0 });
  const [imageCutout, setImageCutout] = useState();
  const stageRef = useRef(null);
  const imageRef = useRef(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const image = new window.Image();
    image.src = imageUrl;
    image.onload = () => {
      const stage = stageRef.current;
      setImageWidth(image.width);
      setImageHeight(image.height);
      imageRef.current = image;
      stage.batchDraw();
    };
  }, []);

  const handleMouseDown = (e) => {
    setDrawing(true);
    const stage = e.target.getStage();
    const position = stage.getPointerPosition();
    setStartPos({ x: position.x, y: position.y });
    setEndPos({ x: position.x, y: position.y });
  };

  const handleMouseMove = (e) => {
    if (!drawing) return;

    const stage = e.target.getStage();
    const position = stage.getPointerPosition();
    setEndPos({ x: position.x, y: position.y });
    stage.batchDraw();
  };

  const handleMouseUp = () => {
    if (!drawing) return;

    setDrawing(false);
    const newRectangle = {
      x: startPos.x,
      y: startPos.y,
      width: endPos.x - startPos.x,
      height: endPos.y - startPos.y,
    };

    setRectangles([newRectangle]);
    console.log("Coordinates:", newRectangle);
  };

  const maxWidth = 960;
  const maxHeight = 540;

  const scale = Math.min(maxWidth / imageWidth, maxHeight / imageHeight);
  const scaledWidth = imageWidth * scale;
  const scaledHeight = imageHeight * scale;

  const handlePostRequest = async () => {
    try {
      setLoading(true);
      const apiUrl = "http://localhost:3020/artstudio/sam-cutout-bbox";
      const data = {
        projectId: "64ae77e1432482f34c2db679",
        workflowId: "64ae7904432482f34c2db69c",
        templateId: "64ae796bdc8cd6064aa7a70f",
        userId: "6482b950235b8404822771a9",
        image: imageUrl,
        coordinates: [
          Math.round(rectangles[0].x),
          Math.round(rectangles[0].y),
          Math.round(rectangles[0].x) + Math.round(rectangles[0].width),
          Math.round(rectangles[0].height) + Math.round(rectangles[0].y),
        ],
      };
      const response = await axios.post(apiUrl, data);
      console.log("Response:", response.data.response.images[0]);
      setLoading(false);
      const base64ImageData = `data:image/png;base64,${response.data.response.images[0]}`;
      setImageCutout(base64ImageData);
    } catch (error) {
      setLoading(false);
      console.error("Error:", error);
    }
  };

  return (
    <div>
      {!imageCutout && (
        <Stage
          ref={stageRef}
          width={maxWidth}
          height={maxHeight}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <Layer>
            <Image
              x={(maxWidth - scaledWidth) / 2}
              y={(maxHeight - scaledHeight) / 2}
              width={scaledWidth}
              height={scaledHeight}
              image={imageRef.current}
            />
            {rectangles.map((rect, index) => (
              <Rect
                key={index}
                x={rect.x}
                y={rect.y}
                width={rect.width}
                height={rect.height}
                stroke="red"
              />
            ))}
            {drawing && (
              <Rect
                x={startPos.x}
                y={startPos.y}
                width={endPos.x - startPos.x}
                height={endPos.y - startPos.y}
                stroke="red"
              />
            )}
          </Layer>
        </Stage>
      )}
      {imageCutout && (
        <div
          style={{
            height: "960",
            width: "540",
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <img src={imageCutout} alt="Base64 Image" />
        </div>
      )}
      <div
        className="button"
        style={{
          height: "960",
          width: "540",
          display: "flex",
          justifyContent: "space-around",
        }}
      >
        <button className="btn" onClick={handlePostRequest}>
          Generate CutOut
        </button>
        {imageCutout && (
          <button className="btn" onClick={() => setImageCutout()}>
            Select Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ImageCrop;
