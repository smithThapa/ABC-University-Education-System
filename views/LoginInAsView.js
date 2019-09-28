//method to the log in as page to team maintenance
exports.getLoginAsPage = (req, res) => {
  res.status(200).render('LogInAsView', {
    title: 'Login In As'
  });
};

// get log in as student page to log in as a test user with the student role
exports.getLoginStudentPage = (req, res) => {
  res.status(200).render('LoginView', {
    title: 'Login',
    confirmLogInAs: true,
    emailAddress: 'test-student@abcuniversity.com'
  });
};

// get log in as staff page to log in as a test user with the staff role
exports.getLoginStaffPage = (req, res) => {
  res.status(200).render('LoginView', {
    title: 'Login',
    confirmLogInAs: true,
    emailAddress: 'test-staff@abcuniversity.com'
  });
};

// get log in as admin page to log in as a test user with the admin role
exports.getLoginAdminPage = (req, res) => {
  res.status(200).render('LoginView', {
    title: 'Login',
    confirmLogInAs: true,
    emailAddress: 'test-admin@abcuniversity.com'
  });
};
