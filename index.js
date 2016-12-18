var express = require('express');
var app = express();
var http = require('http');
var ent = require('ent'); // Permet de bloquer les caractères HTML (sécurité équivalente à htmlentities en PHP)
var fs = require('fs');
var path = require('path');

var server = http.createServer(app);
var io = require('socket.io').listen(server)


// chargement du fichier html
app.get('/', function(req, res){
	res.sendfile(__dirname+'/index.html');
});
io.sockets.on('connection', function(socket, pseudo){
	socket.on('nouveau_client', function(pseudo){
		pseudo = ent.encode(pseudo);
		socket.pseudo = pseudo;
		socket.broadcast.emit('nouveau_client', pseudo);
		
		// si un cliet quitte le chat 
	socket.on('disconnect', function() {
      socket.broadcast.emit('exit_client', pseudo);
   });
	} );
	 // Dès qu'on reçoit un message, on récupère le pseudo de son auteur et on le transmet aux autres personnes
    socket.on('message', function (message) {
        message = ent.encode(message);
        socket.broadcast.emit('message', {pseudo: socket.pseudo, message: message});
    }); 
	
});



server.listen(8080)