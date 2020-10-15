global.__basePath 	= process.cwd() + '/';
const app 			= require(__basePath + 'app/app.js');
const config 		= require(__basePath + 'app/core/configuration');
const port 			= process.env.NODE_PORT || config.get('server:index:port');
const http 			= require('http');
const socketio 		= require('socket.io');
const server 		= http.createServer(app);
const io 			= socketio(server);
const axios 		= require('axios');

var studentList = {} ;

var teacherlist = {} ;
io.on('connection', (socket) => {
	console.log('New websocket connection')

	socket.on('join', ({id, name, role, room}) => {
		socket.join(room);
		socket.emit('message', 'Welcome!!')
		socket.broadcast.to(room).emit('message', `${name} has joined.`)
		if( role ==1) {
			studentList[id]= name ;
		} else if (role == 0) {
			teacherlist[id]= name ;
		}
		io.in(room).emit('studentlist', `${JSON.stringify(studentList)}`);
		io.in(room).emit('teacherlist', `${JSON.stringify(teacherlist)}`);
	})

	socket.on('enterclass', (name, role, room) => {
		if (role == 2) {
			socket.emit('login', {status: true, role:2, room:room});
		} else {
			axios.post('http://15.207.222.108:8095/addVisitor', {
					"name" : name,
					"role" : role,
					"class" : room
			}).then(res => {
				if(res.data.status ==  true) {
					console.log(res.data);
					res.data['name'] = name;
					res.data['role'] = role;
					res.data['class'] = room;
					if (role == 0)
						io.emit('teacherlist', `${name}`);				
				}
				socket.emit('login', res.data);
			}).catch(error => {
				console.error(error)
			})
		}
	})

	socket.on('startclass', ({id, name, role, room}) => {
		axios.post('http://15.207.222.108:8095/classAction', {
			"isStart" : 1,
			"classTeacher" : name,
			"classTeacherId" : id,
			"classRoom" : room
		}).then(res => {
			if(res.data.status ==  true) {
				io.sockets.in(room).emit('message', 'Class Started');
				io.sockets.in(room).emit('class', {"start":true});
			}
		}).catch(error => {
			console.error(error)
		})
	})

	socket.on('endclass', ({id, name, role, room}) => {
		axios.post('http://15.207.222.108:8095/classAction', {
			"isStart" : 0,
			"classTeacher" : name,
			"classTeacherId" : id,
			"classRoom" : room
		}).then(res => {
			if(res) {
				studentList = {} ;
				teacherlist = {} ;
				io.in(room).emit('studentlist', `${JSON.stringify(studentList)}`);
				//io.in(room).emit('teacherlist', `${JSON.stringify(teacherlist)}`);
				io.sockets.in(room).emit('message', 'Class Ended');
				io.sockets.in(room).emit('class', {"start":false});
			}
		}).catch(error => {
			console.error(error)
		})
	})

	socket.on('leaveclass', ({id, name, role, room}) => {
		axios.get('http://15.207.222.108:8095/leaveClass/'+id).then(res => {
			if(res.data.status ==  true) {
				if( role ==1) {
					delete studentList[id];
				} else if (role == 0) {
					delete teacherlist[id];
				}
				socket.broadcast.to(room).emit('message', `${name} has left the class`);
				io.in(room).emit('studentlist', `${JSON.stringify(studentList)}`);
				io.in(room).emit('teacherlist', `${JSON.stringify(teacherlist)}`);
				socket.emit('leave', {status: true});
			}
		}).catch(error => {
			console.error(error)
		})
	})

	socket.on('getlogs', ({room}) => {
		axios.get('http://15.207.222.108:8095/showClassHistory/'+room).then(res => {
			if(res.data.status ==  true) {
				socket.emit('history', res.data.response);
			}
		}).catch(error => {
			console.error(error)
		})
	})
})

server.listen(process.env.PORT || port, function () {
    console.log(`Listening port ${port}`);
});