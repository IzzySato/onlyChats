import * as Signup from './signup.js';
import * as Login from './login.js';
import * as Util from './util.js';

//handling button clicks
const processClick = (target) => {
  if(target.matches('#signupBtn')) {
    const username = document.querySelector('#newUsername').value;
    const email = document.querySelector('#newEmail').value;
    const password = document.querySelector('#newPassword').value;
    Signup.signup(username, email, password);
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
