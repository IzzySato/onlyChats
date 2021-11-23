const socket = io();

// ONE ON ONE CHATTING HERE
const chats = document.querySelector('.chats');
const msg_send = document.querySelector('#user-send');
const user_msg = document.querySelector('#user-msg');
const mainDiv = document.querySelector('#chatMain');
const username = mainDiv.dataset.username;
// const myEmail = mainDiv.dataset.email;
// const friendData = {};

// const getFriendsData = () => new Promise((res, req) => {
//   fetch('/addFriend/data')
//   .then(res => res.json())
//   .then(json => {
//     // friendData.friends = json;
//     friendData.friends = json.filter(f => f.email === myEmail);
//     console.log(JSON.stringify(friendData.friends));
//     res();
//   });
// });

// getFriendsData();

socket.emit("private-connection", getFriendsData());


//socket.emit("private-connection", friendData);


msg_send.addEventListener('click' , () => {
    let data = {
        user: username,
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