export const generateRandomName = (): string => {
  const letters = Array.from({ length: 5 }, () => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('');
  const numbers = Array.from({ length: 3 }, () => Math.floor(Math.random() * 10)).join('');
  return letters + numbers;
};
