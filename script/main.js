import '../style/style.css'

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

context.fillStyle = 'white';
context.fillRect(0, 0, canvas.width, canvas.height);

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
  context.beginPath();
  draw(e);
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

// --- Rectangle ---

let start = {}

function startRect(e) {
    start = getMousePos(canvas, e);
}

function endRect(e) {
    let { x, y } = getMousePos(canvas, e);
    context.fillRect(start.x, start.y, x - start.x, y - start.y);
}

// --- Circle ---

let circStart = {};

function startCirc(e) {
  circStart = getMousePos(canvas, e);
  context.beginPath()
}

function endCirc(e) {
  let { x, y } = getMousePos(canvas, e);
  x -= circStart.x;
  y -= circStart.y;
  let radius = Math.sqrt((x * x) + (y * y));
  context.arc(circStart.x, circStart.y, radius, 0, 2 * Math.PI, false);
  context.fill();
  context.closePath();
}

// --- Clear ---

function clearCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = 'white';
  context.fillRect(0, 0, canvas.width, canvas.height);
}

// --- Mode ---

let mode = 'draw';

function selectMode(e, newMode) {
  const tools = document.getElementsByClassName("tool");
  for (const tool of tools) {
    tool.classList.remove('selected');
  }
  
  const size = document.querySelector(".size.selected");
  if (size !== null)
  {
    size.classList.remove('hide-select');
    if (newMode === 'rect' || newMode === 'circ')
      size.classList.add('hide-select');
  }
    
  
  e.target.parentElement.classList.add('selected');

  mode = newMode;
}

const activeEvents = {
  "mousedown": undefined,
  "mouseup": undefined,
  "mousemove": undefined
};

function setMode(e, mode) {
  for (const event in activeEvents) {
    window.removeEventListener(event, activeEvents[event]);
    activeEvents[event] = undefined;
  }

  switch (mode) {
    case 'pen':
      window.addEventListener("mousedown", startDraw);
      window.addEventListener("mouseup", endDraw);
      window.addEventListener("mousemove", draw);

      activeEvents['mousedown'] = startDraw;
      activeEvents['mouseup'] = endDraw;
      activeEvents['mousemove'] = draw;
      break;
    case 'line':
      window.addEventListener("mousedown", startLine);
      window.addEventListener("mouseup", endLine);

      activeEvents['mousedown'] = startLine;
      activeEvents['mouseup'] = endLine;
      break;
    case 'polygon':
      window.addEventListener("mousedown", startPolygon);
      window.addEventListener("mouseup", endPolygon);

      activeEvents['mousedown'] = startPolygon;
      activeEvents['mouseup'] = endPolygon;
      break;
    case 'rect':
      window.addEventListener("mousedown", startRect);
      window.addEventListener("mouseup", endRect);

      activeEvents['mousedown'] = startRect;
      activeEvents['mouseup'] = endRect;
      break;
    case 'circ':
      window.addEventListener("mousedown", startCirc);
      window.addEventListener("mouseup", endCirc);

      activeEvents['mousedown'] = startCirc;
      activeEvents['mouseup'] = endCirc;

    default:
      break;
  }

  selectMode(e, mode);
}

// --- Colours ---

const colors = {
    "black": "#000000",
    "white": "#ffffff",
    "red": "#ef4444",
    "green": "#22c55e",
    "blue": "#3b82f6",
    "yellow": "#eab308",
    "orange": "#f97316",
    "violet": "#8b5cf6"
}

function setColor(e, color) {
  context.strokeStyle = colors[color];
  context.fillStyle = colors[color];
  selectColor(e);
}

function selectColor(e) {
  const colors = document.getElementById("colors").children;
  for (const color of colors) {
    color.classList.remove('selected');
  }

  e.target.classList.add('selected');
}

// --- Initilise ---

function initialize() {
  const colorButtons = document.getElementById('colors').children;
  for (const colorButton of colorButtons) {
    colorButton.addEventListener('click', (e) => { setColor(e, colorButton.classList.value.replace(/bg-(\w*).*/, '$1'))} );
  }

  const tools = document.getElementsByClassName('tool');
  for (const tool of tools) {
    tool.addEventListener('click', (e) => { setMode(e, tool.id)} );
  }

  const sizeButtons = document.getElementsByClassName('size');
  for (const sizeButton of sizeButtons) {
    sizeButton.addEventListener('click', (e) => { setSize(e, sizes[sizeButton.id])} );
  }

  document.getElementById('clear').addEventListener('click', clearCanvas);

  // set default settings
  context.lineCap = 'round';
  document.getElementById('small').firstElementChild.click();
  document.getElementById('pen').firstElementChild.click();
  document.getElementById('black').click();
}

initialize();

// --- Download ---

document.getElementById('download').addEventListener('click', function(e) {
  let canvasUrl = canvas.toDataURL("image/png", 1);
  console.log(canvasUrl);
  const createEl = document.createElement('a');
  createEl.href = canvasUrl;
  createEl.download = "your-drawing";
  createEl.click();
  createEl.remove();
});