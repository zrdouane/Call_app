// const { text } = require("express");

const socket = io('/');
const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
var peer = new Peer(undefined, {
	path : '/peerjs',
	host : '/',
	port : '443'
});
myVideo.muted = true;

let myVideoStream = navigator.mediaDevices.getUserMedia({
	video : true,
	audio : true
}).then(stream => {
	myVideoStream = stream;
	addVideoStream(myVideo, stream);
	// make a answer
	peer.on('call', call => {
		call.answer(stream); /* answer the call */
		const video = document.createElement('video') /* create a new element for the new person */
		// show stream in the zoom
		call.on('stream', userVideoStream => {
			addVideoStream(video, userVideoStream)
		})
	})

	socket.on('user-connected', (userId) => {
		connectToNewUser(userId, stream);
	})
	 
	let text = $('input');
	console.log(text);
	$('html').keydown((e) => {
		if (e.which == 13 && text.val().length !== 0) {
			// console.log(text.val());
			socket.emit('message', text.val());
			text.val('')
		}
	});
	// send message from cote client to cote server to render in other user
	socket.on('createMessage', message => {
		console.log('create message', message);
		$('ul').append(`<li class="message"><b>Zack</b><br/>${message}</li>`);
		// $('ul').append(`<li class="messages"><b>Zack</b><br/>${message}</li>`);
		scrollToBottom()
	})
});

peer.on('open', id => {
	socket.emit('Join-room', ROOM_ID, id);
});

const connectToNewUser = (userId, stream) => {
	const call = peer.call(userId, stream);
	const video = document.createElement('video');
	call.on('stream', userVideoStream => {
		addVideoStream(video, userVideoStream)
	});
};


const addVideoStream = (video, stream) => {
	video.srcObject = stream;
	video.addEventListener('loadedmetadata', () => {
		video.play();
	})
	videoGrid.append(video);
};

// let text = $('input');
// console.log(text);
// $('html').keydown((e) => {
// 	if(e.which == 13 && text.val().length !== 0) {
// 		console.log(text.val());
// 		socket.emit('message', text.val());
// 		text.val('')
// 	}
// });

// socket.on('createMessage', message => {
// 	// console.log('this coming from server', message);
// 	$('ul').append(`<li class="message"><b>user</b><br/>${message}</li>`)
// })

// scroll chat in call app 
const scrollToBottom = () => {
	var d = $('.main__chat_window');
	d.scrollTop(d.prop("scrollHeight"));
}

// set mute and unmute in call
const muteUnmute = () => {
	const enabled = myVideoStream.getAudioTracks()[0].enabled;
	if (enabled) {
		myVideoStream.getAudioTracks()[0].enabled = false;
		setUnmuteButton();
	} else {
		setMuteButton();
		myVideoStream.getAudioTracks()[0].enabled = true;
	}
}

// stop camera in call app 
const playStop = () => {
	console.log('object')
	let enabled = myVideoStream.getVideoTracks()[0].enabled;
	if (enabled) {
		myVideoStream.getVideoTracks()[0].enabled = false;
		setPlayVideo()
	} else {
		setStopVideo()
		myVideoStream.getVideoTracks()[0].enabled = true;
	}
}

// setting the mute button
const setMuteButton = () => {
	const html = `
	  <i class="fas fa-microphone"></i>
	  <span>Mute</span>
	`
	document.querySelector('.main__mute_button').innerHTML = html;
}

// setting unmute button
const setUnmuteButton = () => {
	const html = `
	  <i class="unmute fas fa-microphone-slash"></i>
	  <span>Unmute</span>
	`
	document.querySelector('.main__mute_button').innerHTML = html;
}

// setting the button stop video
const setStopVideo = () => {
	const html = `
	  <i class="fas fa-video"></i>
	  <span>Stop Video</span>
	`
	document.querySelector('.main__video_button').innerHTML = html;
}

// setting the play button to unset the stop video
const setPlayVideo = () => {
	const html = `
	<i class="stop fas fa-video-slash"></i>
	  <span>Play Video</span>
	`
	document.querySelector('.main__video_button').innerHTML = html;
}
