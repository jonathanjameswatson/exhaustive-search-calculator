const tuple1Box = document.getElementById("tuple-1");
const tupleType = document.getElementById("tuple-type");
const commandBox = document.getElementById("command-box");
const outputBox = document.getElementById("output-box");
const uniqueBox = document.getElementById("unique-box");

const keywords = {"AND":"&&", "OR":"||", "NOT":"!"};
const unique = list => list.slice().sort((a, b) => a > b)
.reduce((accumulator, currentValue) => {
  if (!arrayEquals(currentValue, accumulator.slice(-1)[0])) accumulator.push(currentValue);
  return accumulator;
}, []);
const arrayEquals = (a1, a2 = []) => a1.length == a2.length && a1.every((element, i) => element == a2[i]);

const check = () => {
  let tuple1 = tuple1Box.value.replace(/\s/g, "").split(",");
  let x = [];

  switch (tupleType.value) {
    case "A":
      break;
    case "B":
      x = permutator(tuple1);
      break;
    case "C":
      break;
    case "D":
      break;
  }

  let command1 = commandBox.value
  .replace(/AND|OR|NOT/g, input => keywords[input])
  .replace(/[^-+*/()\d\&|!=><(?:Xn,\d)]/g, "")
  .replace(/=/g, "==");

  let y = [];
  let command2 = ""

  x.forEach((xN) => {
    command2 = command1.replace(/Xn,\d+/g, input => (xN[input.match(/\d+/)[0]-1]));
    if (!eval(command2)) y.push(xN);
  });

  if (uniqueBox.checked) y = unique(y);

  outputBox.readonly = false;
  outputBox.value = y.join("\n");
  outputBox.readonly = true;
};

const permutator = (input) => {
  let output = [];

  const permute = (input2, permutation=[]) => {
    if (input2.length == 0) {
      output.push(permutation);
    } else {
      for (let i = 0; i < input2.length; i++) {
        let copy = input2.slice();
        let next = copy.splice(i, 1);
        permute(copy.slice(), permutation.concat(next));
     }
   }
 };

 permute(input);

 return output;
};
