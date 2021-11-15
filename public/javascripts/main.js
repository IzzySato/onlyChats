import * as Signup from './signup.js';
import * as Login from './login.js';
import * as Util from './util.js';

//handling button clicks
const processClick = (target) => {
  if(target.matches('#signupBtn')) {
    const userFirstName = document.querySelector('#userFirstName').value;
    const userLastName = document.querySelector('#userLastName').value;
    const username = document.querySelector('#newUsername').value;
    const password = document.querySelector('#newPassword').value;
    Signup.signup(userFirstName, userLastName, username, password);
  }

  if (target.matches('#loginBtn')) {
    console.log('login clicked');
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;
    Login.login(username, password);
  };

  if(target.matches('.fa-caret-down')) {
    console.log('clicked');
    const navDiv = document.querySelector('#moreNav');
    Util.displayToggle(navDiv);
  }
};

//handling all functions
window.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('click', ({
    target
  }) => processClick(target));
});
