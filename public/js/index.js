import '@babel/polyfill';
import { login, logout } from './login';
import { showAlert } from './alerts';
import { getAllForums } from './forums';

// variable
const loginForm = document.getElementById('login-form');
const logoutBtn = document.getElementById('logoutBtn');


document.getElementById('fileInput').onchange = function() {
  alert(`Selected file: ${this.value}`);
};



if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('inputEmail').value;
    const password = document.getElementById('inputPassword').value;
    login(email, password);
 
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}

// if (forumDiv) {
//   getAllForums(forumDiv);
// }
