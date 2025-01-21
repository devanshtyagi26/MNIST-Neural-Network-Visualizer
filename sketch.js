import loadMNIST from "./JavaScript/MNIST_extract.js";

import NeuralNetwork from "https://cdn.jsdelivr.net/gh/devanshtyagi26/XOR-MultiLayer-Perceptron/JavaScript/neuralNetwork.js";

let mnist;
let nn;
let canvas;
let user_digit;

let trainingIndex = 0; // Index of the current image to display
let imageSize = 28; // Size of the MNIST image (28x28 pixels)
let canvasSize = 200; // Size of the canvas to display images scaled

function getMaxIndex(arr) {
  if (arr.length === 0) throw new Error("Array is empty");

  return arr.reduce((maxIdx, currentValue, currentIdx, array) => {
    return currentValue > array[maxIdx] ? currentIdx : maxIdx;
  }, 0);
}
window.setup = function () {
  canvas = createCanvas(canvasSize * 2, canvasSize);
  canvas.parent("canvasContainer"); // Attach canvas to #canvasContainer

  nn = new NeuralNetwork(784, 16, 10);

  user_digit = createGraphics(canvasSize, canvasSize);
  user_digit.pixelDensity(1);
  loadMNIST(function (data) {
    mnist = data;
    console.log(data);
  });
};
function trainNN() {
  let inputs = [];
  let img = createImage(imageSize, imageSize);
  img.loadPixels();

  for (let i = 0; i < imageSize * imageSize; i++) {
    const brightness = mnist.train_images[i + trainingIndex * 784]; // Pixel intensity (0-255)
    inputs[i] = [brightness / 255];
    img.pixels[i * 4 + 0] = brightness; // Red
    img.pixels[i * 4 + 1] = brightness; // Green
    img.pixels[i * 4 + 2] = brightness; // Blue
    img.pixels[i * 4 + 3] = 255; // Alpha
  }

  img.updatePixels();

  // Display the scaled image on the canvas
  image(img, 200, 0, 200, 200);

  let label = mnist.train_labels[trainingIndex];
  let targets = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  targets[label] = 1;
  console.log(trainingIndex);

  let predicted = nn.feedForward(inputs);
  let guess = getMaxIndex(predicted);

  document.querySelector("#label").innerHTML = label;
  document.querySelector("#guess").innerHTML = guess;

  if (guess == label) {
    document.querySelector(".text").style.color = "green";
  } else {
    document.querySelector(".text").style.color = "red";
  }
  nn.train(inputs, targets);

  trainingIndex++;
}
window.draw = function () {
  background(0);
  if (mnist) {
    trainNN();
  }
  image(user_digit, 0, 0);
  if (mouseIsPressed) {
    user_digit.fill(255);
    user_digit.stroke(255);

    user_digit.ellipse(mouseX, mouseY, 16);

    clearDraw();
  }
};

function clearDraw() {
  let btn = document.querySelector("#clear");
  btn.addEventListener("click", () => {
    user_digit.background(0);
  });
}

// // // Go to the next image when mouse is clicked
// function mousePressed() {
//   if (imagesData && labelsData) {
//     currentIndex = (currentIndex + 1) % imagesData.length;
//     redraw();
//   }
// }
