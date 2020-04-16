let text     = $("#text"),
    chat     = $("#chat"),
    chat_body= $("#chat_body"),
    name     = $("#name"),
    chatname = $("#chatname"),
    message  = $(".message"),
    ws;

chatname.change(function (event) {
    $(".message").remove();
    console.log(message);
    if (ws) {
        ws.close();
        ws = null;
    }
    ws = new WebSocket(chatname.val());

    ws.onmessage = function (message_ws) {  
        let message_in = JSON.parse(message_ws.data);
        console.log(message_in);
        message_in.forEach(element => {
            let message_field = `<div class="message alert alert-light ${element.name == name.val() ? "message-right" : "message-left"}">
                                    <div class="username">${element.server}: ${element.name}</div>
                                    <div class="usertext">${element.text}</div>
                                </div>`;
        chat.append(message_field);
        }) 
        
        chat_body.scrollTop(chat.height());
    };

    ws.onopen = function () {
        text.keyup(function (event) {
            if (event.which === 13 && name.val() && text.val()) {
                let message_out = [{
                    server: $("#chatname option:selected").text(),
                    name: name.val(),
                    text: text.val(),
                }];
                ws.send(JSON.stringify(message_out));
                text.val("");
            }
        });
    };
})
chatname.trigger("change");