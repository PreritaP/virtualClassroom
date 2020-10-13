const socket = io()

setTimeout(function(){
    const {id, name, role, room} = Qs.parse(location.search, {ignoreQueryPrefix: true});
    socket.emit('join', {id, name, role, room});
    socket.emit('disconnect', {id, name, role, room});
    socket.on('data', {id, name, role, room});
    if(role == 1){
        document.querySelector('#startClass').classList.add("hide");
        document.querySelector('#endClass').classList.add("hide");
    }

    const messageTemplate = document.querySelector('#message-template').innerHTML
    
    socket.on('message', (message) => {
        const html = Mustache.render(messageTemplate, {msg: message})
        document.querySelector('#notiList').innerHTML += html;
    })

    socket.on('teacherlist', (name) => {
        let teacherList = JSON.parse(name);
        let html = "";
        Object.keys(teacherList).forEach(key => { 
            let teacherName = teacherList[key];
            html += Mustache.render(messageTemplate, {msg: teacherName})
        });
        document.querySelector('#teacherList').innerHTML = html;
    })

    socket.on('studentlist', (name) => {
        let studentList = JSON.parse(name);
        let html = "";
        Object.keys(studentList).forEach(key => {
            let studentName = studentList[key];
            html += Mustache.render(messageTemplate, {msg: studentName})
            
        });
        document.querySelector('#studentList').innerHTML = html;
    })

    document.querySelector('#startClass').addEventListener('click',(e) => {
		e.preventDefault()
		socket.emit('startclass', {id, name, role, room})
    })

    document.querySelector('#endClass').addEventListener('click',(e) => {
		e.preventDefault()
		socket.emit('endclass', {id, name, role, room})
    })

    socket.on('class',(res) => {
        if (res.start == true){
            if(role == 0){
                document.querySelector('#startClass button').disabled = true
                document.querySelector('#endClass button').disabled = false
            }
        } else if(res.start == false) {
            if(role == 1){
                document.querySelector('.main-content').innerHTML = "Class ended successfully";
            } else {
                document.querySelector('#startClass button').disabled = false
                document.querySelector('#endClass button').disabled = true
            }
        }
    })

    document.querySelector('#leaveClass').addEventListener('click',(e) => {
        console.log('leave');
		e.preventDefault()
		socket.emit('leaveclass', {id, name, role, room})
    })

    socket.on('leave', (res) => { 
        document.querySelector('.main-content').innerHTML = 'SUCCESSFULLY LEFT CLASS';
    })
    
}, 10);