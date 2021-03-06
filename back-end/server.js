const http = require('http');
const websocketServer = require('websocket').server;
const httpServer = http.createServer();
httpServer.listen(8080, () => console.log('Listening on port 8080'));

// hashmap clients
const clients = {};
const games = {};
let leaderboard = {};

const wsServer = new websocketServer({
    "httpServer": httpServer,
})

function manage_lead(diz) {
    let sortable = [];
    for (let e in diz) {
        sortable.push([e, diz[e]]); // insert elements in new list
    }
    for (let edict in diz) { 
        delete diz[edict];  // remove previous elements
    }
    sortable.sort(function(a, b) {
        return a[1] - b[1];  // list sorting
    });
    for (let i = 1; i <= sortable.length; i++) {
        diz[sortable[i-1][0]] = sortable[sortable.length - i][1];  // insert new elements in dict
    }
}

function check_score(list, s){
    let keys = Object.keys(list);
    for (let i = 0; i < keys.length; i++) {
        if (s > list[keys[i]]) { 
            return true;
        }
    }
    return false;
}

wsServer.on("request", request => {
    // connect
    const connection = request.accept(null, request.origin);
    connection.on("message", message => {
        const result = JSON.parse(message.utf8Data); // message.utf8Data IF give errors
        // request from user to create a new game
        if (result.method == "create") {
            console.log(result.nickname, "ha richiesto al server -> CREATE LOBBY");
            const clientId = result.clientId;
            const nickname = result.nickname;
            const score =  result.score;
            try{
                games[clientId] = {
                    'clientId': clientId,
                    'nickname': nickname
                };
            }
            catch(e){
                console.log("Problemi con l'aggiunta della lobby...", e.code, e.message);
            }
            connection.on("close", () => {
                delete games[clientId];
                //console.log("Leaderboard: ", leaderboard);
                //console.log("Games: ", games);
                console.log(clientId, " ha chiuso la connessione !");
            });
            console.log("Lobby attuali...");
            console.log(games);
            const payLoad = {
                "method": "create",
                "clientId": clientId
            }
            const con = clients[clientId].connection;
            con.send(JSON.stringify(payLoad));
        }
        if (result.method == "get_lead") {
            const payLoad = {
                "method": "get_lead",
                "leaderboard": leaderboard
            }
            const con = clients[clientId].connection;
            con.send(JSON.stringify(payLoad));
        }
        if (result.method == "update_lead") {
            const nickname = result.nickname;
            const score = result.score;
            if (Object.keys(leaderboard).length < 3) {
                leaderboard[nickname] = score;
                up_lead = manage_lead(leaderboard);
            }
            else{
                if (check_score(leaderboard, score)) { 
                    leaderboard[nickname] = score;
                    up_lead = manage_lead(leaderboard);
                }
            }
            console.log(leaderboard);
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


