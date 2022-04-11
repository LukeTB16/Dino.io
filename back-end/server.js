function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}
const http = require('http');
const { getMaxListeners } = require('process');
const app = require('express')();
app.get("/", (req, res) => res.sendFile(__dirname + '/lobby.html.lnk'));
app.listen(8081, () => console.log('Back-end on 8081'))
const websocketServer = require('websocket').server;
const httpServer = http.createServer();

httpServer.listen(8080, () => console.log('Front-end on 8080'));
// hashmap clients
const clients = {};
const games = {};
let counter = 0;

const wsServer = new websocketServer({
    "httpServer": httpServer,
})

function getGameIdKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key].gameId === value);
}
function getClientIdKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key].clientId === value);
}
let indice;
wsServer.on("request", request => {
    // connect
    const connection = request.accept(null, request.origin);
    connection.on("open", () => console.log('A session has been opened!!'));
    connection.on("message", message => {
        const result = JSON.parse(message.utf8Data); // message.utf8Data IF give errors
        // request from user to create a new game
        if (result.method == "create") {
            console.log(result.nickname, "ha richiesto al server -> CREATE LOBBY");
            const clientId = result.clientId;
            const gameId = game_guid();
            games[counter] = {
                'gameId': gameId,
                'clientId': [clientId]
            };
            indice = counter;
            connection.on("close", () => {
                delete games[getGameIdKeyByValue(games, gameId)];
                console.log(clientId, " ha chiuso la comunicazione");
            });
            counter = counter + 1;
            console.log("Lobby attuali...");
            console.log(games);
            const payLoad = {
                "method": "create",
                "gameId": gameId
            }
            const con = clients[clientId].connection;
            con.send(JSON.stringify(payLoad));
        }
        // request from user to join a game
        if (result.method == "join") {
            let start = false;
            console.log(result.nickname, "ha richiesto al server -> JOIN LOBBY");
            const clientID = result.clientId;
            const gameID = result.gameId;
            const nick = result.nickname;
            if (games[getGameIdKeyByValue(games, gameID)] != null) {
                if (games[getClientIdKeyByValue(games, clientID)].clientId.length < 2) {
                    games[getClientIdKeyByValue(games, clientID)].clientId.push(clientID);
                    console.log(games);
                    console.log(nick, " è stato aggiunto alla lobby");
                    //start = true;
                }
                else {
                    console.log("LOBBY PIENA !");
                }
            }
            else {
                console.log("LOBBY NON TROVATA !");
                console.log(games);
            }
            const payLoad = {
                "method": "join",
                "game": gameID,
                "start": start
            }
            const con = clients[clientID].connection;
            con.send(JSON.stringify(payLoad));
        }
    }
    );

    // generate a new clientId
    const clientId = id_guid();
    clients[clientId] = {
        "connection": connection
    }
    // send back response to client
    const payLoad = {
        "method": "connect",
        "clientId": clientId
    }
    // send back the client connect
    connection.send(JSON.stringify(payLoad));
})

// generate unique id
// ref: https://stackoverflow.com/questions/6248666/how-to-generate-short-uid-like-ax4j9z-in-js
const id_guid = () => {
    var firstPart = (Math.random() * 46656) | 0;
    var secondPart = (Math.random() * 46656) | 0;
    firstPart = ("000" + firstPart.toString(36)).slice(-3);
    secondPart = ("000" + secondPart.toString(36)).slice(-3);
    return firstPart + secondPart;
}
const game_guid = () => {
    var firstPart = (Math.random() * 46656) | 0;
    var secondPart = (Math.random() * 46656) | 0;
    firstPart = ("000" + firstPart.toString(36)).slice(-3);
    secondPart = ("000" + secondPart.toString(36)).slice(-3);
    return firstPart + secondPart + firstPart;
}



/*

const io = require("socket.io")();

io.on('connection', client => {
    client.emit('init', {data: 'hello world'})
});

io.listen(8081);

*/