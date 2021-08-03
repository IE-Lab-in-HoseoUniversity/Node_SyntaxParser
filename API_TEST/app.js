var jsonCheck = require("./api");


console.log("==================================");
console.log("         json 속성 체크");
console.log("==================================");
console.log(jsonCheck.json_parse('pbjson.json', 'playbook.js'));

console.log("\n==================================");
console.log("         에러 체크");
console.log("==================================");
console.log(jsonCheck.err_catch('./error-codes/ex4.js'));



console.log(jsonCheck.err_catch_dir('../error-codes', '/log-dir'));