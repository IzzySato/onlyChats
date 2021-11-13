import * as Signup from './signup.js';

//handling button clicks
const processClick = (target) => {
  if(targert.matches('#signupBtn')) {
    Signup.signup(userFirstName, userLastName, username, password);
    console.log('clicked');
  }
  if(target.matches('#loginBtn')) {
    //login
  }
};

//handling all functions
window.addEventListener('DOMContentLoaded', () => {
  console.log('welcome');
  const btn = document.querySelector('#signupBtn');
  btn.addEventListener('click', () => {
    const userFirstName = document.querySelector('#userFirstName').value;
    const userLastName = document.querySelector('#userLastName').value;
    const username = document.querySelector('#newUsername').value;
    const password = document.querySelector('#newPassword').value;
    Signup.signup(userFirstName, userLastName, username, password);
  });
  // document.addEventListener('click', ({
  //   target
  // }) => processClick(target));
});
