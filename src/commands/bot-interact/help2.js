const Discord = require('discord.js');

module.exports = {
    run: async (bot, message, args) => {
        let text = '';
        if (message.channel.type === 'dm') {
          text += 'I\'m here';
        } else {
          text += 'I came to ' + message.guild.name;
        }
        const embed = new Discord.MessageEmbed()
        .setTitle('I\'m Gidget')
        .setColor('#FFFFFF')
        .setDescription('I am a robot created by ~~AndreMor~~ Widget, and now ' + text + '! Great, right? I hope to increase my commands to help this server more! My default prefix is **g%**')
        .setThumbnail('https://vignette.wikia.nocookie.net/wubbzy/images/7/7d/Gidget.png')
        .addField('Moderation & admin commands', `kick = Kick a member from the server\nban = Ban a member from the server\nunban = Unban someone in this server\nrestrict = Add the Restricted role to a member from the server\nunrestrict = Remove the Restricted role to a member from the server\npurge = Mass deletion of messages on the current channel.\nslowmode = Put slowmode to current channel or mentioned channel (IDs are accepted)\nwarn = A dynamic warning system that admins can change.\npardon = Remove a warning from a member.\nhackban = Ban someone who is not on this server. (Only snowflakes)\nlimitemoji = Limit emojis to a specific role.\n`)
        .addField('Information commands', `info = Information about me in plain text\nping = Response time from the web server (Glitch) to Discord.\navatar = I'll show your avatar or another user's avatar.\nserverinfo = Some info about the server\nuserinfo = Some info about you or another user\nroleinfo = Some info about a role. If unspecified, it will use the highest existing role you have.\nstats = Gidget stats\nstatus = Obtain the status of a user, and the client that user currently uses.\nguildinvites = This shows how many invitations there are on the server.\nwarnings = See how many warnings you have. \nsearch = Search for something on Google.\nemojiinfo = Get information about a emoji\nchannels = Get the server's channel structure\nchannelinfo = Get info about a channel\noverrides = See the channel overrides.\ndjsdocs = Get info from the Discord.js docs\nfetchinvite = Fetch a invite from Discord`)
        .addField('Image commands', `wubbzyimage\nwidgetimage\nwaldenimage\ndaizyimage\nimage = I will give you the image that you ask for.\ntitlecard = I will upload a title card from Wow! Wow! Wubbzy! according to the number you choose. (1-9 for now)\nwubmeme = Generate an image from the text that is given.\nwalden = Same as above`)
        .addField('Music commands', `**Warning:** This feature is experimental!\n\nplay = I'll start playing music either from a YouTube link or a search term.\nskip = I'll skip a song from the queue.\nstop = I'll stop and exit the voice channel.\npause = I'll pause the song\nresume = I'll resume the song\nloop = I'm going to repeat your queue.\nnp = The song I am currently playing.\nqueue = Your list of songs that I will be playing.\nvolume = Change dispatcher volume, numbers from 0 to 5 are allowed (including decimals).\n\nrecord = I will record what you say on a voice channel (experimental)`)
        .addField("Level commands", `leaderboard = It shows a top 10 with the people who have the most points.\nrank = Show your current level and points.\ntogglelevel = Activate or deactivate the level system, the same for level-up notifications.\nmodifylevel = Modify someone's level.`)
        .addField('Ticket commands', `startticket = Start listening to tickets from a channel. If you are not an admin it will tell you where you can create one.\ncloseticket = Close a ticket and delete the respective data from my database.\nfinishticket = Finish listening to tickets. (admins only)\nmodifyticket = Modify the ticket system on the server`)
        .addField("Custom responses commands", `addcc = Add a custom response (may include images)\nlistcc = A list of custom responses.\ndelcc = Remove a custom response from the server`)
        .addField("Commands for roles", `\naddrr = Add reaction-roles to messages (admins only)\neditrr = Edit reaction-roles of the messages (admins only)\nselfrole = Command for selfroles. Put "join" or "leave" with the selfrole name to add or remove the role. Put "list" for a list of them.\ntoggleretrieving = By enabling it, when a user leaves the server, their roles will be returned to them when they join again.`)
        .addField('Other commands', `say = Make me say something\n8ball = A fun 8ball game\nmorse = I'll convert your text to Morse code.\ncoinflip = Flip a coin.\npoll = A basic poll, accepts personalized reactions, with specified time.\nreverse = Reverse some text.\ncalc = Calculate something\nemojis: Get all the emojis in a server\nqr = Generate a QR, using the specified text.\nedits = Get edits from a cached message\nytsearch = Search through YouTube videos.\nbotapp = Information about me in my application on Discord.\ndeconstruct  = Deconstruct a Discord snowflake\nchoose = Set parameters for me to choose.`)
        .addField('Owner-only commands', `trw = Like the say command, but this time for the webhook The real Wubbzy.\nreboot = Restart the server-side part of the bot to update files.\neval = It allows to run code in the bot's JS environment.\nbotstatus = Change the bot's presence in Discord (WWD admins only)`)
        .addField('Links', `[AndreMor's page](https://andremor955.github.io) | [Discord.js documentation](https://discord.js.org/#/docs/)`)
        if(message.content.includes("--nodm") || !message.guild) {
          message.channel.send(embed);
        } else {
          message.author.send(embed).then(m => message.channel.send("I've sent the list to your DM.")).catch(err => message.channel.send("Your DMs seem to be closed"));
        }
    },
    aliases: [],
    secret: true,
    description: "Shows help with bot commands",
}