let text     = $("#text"),
    chat     = $("#chat"),
    chat_body= $("#chat_body"),
    name     = $("#name"),
    chatname = $("#chatname"),
    message  = $(".message"),
    ws;

chatname.change(function (event) {
    if (ws) {
        ws.close();
        ws = null;
    }
    ws = new WebSocket(chatname.val());

    ws.onmessage = function (message_ws) {  
        let message_in = JSON.parse(message_ws.data);
        let message_field = `<div class="message alert alert-light ${message_in.name == name.val() ? "message-right" : "message-left"}">
                                <div class="username">${message_in.name}</div>
                                <div class="usertext">${message_in.text}</div>
                            </div>`;
        chat.append(message_field);
        chat_body.scrollTop(chat.height());
    };

    ws.onopen = function () {
        text.keyup(function (event) {
            if (event.which === 13 && name.val() && text.val()) {
                let message_out = {
                    name: name.val(),
                    text: text.val(),
                }
                ws.send(JSON.stringify(message_out));
                text.val("");
            }
        });
    };
})
chatname.trigger("change");