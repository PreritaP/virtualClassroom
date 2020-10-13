const socket = io()

socket.on('message', (message) => {
	console.log(message)
})

setTimeout(function(){ 
	document.querySelector('.input_form').addEventListener('submit',(e) => {
		e.preventDefault()
		const name = document.querySelector('#name').value
		const role = document.querySelector('#role').value
		const classId = document.querySelector('#classId').value
		socket.emit('enterclass', name, role, classId)
	})
}, 2000);

socket.on('login', (data) => {
	if (data.status == true) {
		if(data.role == 2) {
			window.location = "http://15.207.222.108:8095/history?room="+data.room;
		} else {
			window.location = "http://15.207.222.108:8095/classRoom?id="+data.response.visitorId+"&name="+data.name+"&role="+data.role+"&room="+data.class;
		}
	} else {
		document.querySelector('.main-content').innerHTML = data.response.message;
	}
})