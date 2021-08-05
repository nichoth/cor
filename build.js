var hyperstream = require('hyperstream')
var fs = require('fs')
var path = require('path')
var matter = require('gray-matter')
var mkdirp = require('mkdirp')
var marked = require('marked')

var templatePath = __dirname + '/src/_index.html'

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

    console.log('basename', baseName)

    return hyperstream({
        body: {
            class: { append: baseName }
        },
        '#content': {
            _appendHtml: content + (fm.data.thumbnail ?
                `<div>
                    <img src=${fm.data.thumbnail}>
                </div>` :
                '')
            // _appendHtml: marked( matter(file).content )
        },
        // build the nav links for each page
        // b/c there is a different 'active' link on each page
        '.main-nav': {
            // need to deal with the order of the links
            _appendHtml: navLinks.reduce((acc, [link, href]) => {
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

                var outFileDir = outputDir + '/' + (baseName === 'home' ?
                    '' :
                    baseName)

                mkdirp.sync(outFileDir)

                var hs = makeHs(file, baseName, [
                    ['home', '/'],
                    ['About', '/about'],
                    ['Resources', '/resources'],
                    ['Contact', '/contact']
                ])

                var ws = fs.createWriteStream(outFileDir + '/index.html')
                var rs = fs.createReadStream(templateFile)

                rs.pipe(hs).pipe(ws)
            })
        })

    })

}
