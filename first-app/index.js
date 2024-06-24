const {callCustomer} = require("./call-customer.js");
const {emailCustomer }= require("./email-customer.js");

setInterval(callCustomer, 5000);

setInterval(emailCustomer, 10000);
