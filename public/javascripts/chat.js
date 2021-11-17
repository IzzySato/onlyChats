//client side socket coding
const socket = io();

//let username;
const chats = document.querySelector('.chats');
const users_list = document.querySelector('.users-list');
const users_count = document.querySelector('.users-count');
const msg_send = document.querySelector('#user-send');
const user_msg = document.querySelector('#user-msg');
const mainDiv = document.querySelector('#chatMain');
const username = mainDiv.dataset.username;


//So this logic is basically saying that keep asking for the username
//I think here we will handle the user sign in and stuff
//uggh
// do {
//     username = prompt("Enter your username: ") 
// } while(!username);

socket.emit("new-user-joined", username);

//Getting the user joined stuff to work
socket.on("user-connected", (socket_name) => {
    userJoinLeft(socket_name, 'joined');
});

socket.on("user-disconnected", (user) => {
    userJoinLeft(user, 'left');
});


const userJoinLeft = (name, status) => {
    let div = document.createElement("div");
    div.classList.add("user-join");
    let content = `<p><b>${name}</b> ${status} the chat</p>`;
    div.innerHTML = content;
    chats.appendChild(div);
    chats.scrollTop = chats.scrollTop;
};

socket.on('user-list', (users) => {
    users_list.innerHTML = "";
    const users_arr = Object.values(users);
    for(let i = 0; i < users_arr.length; i++) {
        let p = document.createElement('p');
        p.innerText = users_arr[i];
        users_list.appendChild(p);
    }
    users_count.innerHTML = users_arr.length;
});


msg_send.addEventListener('click' , () => {
    let data = {
        user: username,
        msg: user_msg.value
    };
    if(user_msg.value != '') {
        appendMessage(data, 'outgoing');
        //need to handle the emits in the server
        socket.emit('message', data);
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

//This is when the message is send by one client to the server and then the server broadcasts the message back again to all the users.
socket.on('message', (data) => {
    appendMessage(data, 'incoming');
})