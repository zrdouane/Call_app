// const { Socket } = require("dgram");
const express = require("express");
const app = express();
// const port = 3000;
const server = require("http").Server(app);
// const { v4: uuidv4 } = require("uuid");
const { v4: uuidv4, validate: uuidValidate } = require("uuid");
const io = require("socket.io")(server);
const { ExpressPeerServer } = require('peer');

const peerServer = ExpressPeerServer(server, {
	debug : true
});

app.set("view engine", "ejs");

app.use(express.static("Public"));

app.use('/peerjs', peerServer);


// set the home page.
app.get('/', (req, res) => {
	// const __dirname = '/Users/macbookair2017/Desktop/clone_zoom/views';
	// res.sendFile(__dirname + '/anime.html');
	res.render('anime');
});

// app.get('/room', (req, res) => {
// 	res.redirect(`/${uuidv4()}`);
// });

// app.get('/:room', (req, res) => {
// 	res.render("room",{ roomId : req.params.room })
// });

// generate id and redirecte to /:room
app.get('/room', (req, res) => {
	const roomId = uuidv4();
  
	// Redirect only if the generated roomId is valid
	if (uuidValidate(roomId)) {
	  res.redirect(`/${roomId}`); /* check if the room id generated. */
	} else {
	  res.status(500).send("Failed to generate a valid room ID."); /* if the id not generated response with http status 500(internal server problem) */
	}
});

// set a middleware to home page & fix the old probleme of acces to call without the right id.
app.get('/:room', (req, res, next) => {
	const roomId = req.params.room;
	
	// Block access to invalid room IDs
	if (!uuidValidate(roomId)) {
		res.render('404'); /* if the room id not the same as generated render me the 404 page with status of 404*/
	  return res.status(404); /* give me the status of 404 */
	}
	
	res.render("room", { roomId });
});
  
// set the connection with socket.io to connect with to user
io.on('connection', socket => {
	socket.on('Join-room', (roomId, userId) => {
		socket.join(roomId)
		socket.to(roomId);
		io.emit('user-connected', userId);
		socket.on('message', message => {
			io.to(roomId).emit('createMessage', message)
		});
	})
});


server.listen(process.env.PORT||3030);
