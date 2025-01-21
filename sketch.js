import loadMNIST from "./JavaScript/MNIST_extract.js";
import NeuralNetwork from "https://cdn.jsdelivr.net/gh/devanshtyagi26/XOR-MultiLayer-Perceptron/JavaScript/neuralNetwork.js";

let mnist, nn, img, canvas, user_digit;
let trainingIndex = 0;
let testingIndex = 0;
let totalTests = 0;
let totalCorrect = 0;

const imageSize = 28; // Size of the MNIST image (28x28 pixels)
const canvasSize = 200; // Size of the canvas to display images scaled
const totalTrainSteps = 50; // Number of train steps per frame

// Cache DOM elements
const labelElement = document.querySelector("#label");
const guessElement = document.querySelector("#guess");
const percentElement = document.querySelector("#percent");
const userGuessElement = document.querySelector("#user_guess");
const clearButton = document.querySelector("#clear");

// Get the index of the maximum value in an array
function getMaxIndex(arr) {
  return arr.reduce(
    (maxIdx, val, idx, array) => (val > array[maxIdx] ? idx : maxIdx),
    0
  );
}

// Load MNIST data and initialize
window.setup = function () {
  canvas = createCanvas(canvasSize * 2, canvasSize);
  canvas.parent("canvasContainer");

  nn = new NeuralNetwork(784, 32, 10);
  nn.setLearningRate(0.01);
  user_digit = createGraphics(canvasSize, canvasSize);
  user_digit.pixelDensity(1);

  img = createImage(imageSize, imageSize);

  loadMNIST((data) => {
    mnist = data;
    console.log("MNIST Data Loaded:", data);
  });

  // Clear button event
  clearButton.addEventListener("click", () => {
    user_digit.background(0);
  });
};

// Train the neural network
function trainNN(show) {
  const inputs = [];
  if (show) img.loadPixels();

  // Prepare inputs and display the image
  for (let i = 0; i < imageSize * imageSize; i++) {
    const brightness = mnist.train_images[i + trainingIndex * 784];
    inputs[i] = brightness / 255;

    if (show) {
      img.pixels[i * 4 + 0] = brightness;
      img.pixels[i * 4 + 1] = brightness;
      img.pixels[i * 4 + 2] = brightness;
      img.pixels[i * 4 + 3] = 255;
    }
  }

  if (show) {
    img.updatePixels();
    image(img, canvasSize, 0, canvasSize, canvasSize);
  }

  // Train the neural network
  const label = mnist.train_labels[trainingIndex];
  const targets = Array(10).fill(0);
  targets[label] = 1;

  const predicted = nn.feedForward(inputs);
  const guess = getMaxIndex(predicted);

  // Update DOM
  labelElement.innerHTML = label;
  guessElement.innerHTML = guess;
  document.querySelector(".text").style.color =
    guess === label ? "green" : "red";

  nn.train(inputs, targets);
  trainingIndex = (trainingIndex + 1) % mnist.train_labels.length;
}

// Test the neural network
function testing() {
  const inputs = mnist.test_images
    .slice(testingIndex * 784, (testingIndex + 1) * 784)
    .map((val) => val / 255);
  const label = mnist.test_labels[testingIndex];

  const predicted = nn.feedForward(inputs);
  const guess = getMaxIndex(predicted);

  totalTests++;
  if (guess === label) totalCorrect++;

  const percent = 100 * (totalCorrect / totalTests);
  percentElement.innerHTML = nf(percent, 2, 2) + "%";

  testingIndex = (testingIndex + 1) % mnist.test_labels.length;

  if (testingIndex === 0) {
    console.log("Testing Complete. Accuracy:", percent);
    totalCorrect = 0;
    totalTests = 0;
  }
}

// Guess user-drawn digit
function guessUserDigit() {
  const imgCopy = user_digit.get();
  const inputs = [];

  imgCopy.resize(imageSize, imageSize);
  imgCopy.loadPixels();

  for (let i = 0; i < imageSize * imageSize; i++) {
    inputs[i] = imgCopy.pixels[i * 4] / 255;
  }

  const predicted = nn.feedForward(inputs);
  const guess = getMaxIndex(predicted);
  userGuessElement.innerHTML = guess;
}

// Draw on the canvas
window.draw = function () {
  background(0);
  guessUserDigit();

  if (mnist) {
    for (let i = 0; i < totalTrainSteps; i++) {
      trainNN(i === totalTrainSteps - 1);
    }
    for (let i = 0; i < 200; i++) {
      testing();
    }
  }

  image(user_digit, 0, 0);

  if (mouseIsPressed) {
    user_digit.stroke(255);
    user_digit.strokeWeight(16);
    user_digit.line(mouseX, mouseY, pmouseX, pmouseY);
  }
};
