import '../style/style.css'

const container = document.getElementById("canvas-container");
const canvas = document.getElementById("canvas");
const width = 1920;
const height = 1080;

// context of the canvas
const context = canvas.getContext("2d");
context.imageSmoothingEnabled = true;

// resize canvas
canvas.height = height;
canvas.width = width;

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect(), 
    scaleX = canvas.width / rect.width, 
    scaleY = canvas.height / rect.height;

  return {
    x: (evt.clientX - rect.left) * scaleX,
    y: (evt.clientY - rect.top) * scaleY
  }
}

// --- Pen ---
let drawing = false;

function startDraw(e) {
  drawing = true;
  context.beginPath();
  draw(e)
}

function endDraw(e) {
  drawing = false;
}

function draw(e) {
  if (!drawing) return;

  let { x, y } = getMousePos(canvas, e);

  context.lineTo(x, y);
  context.stroke();

  // for smoother drawing
  context.beginPath();
  context.moveTo(x, y);
}

// --- Sizes ---

const sizes = {
  'small': 5,
  'medium': 10,
  'big': 15
}

function setSize(e, size) {
  context.lineWidth = size;
  selectSize(e);
}

function selectSize(e) {
  if (mode === 'rect')
    return;

  const sizes = document.getElementsByClassName("size");
  for (const size of sizes) {
    size.classList.remove('selected');
  }
  
  if (e === undefined)
  return;
  
  e.target.parentElement.classList.add('selected');
}

// --- Line ---

function startLine(e) {
  drawing = true;
  context.beginLine();
  draw(e)
}

function endLine(e) {
  drawing = false;
  let { x, y } = getMousePos(canvas, e);
  
  context.lineTo(x, y);
  context.stroke();
}

// --- Polygon ---

let poly = false;
let polyTimeout = undefined;

function startPolygon(e) {
  if (e.target.id !== 'canvas')
    return;

  drawing = true;

  if (poly) {
    polygon(e);
  }
  else {
    context.beginPath();
    draw(e);
  }
  poly = true;
}

function endPolygon(e) {
  if (!poly)
    return;

  polyTimeout = setTimeout(() => {
    drawing = false;
    context.closePath();
    context.stroke();

    poly = false;
  }, 1000);
}

function polygon(e) {
  if (!drawing) return;
  clearTimeout(polyTimeout);

  let { x, y } = getMousePos(canvas, e);
  
  context.lineTo(x, y);
  context.stroke();
}

