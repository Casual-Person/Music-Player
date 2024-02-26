const fileInput = document.getElementById("file-input");
const audioPlayer = document.getElementById("audio-player");
const visualizer = document.getElementById("visualizer");
const visualizerCtx = visualizer.getContext("2d");
const analyser = new AnalyserNode(audioContext);
const visualizerData = new Uint8Array(analyser.frequencyBinCount);

let audioSourceNode;

fileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  const url = URL.createObjectURL(
