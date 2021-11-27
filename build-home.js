var hyperstream = require('hyperstream')
var marked = require('marked')
var matter = require('gray-matter')
var fs = require('fs')

var templatePath = __dirname + '/src/_index.html'

buildHome()

function buildHome () {
    var _path = __dirname + '/src/_pages/home.md'
    var outFileDir = __dirname + '/public'

    var navLinks = [
        ['Services', '/services'],
        ['Resources', '/resources'],
        ['About', '/about'],
        ['Consultation', '/consultation']
    ]

    return new Promise((resolve, reject) => {
        fs.readFile(_path, 'utf8', (err, file) => {
            if (err) return reject(err)

            var fm = matter(file)
            var { badge } = fm.data
            var featuredImage = fm.data['featured-image']
            var content = marked(fm.content)
            var intro = marked(fm.data.intro)
            var services = marked(fm.data.services)
            var { credentials } = fm.data
            // console.log('.data', fm.data)
            // console.log('edu', fm.data.education)
            // var education = marked(fm.data.education)
            // var eolSupport = marked(fm.data['eol-support'])
            // var sensoryCuration = marked(fm.data['sensory-curation'])
            var education = fm.data.education || []
            var eolSupport = fm.data['eol-support'] || []
            var sensoryCuration = fm.data['sensory-curation'] || []

            var hs = hyperstream({
                body: {
                    class: { append: 'home' }
                },
                '#content': {
                    _appendHtml: `<div class="section-one">
                        <div class="featured-image">
                            <img src=${featuredImage}>
                        </div>
                        <div class="intro">
                            ${intro}
                            <a class="btn-link" href="/consultation">
                               Schedule A Consultation
                            </a>
                        </div>
                    </div>

                    <div class="section-two">
                        <div class="section-two-content">
                            ${content}
                            <div class="credentials">
                                <div>Corey Coomes, End-of-Life Doula</div>
                                <div>${credentials}</div>
                            </div>
                            <div class="more-about-me">
                                <a class="btn-link" href="/about">
                                    More about me
                                </a>
                            </div>
                        </div>
                        <div class="img-two">
                            <img src="/rectangle-38.png">
                        </div>
                    </div>

                    <h2>Services</h2>

                    <div id="services">
                        ${services}
                        <ul class="services-icons">
                            <li>
                                <img src="/olive-branch.png" alt="olive branch">
                                <h3>End of Life Support</h3>
                                <ul>
                                    ${eolSupport.map(item => {
                                        return `<li>${item}</li>`
                                    }).join('')}
                                </ul>
                            </li>
                            <li>
                                <img src="/sounds.png" alt="sounds">
                                <h3>Sensory Curation</h3>
                                <ul>
                                    ${sensoryCuration.map(item => {
                                        return `<li>${item}</li>`
                                    }).join('')}
                                </ul>
                            </li>
                            <li>
                                <img src="/basket-icon.png" alt="basket">
                                <h3>Education</h3>
                                <ul>
                                    ${education.map(item => {
                                        return `<li>${item}</li>`
                                    }).join('')}
                                </ul>
                            </li>
                        </ul>
                        </ul>
                    </div>
                    `
                },
                '.main-nav': {
                    _appendHtml: navLinks.reduce(function (acc, item) {
                        var [link, href] = item
                        acc += `<li>
                            <a href="${href}">${link}</a>
                        </li>`

                        return acc
                    }, '')
                }
            })

            // build home here
            var ws = fs.createWriteStream(outFileDir + '/index.html')
            var rs = fs.createReadStream(templatePath)
            rs.pipe(hs).pipe(ws)

            return resolve(file)
        })
    })
}
