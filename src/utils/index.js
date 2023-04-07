export const drawRect = (detections, ctx)=>{
  detections.forEach(predictions =>{
    console.log(predictions)
    //get predictions result
    const [x, y, width, height] = predictions['bbox'];
    const text = predictions['class'];

   console.log(text, x, y, width, height);
   const color = 'red';
   ctx.strokeStyle = color;
   ctx.font = "18px Arial";
   ctx.fillStyle = color;

   ctx.beginPath();
   ctx.fillText(text, x, y-10);
   ctx.rect(x,y, width/2, height);
   ctx.stroke();
  })
}