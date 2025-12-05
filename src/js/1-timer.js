//#region Бібліотеки за умовою (Завжди на початку)
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

// присвоєння посилання на DOM-елемент. На змінні присвоюю DOM-елементи (flatpickr)
const startBtn = document.querySelector('[data-start]');
const input = document.querySelector('#datetime-picker');
const daysEl = document.querySelector('[data-days]');
const hoursEl = document.querySelector('[data-hours]');
const minutesEl = document.querySelector('[data-minutes]');
const secondsEl = document.querySelector('[data-seconds]');

let userSelectedDate = null; //скид каледнаря (на старті)
let timerId = null; //Викикаємо кнопку на початку

startBtn.disabled = true; //Вимикаємо кнопку на початку
//#endregion

//#region Alert-Повідомлення (iziToast)
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    console.log(selectedDates[0]);
  }, //Параметр selectedDates — це масив обраних дат, тому ми беремо перший елемент selectedDates[0].

  onClose(selectedDates) {
    const chosenDate = selectedDates[0];

    // Дата у минулому - повідомлення і + не працює кнопка
    if (chosenDate <= new Date()) {
      //метод відображення повідомлення (від бібліотеки!!!)
      iziToast.error({
        icon: '',
        title: '❌',
        message: 'Please choose a date in the future',
        position: 'topRight',
      });

      startBtn.disabled = true; //вимикаємо кнопку!!!
      userSelectedDate = null; //скид дати
      return;
    }

    // Коректна дата - активація кнопки
    userSelectedDate = chosenDate;
    startBtn.disabled = false;
  },
};

flatpickr(input, options); //Бібліотека очікує, що її ініціалізують на елементі input[type="text"], тому ми додали до HTML документа поле input#datetime-picker.(умова)

//#endregion

// ---------------------------
startBtn.addEventListener('click', () => {
  if (!userSelectedDate) return;

  startBtn.disabled = true;
  input.disabled = true;

  iziToast.info({
    title: 'Started',
    message: 'The countdown has begun.',
    position: 'topRight',
  });

  timerId = setInterval(() => {
    const now = new Date();
    const timeLeft = userSelectedDate - now;

    // Таймер завершився
    if (timeLeft <= 0) {
      clearInterval(timerId);
      updateTimer(0);

      iziToast.success({
        title: 'Done!',
        message: 'Timer finished.',
        position: 'topRight',
      });

      input.disabled = false; // дозволяємо вибрати нову дату
      startBtn.disabled = true; // кнопка знову неактивна
      return;
    }

    updateTimer(timeLeft);
  }, 1000);
});

//#endregion

// #region Відлік часу
function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function updateTimer(ms) {
  const { days, hours, minutes, seconds } = convertMs(ms);

  // Дні можуть бути 1, 2, 10, 200, 3000 → НЕ додаємо 0
  daysEl.textContent = days;

  // Інші значення → формат xx
  hoursEl.textContent = addLeadingZero(hours);
  minutesEl.textContent = addLeadingZero(minutes);
  secondsEl.textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}
//#endregion
