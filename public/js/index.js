import '@babel/polyfill';
import { login, logout } from './login';
import { showAlert } from './alerts';
import { createForum, createTopic, createComment } from './createElement';
import { deleteElement } from './deleteElement';

// variable
const loginForm = document.getElementById('login-form');
const logoutBtn = document.getElementById('logoutBtn');
const fileInput = document.getElementById('fileInput');
const createElementForm = document.getElementById('createElementForm');
const deleteElementBtnList = document.querySelectorAll('.deleteModalBtn');

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

    const elementType = document.getElementById('hiddenInputCreateType').value;
    if (elementType == 'Forum') {
      const title = document.getElementById('inputCreation1').value;
      const type = document.getElementById('inputCreation3').value;
      const previousPath = document.getElementById('hiddenInputCreatePath')
        .value;
      createForum(title, type, previousPath);
    }
    if (elementType == 'Topic') {
      const forumId = document.getElementById('hiddenInputCreateForum').value;
      const title = document.getElementById('inputCreation1').value;
      const description = document.getElementById('inputCreation2').value;
      const previousPath = document.getElementById('hiddenInputCreatePath')
        .value;
      createTopic(title, description, forumId, previousPath);
    }
    if (elementType == 'Comment') {
      const topicId = document.getElementById('hiddenInputCreateTopic').value;
      const title = document.getElementById('inputCreation1').value;
      const description = document.getElementById('inputCreation2').value;
      const previousPath = document.getElementById('hiddenInputCreatePath')
        .value;
      createComment(title, description, topicId, previousPath);
    }
  });
}

if (deleteElementBtnList) {
  deleteElementBtnList.forEach(function(btn) {
    btn.addEventListener('click', e => {
      const { typeId, typeType } = e.target.dataset;
      console.log(typeId, typeType.toLowerCase());
      deleteElement(typeId, typeType.toLowerCase());
    });
  });
}
