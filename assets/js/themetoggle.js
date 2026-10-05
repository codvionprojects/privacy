const html = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');
const themeStair = document.getElementById('theme-stair');

let themeChanging = false;

function updateThemeButtonLabel() {
    const currentTheme = html.getAttribute('data-theme');

    themeToggle.setAttribute(
        'aria-label',
        currentTheme === 'dark'
            ? 'Switch to light theme'
            : 'Switch to dark theme'
    );
}

function changeTheme() {
    if (themeChanging) return;

    themeChanging = true;

    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    themeToggle.classList.remove('theme-changing');
    void themeToggle.offsetWidth;
    themeToggle.classList.add('theme-changing');

    themeStair.classList.remove('open');
    void themeStair.offsetWidth;
    themeStair.classList.add('active');

    setTimeout(() => {
        html.setAttribute('data-theme', newTheme);
        updateThemeButtonLabel();
    }, 1080);

    setTimeout(() => {
        themeStair.classList.remove('active');
        themeStair.classList.add('open');
    }, 1160);

    setTimeout(() => {
        themeStair.classList.remove('open');
    }, 1950);

    setTimeout(() => {
        themeChanging = false;
    }, 2100);
}

themeToggle.addEventListener('click', changeTheme);

themeToggle.addEventListener('animationend', () => {
    themeToggle.classList.remove('theme-changing');
});

updateThemeButtonLabel();