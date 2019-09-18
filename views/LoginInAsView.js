exports.getLoginAsPage = (req, res) => {
  res.status(200).render('LogInAsView', {
    title: 'Login In As'
  });
};

exports.getLoginStudentPage = (req, res) => {
  res.status(200).render('LoginView', {
    title: 'Login',
    confirmLogInAs: true,
    emailAddress: 'test-student@abcuniversity.com'
  });
};

exports.getLoginStaffPage = (req, res) => {
  res.status(200).render('LoginView', {
    title: 'Login',
    confirmLogInAs: true,
    emailAddress: 'test-staff@abcuniversity.com'
  });
};

exports.getLoginAdminPage = (req, res) => {
  res.status(200).render('LoginView', {
    title: 'Login',
    confirmLogInAs: true,
    emailAddress: 'test-admin@abcuniversity.com'
  });
};
