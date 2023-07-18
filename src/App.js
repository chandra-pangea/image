import React from "react";
import "./App.css";
import ImageUploader from "./ImageUploader/ImageUploader";
import ImageCrop from "./ImageCrop/ImageCrop";
const App = () => {
  const [currentPage, setCurrentPage] = React.useState(0);
  const [imageUrl, setImageUrl] = React.useState();
  const handleClick = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  React.useEffect(() => {
    console.log(imageUrl);
  }, [imageUrl]);
  return (
    <div className="App">
      {!currentPage ? (
        <div>
          <ImageUploader setImageUrl={setImageUrl} />
          <div className="button">
            <button className="btn" onClick={handleClick}>
              Move To Select Object
            </button>
          </div>
        </div>
      ) : (
        <div>
          <ImageCrop imageUrl={imageUrl} />
        </div>
      )}
    </div>
  );
};

export default App;
