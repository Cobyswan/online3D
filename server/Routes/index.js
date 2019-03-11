const paymentApi = require("./Payment");
const configureRoutes = app => {
  paymentApi(app);
};
module.exports = configureRoutes;