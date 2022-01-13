var http = require('http');
var fs = require('fs');
const url  = require('url');
var PORT = 9066; //8966

const server = http.createServer(function (request, response) {
    const parsedUrl = url.parse(request.url,true);
    const query = parsedUrl.query;

    switch(parsedUrl.pathname){
        case '/register':
            response.writeHead(200, {'Content-Type': 'text/plain'});
            response.end('Olá mundo\n');
            break;
        case '/ranking':
            break;
    }
});

server.listen(PORT);

/*
fs.readFile('./index.html', function(err, html){
    if(!err){
        http.createServer(function(request, response) {
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.write(html);
            response.end();
        }).listen(PORT);
    }
});*/