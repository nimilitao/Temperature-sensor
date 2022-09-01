/* instalar as bibliotecas antes de iniciar
npm install express fs serialport 
*/
// declaro a velocidade da serial do arduino

var rate = 9600;
const { resolveSoa } = require('dns');
// instancio o file sistem
var fs = require('fs');
// instancio a porta serial
const SPort = require('serialport');

// inicializo o express e outros.
var express = require('express'),
    app     = express(),
    server  = require('http').Server(app),
    io      = require('socket.io')(server),
    port    = 8888;


var Serial = new SPort.SerialPort(
    {path: 'COM11', baudRate: rate}
);    
// tratamento de erro
Serial.on('error', function(err){
    console.log('Erro : '+ err.message);
});
// quando inicializa
Serial.on('open', function(){
    console.log('Porta serial aberta');
});
// quando recebe dados.
Serial.on('data', function(data){
    console.log(data.toString('utf-8'));
    io.emit('data',{data:data.toString('utf-8')});
});

server.listen(port, ()=> console.log('escutando na port :'+ port));

app.get('*', function(req,res){

    fs.readFile(__dirname + '/index.html', 'utf-8', function(err,data){
        if (err){
            res.writeHead(500);
            return res.end('Erro ao carregar a pagina');
        }
        res.writeHead(200,{'Content-Type':"text/html; charset=utf-8"});
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

