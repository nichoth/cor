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
                        
                            <div class="about-cor">
                                ${content}
                                <img src="/Daisy_outline_SVG.svg" alt="daisies">
                            </div>

                            <div class="credentials">
                                <div class="credentials-words">
                                    <div>
                                        Corey Coomes, End&#8209;of&#8209;Life&nbsp;Doula
                                    </div>
                                    <div class="certificate">${credentials}</div>
                                    <div class="more-about-me">
                                        <a class="btn-link" href="/about">
                                            More about me
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="img-two">
                            <img src="${fm.data['profile-pic']}">
                        </div>
                    </div>

                    <div id="services">
                        <h2>Services</h2>

                        <div>
                            ${services}
                        </div>

                        <ul class="services-icons">
                            <li>
                                <img src="/column_1_icon.svg" alt="olive branch">
                                <h3>End of Life Support</h3>
                                ${eolSupport}
                            </li>
                            <li>
                                <img src="/sounds.png" alt="sounds">
                                <h3>Sensory Curation</h3>
                                ${sensoryCuration}
                            </li>
                            <li>
                                <img src="/column_3_icon.svg" alt="basket">
                                <h3>Education</h3>
                                ${education}
                            </li>
                        </ul>
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

                    <div class="section-three">
                        <div class="column-pic">
                            <img src="${fm.data['section3-pic']}">
                        </div>
                        <div class="column-text">
                            <p>${fm.data.section3}</p>
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
                            <p>
                                <a href="mailto:seijocoomes@gmail.com">
                                    seijocoomes@gmail.com
                                </a>
                            </p>
                            <p>© Still Brilliance 2022</p>
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
