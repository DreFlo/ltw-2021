const server = 'http://twserver.alunos.dcc.fc.up.pt:8008/';
const ourServer = 'http://twserver.alunos.dcc.fc.up.pt:9066/'; //8966

// Grupo é só pra debugging - TIRAR NO FIM
// WORKING
async function join(group, nick, password, size, initial){
    const url = server + 'join';

    const request = fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            'group': group,
            'nick': nick,
            'password': password,
            'size': size,
            'initial': initial
        })
    });

    const response = await request;
    let data = await response.json();

    console.log(data);

    return data.game;
}

// WORKING
async function leave(nick, password, game){
    const url = server + 'leave';

    const request = fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            'nick': nick,
            'password': password,
            'game': game
        })
    });

    const response = await request;

    if (response.ok)
        return 'Successful leave';
    else {
        const data = await response.json();
        return data.error;
    }
}

// UNTESTED
async function notify(nick, password, game, move){
    const url = server + 'notify';

    const request = fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            'nick': nick,
            'password': password,
            'game': game,
            'move': move
        })
    });

    const response = await request;

    if (response.ok)
        return 'Successful notify';
    else {
        const data = await response.json();
        return data.error;
    }
}

// ranking();
// WORKING
async function ranking(){
    /*const url = server + 'ranking';*/
    const url = ourServer + 'ranking';

    const request = fetch(url, {
        method: 'POST',
        body: JSON.stringify({})
    });

    const response = await request;
    const data = await response.json();

    let class_table = document.getElementById("classification");
    while(class_table.children.length > 1){
        class_table.removeChild(class_table.lastChild);
    }

    data.ranking.forEach(entry => {
        let class_row = class_table.insertRow();
        class_row.classList.add("class_row");

        let class_row_nick = class_row.insertCell(0);
        class_row_nick.classList.add("class_cell");
        
        let class_row_victories = class_row.insertCell(1);
        class_row_victories.classList.add("class_cell");

        let class_row_games = class_row.insertCell(2);
        class_row_games.classList.add("class_cell");

        class_row_nick.innerHTML = entry.nick;
        class_row_victories.innerHTML = entry.victories;
        class_row_games.innerHTML = entry.games;
    });
}

async function saveRanking(nick, winner){
    const url = ourServer + 'saveRanking';

    const request = fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            'nick': nick,
            'winner': winner
        })
    });

    const response = await request;

    return;
}

// account - up201907001 pass
// register('zp', 'secret');
// WORKING
async function register(nick, password){
    const url_1 = server + 'register';
    
    const url_2 = ourServer + 'register';

    const request_1 = fetch(url_1, {
        method: 'POST',
        body: JSON.stringify({
            'nick': nick,
            'password': password
        })
    });

    const response_1 = await request_1;

    if (response_1.ok) {
        console.log("Response 1 ok");

        const request_2 = fetch(url_2, {
            method: 'POST',
            body: JSON.stringify({
                'nick': nick,
                'password': password
            })
        });

        const response_2 = await request_2;

        if (response_2.ok) {
            console.log("Succesful register");
            return 'Successful register';
        }
        else {
            const data = await response_2.json();
            console.log(data);
            return data.error;
        }
    }
    else {
        const data = await response_1.json();
        console.log(data);
        return data.error;
    }
}

// EventSource tem de ser fechado no fim do jogo!
// UNTESTED
async function update(nick, game, errorFunc){
    const url = new URL(server + 'update');

    let args = [
        ['nick', nick],
        ['game', game]
    ];
    url.search = new URLSearchParams(args).toString();

    const source = new EventSource(url);

    source.onerror = errorFunc;

    source.onmessage = function(event) {
        handleEventMessage(JSON.parse(event.data));
    }

    return source;
}