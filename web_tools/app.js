// 加载 http 模块
var http = require("http");

// 加载 fs 模块
var fs = require("fs");

// 加载 path 模块
var path = require("path");

// 解析post方法中的payload
var parse_post_body = function (req, sort_req) {
    var arr = [];
    var chunks;

    req.on('data', function(buff){
        arr.push(buff);
    });

    req.on('end', function(){
        chunks = Buffer.concat(arr);
        sort_req(chunks);
    });
};
// 创建服务器
http.createServer(function (request, response) {
  	// 如果链接的路径是 / 或者 /index 时，返回的页面的 index 页面
  	url_obj = request.url.split("/")
  	url_len = url_obj.length
  	if (request.url === '/' || request.url === '/index') {
    	filePath = path.join(__dirname, "Index.htm");
    	// 使用 fs.readFile 读取 html 文件, callback 有两个参数，一个是 err,一个是 data
    	// err：错误警告
    	// data：读取到的数据
    	fs.readFile(filePath, function (err, data) {
      		// 如果出现错误就抛出 err，没出错就把 html 页面返回给浏览器
      		if (err) {
        		throw err;
			} 
			else {	
        		response.end(data);
      		}
    	});
	}
  	else if (url_obj[url_len-1] === "json_data.json"){
		var request_data;
    	parse_post_body(request, function sort_req(chunks){
			request_data = Array.from(chunks.toString()).sort().join("").replace(/"/g,"")    
		});

    	filePath = path.join(__dirname, request.url);
		filePath = filePath.split("?")[0]
    	fs.readFile(filePath, function (err, data) {
       	 	// 如果出现错误就抛出 err，没出错就把json数据返回给浏览器
        	if (err) {
          		throw err;
        	} 
        	else {
				data = JSON.parse(data.toString())
				return_data = JSON.stringify(data[request_data])
            	response.end(return_data);
        	}
      	});
  	}
  	else {
    	filePath = path.join(__dirname, request.url);
    	filePath = filePath.split("?")[0]
    	fs.readFile(filePath, function (err, data) {
			response.end(data);
    	//   if (err) {
    	//     throw err;
    	//   } else {
    	//     response.end(data);
    	//   }
    	});
  	}
}).listen(8080, function () {
  console.log("OK,访问：localhost:8080");
});