
import React, { useState, useRef } from 'react';
import { Stage, Layer, Text, Transformer } from 'react-konva';

const TextComponent = () => {
  const textRef = useRef();
  const trRef = useRef();
  const [selected, setSelected] = useState(false);
  const [textSelected, setTextSelected] = useState(false);
  const [text, setText] = useState('Edit me!');
  const [textSize, setTextSize] = useState({ width: 0, height: 0 });

  const handleDoubleClick = () => {
    setSelected(true);
  };

  const handleDragEnd = () => {
    setSelected(false);
  };

  const handleTransform = () => {
    const node = textRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    node.scaleX(scaleX);
    node.scaleY(scaleY);
    setTextSize({
      width: node.width() * scaleX,
      height: node.height() * scaleY,
    });
  };

  const handleTextClick = () => {
    setTextSelected(true);
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleTextBlur = () => {
    setTextSelected(false);
  };

  return (
    <div>
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          <Text
            text={text}
            fontSize={20}
            fontFamily="Arial"
            fill="black"
            ref={textRef}
            draggable
            onDblClick={handleDoubleClick}
            onDragEnd={handleDragEnd}
            onClick={handleTextClick}
            onTransform={handleTransform}
          />
          {selected && (
            <Transformer
              ref={trRef}
              node={textRef.current}
              rotateEnabled={false}
              onTransformEnd={handleTransform}
              keepRatio={false}
            />
          )}
        </Layer>
      </Stage>
      {textSelected && (
        <div
          style={{
            position: 'absolute',
            top: textRef.current.y(),
            left: textRef.current.x(),
          }}
        >
          <input
            type="text"
            value={text}
            onChange={handleTextChange}
            onBlur={handleTextBlur}
            autoFocus
            style={{
              width: textSize.width,
              height: textSize.height,
              fontSize: textRef.current.fontSize(),
              fontFamily: textRef.current.fontFamily(),
              color: textRef.current.fill(),
              position: 'absolute',
            }}
          />
        </div>
      )}
    </div>
  );
};

export default TextComponent;
