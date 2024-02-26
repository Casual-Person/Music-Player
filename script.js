const fileInput = document.getElementById("file-input");
const audioPlayer = document.getElementById("audio-player");
const visualizer = document.getElementById("visualizer");
const visualizerCtx = visualizer.getContext("2d");
const analyser = new AnalyserNode(audioContext);
const visualizerData = new Uint8Array(analyser.frequencyBinCount);

let audioSourceNode;

fileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  const url = URL.createObjectURL(file);

  audioSourceNode = audioContext.createMediaStreamSource(url);
  audioSourceNode.connect(analyser);

  audioPlayer.src = url;
  audioPlayer.load();
  audioPlayer.play();
});

const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function drawVisualizer() {
  analyser.getByteFrequencyData(visualizerData);
  visualizerCtx.clearRect(0, 0, visualizer.width, visualizer.height);
  visualizerCtx.fillStyle = "rgba(0, 0, 0, 0.2)";

  visualizerData.forEach((data, index) => {
    const barWidth = (visualizer.width / analyser.frequencyBinCount) * 2.5;
    const barHeight = (data / 255) * visualizer.height;
    visualizerCtx.fillRect(barWidth * index, visualizer.height - barHeight, barWidth, barHeight);
  });

  requestAnimationFrame(drawVisualizer);
}

// Screen effects
const screenEffect = document.getElementById("screen-effect");
const screenEffectStyles = getComputedStyle(screenEffect);
const screenEffectWidth = parseInt(screenEffectStyles.width, 10);
const screenEffectHeight = parseInt(screenEffectStyles.height, 10);

function drawScreenEffect() {
  const canvas = document.createElement("canvas");
  canvas.width = screenEffectWidth;
  canvas.height = screenEffectHeight;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
  ctx.fillRect(0, 0, screenEffectWidth, screenEffectHeight);

  const gradient = ctx.createLinearGradient(0, 0, screenEffectWidth, screenEffectHeight);
  gradient.addColorStop(0, "rgba(255, 0, 0, 1)");
  gradient.addColorStop(0.5, "rgba(0, 255, 0, 1)");
  gradient.addColorStop(1, "rgba(0, 0, 255, 1)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, screenEffectWidth, screenEffectHeight);

  screenEffect.appendChild(canvas);

  requestAnimationFrame(drawScreenEffect);
}

drawVisualizer();
drawScreenEffect();
