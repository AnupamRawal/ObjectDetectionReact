import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";

function App() {
  const videoRef = useRef(null);

  // Load the COCO-SSD model
  const loadModel = async () => {
    const net = await cocossd.load();
    return net;
  };

  // Run the object detection on the uploaded video
  const runDetection = async (net) => {
    if (videoRef.current !== null) {
      const video = videoRef.current;
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;
      video.width = videoWidth;
      video.height = videoHeight;

      // Start the video playback and wait for it to start
      await video.play();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const video = videoRef.current;
    const source = URL.createObjectURL(file);
    video.src = source;

    const net = await loadModel();
    runDetection(net);
  };

  return (
    <div className="App">
      <input type="file" onChange={handleFileChange} />
      <div>
        <video ref={videoRef}/>
      </div>
    </div>
  );
}

export default App;
