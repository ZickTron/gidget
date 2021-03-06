require("dotenv").config();
// index.js
// where your node app starts

// init project
const Discord = require("discord.js");
require("./structures");
const bot = new Discord.Client({ partials: ['MESSAGE', 'REACTION', 'CHANNEL', 'GUILD_MEMBER', 'USER'], ws: { properties: { $browser: "Discord Android" }, intents: Discord.Intents.ALL }, allowedMentions: { parse: [] }});
const reg = require('./utils/registry');
const puppeteer = require("puppeteer");
const database = require("./database/database");
let version = "0.98 Post-Beta";

process.on("unhandledRejection", error => {
  console.error("Unhandled promise rejection:", error);
});

(async () => {
  //Pre-login
  //Database
  await database.then(() => console.log("Connected to the database."));
  //Music collections
  bot.musicVariables1 = new Discord.Collection();
  bot.queue = new Discord.Collection();
  //Command collection
  bot.commands = new Discord.Collection();
  //Cache system
  bot.cachedMessageReactions = new Discord.Collection();
  bot.autoresponsecache = new Discord.Collection();
  bot.level = new Discord.Collection();
  bot.rrcache = new Discord.Collection();
  bot.guildprefix = new Discord.Collection();
  //Timezone thing
  bot.intl = Intl.DateTimeFormat("en", { dateStyle: "full", timeStyle: "full", timeZone: "America/New_York", hour12: true, timeZoneName: "short" })
  //Puppeteer
  bot.browser = await puppeteer.launch({ headless: true, defaultViewport: {
    width: 1440,
    height: 900
  }, args: ["--disable-gpu", "--no-sandbox", "--disable-setuid-sandbox"] });
  //Registers
  reg.registerEvents(bot, "../events");
  reg.registerCommands(bot, "../commands");
  //Login and post-login
  await bot.login();
  bot.user.setPresence({
    activity: { name: "Ready event (Loading...)", type: "LISTENING" },
    status: "dnd"
  });
})().catch(err => {
  console.log(err);
  setTimeout(() => process.exit(1), 1000);
});

module.exports = {
  bot, version
}
