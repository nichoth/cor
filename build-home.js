var hyperstream = require('hyperstream')
var marked = require('marked')
var matter = require('gray-matter')
var fs = require('fs')
var navLinks = require('./nav-links')

var templatePath = __dirname + '/src/_index.html'

buildHome()

function buildHome () {
    var _path = __dirname + '/src/_pages/home.md'
    var outFileDir = __dirname + '/public'

    return new Promise((resolve, reject) => {
        fs.readFile(_path, 'utf8', (err, file) => {
            if (err) return reject(err)

            var fm = matter(file)
            // var { badge } = fm.data
            var featuredImage = fm.data['featured-image']
            var content = marked(fm.content)
            var intro = marked(fm.data.intro)
            var services = marked(fm.data.services)
            var { credentials } = fm.data
            var education = marked(fm.data.education)
            var eolSupport = marked(fm.data['eol-support'])
            var sensoryCuration = marked(fm.data['sensory-curation'])
            var consultation = marked(fm.data['consultation'])

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

                        <hr>
                        
                            ${content}
                            <div class="credentials">
                                <img src="/Daisy_V2_outlined.png" alt="daisies">
                                <div class="credentials-words">
                                    <div>
                                        Corey Coomes, <br> End-of-Life Doula
                                    </div>
                                    <div>${credentials}</div>
                                </div>
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

                    <div id="services">
                        <h2>Services</h2>

                        <div>
                            ${services}
                            <ul class="services-icons">
                                <li>
                                    <img src="/olive-branch.png" alt="olive branch">
                                    <h3>End of Life Support</h3>
                                    ${eolSupport}
                                </li>
                                <li>
                                    <img src="/sounds.png" alt="sounds">
                                    <h3>Sensory Curation</h3>
                                    ${sensoryCuration}
                                </li>
                                <li>
                                    <img src="/basket-icon.png" alt="basket">
                                    <h3>Education</h3>
                                    ${education}
                                </li>
                            </ul>
                            </ul>
                        </div>
                    </div>

                    <div class="schedule-consultation">
                        <div class="left-col">
                            ${consultation}
                        </div>
                        <div class="right-col">
                            <a class="btn-link" href="/consultation">
                               Schedule A Consultation
                            </a>
                        </div>
                    </div>

                    <div class="foot">
                        <ul class="main-nav">
                            ${navLinks.reduce(function (acc, item) {
                                var [link, href] = item
                                acc += `<li>
                                    <a href="${href}">${link}</a>
                                </li>`

                                return acc
                            }, '')}
                        </ul>
                        <h2>Contact</h2>
                        <div class="contact-info">
                            <p>Corey Coomes</p>
                            <p>(815) 677-5152</p>
                            <p>seijocoomes@gmail.com</p>
                            <p>© Still Brilliance 2021</p>
                        </div>
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
