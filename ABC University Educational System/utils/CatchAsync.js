// Method to catch all the async functions in a general process, it will receive the whole function
module.exports = fn => {
  return (req, res, next) => {
    //set the catch with the next
    fn(req, res, next).catch(next);
  };
};
