import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";
import { drawRect } from "./utils";
import './App.css'

function App() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [animationFrameId, setAnimationFrameId] = useState(null);

  // Load the COCO-SSD model
  const loadModel = async () => {
    const net = await cocossd.load();
    return net;
  };

  // Run the object detection on the uploaded video
  const runDetection = async (net) => {
    if (videoRef.current !== null) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;
      video.width = videoWidth;
      video.height = videoHeight;
      canvas.width = videoWidth;
      canvas.height = videoHeight;

      // Start the video playback and wait for it to start
      await video.play();

      const detect = async () => {
        if (video.readyState === 4) {
          // Perform the object detection
          const obj = await net.detect(video);
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          // Draw the detection results on the canvas
          drawRect(obj, ctx);
        }
        setAnimationFrameId(requestAnimationFrame(detect));
      };

      detect();
      // Add event listener to stop detection when video ends
      video.addEventListener("ended", () => {
        cancelAnimationFrame(animationFrameId);
      });
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
      <div style={{ position: "relative" }}>
        <video
          ref={videoRef}
          style={{ position: "absolute", zIndex: 0, width: "800px", height:"auto", left: "50%", transform: "translateX(-50%)" }}
        />
        <canvas
          ref={canvasRef}
          style={{ position: "absolute", zIndex: 1, width: "800px", left: "50%", transform: "translateX(-50%)" }}
        />
      </div>
    </div>
  );
}

export default App;
