import * as Signup from './signup.js';
import * as Login from './login.js';
import * as Util from './util.js';
import * as AddFriend from './addFriend.js';
import * as User from './user.js';

//handling button clicks
const processClick = (target) => {
  if(target.matches('#signupBtn')) {
    const username = document.querySelector('#newUsername').value;
    const email = document.querySelector('#newEmail').value;
    const password = document.querySelector('#newPassword').value;
    Signup.signup(username, email, password);
  }

  // add Friends
  if(target.matches('#addFriendbtn')) {
    const friendName = document.querySelector('#friendName').value;
    const friendEmail = document.querySelector('#friendEmail').value;
    console.log(`friend::: ${friendName}   ${friendEmail}`);
    AddFriend.addFriend(friendName, friendEmail);
  }

  if(target.matches('.fa-caret-down')) {
    console.log('clicked');
    const navDiv = document.querySelector('#moreNav');
    Util.displayToggle(navDiv);
  }
};

//handling all functions
window.addEventListener('DOMContentLoaded', () => {
  User.getFriendsData();
  User.appendFriends();
  //navigation icons message
  const navIcons = document.querySelectorAll('.mIcon');
  navIcons.forEach(i => {
    i.addEventListener('mouseover', (e) => {
      const name = e.target.dataset.name;
      const classDiv = document.querySelector('.' + e.target.dataset.class);
      const html = `<p>${name}</p>`;
      classDiv.innerHTML = html;
      setTimeout(() => {  classDiv.innerHTML = ""; }, 500);
    });
  });
  document.addEventListener('click', ({
    target
  }) => processClick(target));
});
