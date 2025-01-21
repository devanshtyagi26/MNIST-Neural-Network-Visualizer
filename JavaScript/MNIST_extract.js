function loadMNIST(callback) {
  let mnist = {};
  const files = {
    train_images: "../Assets/MNIST Dataset/train-images.idx3-ubyte",
    train_labels: "../Assets/MNIST Dataset/train-labels.idx1-ubyte",
    test_images: "../Assets/MNIST Dataset/t10k-images.idx3-ubyte",
    test_labels: "../Assets/MNIST Dataset/t10k-labels.idx1-ubyte",
  };

  return Promise.all(
    Object.keys(files).map(async (key) => {
      mnist[key] = await loadFile(files[key]);
    })
  ).then(() => callback(mnist));
}

async function loadFile(file) {
  const buffer = await fetch(file).then((response) => response.arrayBuffer());
  const view = new DataView(buffer);

  // Read the magic number to determine the file type
  const magicNumber = view.getUint32(0, false); // Big-endian
  let headerSize, dataOffset;

  if (magicNumber === 2049) {
    // Labels file
    headerSize = 8; // Magic number (4 bytes) + Number of labels (4 bytes)
    dataOffset = headerSize;
  } else if (magicNumber === 2051) {
    // Images file
    headerSize = 16; // Magic number (4 bytes) + Number of images (4 bytes) + Rows (4 bytes) + Columns (4 bytes)
    dataOffset = headerSize;
  } else {
    throw new Error("Unknown file type: " + magicNumber);
  }

  // Return the raw data as a single Uint8Array starting after the header
  return new Uint8Array(buffer, dataOffset);
}

export default loadMNIST;
