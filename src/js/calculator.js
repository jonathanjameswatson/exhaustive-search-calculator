import generatorics from "generatorics";
import saferEval from "./saferEval";
import { mapGenerator, filterGenerator } from "./generatorHelpers";
import removeDuplicateArrays from "./removeDuplicateArrays";

const combinatoricsType = document.getElementById("combinatorics-type");
const tupleBox = document.getElementById("tuple-box");
const kBox = document.getElementById("k-box");
const uniqueBox = document.getElementById("unique-box");
const outputBox = document.getElementById("output-box");

const changeTextBox = (text) => {
  outputBox.value = text;
  outputBox.style.height = `${outputBox.scrollHeight}px`;
};

const getTuple = () => {
  const { value } = tupleBox;
  if (value.trim().length === 0) {
    throw new Error("Parsed input tuple has no elements");
  }
  const tuple = value.split(",").map((element) => element.trim());
  const emptyIndex = tuple.findIndex((element) => element.length === 0);
  if (emptyIndex !== -1) {
    throw new Error(
      `Element ${emptyIndex + 1} of the parsed input tuple is not present`
    );
  }
  return tuple;
};

const getK = () => {
  const parsedInt = parseInt(kBox.value, 10);
  if (Number.isNaN(parsedInt)) {
    throw new Error("Could not parse k");
  }
  return parsedInt;
};

const check = () => {
  let output = "";

  try {
    const tuple = getTuple();
    const k = getK();

    if (k > tuple.length) {
      throw new Error("k is greater than the parsed input tuple's length");
    }

    const steps = document.getElementsByClassName("step");
    const x = Array.from(steps).reduce((currentGenerator, step, i) => {
      const returnExpressionString =
        step.getElementsByClassName("command-box")[0].value;

      if (step.dataset.type === "filter") {
        return filterGenerator(currentGenerator, (Xn) => {
          const variablesString = `var Xn = JSON.parse("[${Xn}]"); var n = ${Xn.length};`;
          try {
            return !saferEval(returnExpressionString, variablesString);
          } catch (error) {
            throw new Error(
              `(Step ${i + 1}) ${
                error.message === undefined ? error : error.message
              }`
            );
          }
        });
      }

      return mapGenerator(currentGenerator, (Xn) => {
        const variablesString = `var Xn = JSON.parse("[${Xn}]"); var n = ${Xn.length};`;
        try {
          const newXn = saferEval(returnExpressionString, variablesString);
          if (!Array.isArray(newXn)) {
            throw new Error(`${JSON.stringify(newXn)} is not an array`);
          }
          return newXn.map((element) => JSON.stringify(element));
        } catch (error) {
          throw new Error(
            `(Step ${i + 1}) ${
              error.message === undefined ? error : error.message
            }`
          );
        }
      });
    }, generatorics.clone[combinatoricsType.value](tuple, k));

    const evaluatedX = [...x];

    if (uniqueBox.checked) {
      removeDuplicateArrays(evaluatedX);
    }

    output = evaluatedX.length === 0 ? "[No results]" : evaluatedX.join("\n");
  } catch (error) {
    output = `Error: ${error.message === undefined ? error : error.message}`;
  }

  changeTextBox(output);
};

const add = (element) => {
  const card = element.parentElement.parentElement;
  const cardClone = card.cloneNode(true);
  card.parentElement.appendChild(cardClone);
  Array.from(document.getElementsByClassName("minus")).forEach((button) => {
    button.removeAttribute("hidden");
  });
};

const minus = (element) => {
  const steps = document.getElementsByClassName("step");
  if (steps.length > 1) {
    const card = element.parentElement.parentElement;
    card.remove();
    if (steps.length === 1) {
      document.getElementsByClassName("minus")[0].setAttribute("hidden", "");
    }
  }
};

const swap = (element) => {
  const card = element.parentElement.parentElement;
  card.dataset.type = card.dataset.type === "map" ? "filter" : "map";
  card.getElementsByClassName("description")[0].textContent =
    card.dataset.type === "map"
      ? "Replace each Xn with"
      : "For each Xn, discard if";
};

changeTextBox("Click Run to find X");

document.addEventListener("click", (event) => {
  if (event.target.matches(".add")) {
    add(event.target);
  } else if (event.target.matches(".minus")) {
    minus(event.target);
  } else if (event.target.matches(".swap")) {
    swap(event.target);
  } else if (event.target.matches(".run")) {
    check();
  }
});
