var hyperstream = require('hyperstream')
// var marked = require('marked')
// var matter = require('gray-matter')
var fs = require('fs')
const mkdirp = require('mkdirp')
const navLinks = require('./nav-links')

var templatePath = __dirname + '/src/_index.html'

buildConsultation()

function buildConsultation () {
    // var _path = __dirname + '/src/_pages/consultation.md'
    var outFileDir = __dirname + '/public/consultation'

    return new Promise((resolve, _) => {
        // var fm = matter(file)
        // var content = marked(fm.content)

        // do the streaming
        var hs = hyperstream({
            body: {
                class: { append: 'consultation' }
            },

            '.main-nav-wrapper': {
                _appendHtml: navLinks.button +
                    '<ul class="main-nav">' + navLinks.string + '</ul>'
            },

            '#content': {
                _appendHtml: `<div class="consultation-content">
                    <!-- Calendly inline widget begin -->
                    <div class="calendly-inline-widget"
                        data-url="https://calendly.com/stillbrilliance" style="min-width:320px;height:630px;">
                    </div>
                    <script type="text/javascript" src="https://assets.calendly.com/assets/external/widget.js" async></script>
                    <!-- Calendly inline widget end -->
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

                // <!-- Calendly inline widget begin -->
                // <div class="calendly-inline-widget"
                //     data-url="https://calendly.com/stillbrilliance?text_color=131311&primary_color=79c8a9"
                //     style="min-width:320px;height:630px;"></div>
                // <script type="text/javascript" src="https://assets.calendly.com/assets/external/widget.js" async></script>
                // <!-- Calendly inline widget end -->

                // _appendHtml: `<div class="contact">
                //     <div>Get In Touch</div>
                // </div>`

        // build `about` here
        mkdirp(outFileDir).then(() => {
            var ws = fs.createWriteStream(outFileDir + '/index.html')
            var rs = fs.createReadStream(templatePath)
            rs.pipe(hs).pipe(ws)

            resolve()
        })
    })
}

