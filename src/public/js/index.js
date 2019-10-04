const ocultos = document.querySelectorAll('.hide');
const preloader = document.querySelector('#preloader');

preloader.classList.toggle('hide');
ocultos.forEach(element => element.classList.toggle('hide'));

var materialBoxes = document.querySelectorAll('.materialboxed');
M.Materialbox.init(materialBoxes);
var sliders = document.querySelectorAll('.slider');
M.Slider.init(sliders, {
    indicators: true,
    height: 550,
    interval: 5000,
    duration: 1000
});