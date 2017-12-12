"use strict";

const
    http = require('http'),
    fs = require('fs'),
    url = require('url'),
    path = require('path');

function renderError(response) {
    var errfilename = path.join(process.cwd(), "/404.html");
    console.log("Serving: " + errfilename);


    fs.readFile(errfilename, 'binary', function (err, file) {
        response.writeHead(404);
        response.write(file, 'binary');
        response.end();
    })
}

function renderResponse(filename, response) {
    console.log("Serving: " + filename);

    fs.readFile(filename, 'binary', function (err, file) {
        if (err) {
            renderError(response);
        } else {
            response.writeHead(200);
            response.write(file, 'binary');
            response.end();
        }
    })
}

var port = process.env.PORT || 8080;

http.createServer(function (request, response) {
    var uri = url.parse(request.url).pathname,
        filename = path.join(process.cwd(), uri);
    console.log("Serving: " + filename);

    fs.stat(filename, function (err, stats) {
        if (err) {
            renderError(response);
        } else if (stats.isDirectory()) {
            filename = path.join(process.cwd(), "/index.html");
            renderResponse(filename, response);
        } else {
            renderResponse(filename, response);
        }


    })
}).listen(port)
