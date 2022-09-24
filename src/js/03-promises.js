import Notiflix from 'notiflix';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

Notiflix.Notify.init({
  width: '320px',
  timeout: 5000,
});

const refs = {
  form: document.querySelector('.form'),
  labels: document.querySelectorAll('label'),
  button: document.querySelector('button'),
};

setInlineStyles();

refs.form.addEventListener('submit', onSubmit);

function onSubmit(event) {
  event.preventDefault();

  const {
    elements: { delay, step, amount },
  } = event.currentTarget;

  const numDelay = Number(delay.value);
  const numStep = Number(step.value);
  const numAmount = Number(amount.value);

  if (numDelay < 0 || numStep < 0 || numAmount <= 0) {
    Notiflix.Notify.failure('Must be: delay>=0, step>=0, amount>0');
  } else {
    for (let i = 0; i < numAmount; i += 1) {
      createPromise(i + 1, numDelay + i * numStep)
        .then(({ position, delay }) => {
          Notiflix.Notify.success(
            `✅ Fulfilled promise ${position} in ${delay}ms`
          );
        })
        .catch(({ position, delay }) => {
          Notiflix.Notify.warning(
            `❌ Rejected promise ${position} in ${delay}ms`
          );
        });
    }
  }
  event.currentTarget.reset();
}

function createPromise(position, delay) {
  const shouldResolve = Math.random() > 0.3;

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldResolve) {
        resolve({ position, delay });
      } else {
        reject({ position, delay });
      }
    }, delay);
  });
}

function setInlineStyles() {
  refs.form.setAttribute(
    'style',
    'display: flex; align-items: center; margin: 8px 0 0 -2px;'
  );
  refs.labels.forEach(label => {
    label.setAttribute(
      'style',
      'display: flex; flex-direction: column; justify-content: center; align-items: left; margin: 0 2px;'
    );
  });
  refs.button.setAttribute('style', 'margin: 24px 0 0 2px;');
}
