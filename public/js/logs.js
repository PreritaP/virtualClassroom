const socket = io()

setTimeout(function(){
    const {room} = Qs.parse(location.search, {ignoreQueryPrefix: true});
    socket.emit('getlogs', {room})
    const table = document.querySelector('#list').innerHTML
    socket.on('history', (res) => {
        res.forEach(element => {
            var html = '<tr><td>'+element['Teacher']+'</td><td>'+element['classStartTime']+'</td><td>'+element['Student']+'</td><td>'+element['student_join']+'</td><td>'+element['student_leave']+'</td><td>'+element['classEndTime']+'</td></tr>';
            document.querySelector('#list').innerHTML += html;
        });        
    })    
}, 10);