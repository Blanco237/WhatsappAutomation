const qrcode = require('qrcode-terminal');
const tord = require('better-tord');

const prompt = require('prompt-sync')();

let input = "";

while(input != 'exit'){
    input = prompt("Truth or Dare? > ");

    if(input.trim()=='truth'){
        console.log(tord.get_truth());
    }
    
    else if(input.trim()=='dare'){
        console.log(tord.get_dare());
    }
    
    else{
        console.log(tord.get_random_question());
    }
}