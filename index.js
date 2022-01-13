var http = require('http');
var fs = require('fs');
const url  = require('url');
//const fetch = require('node-fetch');
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

                let accounts;

                fs.readFile('./accounts.json', 'utf-8', async function (readErr, fileData) {
                    if(readErr) {
                        console.log(`Error reading file: ${err}`);
                    }
                    else {
                        let updateFile = true;
                        accounts = JSON.parse(fileData);

                        console.log(`Accounts: ${JSON.stringify(accounts)}`);

                        accounts.forEach(account => {
                            if(account.nick === data.nick && account.password === data.password) {
                                updateFile = false;
                                response.writeHead(200, {'Content-Type': 'text/plain'});
                                response.end('Succesful register');
                            }
                            else if(account.nick === data.nick && account.password !== data.password) {
                                updateFile = false;
                                response.writeHead(400, {'Content-Type': 'text/plain'});
                                response.end('Failure');
                            }
                        });

                        /*
                        Request to LTW server not working

                        const url = 'http://twserver.alunos.dcc.fc.up.pt:8008/register';

                        const ltwRequest = fetch(url, {
                            method: 'POST',
                            body: JSON.stringify(data)
                        });

                        const ltwResponse = await ltwRequest;
                        
                        if(!ltwResponse.ok){
                            updateFile = false;
                        }

                        */

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