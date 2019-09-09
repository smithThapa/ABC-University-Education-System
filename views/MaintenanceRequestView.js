exports.getMaintenancePage = (req, res) => {
  res.status(200).render('MainRequestView', {
    title: 'Maintenance Request'
  });
};
