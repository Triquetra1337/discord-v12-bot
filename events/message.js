const Discord = require('discord.js');
const config = require('../config.json');
const moment = require('moment');
let talkedRecently = new Set();
module.exports = async message => {

          
  
  
  let client = message.client;
  if (message.author.bot) return;
  

  
  
  
  let command = message.content.split(' ')[0].slice(config.prefix.length);
  
  if (!message.content.startsWith(config.prefix)) return;
  
 
  
  let params = message.content.split(' ').slice(1);
  let perms = client.elevation(message);
  let cmd;
  if (client.commands.has(command)) {

    cmd = client.commands.get(command);
  } else if (client.aliases.has(command)) {
    cmd = client.commands.get(client.aliases.get(command));
  }
  if (cmd) {    

  
    if (perms < cmd.conf.permLevel) return;
    cmd.run(client, message, params, perms);
  }
  

  

};