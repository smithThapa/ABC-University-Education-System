import '@babel/polyfill';
import { login, logout, logoutAs } from './login';
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
import { reportGeneration } from './reportGeneration';

//----------
// VARIABLES
//----------
//1: user access
const loginBtn = document.getElementById('submitLogin'); //a
const logoutBtn = document.getElementById('logoutBtn'); //b
const logoutAsBtn = document.getElementById('logoutAsBtn'); //c
//2: password related
const resetPasswordForm = document.getElementById('resetPasswordForm'); //a
const forgotPasswordForm = document.getElementById('forgotPasswordForm'); //b
const editMyPasswordForm = document.getElementById('editMyPasswordForm'); //c
//3: file related
const fileInput = document.getElementById('fileInput'); //a
//4: create elements
const createElementForm = document.getElementById('createElementForm'); //a
const createArticleForm = document.getElementById('createArticleForm'); //b
const createUserForm = document.getElementById('createUserForm'); //c
const createMaintenanceRequestForm = document.getElementById(
  'createMaintenanceRequestForm'
); //d
const createErrorReportForm = document.getElementById('createErrorReportForm'); //e
//5: edit elements
const editElementForm = document.getElementById('editElementForm'); //a
const editArticleForm = document.getElementById('editArticleForm'); //b
const editUserForm = document.getElementById('editUserForm'); //c
const editMeForm = document.getElementById('editMeForm'); //d
const editMaintenanceRequestBtnList = document.querySelectorAll(
  '.editMaintenanceRequestBtn'
); //e
//6: delete element
const deleteElementBtnList = document.querySelectorAll('.deleteModalBtn'); //a
//7: send notification
const sendNotificationChangePasswordBtn = document.getElementById(
  'sendNotificationChangePasswordBtn'
); //a
const sendNotificationFromMaintenanceForm = document.getElementById(
  'sendNotificationFromMaintenanceForm'
); //b
//8: report generation buttons
const reportGenerationBtnList = document.querySelectorAll(
  '.reportGenerationBtn'
); //a

//1.a: Log in button starts
if (loginBtn) {
  //add event to click
  loginBtn.addEventListener('click', e => {
    e.preventDefault();
    //email and password insert
    const email = document.getElementById('inputEmail').value;
    const password = document.getElementById('inputPassword').value;
    //send values to validate
    login(email, password);
  });
}

//1.b: log out button
if (logoutBtn) {
  //add event to click and execute the method to logout
  logoutBtn.addEventListener('click', logout);
}

//1.c: Log out as from testing user (team-maintenance)
if (logoutAsBtn) {
  //add event to click and execute the method to logout and return to team-maintenance
  logoutAsBtn.addEventListener('click', logoutAs);
}

//2.a: Reset own passwird form
if (resetPasswordForm) {
  //add event to forum when it is submiteed
  resetPasswordForm.addEventListener('submit', e => {
    e.preventDefault();
    //get the password from the user
    const newPassword = document.getElementById('inputNewPassword').value;
    const confirmPassword = document.getElementById('inputConfirmPassword')
      .value;
    //get token from the forum, get from the email
    const token = document.getElementById('hiddenResetToken').value;

    //method to reset password
    resetPassword(newPassword, confirmPassword, token);
  });
}

//2.b: forgot forum to request new password
if (forgotPasswordForm) {
  //add event to forum to add email and send new ptoken
  forgotPasswordForm.addEventListener('submit', e => {
    e.preventDefault();

    //get email
    const userEmail = document.getElementById('inputForgotUserEmail').value;
    const resetURL = '/my_details/reset_password'; //define url

    //send the forgot password method
    forgotPassword(userEmail, resetURL);
  });
}

//2.c: edit personal password form
if (editMyPasswordForm) {
  //add event to form when it is submitted
  editMyPasswordForm.addEventListener('submit', e => {
    e.preventDefault();

    //new object to fill up with data
    const userPasswordObj = new Object();

    //add old passord, new password and confirm password
    userPasswordObj.passwordCurrent = document.getElementById(
      'inputUpdateCurrentMyPassword'
    ).value;
    userPasswordObj.password = document.getElementById(
      'inputUpdateNewMyPassword'
    ).value;
    userPasswordObj.confirmPassword = document.getElementById(
      'inputUpdateConfirmMyPassword'
    ).value;

    //send obejct to edit the password
    editMyPassword(userPasswordObj);
  });
}

//4.a: Create element, forum, topic and comment
if (createElementForm) {
  //add event to all forums
  createElementForm.addEventListener('submit', e => {
    e.preventDefault();

    //element type
    const elementType = document.getElementById('hiddenInputCreateType').value;
    //user role
    const userRole = document.getElementById('hiddenInputCreateUserRole').value;
    //case type = forum
    if (elementType == 'Forum') {
      //set element of forum and previos path to redirect
      const title = document.getElementById('inputCreationTitle').value;
      const type = document.getElementById('inputCreationType').value;
      const previousPath = document.getElementById('hiddenInputCreatePath')
        .value;
      //method to create forum
      createForum(title, type, previousPath);
    }

    //case elementType = topic
    if (elementType == 'Topic') {
      //empty forumID
      let forumId;
      //topic values
      const title = document.getElementById('inputCreationTitle').value;
      const description = document.getElementById('inputCreationDescription')
        .value;
      //previous path
      let previousPath = document.getElementById('hiddenInputCreatePath').value;

      //case role = staff
      if (userRole == 'staff') {
        //forum id from selection
        forumId = document.getElementById('inputCreationForum')
          .selectedOptions[0].dataset.forumId;
        //forums slug to redirect
        const forumSlug = document.getElementById('inputCreationForum')
          .selectedOptions[0].dataset.forumSlug;
        //change precious path to redirect
        previousPath += `/${forumSlug}/topics`;
      }
      //user has role = admin
      else if (userRole == 'admin') {
        //set forum Id by
        forumId = document.getElementById('hiddenInputCreateForum').value;
      }
      //method to create topic
      createTopic(title, description, forumId, previousPath);
    }
    //case elementType= comment
    if (elementType == 'Comment') {
      //get topicId
      const topicId = document.getElementById('hiddenInputCreateTopic').value;
      //get comment values
      const title = document.getElementById('inputCreationTitle').value;
      const description = document.getElementById('inputCreationDescription')
        .value;
      //get precious path to redirect
      const previousPath = document.getElementById('hiddenInputCreatePath')
        .value;
      //create comment method with the values
      createComment(title, description, topicId, previousPath);
    }
  });
}

//4.b: Create Article
if (createArticleForm) {
  //add event to the form at submittion
  createArticleForm.addEventListener('submit', e => {
    e.preventDefault();

    //get previos path
    const previousPath = document.getElementById('hiddenInputCreateArticlePath')
      .value;

    //empty object to fill
    const article = new Object();

    //add type of article, title and description
    article.type = document.getElementById(
      'hiddenInputCreateArticleType'
    ).value;
    article.title = document.getElementById('inputCreationArticleTitle').value;
    article.description = document.getElementById(
      'inputCreationArticleDescription'
    ).value;

    //array to the roles to email announcements
    let arrayRoleEmails = [];
    let checkboxs; //checkbox varaible to check the checkbox in the html

    //case that it is a announcement type
    if (article.type == 'Announcements') {
      //get all the checkbox
      checkboxs = document.querySelectorAll('.form-check-input');
      //add the values of checkbox in the array
      checkboxs.forEach(e => {
        if (e.checked) arrayRoleEmails.push(e.value);
      });
    }

    // create the article by the method
    createArticle(article, previousPath, arrayRoleEmails);
  });
}

//4.c: user form creation to add new users by admin
if (createUserForm) {
  //add evenet to the user forum
  createUserForm.addEventListener('submit', e => {
    e.preventDefault();

    //obecjt to fill with user information
    const newUser = new Object();

    //get first name
    newUser.firstName = document.getElementById('inputCreationFirstName').value;
    //more tha one and capital letter in the first letter in each word
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
    //get last name
    newUser.lastName = document.getElementById('inputCreationLastName').value;
    //more tha one and capital letter in the first letter in each word
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
    //get email
    newUser.email = document.getElementById('inputCreationEmailAddress').value;
    //get phone number
    newUser.phoneNumber = document.getElementById(
      'inputCreationPhoneNumber'
    ).value;
    //asign role
    newUser.role = document
      .getElementById('inputCreationUserRole')
      .value.toLowerCase();
    if (newUser.role == 'team maintenance') newUser.role = 'team-maintenance';
    //add major to the object
    newUser.major = document.getElementById('inputCreationUserMajor').value;
    //url to send
    newUser.resetURL = '/my_details/reset_password';

    //method to create user
    createUser(newUser);
  });
}

//4.d: Create maintenanceRequests
if (createMaintenanceRequestForm) {
  //add event listener to the forum to submit
  createMaintenanceRequestForm.addEventListener('submit', e => {
    e.preventDefault();

    //get the subject and descripto to send in the maintenanceRequests
    const subject = document.getElementById('inputSubject').value;
    const description = document.getElementById('inputDescription').value;

    //create the maintenance request
    createMaintenanceRequest(subject, description);
  });
}

//4.e: create error report
if (createErrorReportForm) {
  //add event to submit an error report
  createErrorReportForm.addEventListener('submit', function(e) {
    e.preventDefault();

    //obecjt to send
    const errorReport = new Object();

    //get values with subject and description to send
    errorReport.subject = document.getElementById(
      'inputCreationErrorReportSubject'
    ).value;
    errorReport.description = document.getElementById(
      'inputCreationErrorReportDescription'
    ).value;

    //create error report by method
    createErrorReport(errorReport);
  });
}

//5.a: Edit element form for forum, topic and comment
if (editElementForm) {
  //add event to submit forum of edit element
  editElementForm.addEventListener('submit', e => {
    e.preventDefault();

    //get type, id and path of the element
    const elementType = document.getElementById('hiddenInputEditionType').value;
    const elementId = document.getElementById('hiddenInputEditionId').value;
    const elementPath = document.getElementById('hiddenInputEditionPath').value;

    //get inputs
    const inputs = document.querySelectorAll('.inputsEdition');

    //create empty object to add the inputs
    const obj = new Object();

    //iterate through all inputs
    inputs.forEach(element => {
      //add title, descriptionnd type a
      if (element.id === 'inputEdition1') obj.title = element.value;
      if (element.id === 'inputEdition2') obj.description = element.value;
      if (element.id === 'inputEdition3') obj.type = element.value;
    });

    //edit method
    editElement(obj, elementType.toLowerCase(), elementId, elementPath);
  });
}

//5.b: edit article
if (editArticleForm) {
  //add event to the edit artcile form
  editArticleForm.addEventListener('submit', e => {
    e.preventDefault();

    //get id, type of article and previous path to send
    const elementId = document.getElementById('hiddenInputEditionArticleId')
      .value;
    const elementType = document.getElementById('hiddenInputEditionArticleType')
      .value;
    const previousPath = document.getElementById(
      'hiddenInputEditionArticlePath'
    ).value;

    //create article object to populate
    const article = new Object();

    //get title and descripton of the article
    article.title = document.getElementById('inputEditionArticleTitle').value;
    article.description = document.getElementById(
      'inputEditionArticleDescription'
    ).value;

    // edit the article
    editArticle(elementId, article, elementType, previousPath);
  });
}

//5.c: edit the user form by the administrator
if (editUserForm) {
  //add event to the user to edit
  editUserForm.addEventListener('submit', e => {
    e.preventDefault();

    //get user id of the user to edit
    const currentUserId = document.getElementById('hiddenInputEditUserId')
      .value;

    //object to edit
    const editUserObj = new Object();

    //get first name
    editUserObj.firstName = document.getElementById('inputEditFirstName').value;
    //case that threr is more than one word to add capital letter in the first letter of each word
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

    //add last name
    editUserObj.lastName = document.getElementById('inputEditLastName').value;
    //case that threr is more than one word to add capital letter in the first letter of each word
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
    //add email
    editUserObj.email = document.getElementById('inputEditEmailAddress').value;
    //add phoneNumber
    editUserObj.phoneNumber = document.getElementById(
      'inputEditPhoneNumber'
    ).value;
    //add role
    editUserObj.role = document
      .getElementById('inputEditUserRole')
      .value.toLowerCase();
    if (editUserObj.role == 'team maintenance')
      editUserObj.role = 'team-maintenance';
    //add major in the university
    editUserObj.major = document.getElementById('inputEditUserMajor').value;
    //add active status
    editUserObj.active =
      document.getElementById('inputEditUserActive').value == 'Yes'
        ? true
        : false;

    //edit method to change user status
    editUser(editUserObj, currentUserId);
  });
}

//5.d:
if (editMeForm) {
  //edit personal form
  editMeForm.addEventListener('submit', e => {
    e.preventDefault();

    //create empty obhect to edit own account
    const currentUser = new Object();

    //edit current user first name
    currentUser.firstName = document.getElementById(
      'inputDetailFirstName'
    ).value;
    //case that threr is more than one word to add capital letter in the first letter of each word
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
    //edit current user last name
    currentUser.lastName = document.getElementById('inputDetailLastName').value;
    //case that threr is more than one word to add capital letter in the first letter of each word
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
    //edit user email
    currentUser.email = document.getElementById(
      'inputDetailEmailAddress'
    ).value;
    //edit mobile phone
    currentUser.phoneNumber = document.getElementById(
      'inputDetailPhoneNumber'
    ).value;

    //edit user information
    editMe(currentUser);
  });
}

//5.e: edit the maintenance request
if (editMaintenanceRequestBtnList) {
  //add event to all buttons
  editMaintenanceRequestBtnList.forEach(function(btn) {
    //event in each button
    btn.addEventListener('click', e => {
      //get dataset from the request
      const { requestId, requestStatus } = e.target.dataset;

      //get message to be sent
      const resolvedMessage = document.getElementById(
        `inputReasonMaintenance${requestStatus}${requestId}`
      ).value;

      //edit the mainteance request if the message is not empty
      if (resolvedMessage != '' && resolvedMessage.trim() != '')
        editMaintenanceRequest(requestId, requestStatus, resolvedMessage);
    });
  });
}

//6.a: delete element from database
if (deleteElementBtnList) {
  //add function to all buttons to delete
  deleteElementBtnList.forEach(function(btn) {
    btn.addEventListener('click', e => {
      //get dataset element of id and type
      const { typeId, typeType } = e.target.dataset;

      //delete the element
      deleteElement(typeId, typeType.toLowerCase());
    });
  });
}

//7.a: send notification to users to change password
if (sendNotificationChangePasswordBtn) {
  //add event to buttins to send notification
  sendNotificationChangePasswordBtn.addEventListener('click', e => {
    //get element type by dataset
    const { elementType } = e.target.dataset;

    //send notification to users
    sendNotification(elementType, {});
  });
}

//7.b: send any message to all users
if (sendNotificationFromMaintenanceForm) {
  //add event to the forum to send notification
  sendNotificationFromMaintenanceForm.addEventListener('submit', e => {
    e.preventDefault();

    //object to send
    const notification = new Object();

    //assign subject and message to notificate
    notification.subject = document.getElementById(
      'inputNoticationSubject'
    ).value;
    notification.description = document.getElementById(
      'inputNoticationDescription'
    ).value;

    //method to send notification
    sendNotification('emailNotificationMaintenance', notification);
  });
}

//8.a: Report generation button list
if (reportGenerationBtnList) {
  //add event to all the button to generate report
  reportGenerationBtnList.forEach(function(btn) {
    //evenet
    btn.addEventListener('click', e => {
      //get the stadistic variable to generate
      const { reportId } = e.target.dataset;

      //empty variable to add card(s)
      let cardHTML;

      //check if the id is artticle to add both cards
      if (reportId == 'article-statistics') {
        cardHTML =
          '<div class="card-deck">' +
          document.getElementById(`announcement-statistics-card`).outerHTML +
          document.getElementById(`new-statistics-card`).outerHTML +
          '</div>';
      } else {
        //get card
        cardHTML = document.getElementById(`${reportId}-card`).outerHTML;
      }

      // html table
      const tableHTML = document.getElementById(`${reportId}-table`).innerHTML;
      //use method to send data
      reportGeneration(
        reportId,
        cardHTML + '<br/><h3>Table</h3><br/>' + tableHTML
      );
    });
  });
}
