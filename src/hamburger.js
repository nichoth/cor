var hamburger = document.querySelector('.hamburger')
var menu = document.querySelector('.hamburger-menu')

var menuEl = document.querySelector('.main-nav')

hamburger.addEventListener('click', ev => {
    ev.preventDefault()
    menuEl.classList.add('open')
})

var closer = document.querySelector('button.close-nav')
closer.addEventListener('click', ev => {
    ev.preventDefault()
    menuEl.classList.remove('open')
})

document.querySelector('.services').addEventListener('click', ev => {
    menuEl.classList.remove('open')
})
