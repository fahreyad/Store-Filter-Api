const { CustomErrorAPI } = require("../errors/error-handle");
const errorHandlerMiddleware = (err, req, res, next) => {
  if (err instanceof CustomErrorAPI) {
    return res.status(err.status).json({ msg: err.message });
  }
  return res.status(500).json({ msg: err.message });
};
module.exports = errorHandlerMiddleware;
