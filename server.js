/*
Acho que criei isto pra nada, mas ainda não sei
*/

var http = require('http');
var fs = require('fs');
var PORT = 8008;

fs.readFile('./index.html', function(err, html){
    if(!err){
        http.createServer(function(request, response) {
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.write(html);
            response.end();
        }).listen(PORT);
    }
});