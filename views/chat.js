function activateQPopup() {
    document.getElementsByClassName('ask-popup')[0].style.display = "flex";
}            

function deactivateQPopup() {
    document.getElementsByClassName('ask-popup')[0].style.display = "none";
}        

function addUserMsg(que) {
    var chat = document.getElementsByClassName('chatinner')[0];
    var msg = document.createElement('div');
    var wrap = document.createElement('div');
    wrap.appendChild(msg);
    msg.innerHTML = que;
    msg.className = "usermsg";
    wrap.className = "userwrap";
    chat.appendChild(wrap);
    chat.scrollIntoView(false);
    window.scrollBy(0, 200);
}

function addBotMsg(que) {
    var chat = document.getElementsByClassName('chatinner')[0];
    var msg = document.createElement('div');
    var wrap = document.createElement('div');

    wrap.appendChild(msg);
    msg.innerHTML = que;
    msg.className = "botmsg";
    wrap.className = "botwrap";

    var info = document.createElement('div');
    info.className = 'ask';
    info.addEventListener("click", activateQPopup);
    wrap.appendChild(info);

    chat.appendChild(wrap);
    chat.scrollIntoView(false);
    window.scrollBy(0, 200);
}
    

function sendQue() {
    var userInput = document.getElementById("user-input-text");
    var que = userInput.value;
    if (que == "") {
        alert('Cannot send an empty message!')
        return NaN
    }

    userInput.value = "";

    addUserMsg(que);

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify({"question":que}),
    };

    fetch("https://rektify-bot.azurewebsites.net/answer/ask", requestOptions)
    .then(response => response.json())
    .then((result) => {
        if (result['success']) {
            addBotMsg(result['answer']);
        } else {
            addBotMsg("Sorry, we couldn't connect to our DB.");
        }
    })
    .catch(error => console.log('error', error));
}
