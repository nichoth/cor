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
                        <div>
                            ${content}
                        </div>
                        <div class="img-two">
                            <img src="/rectangle-38.png">
                        </div>
                    </div>`
                },
                '.main-nav': {
                    // need to deal with the order of the links
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
