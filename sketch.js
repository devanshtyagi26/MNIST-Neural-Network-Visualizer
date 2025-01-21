import loadMNIST from "./JavaScript/MNIST_extract.js";
let mnist;

let currentIndex = 0; // Index of the current image to display
let imageSize = 28; // Size of the MNIST image (28x28 pixels)
let canvasSize = 280; // Size of the canvas to display images scaled

window.setup = function () {
  createCanvas(canvasSize, canvasSize);
  loadMNIST(function (data) {
    mnist = data;
    console.log(data);
  });
};

window.draw = function () {
  if (mnist) {
    background(0);
    let img = createImage(imageSize, imageSize);
    img.loadPixels();

    for (let i = 0; i < imageSize * imageSize; i++) {
      const brightness = mnist.train_images[i]; // Pixel intensity (0-255)
      console.log(brightness);
      img.pixels[i * 4 + 0] = brightness; // Red
      img.pixels[i * 4 + 1] = brightness; // Green
      img.pixels[i * 4 + 2] = brightness; // Blue
      img.pixels[i * 4 + 3] = 255; // Alpha
    }

    img.updatePixels();
    console.log(img);

    // Display the scaled image on the canvas
    image(img, 0, 0, canvasSize, canvasSize);
  }
};

// // Go to the next image when mouse is clicked
// function mousePressed() {
//   if (imagesData && labelsData) {
//     currentIndex = (currentIndex + 1) % imagesData.length;
//     redraw();
//   }
// }
