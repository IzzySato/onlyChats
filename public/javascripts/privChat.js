const socket = io();

// ONE ON ONE CHATTING HERE
const chats = document.querySelector('.chats');
const msg_send = document.querySelector('#user-send');
const user_msg = document.querySelector('#user-msg');
const mainDiv = document.querySelector('#chatMain');
const username = mainDiv.dataset.username;


socket.emit("private-connection", username);


//socket.emit("private-connection", friendData);
//I can get you keys here

//{a, b}

//How do I toggle between knowing who is the sender and who is the reciever

// socket.on("encryption", (data) => {
//     console.log(data);
// })


msg_send.addEventListener('click' , () => {
    //SENDER
    let data = {
        user: username,
        //this the value that we need to encrypt and decrypt
        msg: user_msg.value,
        id: socket.id
    };
    if(user_msg.value != '') {
        appendMessage(data, 'outgoing');
        //need to handle the emits in the server
        socket.emit('priv-message-outgoing', data);
        user_msg.value = '';
    }
});
 
const appendMessage = (data, status) => {
    let div = document.createElement("div");
    div.classList.add('message', status);
    let content = `
    <h5>${data.user}</h5>
    <p>${data.msg}</p>
    `;
    div.innerHTML = content;
    chats.appendChild(div);
    chats.scrollTop = chats.scrollTop;
};


socket.on('priv-message-incoming', (data) => {
    appendMessage(data, 'incoming');
})