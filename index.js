const { Client } = require('whatsapp-web.js');
const printer = require('qrcode-terminal');
const tord = require('better-tord');
const fs = require('fs');

const SESSION_FILEPATH = "./session.json";
let sessionData = null;

if(fs.existsSync(SESSION_FILEPATH)){
    sessionData = require(SESSION_FILEPATH);
}

const client = new Client({
    session: sessionData
});

client.on('authenticated', (session) => {
    sessionData = session;
    fs.writeFile(SESSION_FILEPATH, JSON.stringify(sessionData), (err) => {
        if(err){
             console.log(`Error Occured::`,err);
        }
    })
})

client.on('qr', (qr) => {
    console.log("QR CODE RECIEVED");
    console.log(qr);
    printer.generate(qr,{small: true})
})

client.on('ready', async () => {
    console.log('CLIENT IS READY');
    // let allChats = await client.getChats();
    
})

client.on('message', async (message) => {

    console.log(`New Message from: ${(await message.getContact()).pushname}\nContaining: ${message.body}`);
    if(message.body[0] == '!'){
        console.log("Command Received");
        let choice = message.body.substring(1).trim().toLowerCase();
        console.log('Choice is ', choice);
        if(choice.slice(0,5) == 'truth'){
            message.reply(tord.get_truth());
        }
        else if(choice.slice(0,4) == 'dare'){
            message.reply(tord.get_dare());
        }
        else if(choice.slice(0,8) == 'everyone'){
            const chat = await message.getChat();
            let text =  choice.slice(8).trim();
            let mentions = [];

            for(let participant of chat.participants){
                const contact = await client.getContactById(participant.id._serialized);

                mentions.push(contact);
                if(participant.id.user == '23775761546'){
                    continue;
                }
                text += `\n @${participant.id.user}`;
            }

            await chat.sendMessage(text, { mentions });
        }
        else if(choice.slice(0,4) == 'mute'){
            let chat1 = await message.getChat();
            try{
                await chat1.setMessagesAdminsOnly();
            }catch(e){
                console.log(`Error: ${e.message}`);
            }
            
        }
    }
})


client.initialize();