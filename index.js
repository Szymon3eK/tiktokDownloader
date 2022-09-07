const TelegramBot = require('node-telegram-bot-api');
const { brotliCompress } = require('zlib');
const {token} = require('./config');
const { exec, spawn } = require('node:child_process');
const fs = require('fs');
const { isBoxedPrimitive } = require('util/types');

const bot = new TelegramBot(token, {polling: true});

console.log('Bot aktywny!')

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const message = msg.text;

    const l2 = message.split('?').pop();
    const l3 = message.replace(l2, '')
    const qualitylink = l3.replace('?', '')

    console.log({l2, l3, qualitylink})

    const randomnumber = Math.floor(Math.random() * 10000000) + 1;
    console.table({l2, l3, qualitylink})

    console.table({randomnumber, message, qualitylink})

    bot.sendMessage(chatId, '[💛] Pobieranie pliku...')
    
    exec(`python3 -m tiktok_downloader --snaptik --url ${message.includes("?") ? qualitylink : message} --save ./movies/${randomnumber}.mp4`, (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      bot.sendMessage(chatId, '[💔] Wystapil blad z pobraniem filmu [python3 -m tiktok_downloader --snaptik --url ${message} --save ./movies/${randomnumber}.mp4]');
      return; 
    }
    bot.sendMessage(chatId, '[💚] Pobieranie zakonczone! ');

    async function sendVideo() {
        await bot.sendVideo(chatId, `./movies/${randomnumber}.mp4`);
        fs.unlinkSync(`./movies/${randomnumber}.mp4`);
    }

    sendVideo();
 
  });    


    });