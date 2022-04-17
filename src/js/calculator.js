import generatorics from "generatorics";
import saferEval from "./saferEval";
import { filterGenerator } from "./generatorHelpers";
import removeDuplicateArrays from "./removeDuplicateArrays";

const tuple1Box = document.getElementById("tuple-1");
const tupleType = document.getElementById("tuple-type");
const outputBox = document.getElementById("output-box");
const uniqueBox = document.getElementById("unique-box");
const kBox = document.getElementById("k-box");
let steps = document.getElementsByClassName("step");

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

  const x = Array.from(steps).reduce((currentGenerator, step) => {
    const predicateString = step.getElementsByClassName("command-box")[0].value;
    return filterGenerator(currentGenerator, (Xn) => {
      const variablesString = `var Xn = [${Xn}]; var n = ${Xn.length};`;
      return !saferEval(predicateString, variablesString);
    });
  }, generatorics.clone[tupleType.value](tuple1, k));

  const evaluatedX = [...x];

  if (uniqueBox.checked) {
    removeDuplicateArrays(evaluatedX);
  }

  changeTextBox(evaluatedX.join("\n"));
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
