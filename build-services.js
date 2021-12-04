var hyperstream = require('hyperstream')
var marked = require('marked')
var matter = require('gray-matter')
var fs = require('fs')
const mkdirp = require('mkdirp')

var templatePath = __dirname + '/src/_index.html'

buildConsultation()

function buildConsultation () {
    var _path = __dirname + '/src/_pages/services.md'
    var outFileDir = __dirname + '/public/services'

    var navLinks = [
        ['Services', '/services'],
        ['Resources', '/resources'],
        ['About', '/about'],
        ['Consultation', '/consultation']
    ]



    return new Promise((resolve, reject) => {
        // var fm = matter(file)
        // var content = marked(fm.content)

        fs.readFile(_path, 'utf8', (err, file) => {
            if (err) return reject(err)

            var fm = matter(file)
            var content = marked(fm.content) || ''

            // do the streaming
            var hs = hyperstream({
                body: {
                    class: { append: 'services' }
                },

                '.main-nav': {
                    _appendHtml: navLinks.reduce(function (acc, item) {
                        var [link, href] = item
                        var cl = href === '/services' ? 'active' : ''
                        acc += `<li class="${cl}">
                            <a href="${href}">${link}</a>
                        </li>`

                        return acc
                    }, '')
                },

                '#content': {
                    _appendHtml: `<div class="services-content">
                        <h1>Services</h1>
                        ${content}
                    </div>`
                }
            })

            // build `services` here
            mkdirp(outFileDir).then(() => {
                var ws = fs.createWriteStream(outFileDir + '/index.html')
                var rs = fs.createReadStream(templatePath)
                rs.pipe(hs).pipe(ws)

                resolve(file)
            })
        })
    })
}



