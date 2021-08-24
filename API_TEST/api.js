const { json } = require('express');
const { stringify } = require('querystring');
const fs = require('fs');
const path = require('path');
/*
function errTranslate(err)
{
    if(err.includes('EvalError')){
        return 'Eval 오류: 전역 eval() 함수에 관한 오류.';

    } else if(err.includes('RangeError')){
        return '범위 오류: 숫자 변수나 매개변수가 유효한 범위를 벗어났습니다.';

    } else if(err.includes('ReferenceError')){
        return '참조 오류: 선언된 적이 없는 변수를 참조하려고 합니다.';

    } else if(err.includes('RangeError')){
        return '범위 오류: 숫자 변수나 매개변수가 유효한 범위를 벗어났습니다.';

    } else if(err.includes('SyntaxError')){
        return '구문 오류: 언어의 구문에 맞지 않는 토큰이나 토큰 순서입니다.';

    } else if(err.includes('TypeError')){
        return '자료형 오류: 변수나 매개변수가 유효한 자료형이 아닙니다.';

    } else if(err.includes('URIError')){
        return 'URI 오류: encodeURI()나 decodeURl() 함수에 부적절한 매개변수를 제공했습니다.';

    } else if(err.includes('AggregateError')){
        return '집계 오류: 하나의 동작이 여러 개의 오류를 발생시켰습니다.';

    } else if(err.includes('InternalError')){
        return '내부 오류: JavaScript 엔진의 내부에서 오류가 발생했습니다.';

    } else {
        return err;
    }
}
*/

function errTranslate(err)
{
    // Eval() Error
    if(err.includes('EvalError')){
        return 'Eval 오류: 전역 eval() 함수에 관한 오류.';

    // RangeError
    } else if(err.includes('RangeError')){
        if (err.includes('repeat count must be less than infinity')){
            return '범위 오류: 반복 횟수가 무한대 미만이어야 합니다.';
        } else if (err.includes('precision is out of range')) {
            return '범위 오류: 정밀도가 범위를 벗어났습니다.';
        }
        else return '범위 오류: 숫자 변수나 매개변수가 유효한 범위를 벗어났습니다.';

    // ReferenceError
    } else if(err.includes('ReferenceError')){
        return '참조 오류: 선언된 적이 없는 변수를 참조하려고 합니다.';

    // URIError
    } else if(err.includes('URIError')){
        return 'URI 오류: encodeURI()나 decodeURl() 함수에 부적절한 매개변수를 제공했습니다.';

    // AggregateError
    } else if(err.includes('AggregateError')){
        return '집계 오류: 하나의 동작이 여러 개의 오류를 발생시켰습니다.';

    // InternalError
    } else if(err.includes('InternalError')){
        if (err.includes('too much recursion')){
            return '내부 오류: 너무 많은 재귀';
        }
        else return '내부 오류: JavaScript 엔진의 내부에서 오류가 발생했습니다.';

    // Warning
    } else if(err.includes('Warning')) {
        if (err.includes('unreachable code after return statement')) {
            return '경고: return문 뒤에 도달할 수 없는 코드입니다.'
        }
        return '경고: Warning Error 발생';

    // SyntaxError
    } else if(err.includes('SyntaxError')) {
        if (err.includes('missing ]')){ 
            return '구문 오류: 배열 초기자 구문에 오류가 있습니다. 닫는 대괄호(]) 또는 콤마(,)가 빠진 것 같습니다.';
        } else if (err.includes('missing [')){ 
            return '구문 오류: 배열 초기자 구문에 오류가 있습니다. 여는 대괄호([) 또는 콤마(,)가 빠진 것 같습니다.';
        } else if (err.includes('missing (')){ 
            return '구문 오류: 여는 괄호 ( 또는 콤마(,)가 빠진 것 같습니다.';
        } else if (err.includes('missing )')){ 
            return '구문 오류: 닫는 괄호 ) 또는 콤마(,)가 빠진 것 같습니다.';
        } else if (err.includes('missing = in const declaration')){ 
            return '구문 오류: const 선언에서는 반드시 값을 정의해야 합니다.';
        } else if (err.includes('missing } after property list')){ 
            return '구문 오류: 중괄호 혹은 객체 초기화 과정 중 쉼표가 누락되었습니다.';
        } else if (err.includes('missing ;')){ 
            return '구문 오류: 세미콜론 누락 혹은 Escape 처리되지 않은 문자열이 존재합니다.';
        } else if (err.includes('Unexpected token')){ 
            return '구문 오류: 콤마, 괄호, 수식어 등 오타 관련 오류가 발견되었습니다.';
        } else if (err.includes('missing variable name')){ 
            return '구문 오류: 변수명이 선언되지 않았거나 잘못된 변수명이 발견되었습니다.';
        } else if (err.includes('function statement requires a name')){ 
            return '구문 오류: 함수의 이름 혹은 표현식이 잘못 정의되었습니다.';
        } else if (err.includes('unterminated string literal')){ 
            return '구문 오류: 종료되지 않은 문자열 리터럴 오류 발생';
        } else if (err.includes('use strict not allowed in function with non-simple parameters')){ 
            return '구문 오류: 단순하지 않은 매개변수가 있는 함수에서는 "use strict"가 허용되지 않습니다.';
        }
        else return '구문 오류: 언어의 구문에 맞지 않는 오류 혹은 토큰 오류가 발생했습니다.';

    // TypeError
    } else if(err.includes('TypeError')) {
        if (err.includes('More arguments needed')) {
            return '자료형 오류: 함수 호출 시 에러가 발생했습니다. 더 많은 인수가 주어져야 합니다.';
        } else if (err.includes('Reduce of empty array with no initial value')){
            return '유형 오류: 초기 값이 없는 빈 배열의 감소';
        }
        else return '자료형 오류: 변수나 매개변수가 유효한 자료형이 아닙니다.';

    } 
    else { return err; }
}

function timeReturn()
{
    // Get Date Format YY-mm-dd HH:mm:ss
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    month = month >= 10 ? month : '0' + month;
    let day = date.getDate();
    day = day >= 10 ? day : '0' + day;
    let hour = date.getHours();
    hour = hour >= 10 ? hour : '0' + hour;
    let min = date.getMinutes();
    let sec = date.getSeconds();
    sec = sec >= 10 ? sec : '0' + sec;
    let purchaseDay = year + '-' + month + '-' + day + '_' + hour + '-' + min + '-' + sec;

    return String(purchaseDay)
}


exports.json_parse = function(jscode, playbook){
    const dataBuffer = fs.readFileSync(String(playbook)); // read JSON
    const codeBuffer = fs.readFileSync(String(jscode));  // read js code 

    const dataJSON = dataBuffer.toString();
    const data = JSON.parse(dataJSON);
    let str = "";

    str += "input\n";
    for(let i=0; i<data.input.items.length; i++){
        let findString = "$" + String(data.input.items[i].name) + " = input['" + String(data.input.items[i].name) + "']";
    
        err = codeBuffer.indexOf(findString);
        if (err == -1){
            str += "(1:1 대응 오류) Input 코드에 "+ String(data.input.items[i].name) + " 속성이 없습니다.\n";
        }
    }
    str += "output\n";
    for(let i=0; i<data.output.items.length; i++){
        let findString = String(data.output.items[i].name) + ":";
        
        err = codeBuffer.indexOf(findString);
        if (err == -1){
            str += "(1:1 대응 오류) Output 코드에 "+ String(data.output.items[i].name) + " 속성이 없습니다.\n";
        }
    }

    return str;
}

exports.err_catch = function(jscode) {
    const fileRead = fs.readFileSync(String(jscode)); // read js code
    const fr = fileRead.toString();
    const codeString = String(fr);
    
    try {
        eval(codeString);
    }catch(error)
    {
        const errorString = errTranslate(String(error));
        return errorString;
    }
    return "에러가 없습니다.";
}

exports.err_catch_dir = function(codedir, logdir) {
    const directoryPath1 = path.join(__dirname, codedir); // error code dir
    const directoryPath2 = path.join(__dirname, logdir);  // log output dir
    
    var count = 0;

    fs.readdir(directoryPath1, function (err, files) {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        } 
        //listing all files using forEach
        files.forEach(function (file) {
            // Do whatever you want to do with the file
            const fileRead = fs.readFileSync(directoryPath1+'/'+file);
            const fr = fileRead.toString();
            const codeString = String(fr);
    
            try {
                eval(codeString);
            }catch(error)
            {
                let purchaseDay = timeReturn();
                count += 1;
                const errorString = errTranslate(String(error));
                fs.writeFile(directoryPath2+'/'+purchaseDay+'_'+count+'.txt', errorString, 'utf8', function(error){
                    console.log("write end");
                });
            }
        });
      });
}
        