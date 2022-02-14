var navLinks = [
    ['Services', '/#services'],
    ['Resources', '/resources'],
    ['About', '/about'],
    ['Consultation', '/consultation']
]

module.exports = {
    button: `<div class="close">
        <button class="material-icons close-nav">close</button>
    </div>`,

    string: navLinks.reduce(function (acc, item) {
        var [link, href] = item

        var cl
        if (href.includes('services')) {
            cl = 'services'
        }

        acc += `<li>
            <a href="${href}" class="${cl || ''}">
                ${link}
            </a>
        </li>`

        return acc
    }, ''),

    links: navLinks
}
