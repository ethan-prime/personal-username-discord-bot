const TOKEN = "<TOKEN>";
const { Client, Intents, MessageEmbed, MessageFlags } = require('discord.js');
const axios = require('axios');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

const allIntents = new Intents(32767);
const client = new Client({ intents: allIntents });
const prefix = '!';

client.on('messageCreate', (message) => {
    if(!message.content.startsWith(prefix)) return;
    var args = message.content.replace(prefix,'').split(' ');
    switch(args[0]) {
        case "hi":
            message.reply('hey');
            break;
        case "fortnite":
            var d_name = args.slice(1, args.length).join(' ');
            const options = {
                method: 'get',
                url: 'https://og-fortnite-api.herokuapp.com/check',
                data: {
                    name: d_name
                }
            }
            axios(options)
                .then((response) => {
                    if(response.data.found == 'none') {
                        message.reply("I couldn't find a name, sorry.")
                    } else {
                        message.reply(response.data.found);
                    }
                })
                .catch((err) => {
                    message.reply(err.response.data.message || 'There was an unknown error, sorry.');
                    return;
                });
            break;
        case "tiktok":
            var d_name = args[1];
            axios.get(`https://tiktok-user-api.herokuapp.com/available/${d_name}`)
                .then((response) => {
                    if(response.data.available == 'true') {
                        message.reply(`[AVAILABLE] ${d_name}`);
                    } else {
                        message.reply(`[TAKEN] ${d_name}`);
                    }
                })
                .catch((err) => {
                    message.reply(err.response.data.message || 'There was an unknown error, sorry.');
                });
            break;
    }
});

client.on('ready', () => {
    console.log(`Bot connected.`);
});

app.listen(PORT, () => {
    console.log(`Express server hosted on PORT ${PORT}`);
});

client.login(TOKEN);