
const express = require('express');
const app = express();
const http = require('http');
const request = require("request")

app.get("/", (request, response) => {
  response.sendStatus(200);
});
app.listen(process.env.PORT);


const Discord = require('discord.js');
const client = new Discord.Client({ disableMentions: 'everyone' });
  let util = require('./node_modules/discord.js/src/util/Constants.js')
util.DefaultOptions.ws.properties.$browser = `Discord iOS`
const chalk = require('chalk');
const fs = require('fs');
const parsems = require("parse-ms");
const ms = require("ms");
const moment = require('moment');
require("moment-duration-format");
const config = require("./config.json")

require('./utils/eventLoader')(client);

var prefix = config.prefix;
const log = message => {
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);
};
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./src/', (err, files) => {
  if (err) console.error(err);
  log(`${files.length} commands loaded..`);
  files.forEach(f => {
    let props = require(`./src/${f}`);
    log(`Loaded: ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});
client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./src/${command}`)];
      let cmd = require(`./src/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};
client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./src/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
        
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};
client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./src/${command}`)];
      let cmd = require(`./src/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.elevation = message => {
  if(!message.guild) {
	return; }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.member.hasPermission("MANAGE_MESSAGES")) permlvl = 4;
  return permlvl;
};
var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
client.on('warn', e => {
  console.log(chalk.bgYellow(e.replace(regToken, 'that was redacted')));
});
client.on('error', e => {
  console.log(chalk.bgBlue(e.replace(regToken, 'that was redacted')));
});
  
client.login(config.token);





