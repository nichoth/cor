var hamburger = document.querySelector('.hamburger')
var menu = document.querySelector('.hamburger-menu')

var menuEl = document.querySelector('.main-nav')

hamburger.addEventListener('click', ev => {
    ev.preventDefault()
    menuEl.classList.add('open');
})

console.log('hamburger', hamburger)
