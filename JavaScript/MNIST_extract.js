function loadMNIST(callback) {
  let mnist = {};
  let files = {
    train_images: "../Assets/MNIST Dataset/train-images.idx3-ubyte",
    train_labels: "../Assets/MNIST Dataset/train-labels.idx1-ubyte",
    test_images: "../Assets/MNIST Dataset/t10k-images.idx3-ubyte",
    test_labels: "../Assets/MNIST Dataset/t10k-labels.idx1-ubyte",
  };
  return Promise.all(
    Object.keys(files).map(async (file) => {
      mnist[file] = await loadFile(files[file]);
    })
  ).then(() => callback(mnist));
}

async function loadFile(file) {
  const buffer = await fetch(file).then((response) => response.arrayBuffer());
  const headerCount = 4;
  const headerView = new DataView(buffer, 0, headerCount * 4);
  const headers = new Array(headerCount)
    .fill()
    .map((_, i) => headerView.getUint32(4 * i, false));

  // Identify the file type and calculate offsets
  let type, dataLength;
  if (headers[0] === 2049) {
    type = "label"; // Labels file
    dataLength = 1; // Each label is 1 byte
  } else if (headers[0] === 2051) {
    type = "image"; // Images file
    dataLength = headers[2] * headers[3]; // Rows * Columns (pixels per image)
  } else {
    throw new Error("Unknown file type: " + headers[0]);
  }

  // Extract the data after the header
  const rawData = new Uint8Array(buffer, headerCount * 4);

  // If it's image data, no longer split it into subarrays
  if (type === "image") {
    return rawData; // Single Uint8Array containing all images
  }

  // If it's label data, return as a single Uint8Array
  return rawData;
}

export default loadMNIST;
