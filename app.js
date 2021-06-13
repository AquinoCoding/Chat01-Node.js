const { Socket } = require('dgram');
const express = require('express');
const path = require('path');

const app = express();

// Config HTTP para abrir o server
const server = require('http').createServer(app);

// Integração HTTP com SOCKET.IO
const io = require('socket.io')(server);

// Arquivos publicos da aplicação / Arquivos Frontend
app.use(express.static(path.join(__dirname, 'public')));

// Definição de views em HTML ao inves de ejs / Ficará dentro de Public tbm
app.set('views', path.join(__dirname, 'public'));

// Enginee como Html ao inves de ejs
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// Abertura da ROta index.html
app.use('/', (req, res) => {
    res.render('index.html');
});

let messages = [];

io.on('connection', socket => {
    console.log(`Socket conectado: ${socket.id}` );

    socket.emit('previousMessagens', messages);

    socket.on('sendMessage', data => {
        console.log(data);
        messages.push(data);
        socket.broadcast.emit('receveidMessage', data);
    });
});

server.listen(3000);

console.log('\nIniciando...\nSua porta é: 3000\nhttp://localhost:3000/\n');