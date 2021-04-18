var hyperstream = require('hyperstream')
var fs = require('fs')
var path = require('path')
var matter = require('gray-matter')
var mkdirp = require('mkdirp')

buildThem(
    __dirname + '/src/_pages',
    __dirname + '/public',
    __dirname + '/src/_index.html',
    makeHs
)

// a fn that returns a hs instance
function makeHs (file, baseName) {
    return hyperstream({
        body: {
            class: { append: baseName }
        },
        '#content': {
            _appendHtml: matter(file).content
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

                var outFileDir = outputDir + '/' + baseName
                mkdirp.sync(outFileDir)

                var hs = makeHs(file, baseName)

                var ws = fs.createWriteStream(outFileDir + '/index.html')
                var rs = fs.createReadStream(templateFile)

                rs.pipe(hs).pipe(ws)
            })
        })

    })
}
