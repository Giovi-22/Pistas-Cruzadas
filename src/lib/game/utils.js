function generateSecretCoordinates(rows, cols) {
  const red = [];
  const blue = [];
  
  // Create an array of all possible coordinates
  const allCoords = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      allCoords.push({ row: r, col: c });
    }
  }
  
  // Shuffle the array (Fisher-Yates)
  for (let i = allCoords.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allCoords[i], allCoords[j]] = [allCoords[j], allCoords[i]];
  }
  
  // Distribute half to red, half to blue
  const half = Math.floor(allCoords.length / 2);
  for (let i = 0; i < allCoords.length; i++) {
    if (i < half) {
      red.push(allCoords[i]);
    } else {
      blue.push(allCoords[i]);
    }
  }
  
  return { red, blue };
}

module.exports = { generateSecretCoordinates };
