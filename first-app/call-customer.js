const  {customers} = require( "./customers-list")

function callCustomer() {
    const randomCustomer = customers[Math.floor(Math.random() * customers.length)];
    console.log(`Called customer: ${randomCustomer}`);
}

module.exports = {
    callCustomer
}