let wss = require("ws").Server;
let fs = require("fs");
let messages = JSON.parse(fs.readFileSync("history.json","utf-8"));
let server = new wss({port:591},function(){
    console.log("Сервер запущен!");
});
let clients = new Set();

server.on("connection", function(socket){    
    clients.add(socket);
    socket.send(JSON.stringify(messages));
    socket.on("message", function(message){
        messages = messages.concat(JSON.parse(message));
        for (let i of clients){
            i.send(message);
        }
        fs.writeFileSync("history.json", JSON.stringify(messages));
    });
    socket.on("close", function(){
        clients.delete(socket);
    });
});