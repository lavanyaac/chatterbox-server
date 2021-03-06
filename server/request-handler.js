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

var writeFile = function(message) {
  console.log('MESSAGE HERE--------', message);
  fs.readFile('messageData.json', 'utf-8', function(err, data) {
    if (err) {
      return console.error(err); 
    }
    var dataObj = JSON.parse(data);

    dataObj.push(message)
    console.log('DATA IS PUSHED', dataObj)
    fs.writeFile('messageData.json', JSON.stringify(dataObj))
  //   console.log('file is open success!!!!!!!!!', openFile)
  });
}

var readFile = function() {
  // fs.open('messageData.json', 'a', function(err, fd) {
  //   if (err) {
  //     return console.error(err); 
  //   }
    var res;
    fs.readFile('./messageData.json', function(err, data) {
      if (err) {
        return console.error(err);
      }
      res = JSON.parse(data);
      console.log('THIS IS PARSED DATA', res);
    })
    return res;
    // fs.close(fd, function(err) {
    //   if (err) {
    //     return console.error(err);
    //   }
    // })
    // console.log('file is open success!!!!!!!!!', openFile)
  // });
  
} 
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': '*',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'application/json'
};

var objectIdCounter = 1;
var data = {results: []}


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

  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  // The outgoing status.
  var statusCode = 200;

  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  headers['Content-Type'] = 'application/json';

  if (request.url !== '/classes/messages') {
    response.writeHead(404, headers);
    response.end();

  } else if (request.method === 'OPTIONS') {
    response.writeHead(200, headers);
    response.end();

  } else if (request.method === 'POST') {
    request.on('data', function(chunk) {
      var chunkParsed = JSON.parse(chunk.toString());
      chunkParsed.objectID = ++objectIdCounter;
      data.results.push(chunkParsed);
      writeFile(JSON.stringify(chunkParsed));
    });

    var statusCode = 201;
    response.writeHead(statusCode, JSON.stringify(data), headers);
    response.end(JSON.stringify(data));

  } else if (request.method === 'GET') {
    var statusCode = 200;
    var data = readFile();
    console.log('DATA---------------', data)
    response.writeHead(statusCode, headers);
    response.end(JSON.stringify(data));

  } else if (request.method === 'PUT') {
    var statusCode = 201;
    var res = {
      results: [{
        username: 'Jono',
        message: 'Do my bidding minions!'
      }]
    };
    response.writeHead(statusCode, headers);
    response.end(JSON.stringify(res));

  } else if (request.method === 'DELETE') {
    var statusCode = 202;
    var res = {results: []};
    response.writeHead(statusCode, headers);
    response.end(JSON.stringify(res));
  } else {
    response.writeHead(statusCode, headers);
    response.end(statusCode, headers);
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


module.exports.requestHandler = requestHandler;
