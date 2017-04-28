var WebSocket = require('ws');
var url=require('url');
var {URLSearchParams} = url;
var wss=new WebSocket.Server({
	perMessageDeflate:false,
	port:8888
})
var clients=[];
wss.on('connection',function connection(ws){
	var urldata=url.parse(ws.upgradeReq.url);
	var params=new URLSearchParams(urldata.query);
	if(params.get('token')!="tzuser"){
		ws.terminate();
		console.log('认证失败!')
		return;
	}
	ws.on('message',function incoming(message){
		var data=JSON.parse(message);
		if(data.action=="SET_DATA"){
			sendMessageAll(data);
		}
		console.log(data);
	});
	clients.push(ws);
	ws.send('服务器连接成功!');
})


var sendMessageAll=(data)=>{
	for(var key in clients){
		var ws=clients[key];
		ws.send(JSON.stringify(data));
	}
}

