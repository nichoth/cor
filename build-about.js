var hyperstream = require('hyperstream')
var marked = require('marked')
var matter = require('gray-matter')
var fs = require('fs')
const mkdirp = require('mkdirp')
const navLinks = require('./nav-links')

var templatePath = __dirname + '/src/_index.html'

buildAbout()

function buildAbout () {
    var _path = __dirname + '/src/_pages/about.md'
    var outFileDir = __dirname + '/public/about'

    return new Promise((resolve, reject) => {
        fs.readFile(_path, 'utf8', (err, file) => {
            if (err) return reject(err)

            var fm = matter(file)
            var content = marked(fm.content)
            var featuredImage = fm.data['featured-image']

            // do the streaming
            var hs = hyperstream({
                body: {
                    class: { append: 'about' }
                },

                '.main-nav': {
                    _appendHtml: navLinks.string
                },

                '#content': {
                    _appendHtml: `<div class="abouts">
                        <div class="section-one">
                            ${content}
                            <div class="btn-wrapper">
                                <a class="btn-link" href="/consultation">
                                    Schedule A Consultation
                                </a>
                            </div>
                        </div>
                        <div class="section-two">
                            <div class="featured-image">
                                <img src=${featuredImage}>

                                <img class="doula-cert" src="/doula-cert.svg">
                            </div>
                        </div>
                    </div>

                    <div class="foot">
                        <ul class="main-nav">
                            ${navLinks.links.reduce(function (acc, item) {
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
                }
            })

            mkdirp(outFileDir).then(() => {
                // build `about` here
                var ws = fs.createWriteStream(outFileDir + '/index.html')
                var rs = fs.createReadStream(templatePath)
                rs.pipe(hs).pipe(ws)

                resolve(file)
            })
        })
    })
}
