var messageTxt;
var messages;





$("#login-btn").on("click" , function(){

	username_val = $( $.parseHTML($("#username").val()) ).text()

	if(username_val != ""){
		localStorage.setItem('username',username_val);
	    window.location.reload()
	}else{
		alert("you should required fields ");
	}
});





$(function () {


	messageTxt = $("#messageTxt");
	messages = $("#messages");
   
    username = localStorage.getItem("username");




	ws = new WebSocket("ws://localhost:8000/ws");
	   	ws.onopen = function(e) {
			$("#sendBtn").click(function () {
				if (messageTxt.val() != "") {
				 	ws.send(
	                    JSON.stringify({
	                        username:username,
	                        message:  $( $.parseHTML(messageTxt.val()) ).text(),
	                    }
			        ));
					messageTxt.val("");
				}else{
					alert('Enter some value');
				}
			});
			if(username != null){
				ws.send(
			        JSON.stringify({
			            username:username,
			            login: true
			        }
			    ));        
			}
		}




   
	//get messages
	 ws.addEventListener("message", function(event) {
	       	const msg = JSON.parse(event.data)

	       	$onlineIcon = "<span style='color:#00B16A;font-size:11px;'><i class='fa fa-circle' aria-hidden='true'></i></span>";
	       	if(msg.Login != true){
	       		appendMessage($("<div class='message-bubble'>"+ "<p class='text-muted'>"+msg.Username +" </p>" + "<b>" + msg.Message + "</b>" + "</div>"));
	       	}else{
	       		$('#Peopleonline').append('<li class="list-group-item" id="'+msg.Username+'">'+ $onlineIcon+" "+msg.Username+'</li>')
	       	}
	});

});



 $('#messageTxt').keypress(function(e){
        if(e.which == 13){			//Enter key pressed
            $('#sendBtn').click();	//Trigger search button click event
        }
    });


function appendMessage(messageDiv) {
    var theDiv = messages[0];
    var doScroll = theDiv.scrollTop == theDiv.scrollHeight - theDiv.clientHeight;
    messageDiv.appendTo(messages);
    if (doScroll) {
        theDiv.scrollTop = theDiv.scrollHeight - theDiv.clientHeight;
    }
}