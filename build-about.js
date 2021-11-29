var hyperstream = require('hyperstream')
var marked = require('marked')
var matter = require('gray-matter')
var fs = require('fs')

var templatePath = __dirname + '/src/_index.html'

buildAbout()

function buildAbout () {
    var _path = __dirname + '/src/_pages/about.md'
    var outFileDir = __dirname + '/public/about'

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
            var content = marked(fm.content)
            var featuredImage = fm.data['featured-image']

            // do the streaming
            var hs = hyperstream({
                body: {
                    class: { append: 'about' }
                },

                '.main-nav': {
                    _appendHtml: navLinks.reduce(function (acc, item) {
                        var [link, href] = item
                        acc += `<li>
                            <a href="${href}">${link}</a>
                        </li>`

                        return acc
                    }, '')
                },

                '#content': {
                    _appendHtml: `<div class="section-one">
                        ${content}
                        <a class="btn-link" href="/consultation">
                            Contact Me
                        </a>
                    </div>
                    <div class="section-two">
                        <div class="featured-image">
                            <img src=${featuredImage}>
                        </div>
                    </div>`
                }
            })

            // build `about` here
            var ws = fs.createWriteStream(outFileDir + '/index.html')
            var rs = fs.createReadStream(templatePath)
            rs.pipe(hs).pipe(ws)

            resolve(file)
        })
    })
}
