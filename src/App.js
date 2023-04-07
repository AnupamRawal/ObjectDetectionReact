import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";

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
          const detections = await net.detect(video);

          detections.forEach(predictions => {
            console.log(predictions)
            //get predictions result
            const [x, y, width, height] = predictions['bbox'];
            const text = predictions['class'];
            const color = 'red';
            ctx.strokeStyle = color;
            ctx.font = "18px Arial";
            ctx.fillStyle = color;

            ctx.beginPath();
            ctx.fillText(text, x, y - 10);
            ctx.rect(x, y, width / 2, height);
            ctx.stroke();
          })
        }
      };

      detect();
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
        <video ref={videoRef} videoWidth="100%" style={{ position: "absolute" }} />
        <canvas ref={canvasRef} style={{ position: "absolute" }} />
      </div>
    </div>
  );
}

export default App;
