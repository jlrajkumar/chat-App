var express = require('express');
var bodyParser= require('body-parser');
var app = express();

var http = require('http');
const server = http.createServer(app);
var io = require('socket.io')(server);
var mongoose = require('mongoose');;

const PORT = 3030;

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

var dbURL = 'mongodb+srv://user:<password>@cluster0.ysxws.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'


var Message = mongoose.model('Message', {
        name:String,
        message:String
})

var messages = [
    {name: '♥ Bot... ♥', message:'Heya!!'}
  
]

app.get('/messages', (req,res)=>{
    res.send(messages);
});


app.post('/messages', (req,res)=>{
    try{
       
        var message = new Message(req.body);

        messages.push(req.body); //If no error save to db
       
        io.emit('message', req.body);
        res.sendStatus(200);

    } catch(error){
        res.sendStatus(500);
        return console.error(error);
    } 
 

  
});

//when user connects
io.on('connection', (socket) => {

    console.log("User connected");
 
});

server.listen(PORT, ()=>{
    console.log(`Listening at port ${PORT}`);
});