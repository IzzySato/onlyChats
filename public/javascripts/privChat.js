const socket = io();
import crypto from "../../app";
// ONE ON ONE CHATTING HERE
const chats = document.querySelector('.chats');
const msg_send = document.querySelector('#user-send');
const user_msg = document.querySelector('#user-msg');
const mainDiv = document.querySelector('#chatMain');
const username = mainDiv.dataset.username;


socket.emit("private-connection", username);

let privateUsersClient = [];

//socket.emit("private-connection", friendData);
//I can get you keys here

//{a, b}

//How do I toggle between knowing who is the sender and who is the reciever

socket.on("encryption", (privateUsers) => {
    console.log("DEBUG, printi  ng the private users on the client side");
    privateUsersClient = privateUsers;
    console.log(privateUsers);
    console.log("DEBUGGGGGG");
    console.log(privateUsersClient);  
})




msg_send.addEventListener('click' , () => {
    //SENDER
    let data = {
        user: username,
        //this the value that we need to encrypt and decrypt
        msg: user_msg.value,
        id: socket.id
    };
    let userSharedKey;
    for(let i= 0; i < privateUsersClient.length; i++) {
        if (privateUsersClient[i].id === socket.id) {
            userSharedKey = privateUsersClient[i].key;
        }
    }
    const IV = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
        'aes-256-gcm',
        Buffer.from(userSharedKey, 'hex'),
        IV
    );

    let encrypted = cipher.update(data.msg, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const auth_tag = cipher.getAuthTag().toString('hex');

    const payload = IV.toString('hex') + encrypted + auth_tag;

    const payload64 = Buffer.from(payload, 'hex').toString('base64');
    console.log(payload64);
    //payload one is the encrypted message
    if(user_msg.value != '') {
        appendMessage(data, 'outgoing');
        //need to handle the emits in the server
        socket.emit('priv-message-outgoing', payload64);
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