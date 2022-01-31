var navLinks = [
    ['Services', '/#services'],
    ['Resources', '/resources'],
    ['About', '/about'],
    ['Consultation', '/consultation']
]

module.exports = `<li class="close">
    <button class="material-icons close-nav">close</button>
</li>` + navLinks.reduce(function (acc, item) {
    var [link, href] = item
    acc += `<li>
        <a href="${href}">${link}</a>
    </li>`

    return acc
}, '')

module.exports.links = navLinks


// module.exports = `<li class="close">
//     <button class="material-icons close-nav">close</button>
// </li>` + navLinks.reduce(function (acc, item) {
//     var [link, href] = item
//     acc += `<li>
//         <a href="${href}">${link}</a>
//     </li>`

//     return acc
// }, '')
