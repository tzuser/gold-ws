var WebSocket = require('ws');
var ws=new WebSocket("ws://localhost:8888?token=tzuser");
ws.on('open',function open(){
	console.log('连接成功！')
})
ws.on('message',function incoming(data,flags){
	console.log(data,flags);
})