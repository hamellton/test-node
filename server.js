const http = require('http')
const fs = require('fs')
const path = require('path')

let obj = {
    table: []
}


fs.exists('priceData.json', (exists) => {
    if (exists) {
        fs.open('testFile.json', 'w', (err) => {
            if (err) throw err
        })
        console.log('yeah, file is exists')
        fs.readFile("priceData.json", (err, data) => {
            if (err) {
                console.log(err)
            } else {
                dataParse = JSON.parse(data)
                obj.table.push(dataParse)
                let json = JSON.stringify(obj)
                fs.writeFile('priceData.json', json)
                console.log(obj)
            }
        })
    }
})


const server = http.createServer((req, res) => {
    let filePath = path.join(__dirname, 'client', req.url === '/' ? 'index.html' : req.url)
    const ext = path.extname(filePath)
    let contentType = 'text/html'

    switch (ext) {
        case '.css':
            contentType = 'text/css'
        case '.js':
            contentType = 'text/javascript'
        default:
            contentType = 'text/html'
    }

    if (!ext) {
        contentType += '.html'
    }

    fs.readFile(filePath, (err, content) => {
        if (err) {
            fs.readFile(path.join(__dirname, 'cient', 'error.html'), (err, data) => {
                if (err) {
                    res.writeHead(500)
                    res.end('Error')
                } else {
                    res.writeHead(200, {
                        'Content-type': 'text/html'
                    })
                    res.end(data)
                }
            })
        } else {
            res.writeHead(200, {
                'Content-Type': contentType
            })
            res.end(content)
        }
    })
})

const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
    console.log(`Server has been started on PORT: ${PORT}`)
})