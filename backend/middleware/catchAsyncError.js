const catchAsyncError = (cathAsync) => (req, res, next) => {
  Promise.resolve(cathAsync(req, res, next)).catch(next);
};

module.exports = catchAsyncError;
