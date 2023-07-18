import { Stage, Layer, Image as KonvaImage } from 'react-konva';
import React, { useEffect, useRef, useState } from 'react';
import ResizableRectangle from './ResizableRectagle';

const MyKonvaComponent = () => {
  const [image] = useState(new window.Image());
  const [imageLoaded, setImageLoaded] = useState(false);
  const [ImagePixel,setImagePixel]=useState()
  const rectRef = useRef(null);
  const trRef = useRef(null);
  const [isSelected, setSelected] = useState(false);

  const handleSelect = () => {
    setSelected(true);
    trRef.current.nodes([rectRef.current]);
  };

  useEffect(() => {
    image.onload = () => {
      setImageLoaded(true);
    };
    image.src ='https://res.cloudinary.com/dtzlqivcd/image/upload/v1689588768/test2_dzib8c.png'

    return () => {
      // Clean up event listeners
      image.onload = null;
    };
  }, []);

  const getMeta = (url) =>
    new Promise((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(err);
      img.src = url;
    });


  const handleSubmit=()=>{
    console.log("data")
  }
  // Usage example:
  useEffect(() => {
    (async () => {
      const img = await getMeta(image.src);
      setImagePixel(img)
    })();
  }, [image.src]);

  return (
    <div>
    <Stage width={ImagePixel?.naturalWidth} height={ImagePixel?.naturalHeight}>
      <Layer>
        {/* Background */}
        {imageLoaded &&  (
          <KonvaImage x={0} y={0} image={image} />
        )}
      </Layer>
      <Layer>
        {/* Asset */}
        <ResizableRectangle x={100} y={100} height={200} width={100} />
      </Layer>
    </Stage>
    <div style={{display:"flex",justifyContent:"center",alignItems:"center"}}><button onClick={handleSubmit} style={{backgroundColor:"#2D39B5",color:"white",padding:'8px',margin:"4px",border:"1px solid red",borderRadius:"5px",fontSize:"17px"}}>Submit</button></div>
    </div>
  );
};

export default MyKonvaComponent;
