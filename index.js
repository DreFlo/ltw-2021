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
                        accounts = [data];
                        fs.writeFile('./accounts.json', JSON.stringify(accounts), 'utf-8', (writeErr) => {
                            if (writeErr) {
                                console.log(`Error writing file: ${writeErr}`);
                            } else {
                                console.log(`File is written successfully!`);
                            }
                        });
                        
                        response.writeHead(200, {'Content-Type': 'text/plain'});
                        response.end();
                    }
                    else {
                        let updateFile = true;
                        let status = 200;
                        let accounts = JSON.parse(fileData);

                        console.log(`Accounts: ${JSON.stringify(accounts)}`);

                        accounts.forEach(account => {
                            if(account.nick === data.nick && account.password === data.password) {
                                updateFile = false;
                            }
                            else if(account.nick === data.nick && account.password !== data.password) {
                                updateFile = false;
                                status = 401;                            }
                        });

                        if (updateFile) {
                            accounts.push(data);

                            console.log(`Updated Accounts: ${JSON.stringify(accounts)}`);

                            fs.writeFile('./accounts.json', JSON.stringify(accounts), 'utf-8', (writeErr) => {
                                if (writeErr) {
                                    console.log(`Error writing file: ${writeErr}`);
                                } else {
                                    console.log(`File is written successfully!`);
                                }
                            });
                        }

                        response.writeHead(status, {'Content-Type': 'text/plain'});
                        response.end();
                    }
                });
                break;
            case '/ranking':
                console.log('Ranking request');
                fs.readFile('./ranking.json', 'utf-8', async function (readErr, fileData) {
                    if(readErr) {
                        console.log(`Error in reading file: ${readErr}`);
                        response.writeHead(200, {'Content-Type': 'text/plain'});
                        response.end(JSON.stringify({ranking:[]}));
                    }
                    else {
                        let rankings = JSON.parse(fileData);
                        let read_values = rankings.ranking;
                        let values_to_send = [];
                        
                        if(read_values.length < 10){
                            read_values.forEach(value => {
                                values_to_send.push(value);
                            })
                        }
                        else{
                            for(let i = 0; i < 10; i++){
                                values_to_send.push(read_values[i]);
                            }
                        }
                        
                        response.writeHead(200, {'Content-Type': 'text/plain'});
                        response.end(JSON.stringify({ranking:values_to_send}));
                    }
                });
                break;
            case '/saveRanking':
                console.log('Save Ranking request');
                fs.readFile('./ranking.json', 'utf-8', async function (readErr, fileData) {
                    if(readErr) {
                        console.log(`Error in reading file: ${readErr}`);
                        curr_user = {nick:data.nick, victories:0, games:0};
                        if(data.winner == data.nick){ //Win
                            curr_user.victories += 1;
                        }
            
                        curr_user.games += 1;

                        fs.writeFile('./ranking.json', JSON.stringify({ranking:[curr_user]}), 'utf-8', (writeErr) => {
                            if (writeErr) {
                                console.log(`Error writing file: ${writeErr}`);
                            } else {
                                console.log(`File is written successfully!`);
                            }
                        });

                        
                        response.writeHead(200, {'Content-Type': 'text/plain'});
                        response.end();
                    }
                    else {
                        let rankings = JSON.parse(fileData);
                        let read_values = rankings.ranking;
                        let curr_user;
                        let index = -1;
            
                        for(let i = 0; i < read_values.length; i++){
                            if(read_values[i].nick == data.nick){
                                curr_user = read_values[i];
                                index = i;
                                break;
                            }
                        }
                            
                        //No games before
                        if(index == -1){
                            curr_user = {nick:data.nick, victories:0, games:0};
                        }
                        
                        if(data.winner == data.nick){ //Win
                            curr_user.victories += 1;
                        }
            
                        curr_user.games += 1;
            
                        if(index != -1) read_values[index] = curr_user;
                        else read_values.push(curr_user);

                        fs.writeFile('./ranking.json', JSON.stringify({ranking:read_values}), 'utf-8', (writeErr) => {
                            if (writeErr) {
                                console.log(`Error writing file: ${writeErr}`);
                            } else {
                                console.log(`File is written successfully!`);
                            }
                        });

                        response.writeHead(200, {'Content-Type': 'text/plain'});
                        response.end();
                    }
                });
                break;
        }
    })

});

server.listen(PORT);