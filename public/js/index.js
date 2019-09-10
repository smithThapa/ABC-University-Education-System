import '@babel/polyfill';
import { login, logout } from './login';
import { showAlert } from './alerts';
import {
  createUser,
  createForum,
  createTopic,
  createComment
} from './createElement';
import { editElement } from './editElement';
import { deleteElement } from './deleteElement';
import { submitMaintenanceRequest } from './maintenanceRequest';
import { resetPassword } from './passwordManagement';

// variable
const loginForm = document.getElementById('login-form');
const logoutBtn = document.getElementById('logoutBtn');
const fileInput = document.getElementById('fileInput');
const createUserForm = document.getElementById('createUserForm');
const resetPasswordForm = document.getElementById('resetPasswordForm');
const createElementForm = document.getElementById('createElementForm');
const editElementForm = document.getElementById('editElementForm');
const deleteElementBtnList = document.querySelectorAll('.deleteModalBtn');
const maintenanceForm = document.getElementById('maintenance-form');

if (maintenanceForm) {
  maintenanceForm.addEventListener('submit', e => {
    e.preventDefault();
    const subject = document.getElementById('inputSubject').value;
    const description = document.getElementById('inputDescription').value;
    submitMaintenanceRequest(subject, description);
  });
}

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
    const userRole = document.getElementById('hiddenInputCreateUserRole').value;
    if (elementType == 'Forum') {
      const title = document.getElementById('inputCreationTitle').value;
      const type = document.getElementById('inputCreationType').value;
      const previousPath = document.getElementById('hiddenInputCreatePath')
        .value;
      createForum(title, type, previousPath);
    }
    if (elementType == 'Topic') {
      let forumId;
      const title = document.getElementById('inputCreationTitle').value;
      const description = document.getElementById('inputCreationDescription')
        .value;
      let previousPath = document.getElementById('hiddenInputCreatePath').value;

      if (userRole == 'staff') {
        forumId = document.getElementById('inputCreationForum')
          .selectedOptions[0].dataset.forumId;
        const forumSlug = document.getElementById('inputCreationForum')
          .selectedOptions[0].dataset.forumSlug;
        previousPath += `/${forumSlug}/topics`;
      } else {
        forumId = document.getElementById('hiddenInputCreateForum').value;
      }
      createTopic(title, description, forumId, previousPath);
    }
    if (elementType == 'Comment') {
      const topicId = document.getElementById('hiddenInputCreateTopic').value;
      const title = document.getElementById('inputCreationTitle').value;
      const description = document.getElementById('inputCreationDescription')
        .value;
      const previousPath = document.getElementById('hiddenInputCreatePath')
        .value;
      createComment(title, description, topicId, previousPath);
    }
  });
}

if (createUserForm) {
  createUserForm.addEventListener('submit', e => {
    e.preventDefault();

    const newUser = new Object();

    newUser.firstName = document.getElementById('inputCreationFirstName').value;
    if (newUser.firstName.includes(' ')) {
      const firstNameArray = newUser.firstName.split(' ');
      newUser.firstName = '';
      for (let i = 0; i < firstNameArray.length; i++) {
        const element =
          firstNameArray[i].charAt(0).toUpperCase() +
          firstNameArray[i].slice(1).toLowerCase();
        if (i == firstNameArray.length - 1) newUser.firstName += element;
        else newUser.firstName += element + ' ';
      }
    }
    newUser.lastName = document.getElementById('inputCreationLastName').value;
    if (newUser.lastName.includes(' ')) {
      const lastNameArray = newUser.lastName.split(' ');
      newUser.lastName = '';
      newUser.lastName = '';
      for (let i = 0; i < lastNameArray.length; i++) {
        const element =
          lastNameArray[i].charAt(0).toUpperCase() +
          lastNameArray[i].slice(1).toLowerCase();
        if (i == lastNameArray.length - 1) newUser.lastName += element;
        else newUser.lastName += element + ' ';
      }
    }
    newUser.email = document.getElementById('inputCreationEmailAddress').value;
    newUser.phoneNumber = document.getElementById(
      'inputCreationPhoneNumber'
    ).value;
    newUser.role = document
      .getElementById('inputCreationUserRole')
      .value.toLowerCase();
    newUser.major = document.getElementById('inputCreationUserMajor').value;
    newUser.resetURL = '/my_details/reset_password';
    createUser(newUser);
  });
}

if (resetPasswordForm) {
  resetPasswordForm.addEventListener('submit', e => {
    e.preventDefault();
    const newPassword = document.getElementById('inputNewPassword').value;
    const confirmPassword = document.getElementById('inputConfirmPassword')
      .value;
    const token = document.getElementById('hiddenResetToken').value;

    resetPassword(newPassword, confirmPassword, token);
  });
}

if (editElementForm) {
  editElementForm.addEventListener('submit', e => {
    e.preventDefault();
    const elementType = document.getElementById('hiddenInputEditionType').value;
    const elementId = document.getElementById('hiddenInputEditionId').value;
    const elementPath = document.getElementById('hiddenInputEditionPath').value;

    const inputs = document.querySelectorAll('.inputsEdition');

    const obj = new Object();

    inputs.forEach(element => {
      if (element.id === 'inputEdition1') obj.title = element.value;
      if (element.id === 'inputEdition2') obj.description = element.value;
      if (element.id === 'inputEdition3') obj.type = element.value;
    });

    editElement(obj, elementType.toLowerCase(), elementId, elementPath);
  });
}

if (deleteElementBtnList) {
  deleteElementBtnList.forEach(function(btn) {
    btn.addEventListener('click', e => {
      const { typeId, typeType } = e.target.dataset;
      // console.log(typeId, typeType.toLowerCase());
      deleteElement(typeId, typeType.toLowerCase());
    });
  });
}
