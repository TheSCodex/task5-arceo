export function injectErrors(text, errorRate, rng) {
  let newText = text;

  for (let i = 0; i < errorRate; i++) {
    const errorType = Math.floor(rng() * 3);

    switch (errorType) {
      case 0: {
        const deletePos = Math.floor(rng() * newText.length);
        newText = newText.slice(0, deletePos) + newText.slice(deletePos + 1);
        break;
      }
      case 1: {
        const addPos = Math.floor(rng() * newText.length);
        const randomChar = String.fromCharCode(97 + Math.floor(rng() * 26));
        newText = newText.slice(0, addPos) + randomChar + newText.slice(addPos);
        break;
      }
      case 2: {
        const swapPos = Math.floor(rng() * (newText.length - 1));
        newText = newText.slice(0, swapPos) +
                  newText[swapPos + 1] +
                  newText[swapPos] +
                  newText.slice(swapPos + 2);
        break;
      }
    }
  }

  return newText;
}
