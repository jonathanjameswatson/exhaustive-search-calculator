import generatorics from "generatorics";
import saferEval from "./saferEval";

const tuple1Box = document.getElementById("tuple-1");
const tupleType = document.getElementById("tuple-type");
const outputBox = document.getElementById("output-box");
const uniqueBox = document.getElementById("unique-box");
const kBox = document.getElementById("k-box");
let steps = document.getElementsByClassName("step");

const arrayEquals = (a1, a2 = []) => {
  const lengthSame = a1.length === a2.length;
  const everySame = a1.every((element, i) => element === a2[i]);
  return lengthSame && everySame;
};

const unique = (list) =>
  list
    .slice()
    .sort((a, b) => a > b)
    .reduce((accumulator, currentValue) => {
      if (!arrayEquals(currentValue, accumulator.slice(-1)[0])) {
        accumulator.push(currentValue);
      }
      return accumulator;
    }, []);

const changeTextBox = (text) => {
  outputBox.readonly = false;
  outputBox.value = text;
  outputBox.readonly = true;
  outputBox.style.height = "1rem";
  outputBox.style.height = `${outputBox.scrollHeight}px`;
};

const check = () => {
  const tuple1 = tuple1Box.value.replace(/\s/g, "").split(",");
  const k = parseInt(kBox.value.replace(/n/, tuple1.length).trim(), 10);
  const xGenerator = generatorics.clone[tupleType.value](tuple1, k);
  let x = [...xGenerator].slice();

  let y = [];

  Array.from(steps).forEach((step) => {
    const predicateString = step.getElementsByClassName("command-box")[0].value;

    x.forEach((xN) => {
      const variablesString = `var Xn = [${xN}]; var n = ${xN.length};`;

      if (!saferEval(predicateString, variablesString)) {
        y.push(xN);
      }
    });

    x = y;
    y = [];
  });

  if (uniqueBox.checked) {
    x = unique(x);
  }

  changeTextBox(x.join("\n"));
};

const minus = (element) => {
  steps = document.getElementsByClassName("step");
  if (steps.length > 1) {
    element.parentElement.parentElement.remove();
    if (steps.length === 1) {
      document.getElementsByClassName("minus")[0].setAttribute("hidden", "");
    }
  }
};

const add = (element) => {
  const clone = element.parentElement.parentElement.cloneNode(true);
  element.parentElement.parentElement.parentElement.appendChild(clone);
  Array.from(document.getElementsByClassName("minus")).forEach((button) => {
    button.removeAttribute("hidden");
  });
};

changeTextBox("");

document.addEventListener("click", (event) => {
  if (event.target.matches(".add")) {
    add(event.target);
  } else if (event.target.matches(".minus")) {
    minus(event.target);
  } else if (event.target.matches(".run")) {
    check();
  }
});
