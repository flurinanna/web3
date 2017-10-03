"use strict";

const
    http = require('http'),
    fs = require('fs'),
    url = require('url'),
    path = require('path');

http.createServer(function (request, response) {
    var uri = url.parse(request.url).pathname,
        filename = path.join(process.cwd(), uri),
        errfilename = path.join(process.cwd(), "/404.html");
    console.log("Serving: " + filename);
    console.log("Serving: " + errfilename);



    fs.readFile(filename, 'binary', function (err, file) {
        if (err) {
            fs.readFile(errfilename, 'binary', function (err, file) {
                response.writeHead(404);
                response.write(file, 'binary');
                response.end();
            })
        } else {
            response.writeHead(200);
            response.write(file, 'binary');
            response.end();
        }
    })
}).listen(8080)
