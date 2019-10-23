document.addEventListener('DOMContentLoaded', () => {
    let materialBoxes = document.querySelectorAll('.materialboxed');
    let dropdown = document.querySelectorAll('.dropdown-trigger');
    let fixbtn = document.querySelector('.fixed-action-btn');
    let elems = document.querySelectorAll('.autocomplete');
    let paralax = document.querySelectorAll('.parallax');
    let sidenavs = document.querySelectorAll('.sidenav');
    let sliders = document.querySelectorAll('.slider');

    M.FloatingActionButton.init(fixbtn);
    M.Materialbox.init(materialBoxes);
    M.Autocomplete.init(elems);
    M.Parallax.init(paralax);
    M.Sidenav.init(sidenavs);
    M.Slider.init(sliders, {
        height: 500,
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

window.onscroll = () => {
    let footer = document.querySelector('footer');
    let position = footer.getBoundingClientRect();
    let fixbtn = document.querySelector('.fixed-action-btn');
    let clientHeight = document.documentElement.clientHeight;

    if (position.bottom - clientHeight <= position.height)
        fixbtn.classList.add('hide');
    else
        fixbtn.classList.remove('hide');
}