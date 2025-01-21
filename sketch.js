import loadMNIST from "./JavaScript/MNIST_extract.js";
let mnist;
let imagesData; // Array to store the image data
let labelsData; // Array to store the labels
let currentIndex = 0; // Index of the current image to display
let imageSize = 28; // Size of the MNIST image (28x28 pixels)
let canvasSize = 280; // Size of the canvas to display images scaled

window.setup = function () {
  createCanvas(canvasSize, canvasSize);
  loadMNIST(function (data) {
    mnist = data;
    console.log(data);
  });
  noLoop();
};

// window.draw = function () {
//   background(255);

//   if (imagesData && labelsData) {
//     // Get the current image data (28x28 pixels)
//     const mnistImage = imagesData[currentIndex];

//     // Convert the image into a p5.Image for visualization
//     let img = createImage(imageSize, imageSize);
//     img.loadPixels();

//     for (let i = 0; i < imageSize * imageSize; i++) {
//       const brightness = mnistImage[i]; // Pixel intensity (0-255)
//       img.pixels[i * 4] = brightness; // Red
//       img.pixels[i * 4 + 1] = brightness; // Green
//       img.pixels[i * 4 + 2] = brightness; // Blue
//       img.pixels[i * 4 + 3] = 255; // Alpha
//     }

//     img.updatePixels();

//     // Display the scaled image on the canvas
//     image(img, 0, 0, canvasSize, canvasSize);

//     // Display the label
//     textAlign(CENTER, CENTER);
//     textSize(32);
//     fill(255);
//     text(`Label: ${labelsData[currentIndex]}`, canvasSize / 2, canvasSize - 20);
//   }
// }

// // Go to the next image when mouse is clicked
// function mousePressed() {
//   if (imagesData && labelsData) {
//     currentIndex = (currentIndex + 1) % imagesData.length;
//     redraw();
//   }
// }
