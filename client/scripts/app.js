// YOUR CODE HERE:
$(document).ready(function (){
  app.init();
  $("#send").on('submit', function(event){
    event.preventDefault();
    app.handleSubmit();  
  });      

  $("#roomSelect").change(function(){
    event.preventDefault(); 
    event.stopPropagation();
    var dropDownVal = $("#roomSelect").find(':selected').val();
    if(dropDownVal === "ADD NEW ROOM..."){
      var newRoom = (prompt('Enter new room name'))
      newRoom.replace(/"/g, '\\\"');
      app.renderRoom(newRoom);
      $("#roomSelect").val(newRoom);
    }
    app.fetch();
  });

  $("#chats").on('click', '.username', function(event){
    event.preventDefault();
    event.stopPropagation();
    var eventData = $(event.target).html();

    app.handleUsernameClick(eventData);  
  });   
});

var app = {
  server: 'http://127.0.0.1:3000/classes/messages',
  rooms: {},
  lastMesgID: 0,
  init: function(){
    app.fetch();    

    setInterval(function (){app.fetch()},3000);
  },
  send: function(message){
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },
  fetch: function(){
    var roomName = $("#roomSelect").val();

    var that = this;
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: app.server,
      type: 'GET',
      // data: {where:JSON.stringify({roomname: roomName}),limit: 1000, order: '-createdAt'},
      //data: {limit: 1000, order: '-createdAt'},
      //data: {limit: 1000},
      contentType: 'application/json',

      success: function (data) {       
        var results = data.results;

        var mostRecentMesgID = results[results.length-1].objectID;
        // if(mostRecentMesgID !== app.lastMesgID){
        //   app.renderRoomList(results); 
        //   that.lastMesgID = mostRecentMesgID; 
        // }
        console.log(roomName)
        app.renderRoomList(results); 

        if(roomName){
          results = _.filter(results,function(obj){return obj.roomname === roomName});
        }

        that.clearMessages();
        for(var i of results){
          that.renderMessage(i);
        }

        console.log('chatterbox: Message received');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to fetch message', data);
      }
    });
  },
  clearMessages: function (){
    $('#chats').html('');
  },
  renderMessage: function (message){
    var $chatContainer = $('#chats')
    var $chat = $('<div>').addClass('chat').appendTo($chatContainer)
    var $userName = $('<div>').appendTo($chat).text(message.username).addClass('username').attr('data-username',message.username);
    
    $('<div>').appendTo($chat).text(message.text).addClass('text');
    $('<div>').appendTo($chat).text(message.roomname);
    $('<div>').appendTo($chat).text(message.createdAt);
  },
  renderRoom: function (roomName){
    var $roomSelect = $('#roomSelect');
    var $newRoomDrop = $('<option>').text(roomName).attr({'value': roomName});
    $newRoomDrop.appendTo($roomSelect);
  },
  handleSubmit: function (){
    var inputText = $('#send').find('#message').val();
    var userName = window.location.search.split("=").slice(-1).toString();

    var message = {'username': userName,
      'text': inputText,
      'roomname': $("#roomSelect").val()
    };

    this.send(message);
    $('#send').find('#message').val('');
    this.clearMessages();
    this.fetch();
  },
  handleUsernameClick: function (userName){
    var selector = $('[data-username="'+ userName.replace(/"/g, '\\\"') + '"]');
  
    selector.toggleClass('friend');
  },
  renderRoomList: function (messages){
    app.rooms = {};
    messages.forEach(function (message){
      var roomname = message.roomname;
      if (roomname && !app.rooms[roomname]){
        app.renderRoom(roomname);
        app.rooms[roomname] = true;
      }
    });
  }
};



