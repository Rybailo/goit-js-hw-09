import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import Notiflix from 'notiflix';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  buttonStart: document.querySelector('[data-start]'),
  timer: document.querySelector('.timer'),
  fields: document.querySelectorAll('.field'),
  values: document.querySelectorAll('.value'),
  labels: document.querySelectorAll('.label'),
  dataDays: document.querySelector('[data-days]'),
  dataHours: document.querySelector('[data-hours]'),
  dataMinutes: document.querySelector('[data-minutes]'),
  dataSeconds: document.querySelector('[data-seconds]'),
};

setInlineStyles();

let dataDateTime = setInitDateTime();
let idIntervalSecond = 0;

flatpickr('#datetime-picker', {
  enableTime: true,
  time_24hr: true,
  defaultDate: dataDateTime.initDateTime,
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (dataDateTime.stopDateTime === -1) {
      dataDateTime.stopDateTime = new Date(selectedDates[0]);
      if (dataDateTime.stopDateTime <= dataDateTime.initDateTime) {
        Notiflix.Notify.failure('Please choose a date in the future');
        dataDateTime.stopDateTime = -1;
      } else {
        refs.buttonStart.removeAttribute('disabled');
      }
    }
  },
});

refs.buttonStart.addEventListener('click', intervalStart);

function intervalStart() {
  dataDateTime.loopDateTime =
    dataDateTime.stopDateTime - dataDateTime.initDateTime;
  setDateTime(convertMs(dataDateTime.loopDateTime));
  idIntervalSecond = setInterval(intervalSecond, 1000);
  refs.buttonStart.setAttribute('disabled', '');
}

function intervalSecond() {
  dataDateTime.loopDateTime -= 1000;
  if (dataDateTime.loopDateTime <= 0) {
    dataDateTime = setInitDateTime();
    clearInterval(idIntervalSecond);
    Notiflix.Notify.info('Time is over');
  }
  setDateTime(convertMs(dataDateTime.loopDateTime));
}

function setInitDateTime() {
  const data = {};
  data.initDateTime = new Date();
  data.initDateTime.setSeconds(0);
  data.initDateTime.setMilliseconds(0);
  data.stopDateTime = -1;
  data.loopDateTime = 0;
  return data;
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

const addLeadingZero = value => String(value).padStart(2, 0);
const addLeadingZeroDays = value => {
  if (value < 10) {
    return String(value).padStart(2, 0);
  }
  return String(value);
};

function setDateTime(data) {
  refs.dataDays.textContent = addLeadingZeroDays(data.days);
  refs.dataHours.textContent = addLeadingZero(data.hours);
  refs.dataMinutes.textContent = addLeadingZero(data.minutes);
  refs.dataSeconds.textContent = addLeadingZero(data.seconds);
}

function setInlineStyles() {
  refs.buttonStart.setAttribute('disabled', '');
  refs.timer.setAttribute(
    'style',
    'display: flex; align-items: center; margin: 8px 0 0 -6px;'
  );
  refs.fields.forEach(f => {
    f.setAttribute(
      'style',
      'display: flex; flex-direction: column; justify-content: center; align-items: center; margin: 0 6px;'
    );
  });
  refs.values.forEach(v => {
    v.setAttribute('style', 'font-size: 28px; letter-spacing: 0.01em;');
  });
  refs.labels.forEach(l => {
    l.setAttribute('style', 'text-transform: uppercase; font-size: 10px;');
  });
}
