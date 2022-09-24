const refs = {
  buttonStart: document.querySelector('button[data-start]'),
  buttonStop: document.querySelector('button[data-stop]'),
  body: document.querySelector('body'),
};

refs.buttonStart.setAttribute(
  'style',
  `width:5em; height:3em; position: absolute; top: calc(50% - 1.5em); left: calc(50% - 5em - 5px);`
);
refs.buttonStop.setAttribute(
  'style',
  `width:5em; height:3em; position: absolute; top: calc(50% - 1.5em); left: calc(50% + 5px);`
);

refs.buttonStop.setAttribute('disabled', '');
let intervalId = 0;

refs.buttonStart.addEventListener('click', colorsStart);
refs.buttonStop.addEventListener('click', colorsStop);

function colorsStart() {
  setBackgroundColor();
  intervalId = setInterval(setBackgroundColor, 1000);
  refs.buttonStart.setAttribute('disabled', '');
  refs.buttonStop.removeAttribute('disabled');
}

function setBackgroundColor() {
  refs.body.setAttribute('style', `background-color: ${getRandomHexColor()}`);
}

function colorsStop() {
  clearInterval(intervalId);
  refs.buttonStart.removeAttribute('disabled');
  refs.buttonStop.setAttribute('disabled', '');
}

function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, 0)}`;
}
