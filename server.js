/*
Acho que criei isto pra nada, mas ainda não sei
*/

var http = require('http');
var fs = require('fs');
var PORT = 9066; //8966

const server = http.createServer(function (request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end('Olá mundo\n');
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