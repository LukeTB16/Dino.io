const http = require('http');
const app = require('express')();
app.get("/", (req, res) => res.sendFile(__dirname + '/lobby.html.lnk'));
app.listen(8081, () => console.log('Back-end on 8081'))
const websocketServer = require('websocket').server;
const httpServer = http.createServer();

httpServer.listen(8080, () => console.log('Front-end on 8080'));
// hashmap clients
const clients = {}
const games = {};


const wsServer = new websocketServer({
    "httpServer": httpServer,
})
wsServer.on("request", request => {
    // connect
    const connection = request.accept(null, request.origin);
    connection.on("open", () => console.log('opened!'))
    connection.on("close", () => console.log('closed!'))
    connection.on("message", message => {
        const result = JSON.parse(message.utf8Data);
        // request from user to create a new game
        if(result.method === "create") {
            const clientId = result.clientId;
            const gameId = guid();
            games[gameId] = {
                "id": gameId,
                "users": 2
            }
            const payLoad = {
                "method": "create",
                "game": games[gameId]
            }

            const con = clients[clientId].connection;
            con.send(JSON.stringify(payLoad));
        }
    })
    // generate a new clientId
    const clientId = guid();
    clients[clientId] = {
        "connection": connection
    }
    // send back response to client
    const payload = {
        "method": "connect",
        "clientId": clientId
    }
    // send back the client connect
    connection.send(JSON.stringify(payload));
})

// generate unique id
// https://stackoverflow.com/posts/44996682/revisions
const guid=()=> {
    const s4=()=> Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);     
    return `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4() + s4() + s4()}`;
  }