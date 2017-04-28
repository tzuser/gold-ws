var phantom = require('phantom');
var md5 = require('md5')
var WebSocket = require('ws');
var ws=new WebSocket("ws://localhost:8888?token=tzuser");

/*ws.on('message',function incoming(data,flags){
	console.log(data,flags);
})*/
const start=async (url,ws)=>{
	const instance=await phantom.create();
	const page=await instance.createPage();
	await page.property("onResourceRequested",function(requestData,networkRequest){
		if(requestData.url.indexOf("google.com")!=-1 || requestData.url.indexOf(".png")!=-1 || requestData.url.indexOf(".jpg")!=-1 || requestData.url.indexOf("fonts.googleapis.com")!=-1 ){
			networkRequest.abort();
			console.info('忽略:',requestData.url )
		}else{
			console.info('请求:',requestData.url )
		}
	})
	const status=await page.open(url);
	console.info('Status: ' +status )
	await page.render('./'+md5(url)+'.jpeg', {format: 'jpeg', quality: '100'});
	let pdata={};
	setInterval(()=>{update(page)},20);
	const update=(page)=>{
		page.evaluate(function() {
				var name=document.getElementsByClassName('float_lang_base_1')[0].textContent.trim();
				var type=name.split('-')[0].trim();
				var price=document.getElementById('last_last').textContent;
				var time=document.getElementsByClassName('lighterGrayFont arial_11')[0].textContent;
				time=time.trim();
				time=time.split('-')[0].trim();
				var dataElement=document.getElementsByClassName('bottomText float_lang_base_1')[0];
				var lis=dataElement.getElementsByTagName("li");
				var low=lis[2].getElementsByTagName("span")[1].getElementsByTagName("span")[0].textContent;
				var high=lis[2].getElementsByTagName("span")[1].getElementsByTagName("span")[1].textContent;
		        return {name:name,type:type,price:price,time:time,high:high,low:low}
		    }).then(function(data){
		    	if(data.price!=pdata.price || data.time!=pdata.time){
		    		console.log(`Type:${data.type} Price:${data.price} Time:${data.time} High:${data.high} Low:${data.low}`);
		    		data.action="SET_DATA";
		    		ws.send(JSON.stringify(data));//发送数据
				}
				pdata=data;
			}).catch((err)=>{
				console.log(err);
			});
	}
	//await instance.exit();
}


//start("https://www.investing.com/currencies/btc-usd");
ws.on('open',function open(){
		start("https://www.investing.com/commodities/gold",ws);
})

/*start("https://www.investing.com/indices/us-spx-500-futures");*/