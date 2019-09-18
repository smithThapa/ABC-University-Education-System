import '@babel/polyfill';
import { login, logout, logoutAs} from './login';
import { showAlert } from './alerts';
import {
  createUser,
  createForum,
  createTopic,
  createComment,
  createArticle,
  createMaintenanceRequest,
  createErrorReport
} from './createElement';
import {
  editUser,
  editMe,
  editMyPassword,
  editArticle,
  editElement,
  editMaintenanceRequest
} from './editElement';
import { deleteElement } from './deleteElement';
import { forgotPassword, resetPassword } from './passwordManagement';
import { sendNotification } from './sendNotification';

// variable
const loginForm = document.getElementById('login-form');
const logoutBtn = document.getElementById('logoutBtn');
const logoutAsBtn = document.getElementById('logoutAsBtn');
const fileInput = document.getElementById('fileInput');
const openLoginAsBtnList = document.querySelectorAll('.loginasbutton')

const resetPasswordForm = document.getElementById('resetPasswordForm');
const forgotPasswordForm = document.getElementById('forgotPasswordForm');
const editMyPasswordForm = document.getElementById('editMyPasswordForm');

const createElementForm = document.getElementById('createElementForm');
const createArticleForm = document.getElementById('createArticleForm');
const createUserForm = document.getElementById('createUserForm');
const createMaintenanceRequestForm = document.getElementById(
  'createMaintenanceRequestForm'
);
const createErrorReportForm = document.getElementById('createErrorReportForm');

const editElementForm = document.getElementById('editElementForm');
const editArticleForm = document.getElementById('editArticleForm');
const editUserForm = document.getElementById('editUserForm');
const editMeForm = document.getElementById('editMeForm');
const editMaintenanceRequestBtnList = document.querySelectorAll(
  '.editMaintenanceRequestBtn'
);

const deleteElementBtnList = document.querySelectorAll('.deleteModalBtn');

const sendNotificationChangePasswordBtn = document.getElementById(
  'sendNotificationChangePasswordBtn'
);
const sendNotificationFromMaintenanceForm = document.getElementById(
  'sendNotificationFromMaintenanceForm'
);

if (createMaintenanceRequestForm) {
  createMaintenanceRequestForm.addEventListener('submit', e => {
    e.preventDefault();
    const subject = document.getElementById('inputSubject').value;
    const description = document.getElementById('inputDescription').value;
    createMaintenanceRequest(subject, description);
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

if (logoutAsBtn) {
  logoutAsBtn.addEventListener('click', logoutAs);
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

if (createArticleForm) {
  createArticleForm.addEventListener('submit', e => {
    e.preventDefault();

    const previousPath = document.getElementById('hiddenInputCreateArticlePath')
      .value;

    const article = new Object();

    article.type = document.getElementById(
      'hiddenInputCreateArticleType'
    ).value;
    article.title = document.getElementById('inputCreationArticleTitle').value;
    article.description = document.getElementById(
      'inputCreationArticleDescription'
    ).value;

    let arrayRoleEmails = [];
    let checkboxs;

    if (article.type == 'Announcements') {
      checkboxs = document.querySelectorAll('.form-check-input');
      checkboxs.forEach(e => {
        if (e.checked) arrayRoleEmails.push(e.value);
      });
    }

    // console.log(arrayEmails, checkboxs, article, previousPath);
    createArticle(article, previousPath, arrayRoleEmails);
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
    if (newUser.role == 'team maintenance') newUser.role = 'team-maintenance';
    newUser.major = document.getElementById('inputCreationUserMajor').value;
    newUser.resetURL = '/my_details/reset_password';
    createUser(newUser);
  });
}

if (createErrorReportForm) {
  createErrorReportForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const errorReport = new Object();

    errorReport.subject = document.getElementById(
      'inputCreationErrorReportSubject'
    ).value;
    errorReport.description = document.getElementById(
      'inputCreationErrorReportDescription'
    ).value;

    createErrorReport(errorReport);
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

if (forgotPasswordForm) {
  forgotPasswordForm.addEventListener('submit', e => {
    e.preventDefault();

    const userEmail = document.getElementById('inputForgotUserEmail').value;
    const resetURL = '/my_details/reset_password';

    forgotPassword(userEmail, resetURL);
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

if (editArticleForm) {
  editArticleForm.addEventListener('submit', e => {
    e.preventDefault();

    const elementId = document.getElementById('hiddenInputEditionArticleId')
      .value;
    const elementType = document.getElementById('hiddenInputEditionArticleType')
      .value;
    const previousPath = document.getElementById(
      'hiddenInputEditionArticlePath'
    ).value;

    const article = new Object();

    article.title = document.getElementById('inputEditionArticleTitle').value;
    article.description = document.getElementById(
      'inputEditionArticleDescription'
    ).value;

    // console.log(elementId, article, previousPath);
    editArticle(elementId, article, elementType, previousPath);
  });
}

if (editUserForm) {
  editUserForm.addEventListener('submit', e => {
    e.preventDefault();

    const currentUserId = document.getElementById('hiddenInputEditUserId')
      .value;

    const editUserObj = new Object();

    editUserObj.firstName = document.getElementById('inputEditFirstName').value;
    if (editUserObj.firstName.includes(' ')) {
      const firstNameArray = editUserObj.firstName.split(' ');
      editUserObj.firstName = '';
      for (let i = 0; i < firstNameArray.length; i++) {
        const element =
          firstNameArray[i].charAt(0).toUpperCase() +
          firstNameArray[i].slice(1).toLowerCase();
        if (i == firstNameArray.length - 1) editUserObj.firstName += element;
        else editUserObj.firstName += element + ' ';
      }
    }
    editUserObj.lastName = document.getElementById('inputEditLastName').value;
    if (editUserObj.lastName.includes(' ')) {
      const lastNameArray = editUserObj.lastName.split(' ');
      editUserObj.lastName = '';
      for (let i = 0; i < lastNameArray.length; i++) {
        const element =
          lastNameArray[i].charAt(0).toUpperCase() +
          lastNameArray[i].slice(1).toLowerCase();
        if (i == lastNameArray.length - 1) editUserObj.lastName += element;
        else editUserObj.lastName += element + ' ';
      }
    }
    editUserObj.email = document.getElementById('inputEditEmailAddress').value;
    editUserObj.phoneNumber = document.getElementById(
      'inputEditPhoneNumber'
    ).value;
    editUserObj.role = document
      .getElementById('inputEditUserRole')
      .value.toLowerCase();
    if (editUserObj.role == 'team maintenance')
      editUserObj.role = 'team-maintenance';
    editUserObj.major = document.getElementById('inputEditUserMajor').value;
    editUserObj.active =
      document.getElementById('inputEditUserActive').value == 'Yes'
        ? true
        : false;

    console.log(currentUserId, editUserObj);
    editUser(editUserObj, currentUserId);
  });
}

if (editMeForm) {
  editMeForm.addEventListener('submit', e => {
    e.preventDefault();

    const currentUser = new Object();

    currentUser.firstName = document.getElementById(
      'inputDetailFirstName'
    ).value;
    if (currentUser.firstName.includes(' ')) {
      const firstNameArray = currentUser.firstName.split(' ');
      currentUser.firstName = '';
      for (let i = 0; i < firstNameArray.length; i++) {
        const element =
          firstNameArray[i].charAt(0).toUpperCase() +
          firstNameArray[i].slice(1).toLowerCase();
        if (i == firstNameArray.length - 1) currentUser.firstName += element;
        else currentUser.firstName += element + ' ';
      }
    }
    currentUser.lastName = document.getElementById('inputDetailLastName').value;
    if (currentUser.lastName.includes(' ')) {
      const lastNameArray = currentUser.lastName.split(' ');
      currentUser.lastName = '';
      for (let i = 0; i < lastNameArray.length; i++) {
        const element =
          lastNameArray[i].charAt(0).toUpperCase() +
          lastNameArray[i].slice(1).toLowerCase();
        if (i == lastNameArray.length - 1) currentUser.lastName += element;
        else currentUser.lastName += element + ' ';
      }
    }
    currentUser.email = document.getElementById(
      'inputDetailEmailAddress'
    ).value;
    currentUser.phoneNumber = document.getElementById(
      'inputDetailPhoneNumber'
    ).value;

    // console.log(currentUser);
    editMe(currentUser);
  });
}

if (editMyPasswordForm) {
  editMyPasswordForm.addEventListener('submit', e => {
    e.preventDefault();

    const userPasswordObj = new Object();

    userPasswordObj.passwordCurrent = document.getElementById(
      'inputUpdateCurrentMyPassword'
    ).value;
    userPasswordObj.password = document.getElementById(
      'inputUpdateNewMyPassword'
    ).value;
    userPasswordObj.confirmPassword = document.getElementById(
      'inputUpdateConfirmMyPassword'
    ).value;

    editMyPassword(userPasswordObj);
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

if (editMaintenanceRequestBtnList) {
  editMaintenanceRequestBtnList.forEach(function(btn) {
    btn.addEventListener('click', e => {
      const { requestId, requestStatus } = e.target.dataset;
      const resolvedMessage = document.getElementById(
        `inputReasonMaintenance${requestStatus}${requestId}`
      ).value;

      // console.log(requestId, requestStatus, resolvedMessage);
      if (resolvedMessage != '' && resolvedMessage.trim() != '')
        editMaintenanceRequest(requestId, requestStatus, resolvedMessage);
    });
  });
}

if (sendNotificationChangePasswordBtn) {
  sendNotificationChangePasswordBtn.addEventListener('click', e => {
    const { elementType } = e.target.dataset;
    sendNotification(elementType, {});
  });
}


if (sendNotificationFromMaintenanceForm) {
  sendNotificationFromMaintenanceForm.addEventListener('submit', e => {
    e.preventDefault();

    const notification = new Object();

    notification.subject = document.getElementById(
      'inputNoticationSubject'
    ).value;
    notification.description = document.getElementById(
      'inputNoticationDescription'
    ).value;

    sendNotification('emailNotificationMaintenance', notification);
  });
}
