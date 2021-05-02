const express = require('express')
const app = express()
const path = require('path')
 
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
})

app.get('/:file', function (req, res) {
    if(req.params.file)
    res.sendFile(path.join(__dirname + '/'+req.params.file));
})
 
app.listen(3000)