var hyperstream = require('hyperstream')
// var marked = require('marked')
// var matter = require('gray-matter')
var fs = require('fs')
const mkdirp = require('mkdirp')

var templatePath = __dirname + '/src/_index.html'

buildConsultation()

function buildConsultation () {
    // var _path = __dirname + '/src/_pages/consultation.md'
    var outFileDir = __dirname + '/public/consultation'

    var navLinks = [
        ['Services', '/services'],
        ['Resources', '/resources'],
        ['About', '/about'],
        ['Consultation', '/consultation']
    ]

    return new Promise((resolve, reject) => {
        // var fm = matter(file)
        // var content = marked(fm.content)

        // do the streaming
        var hs = hyperstream({
            body: {
                class: { append: 'consultation' }
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
                _appendHtml: `<div class="contact">
                    <div>Get In Touch</div>
                </div>`
            }
        })

        // build `about` here
        mkdirp(outFileDir).then(() => {
            var ws = fs.createWriteStream(outFileDir + '/index.html')
            var rs = fs.createReadStream(templatePath)
            rs.pipe(hs).pipe(ws)

            resolve()
        })
    })
}

