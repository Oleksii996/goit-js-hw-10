import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.form');

  form.addEventListener('submit', event => {
    event.preventDefault();

    //даю змінні для промісу
    const delay = Number(form.delay.value); //значення, яке вкажем
    const state = form.state.value; //fulfilled or rejected

    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        if (state === 'fulfilled') {
          resolve(delay);
        } else {
          reject(delay);
        }
      }, delay);
    });

    promise
      .then(delay => {
        iziToast.success({
          title: 'Success',
          message: `Fulfilled promise in ${delay}ms`,
          position: 'topRight', //позиція відображення повідомлення
        });
      })
      .catch(delay => {
        iziToast.error({
          title: 'Error',
          message: `Rejected promise in ${delay}ms`,
          position: 'topRight', //позиція відображення повідомлення
        });
      });

    form.reset();
  });
});
