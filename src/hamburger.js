var hamburger = document.querySelector('.hamburger')
var menu = document.querySelector('.hamburger-menu')

var menuEl = document.querySelector('.main-nav')
var menuWrapper  = document.querySelector('.main-nav-wrapper')

hamburger.addEventListener('click', ev => {
    ev.preventDefault()
    menuEl.classList.add('open')
    menuWrapper.classList.add('open')
})

var closer = document.querySelector('button.close-nav')
closer.addEventListener('click', ev => {
    ev.preventDefault()
    menuEl.classList.remove('open')
    menuWrapper.classList.remove('open')
})

document.querySelector('.services').addEventListener('click', ev => {
    menuEl.classList.remove('open')
    menuWrapper.classList.remove('open')
})
