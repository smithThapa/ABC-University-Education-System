import '@babel/polyfill';
import { login, logout } from './login';
import { showAlert } from './alerts';
import { createComment } from './createElement';

// variable
const loginForm = document.getElementById('login-form');
const logoutBtn = document.getElementById('logoutBtn');
const fileInput = document.getElementById('fileInput');
const createElementForm = document.getElementById('createElementForm');

if (fileInput) {
  document.getElementById('fileInput').onchange = function() {
    alert(`Selected file: ${this.value}`);
  };
}

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

if (createElementForm) {
  createElementForm.addEventListener('submit', e => {
    e.preventDefault();

    const type = document.getElementById('hiddenInputCreateType').value;
    console.log(type);
    if (type == 'Comment') {
      const topicId = document.getElementById('hiddenInoutCreateTopic').value;
      const title = document.getElementById('inputCreation1').value;
      const description = document.getElementById('inputCreation2').value;
      const previousPath = document.getElementById('hiddenInoutCreatePath')
        .value;
      createComment(title, description, topicId, previousPath);
    }
  });
}
