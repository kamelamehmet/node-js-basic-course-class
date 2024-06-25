const mathUtils = require("./math-utils");

const response1 = request1(20);
console.log("**response1**", response1);

otherRequests();

function otherRequests() {
    setInterval(() => {
        console.log("other requests...");
    }, 50);
}

function request1(n) {
    console.log("**start request 1**");
    const start = new Date();

    const primes = [];

    const interval = setInterval(()=>{console.log(mathUtils.getPrimeNumbersWithinRange(2,n)); clearInterval(interval)},50)

    const end = new Date();
    console.log("**finish request 1**. Elapsed ms: ", end.getTime() - start.getTime());

    return primes;
}

const mathUtils = require("./math-utils");

request1(10, 15, (response1) => {
    console.log("prime numbers:", response1);
    request1(15, 20, (response2) => {
        console.log("prime numbers:", response2);
        request1(0, 10, (response3) => {
            console.log("prime numbers:", response3);
        });
    });
});

otherRequests();
