const mainDiv = document.querySelector('#userNameDiv');
const myEmail = mainDiv.dataset.email;

const username = mainDiv.dataset.username;
let friendData = [];

const getFriendsData = () => new Promise((res, req) => {
  fetch('/addFriend/data')
  .then(res => res.json())
  .then(json => {
    // friendData.friends = json;
    friendData = json.filter(f => f.email === myEmail);
    console.log(JSON.stringify(friendData));
    appendFriends(friendData);
  })
});

getFriendsData();


const appendFriends = (friendData) => {
  console.log(friendData);
  const div = document.querySelector("#friendsDiv");
  const ul  = document.createElement("ul");
  div.classList.add('friendsUl');
  for(let i = 0; i < friendData.length; i++) {
    const li = document.createElement("li");
    li.classList.add(`myFriend`);
    li.innerHTML = `<div style="transform: translate(25%, 65%)"><a href="/privChat/${friendData[i].friendName}">${friendData[i].friendName}</div></p>`
    ul.appendChild(li);
  }
  div.appendChild(ul);
};



