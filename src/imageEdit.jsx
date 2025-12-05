import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyD39VG8-EhtIAh-7dmQZjcdBJKoXScoGVA");

const Edit = () => {
  const [inputImage, setInputImage] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [outputImage, setOutputImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e) => {
    setInputImage(e.target.files[0]);
  };

  const editImage = async () => {
    if (!inputImage || !prompt) {
      alert("Please upload an image and enter a prompt");
      return;
    }

    setLoading(true);

    // Convert file to base64
    const base64 = await toBase64(inputImage);

    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash", // or pro
      });

      const result = await model.generateContent([
        {
          inlineData: {
            data: base64,
            mimeType: inputImage.type,
          },
        },
        { text: prompt },
      ]);

      console.log("Gemini Response:", result);

      const response = result.response;
      const editedImageBase64 =
        response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

      if (!editedImageBase64) {
        alert("No edited image generated.");
      } else {
        setOutputImage(`data:image/png;base64,${editedImageBase64}`);
      }
    } catch (error) {
      console.error("Gemini Error:", error);
    }

    setLoading(false);
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
    });

  return (
    <div style={{ padding: "20px" }}>
      <h2>Gemini 2.5 Vision Image Editor</h2>

      {/* Upload Image */}
      <input type="file" accept="image/*" onChange={handleImageUpload} />

      {/* Prompt Input */}
      <input
        type="text"
        placeholder="Describe the edit: remove background, brighten, etc."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        style={{ marginLeft: "10px" }}
      />

      <button onClick={editImage} style={{ marginLeft: "10px" }}>
        Edit Image
      </button>

      {loading && <p>Editing image... Please wait.</p>}

      {/* Original Image */}
      {inputImage && (
        <div>
          <h4>Original Image</h4>
          <img
            src={URL.createObjectURL(inputImage)}
            width="300"
            style={{ marginTop: "10px" }}
          />
        </div>
      )}

      {/* Edited Image */}
      {outputImage && (
        <div>
          <h4>Edited Image</h4>
          <img src={outputImage} width="300" style={{ marginTop: "10px" }} />
        </div>
      )}
    </div>
  );
};

export default Edit;
