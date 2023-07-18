import React, { useRef, useState } from 'react';
import { Rect, Transformer } from 'react-konva';

const ResizableRectangle = ({ x, y, width, height }) => {
    const rectRef = useRef(null);
    const trRef = useRef(null);
    const [isSelected, setSelected] = useState(false);

    const handleSelect = () => {
        setSelected(true);
        trRef.current.nodes([rectRef.current]);
    };

    return (
        <>
            <Rect
                x={x}
                y={y}
                width={width}
                height={height}
                fill="transparent"
                stroke="blue"
                rotation={false}
                draggable
                onClick={handleSelect}
                ref={rectRef}
                onDragEnd={(e) => {
                    rectRef.current.setAttrs({
                        x: e.target.x(),
                        y: e.target.y(),
                    });
                    const rect = rectRef.current;
                    const topLeft = { x: rect.x(), y: rect.y() };
                    const topRight = { x: rect.x() + rect.width(), y: rect.y() };
                    const bottomLeft = { x: rect.x(), y: rect.y() + rect.height() };
                    const bottomRight = { x: rect.x() + rect.width(), y: rect.y() + rect.height() };
                    console.log('Top Left:', topLeft);
                    console.log('Top Right:', topRight);
                    console.log('Bottom Left:', bottomLeft);
                    console.log('Bottom Right:', bottomRight);
                }}
                onTransformEnd={() => {
                    const node = rectRef.current;
                    const scaleX = node.scaleX();
                    const scaleY = node.scaleY();

                    // update the rectangle width and height based on the scaling
                    rectRef.current.setAttrs({
                        width: Math.max(5, node.width() * scaleX),
                        height: Math.max(node.height() * scaleY),
                        scaleX: 1,
                        scaleY: 1,
                    });
                }}
            />
            {isSelected && (
                <Transformer
                    ref={trRef}
                    boundBoxFunc={(oldBox, newBox) => {
                        // limit resize
                        if (newBox.width < 5 || newBox.height < 5) {
                            return oldBox;
                        }
                        return newBox;
                    }}
                />
            )}
        </>
    );
};

export default ResizableRectangle;
