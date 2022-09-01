// declarações básicas.
var rate = 9600;
var fs   = require('fs');
const SPort = require('serialport');

var express = require('express'),
    app     = express(),
    server  = require('http').Server(app),
    io      = require('socket.io')(server),
    port    = 8888;

var Serial = new SPort.SerialPort(
    {path: '/dev/cu.usbserial-2220', baudRate: 9600}
)
Serial.on('error', function(err){
    console.log('Erro : '+ err.message);
});
Serial.on('open', function(){
    console.log('Porta aberta');
});
Serial.on('data', function(data){
    console.log(data.toString('utf-8'));
    io.emit('data',{data:data.toString('utf-8')});
});

server.listen(port, ()=> console.log('Server escutando em '+port));

app.get('*', function(req, res){

    fs.readFile(__dirname + '/index.html','utf-8',function (err,data){
        if (err){
            res.writeHead(500);
            return res.end('Erro ao carregar o arquivo index.html');
        }
        res.writeHead(200, {'Content-Type':"text/html; charset=utf-8"});

        var result = data;
        res.end(result);

    });
});
io.on('connection', onConnection);

var connectedSocket = null;
function onConnection(socket){
    connectedSocket = socket;
    connectedSocket.on('send', function(data){
        console.log(data);
        Serial.write(data.Data);
    });
}
