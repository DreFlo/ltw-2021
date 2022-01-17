var http = require('http');
var https = require('https');
var fs = require('fs');
const url  = require('url');
var PORT = 9066; //8966

const server = http.createServer(function (request, response) {
    const parsedUrl = url.parse(request.url,true);
    const query = parsedUrl.query;
    
    // Not really best practice at all but idk the origin website
    response.setHeader('Access-Control-Allow-Origin', '*');

    let dataString = '';
    let data = undefined;
    let dataOver = false;

    request.on('data', chunk => {
        dataString += chunk;
    })

    request.on('end', () => {
        data = JSON.parse(dataString);

        switch(parsedUrl.pathname){
            case '/register':
                console.log('Register request');
                console.log(`Data: ${JSON.stringify(data)}`);

                fs.readFile('./accounts.json', 'utf-8', async function (readErr, fileData) {
                    if(readErr) {
                        console.log(`Error reading file: ${err}`);
                    }
                    else {
                        let updateFile = true;
                        let responseSent = false;
                        let accounts = JSON.parse(fileData);

                        console.log(`Accounts: ${JSON.stringify(accounts)}`);

                        accounts.forEach(account => {
                            if(account.nick === data.nick && account.password === data.password) {
                                updateFile = false;
                                responseSent = true;
                                response.writeHead(200, {'Content-Type': 'text/plain'});
                                response.end('Succesful register');
                            }
                            else if(account.nick === data.nick && account.password !== data.password) {
                                updateFile = false;
                                responseSent = true;
                                response.writeHead(400, {'Content-Type': 'text/plain'});
                                response.end('Failure');
                            }
                        });

                        if (!responseSent) {
                            const options = {
                                hostname: 'http://twserver.alunos.dcc.fc.up.pt',
                                port: 8008,
                                path: '/register',
                                method: 'POST',
                                headers: {
                                'Content-Type': 'application/json',
                                'Content-Length': dataString.length
                                }
                            }

                            const ltwRequest = https.request(options, response => {
                                updateFile = response.ok;
                            });

                            ltwRequest.on('error', error => {
                                console.error(error);
                            });

                            ltwRequest.write(dataString);
                            ltwRequest.end();

                            if (updateFile) {
                                accounts.push(data);

                                console.log(`Updated Accounts: ${JSON.stringify(accounts)}`);

                                fs.writeFile('./accounts.json', JSON.stringify(accounts), 'utf-8', (writeErr) => {
                                    if (writeErr) {
                                        console.log(`Error writing file: ${err}`);
                                    } else {
                                        console.log(`File is written successfully!`);
                                    }
                                });

                                response.writeHead(200, {'Content-Type': 'text/plain'});
                                response.end('Succesful register');
                            }
                            else {
                                response.writeHead(400, {'Content-Type': 'text/plain'});
                                response.end('Failure');
                            }
                        }
                    }
                });
                break;
            case '/ranking':
                break;
        }
    })

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