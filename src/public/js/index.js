document.addEventListener('DOMContentLoaded', () => {
    let materialBoxes = document.querySelectorAll('.materialboxed');
    let elems = document.querySelectorAll('.autocomplete');
    let sidenavs = document.querySelectorAll('.sidenav');
    let sliders = document.querySelectorAll('.slider');
    
    M.Autocomplete.init(elems);
    M.Materialbox.init(materialBoxes);
    M.Sidenav.init(sidenavs);
    M.Slider.init(sliders, {
        indicators: true,
        height: 550,
        interval: 5000,
        duration: 1000
    });
});

window.onload = () => {
    let ocultos = document.querySelectorAll('.hide');
    let preloader = document.querySelector('#preloader');
    preloader.classList.toggle('hide');
    ocultos.forEach(element => element.classList.toggle('hide'));
};