const {customers} = require( "./customers-list")

function emailCustomer() {
    const randomCustomer = customers[Math.floor(Math.random() * customers.length)];
    console.log(`Sent email to customer: ${randomCustomer}`);
}

module.exports ={
    emailCustomer
}