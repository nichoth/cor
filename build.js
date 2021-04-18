var hyperstream = require('hyperstream')
var fs = require('fs')
var path = require('path')
var matter = require('gray-matter')
var mkdirp = require('mkdirp')

// do the pages (from md files)

// read the index template
// then pipe it through hs with the content

fs.readdir(__dirname + '/src/_pages', function (err, files) {
    if (err) throw err
    console.log('files:  ', files)

    files.forEach(fileName => {
        var _path = __dirname + '/src/_pages/' + fileName
        var baseName = path.basename(fileName, '.md')

        fs.readFile(_path, 'utf8', (err, file) => {
            if (err) throw err

            mkdirp.sync(__dirname + '/public/' + baseName)

            var hs = hyperstream({
                body: {
                    class: { append: baseName }
                },
                '#content': {
                    _appendHtml: matter(file).content
                }
            })
            var ws = fs.createWriteStream(__dirname + '/public/' + baseName + 
                '/index.html')
            var rs = fs.createReadStream(__dirname + '/src/_index.html')

            rs.pipe(hs).pipe(ws)
        })
    })

})

