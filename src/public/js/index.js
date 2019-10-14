document.addEventListener('DOMContentLoaded', () => {
    let materialBoxes = document.querySelectorAll('.materialboxed');
    let dropdown = document.querySelectorAll('.dropdown-trigger');
    let elems = document.querySelectorAll('.autocomplete');
    let paralax = document.querySelectorAll('.parallax');
    let sidenavs = document.querySelectorAll('.sidenav');
    let sliders = document.querySelectorAll('.slider');

    M.Materialbox.init(materialBoxes);
    M.Autocomplete.init(elems);
    M.Parallax.init(paralax);
    M.Sidenav.init(sidenavs);
    M.Slider.init(sliders, {
        indicators: true,
        height: 550,
        interval: 5000,
        duration: 1000
    });
    M.Dropdown.init(dropdown, {
        constrainWidth: false,
        coverTrigger: false
    });
});

window.onload = () => {
    let ocultos = document.querySelectorAll('.hide');
    let preloader = document.querySelector('#preloader');
    preloader.classList.toggle('hide');
    ocultos.forEach(element => element.classList.toggle('hide'));
};