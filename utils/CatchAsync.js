// Method to catch all the async functions
module.exports = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
