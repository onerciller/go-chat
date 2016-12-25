var messageTxt;
var messages;





$("#login-btn").on("click" , function(){

	username_val = $("#username").val();
	

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
			 ws.send(
		                    JSON.stringify({
		                        username:username,
		                        message:  messageTxt.val()
		                    }
		                )); 

				messageTxt.val("");
			});          
}



//get messages
 ws.addEventListener("message", function(event) {
        const msg = JSON.parse(event.data)
       appendMessage($("<div class='row message-bubble'>"+ "<p class='text-muted'>"+msg.Username +" </p>" + "<b>" + msg.Message + "</b>" + "</div>"));
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