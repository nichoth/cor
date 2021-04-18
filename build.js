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
function makeHs (file, baseName) {
    return hyperstream({
        body: {
            class: { append: baseName }
        },
        '#content': {
            _appendHtml: marked( matter(file).content )
        }
    })
}

function buildThem (inputDir, outputDir, templateFile, makeHs) {
    fs.readdir(inputDir, function (err, files) {
        if (err) throw err
        console.log('files:  ', files)

        var names = []
        files.forEach(fileName => {
            var _path = path.join(inputDir, fileName)
            var baseName = path.basename(fileName, '.md')

            if (baseName === 'home') return

            names.push(baseName)

            fs.readFile(_path, 'utf8', (err, file) => {
                if (err) throw err

                var outFileDir = outputDir + '/' + baseName
                mkdirp.sync(outFileDir)

                var hs = makeHs(file, baseName)

                var ws = fs.createWriteStream(outFileDir + '/index.html')
                var rs = fs.createReadStream(templateFile)

                rs.pipe(hs).pipe(ws)
            })
        })

        var homePath = path.join(inputDir, 'home.md')
        fs.readFile(homePath, 'utf8', (err, homeContent) => {
            if (err) throw err

            var fm = matter(homeContent)
            var _homeContent = marked(fm.content)

            hs = hyperstream({
                '#content': {
                    _appendHtml: _homeContent + `<div>
                        <img src=${fm.data.thumbnail}>
                    </div>`,
                }
            })
            var outFileDir = __dirname + '/public'
            var ws = fs.createWriteStream(outFileDir + '/index.html')
            var rs = fs.createReadStream(templatePath)
            rs.pipe(hs).pipe(ws)
        })

    })

}
