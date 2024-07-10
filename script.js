const canvas = document.getElementById('sketchCanvas');
const ctx = canvas.getContext('2d');

let isDrawing = false;
let color = '#000000';
let brushSize = 5;
let brushShape = 'round'; // Default brush shape
let bgColor = '#ffffff'; // Default background color

// Resize canvas
const resizeCanvas = () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
};

const setBackgroundColor = (color) => {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    bgColor = color;
};

window.addEventListener('resize', resizeCanvas);
resizeCanvas(); // Initial resize

const startDrawing = (event) => {
    isDrawing = true;
    draw(event);
};

const stopDrawing = () => {
    isDrawing = false;
    ctx.beginPath();
};

const draw = (event) => {
    if (!isDrawing) return;

    ctx.lineWidth = brushSize;
    ctx.lineCap = brushShape; // Use selected brush shape
    ctx.strokeStyle = color;

    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(event.clientX - rect.left, event.clientY - rect.top);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(event.clientX - rect.left, event.clientY - rect.top);
};

// Mouse events
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mousemove', draw);

// Touch events
const handleTouchStart = (event) => {
    event.preventDefault(); // Prevent scrolling when drawing
    isDrawing = true;
    drawTouch(event);
};

const handleTouchEnd = () => {
    isDrawing = false;
    ctx.beginPath();
};

const drawTouch = (event) => {
    if (!isDrawing) return;

    const touch = event.touches[0];
    const rect = canvas.getBoundingClientRect();
    ctx.lineWidth = brushSize;
    ctx.lineCap = brushShape;
    ctx.strokeStyle = color;

    ctx.lineTo(touch.clientX - rect.left, touch.clientY - rect.top);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(touch.clientX - rect.left, touch.clientY - rect.top);
};

canvas.addEventListener('touchstart', handleTouchStart);
canvas.addEventListener('touchend', handleTouchEnd);
canvas.addEventListener('touchmove', drawTouch);

document.getElementById('colorPicker').addEventListener('input', (event) => {
    color = event.target.value;
});

document.getElementById('brushSize').addEventListener('input', (event) => {
    brushSize = event.target.value;
});

document.getElementById('brushShape').addEventListener('change', (event) => {
    brushShape = event.target.value;
});

document.getElementById('bgColorPicker').addEventListener('input', (event) => {
    setBackgroundColor(event.target.value);
});

document.getElementById('sketchPadSize').addEventListener('change', (event) => {
    canvas.classList.remove('small', 'medium', 'large');
    canvas.classList.add(event.target.value);
    resizeCanvas();
    setBackgroundColor(bgColor); // Redraw background color after resize
});

document.getElementById('sketchPadHeight').addEventListener('change', (event) => {
    canvas.height = event.target.value;
    resizeCanvas();
    setBackgroundColor(bgColor); // Redraw background color after changing height
});

document.getElementById('clearButton').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setBackgroundColor(bgColor); // Redraw background color after clearing
});

document.getElementById('saveButton').addEventListener('click', () => {
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'sketch.png';
    link.click();
});

// Pen indicator
const penIndicator = document.createElement('div');
penIndicator.classList.add('pen-indicator');
document.body.appendChild(penIndicator);

const updatePenIndicator = (event) => {
    penIndicator.style.left = `${event.clientX}px`;
    penIndicator.style.top = `${event.clientY}px`;
};

canvas.addEventListener('mousemove', updatePenIndicator);
canvas.addEventListener('touchmove', (event) => {
    const touch = event.touches[0];
    updatePenIndicator({ clientX: touch.clientX, clientY: touch.clientY });
});

canvas.classList.add('cursor-pen');
