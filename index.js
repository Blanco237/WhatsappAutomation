const { Client, LocalAuth } = require('whatsapp-web.js');
const printer = require('qrcode-terminal');
const fs = require('fs');

const SESSION_FILEPATH = "./session.json";
let sessionData = null;

if (fs.existsSync(SESSION_FILEPATH)) {
    sessionData = require(SESSION_FILEPATH);
}

const client = new Client({
    session: sessionData,
    authStrategy: new LocalAuth({
        clientId: "client-one"
    })
});

client.on('authenticated', (session) => {
    sessionData = session;
    // fs.writeFile(SESSION_FILEPATH, JSON.stringify(sessionData), (err) => {
    //     if (err) {
    //         console.log(`Error Occured::`, err);
    //     }
    // })
})

client.on('qr', (qr) => {
    console.log("QR CODE RECIEVED");
    console.log(qr);
    printer.generate(qr, { small: true })
})

client.on('ready', async () => {
    console.log('CLIENT IS READY');

    const chats = await client.getChats();

    fs.writeFileSync('./chats.json', JSON.stringify(chats), (err) => {
        if (err) {
            console.log(`Error: `);
            console.log(err);
        }
    })

})


client.initialize();