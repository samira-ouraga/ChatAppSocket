var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

users = [];
connections = [];

server.listen(process.env.PORT || 3000);
console.log('server running ');

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

//open a connection
io.sockets.on('connection', function(socket){
    connections.push(socket);
    console.log('connected: $s sockets connected', connections.length);

    //disconect
socket.on('disconnect', function(data){
      //remove user when they disconnect
    users.splice(users.indexOf(socket.username), 1);
    updateUsernames();

    //remove from list of connections
    connections.splice(connections.indexOf(socket), 1);
    console.log('disconnected: $s sockets still here', connections.length)

  

});

//send msg

socket.on('send_message', function(data){
    console.log(data);
    io.sockets.emit('new_message', {msg:data, user:socket.username});
});

//new user
socket.on('new_user', function(data, callback){
    callback(true);
    socket.username = data;
    users.push(socket.username);
    updateUsernames();
});

function updateUsernames(){
    io.sockets.emit('get_users', users);
}
    

});