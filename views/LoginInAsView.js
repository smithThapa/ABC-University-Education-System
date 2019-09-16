exports.getLoginAsPage = (req, res) => {
    res.status(200).render('LogInAsView', {
      title: 'Login In As'
    });
  };

exports.getLoginPage = (req,res) => {
  res.status(200).render('LoginView', {
    title: 'Login'
  });
}