import generatorics from 'generatorics';

const tuple1Box = document.getElementById('tuple-1');
const tupleType = document.getElementById('tuple-type');
const outputBox = document.getElementById('output-box');
const uniqueBox = document.getElementById('unique-box');
const kBox = document.getElementById('k-box');
let steps = document.getElementsByClassName('step');

const keywords = {
  AND: '&&',
  OR: '||',
  NOT: '!',
  '^': '**',
  '=': '==',
};

const whiteSpace = /\s/g;
const letterN = /n/;
const nonCharacters = /\D/;
const acceptable = /[^-+*/()d&|!=><.%(?:Xn,)0-9]/g;
const keywordsRegex = new RegExp(Object.keys(keywords).join('|'), 'g');
const xNs = /Xn,\d+/g;
const digits = /\d+/;

const arrayEquals = (a1, a2 = []) => {
  const lengthSame = a1.length === a2.length;
  const everySame = a1.every((element, i) => element === a2[i]);
  return lengthSame && everySame;
};

const unique = list => list.slice().sort((a, b) => a > b)
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
  outputBox.style.height = '1rem';
  outputBox.style.height = `${outputBox.scrollHeight}px`;
};

const check = () => {
  const tuple1 = tuple1Box.value.replace(whiteSpace, '').split(',');
  const k = Number(kBox.value.replace(letterN, tuple1.length).replace(nonCharacters, ''));
  const xGenerator = generatorics.clone[tupleType.value](tuple1, k);
  let x = [...xGenerator].slice();

  let y = [];

  Array.from(steps).forEach((step) => {
    const command1 = step.getElementsByClassName('command-box')[0].value
      .replace(keywordsRegex, input => keywords[input])
      .replace(acceptable, '');

    x.forEach((xN) => {
      const command2 = command1.replace(xNs, input => (xN[input.match(digits)[0] - 1]));

      if (!eval(command2)) {
        y.push(xN);
      }
    });

    x = y;
    y = [];
  });

  if (uniqueBox.checked) x = unique(x);

  changeTextBox((x.join('\n')));
};

const minus = (element) => {
  steps = document.getElementsByClassName('step');
  if (steps.length > 1) {
    element.parentElement.remove();
    if (steps.length === 1) {
      document.getElementsByClassName('minus')[0].hidden = true;
    }
  }
};

const add = (element) => {
  const clone = element.parentElement.cloneNode(true);
  element.parentElement.parentElement.appendChild(clone);
  Array.from(document.getElementsByClassName('minus')).forEach((button) => {
    button.setAttribute('hidden', false);
  });
};

changeTextBox('');

document.addEventListener('click', (event) => {
  if (event.target.matches('.add')) {
    add(event.target);
  } else if (event.target.matches('.minus')) {
    minus(event.target);
  } else if (event.target.matches('.check')) {
    check();
  }
});
