let fontBase = 750;                  // selected default width for canvas
let fontSize = 10;                     // default size for font

function getFont(canvasWidth) {
  var ratio = fontSize / fontBase;   // calc ratio
  var size = canvasWidth * ratio;   // get font size based on current width
  return (size | 0) + 'px Arial'; // set font
}

export const drawRect = (detections, ctx, canvas) => {
  detections.forEach(predictions => {
    //get predictions result
    const [x, y, width, height] = predictions['bbox'];
    const text = predictions['class'];
    const color = 'red';
    ctx.strokeStyle = color;
    ctx.font = getFont(canvas.width)
    ctx.fillStyle = color;

    ctx.beginPath();
    ctx.fillText(text, x, y-10);
    ctx.rect(x, y, width, height);
    ctx.stroke();
  })
}