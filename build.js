var hyperstream = require('hyperstream')
var fs = require('fs')
var path = require('path')
var matter = require('gray-matter')
var mkdirp = require('mkdirp')
var marked = require('marked')

var templatePath = __dirname + '/src/_index.html'

// templateFile is the template for index.html
// buildThem (inputDir, outputDir, templateFile, makeHs) {
buildThem(
    __dirname + '/src/_pages',
    __dirname + '/public',
    templatePath,
    makeHs
)

// a fn that returns a hs instance
function makeHs (file, baseName, navLinks) {
    var fm = matter(file)
    var content = marked(fm.content)

    var h1 = fm.data.title ? `<h1>${fm.data.title}</h1>` : ''
    if (fm.data.title === 'home') {
        h1 = ''
    }

    return hyperstream({
        body: {
            class: { append: baseName }
        },
        '#content': {
            _appendHtml: h1 +
                content +
                (fm.data.thumbnail ?
                `<div class="featured-image">
                    <img src=${fm.data.thumbnail}>
                </div>` :
                '')
        },
        // build the nav links for each page
        // b/c there is a different 'active' link on each page
        '.main-nav': {
            // need to deal with the order of the links
            _appendHtml: navLinks.reduce(function (acc, item) {
                var [link, href] = item
                // var _basename = path.basename(filename, '.md')
                var cl = path.basename(href) === baseName ?
                    'active' :
                    ''
                if (baseName === 'home' && path.basename(href) === '') {
                    cl = 'active'
                }
                acc += `<li class="${cl}">
                    <a href="${href}">${link}</a>
                </li>`
                return acc
            }, '')
        }
    })
}

function buildThem (inputDir, outputDir, templateFile, makeHs) {
    fs.readdir(inputDir, function (err, files) {
        if (err) throw err
        console.log('files:  ', files)

        files.forEach(fileName => {
            var _path = path.join(inputDir, fileName)
            var baseName = path.basename(fileName, '.md')

            fs.readFile(_path, 'utf8', (err, file) => {
                if (err) throw err

                // make a directory for each file that is the name of the file
                // (clean urls) (url with no file extension)
                // the 'home' file is special
                var outFileDir = outputDir + '/' + (baseName === 'home' ?
                    '' :
                    baseName)

                mkdirp.sync(outFileDir)

                // makeHs (file, baseName, navLinks) {
                var hs = makeHs(file, baseName, [
                    ['About', '/about'],
                    ['Resources', '/resources'],
                    ['Services', '/services'],
                    ['Contact', '/contact']
                ])

                var ws = fs.createWriteStream(outFileDir + '/index.html')
                var rs = fs.createReadStream(templateFile)

                rs.pipe(hs).pipe(ws)
            })
        })

    })

}
