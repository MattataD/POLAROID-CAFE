const headerEl = document.querySelector('.Nav-bar');
headerEl.addEventListener('mouseenter', () => {
    headerEl.classList.add('Nav-bar-hov');
});
headerEl.addEventListener('mouseleave', () => {
    headerEl.classList.remove('Nav-bar-hov');
});
