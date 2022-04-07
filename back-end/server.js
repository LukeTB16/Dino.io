const http = require('http');
const app = require('express')();
app.get("/", (req, res) => res.sendFile(__dirname + '/lobby.html.lnk'));
app.listen(8081, () => console.log('Back-end on 8081'))
const websocketServer = require('websocket').server;
const httpServer = http.createServer();

httpServer.listen(8080, () => console.log('Front-end on 8080'));
// hashmap clients
const clients = {};
const games = {};


const wsServer = new websocketServer({
    "httpServer": httpServer,
})
wsServer.on("request", request => {
    // connect
    const connection = request.accept(null, request.origin);
    connection.on("open", () => console.log('opened!'))
    connection.on("close", () => {
        games
        console.log('closed!')})
    connection.on("message", message => {
        const result = JSON.parse(message.utf8Data); // message.utf8Data IF give errors
        // request from user to create a new game
        if(result.method == "create") {
            console.log(result.nickname, "ha richiesto al server -> CREATE LOBBY");
            const clientId = result.clientId;
            const gameId = game_guid();
            /*
            game.clients.push({
                "clientId": clientId,
                "color": players_color
            })
            */
            try {
                games[gameId] = {
                    "id": gameId,
                    "clients": [clientId]
                }
            } catch (error) {
                console.log("Problemi con la creazione della lobby...");
                console.error(error);
            }
            console.log("Lobby attuali...");
            console.log(games);
            const payLoad = {
                "method": "create",
                "game": games[gameId]
            }

            const con = clients[clientId].connection;
            con.send(JSON.stringify(payLoad));
        }
        // request from user to join a game
        if(result.method == "join") {
            console.log(result.nickname, "ha richiesto al server -> JOIN LOBBY");
            /*
            const clientId = result.clientId;
            const gameId = result.gameId;
            const game = games[gameId] // get game object
            if(game.clients.length >= 3){ // max players reach
                console.log("Max people limit reached");
                return;
            }
            // players dino skin color
            const players_color = {"0": "Red", "1": "Green"}[game.clients.length] // n. of clients that we have
            game.clients.push({
                "clientId": clientId,
                "color": players_color
            })

            const payLoad = {
                "method": "join",
                "game": game
            }
            // check all clients and report people joined
            game.clients.forEach(c =>{
                clients[c.clientId].connection.send(JSON.stringify(payLoad));
            })

            */
           /*
            const clientId = result.clientId;
            const gameId = result.gameId;
            const game = games[gameId] // get game object
            console.log(game);
            const payLoad = {
                "method": "join",
                "game": game,
                "gameId": gameId,
                "clientId": clientId
            }
            const con = clients[clientId].connection;
            con.send(JSON.stringify(payLoad));
        */
            const clientId = result.clientId;
            const gameId = result.gameId;
            const nick = result.nickname;
            //const game = games[gameId];
            if(games[gameId]){
                console.log("LOBBY ESISTENTE");
                if(games[gameId].clients.length < 2){
                    games[gameId].clients.push(clientId);
                    console.log(games);
                    console.log(nick, " è stato aggiunto alla lobby");
                }
                else{
                    return;
                }
            }
            else{
                console.log("La LOBBY NON ESISTE");
            }
        }
    })
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
const id_guid= ()=> {
    var firstPart = (Math.random() * 46656) | 0;
    var secondPart = (Math.random() * 46656) | 0;
    firstPart = ("000" + firstPart.toString(36)).slice(-3);
    secondPart = ("000" + secondPart.toString(36)).slice(-3);
    return firstPart + secondPart;
}
const game_guid= ()=> {
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