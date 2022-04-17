const arrayEquals = (a1, a2 = []) => {
  const lengthSame = a1.length === a2.length;
  const everySame = a1.every((element, i) => element === a2[i]);
  return lengthSame && everySame;
};

export default (array) => {
  array.sort((a, b) => a > b);
  for (let i = array.length - 1; i >= 1; i -= 1) {
    if (arrayEquals(array[i], array[i - 1])) {
      array.splice(i, 1);
    }
  }
};
