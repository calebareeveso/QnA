export default function generateRandomNumbers() {
  const typedArray = new Uint8Array(5);
  const randomValues = window.crypto.getRandomValues(typedArray);
  return randomValues.join("");
}
