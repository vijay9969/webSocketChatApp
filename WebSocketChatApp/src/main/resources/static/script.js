var stompClient = null
function connect(){

    let socket = new SockJS("/server1")

    stompClient = Stomp.over(socket)

    stompClient.connect({},function(frame){
        console.log("connected :"+frame)
        $("#name-from").addClass('d-none')
        $("#chat-room").removeClass('d-none')

        stompClient.subscribe("/topic/return-to",function(responce){
            showMessage(JSON.parse(responce.body))
        })
    })

}

function sendMessage(){
    let jsonObj = {
        name:document.getElementById("name-title").innerText,
        content:$("#message-value").val()
    }
    stompClient.send("/app/message",{},JSON.stringify(jsonObj));
}

function showMessage(message){
$("#meassage-container-table").prepend(`<tr><td><b>${message.name}: <b>${message.content}</td></tr>`)
}
$(document).ready(e=>{
   $("#login").click(()=>{
    let name = $("#name-value").val()
    localStorage.setItem("name",name)
    $("#name-title").text(name)
    connect();
   })
   $("#send").click(()=>{
    
    sendMessage();
   })
   $("#logout").click(()=>{
    localStorage.removeItem("name")
    if(stompClient!=null){
        stompClient.disconnect()
        $("#name-from").removeClass('d-none')
        $("#chat-room").addClass('d-none')
    }
   })
})