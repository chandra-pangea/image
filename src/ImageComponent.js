import React, { useState, useRef } from 'react';
import { Stage, Layer, Image, Transformer } from 'react-konva';
import Konva from 'konva';
import TextComponent from './TextComponent';
const ImageComponent = () => {
  const stageRef = useRef();
  const imageRef = useRef();
  const trRef = useRef();
  const [selected, setSelected] = useState(false);
  const [image, setImage] = useState(null);
  const [contrast, setContrast] = useState(1);
  const [cropSize, setCropSize] = useState(null);

  const handleDragStart = () => {
    setSelected(true);
  };

  const handleDragEnd = () => {
    setSelected(false);
  };

  const handleTransformEnd = () => {
    const node = imageRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    node.scaleX(scaleX);
    node.scaleY(scaleY);
    trRef.current.getLayer().batchDraw();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
      const img = new window.Image();
      img.src = event.target.result;
      img.onload = () => {
        setImage(img);
        setCropSize({
          width: img.width,
          height: img.height,
        });
      };
    };

    reader.readAsDataURL(file);
  };

  const handleContrastChange = (e) => {
    setContrast(parseFloat(e.target.value));
  };

  const handleCropResize = () => {
    const node = imageRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    const width = node.width() * scaleX;
    const height = node.height() * scaleY;

    setCropSize({
      width,
      height,
    });
  };

  const handleDownloadImage = () => {
    const stage = stageRef.current;
    const dataURL = stage.toDataURL();
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'stage.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <input
        type="range"
        min="0"
        max="2"
        step="0.1"
        value={contrast}
        onChange={handleContrastChange}
      />
      <button onClick={handleCropResize}>Crop Resize</button>
      <button onClick={handleDownloadImage}>Download Stage</button>
      <Stage width={500} height={600} ref={stageRef}>
        <Layer>
        <TextComponent/>

          {image && (
            <Image
              image={image}
              ref={imageRef}
              draggable
              onDragStart={handleDragStart}
              onClick={handleDragStart}
              onDragEnd={handleDragEnd}
              filters={[Konva.Filters.Contrast]}
              contrast={contrast}
              onTransformEnd={handleTransformEnd}
              crop={cropSize}
            />
          )}
          {selected && (
            <Transformer
              ref={trRef}
              node={imageRef.current}
              boundBoxFunc={(oldBox, newBox) => {
                if (newBox.width < 10 || newBox.height < 10) {
                  return oldBox;
                }
                return newBox;
              }}
              keepRatio={false}
              rotateEnabled={false}
              onTransformEnd={handleTransformEnd}
            />
          )}
        </Layer>
       
      </Stage>
    </div>
  );
};

export default ImageComponent;
