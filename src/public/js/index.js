document.addEventListener('DOMContentLoaded', function () {
    M.AutoInit();
});

window.addEventListener('load', () => {
    const ocultos = document.querySelectorAll('.hide');
    const preloader = document.querySelector('#preloader');

    preloader.classList.toggle('hide');
    ocultos.forEach(element => element.classList.toggle('hide'));
});