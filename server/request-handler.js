/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var fs = require('fs');
var path = require('path');


var requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.

//----------------Pseudocode
//request - POST
    //Define file structure to store the data
    // Store the data as string - inside as an array
    // FS.write to the file 
//response - POST
    // send status codes, headers, success message

  var content = '';


/*
  if(request.method === 'OPTIONS'){
    request.method === 'POST'
  }

  fs.appendFile(__dirname+'/classes/messages/messageData.txt', 'Hello Node12.js', (err) => {
    if(err) throw err;
    console.log("success")
  })
  
  fs.open(__dirname+'/classes/messages/messageData.txt', 'w', function(err, data){
    if(err){
      return console.error(err);
    }
    console.log('data received: '+data.toString() );
  })*/
  
 

 
console.log('dirname ', __dirname);
console.log('pathname ',path.dirname(__filename));

  console.log('Serving request type ' + request.method + ' for url ' + request.url);
  // console.log('request data', request)

  // The outgoing status.
  var statusCode = 200;

  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  headers['Content-Type'] = 'text/plain';
  if(request.url !== '/classes/messages'){
    response.writeHead(404, headers);
    response.end();
  }else if (request.method === 'OPTIONS') {
    response.writeHead(200, headers);
    response.end();
  }else if(request.method === 'POST'){
    //var body =[];
    var res = {results:[]};
    request.on('error', function(err){
      console.error(err);
    }).on('data', function(chunk){
      console.log('chunk',chunk.toString());
      res.results.push(chunk.toString());
      console.log('get res', res);
    });

    // .on('end', function(){
    //   // body = Buffer.concat(body).toString();
    // });
    
    var statusCode = 201;
    response.writeHead(statusCode, headers);
    response.write(JSON.stringify(res))
    response.end();

  }else if(request.method === 'GET'){
    var statusCode = 200;
    var res = {results:[{
      username: 'Jono',
      message: 'Do my bidding!'
    }]};
    response.writeHead(statusCode, headers);
    response.write(JSON.stringify(res));
    response.end();
  }
  
  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  // response.writeHead(statusCode, headers);
  // response.write(JSON.stringify(res));

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
  // response.end('Hello, World!');

};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

module.exports = requestHandler;
