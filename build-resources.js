var hyperstream = require('hyperstream')
var marked = require('marked')
var matter = require('gray-matter')
var fs = require('fs')
const mkdirp = require('mkdirp')
const navLinks = require('./nav-links')

var templatePath = __dirname + '/src/_index.html'

buildConsultation()

function buildConsultation () {
    var _path = __dirname + '/src/_pages/resources.md'
    var outFileDir = __dirname + '/public/resources'

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
                    class: { append: 'resources' }
                },

                '.main-nav-wrapper': {
                    _appendHtml: navLinks.button +
                        '<ul class="main-nav">' + navLinks.string + '</ul>'
                },

                '#content': {
                    _appendHtml: `<h1>Guides To Burials In New Mexico</h1>
                        <div class="resources-content">
                            ${content}
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

            // build `resources` here
            mkdirp(outFileDir).then(() => {
                var ws = fs.createWriteStream(outFileDir + '/index.html')
                var rs = fs.createReadStream(templatePath)
                rs.pipe(hs).pipe(ws)

                resolve(file)
            })
        })
    })
}


