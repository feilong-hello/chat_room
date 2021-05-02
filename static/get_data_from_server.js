//在页面显示聊天内容
var uuid;
function showMessage(data, type) {
    if (type == "name") {
        $("#name").html(data);
    } else if (type == "uuid") {
        uuid = data;
    } else if (type == "list") {
        var ch;
        $("#conn_list").empty();
        for (var i in data){
            ch = $("<span></span>").text(data[i])
            $("#conn_list").append(ch).append("<br/>");

        }
    } else {
     
        var div = document.createElement("div");
        div.innerHTML = data;
        if (type == "enter") {
            div.style.color = "blue";
        } else if (type == "leave") {
            div.style.color = "red";
        }
        let msg = document.getElementById('msg');
        msg.appendChild(div);
        msg.scroll1p = msg.scrollHeight; 
    }
}

//新建一个websocket
var websocket = new WebSocket("ws://www.dage.world:3101");
//打开websocket连接
websocket.onopen = function () {
    console.log('已经连上服务器----')

    function send() {
        var txt = document.getElementById("sendMsg").value;
        if (txt) {
            //向服务器发送数据
            websocket.send(JSON.stringify({"type":"message", "value": txt, "uuid": uuid}));
            document.getElementById("sendMsg").value = "";
        } else {
            warning_prompt("消息不能为空")
        }
    }

    document.getElementById("change").onclick = function () {
        let new_name = document.getElementById("new_nickname");
        if (new_name.value == "") {
            warning_prompt("昵称不能为空！")
        } else {
            console.log(new_name.value);
            websocket.send(JSON.stringify({"type":"nick name","value": new_name.value, "uuid": uuid}))
        }
    }

    document.getElementById("submitBtn").onclick = send;
    document.getElementById("sendMsg").onkeypress = function () {
        if (event.keyCode == 13) {
            send()
        }
    }
}
//关闭连接
websocket.onclose = function () {
    console.log("websocket close");
}
//接收服务器返回的数据
websocket.onmessage = function (e) {
    var mes = JSON.parse(e.data);
    
    showMessage(mes.data, mes.type);
}
