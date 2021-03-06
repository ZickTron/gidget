const Discord = require('discord.js');

module.exports = {
    run: async (bot, message, args) => {
        if(args[1]){
            var num = args[1] - 1;
            if(typeof num == 'number' && num <= 8 && num >= 0) {
                var ttimages = ["https://cdn.glitch.com/84ebc03b-eca4-4002-8f38-f0a86014f9e8%2FA_Tale_of_Tails.jpg?v=1585893518859", "https://cdn.glitch.com/84ebc03b-eca4-4002-8f38-f0a86014f9e8%2FSpecial_Delivery.jpg?v=1585893539058", "https://cdn.glitch.com/84ebc03b-eca4-4002-8f38-f0a86014f9e8%2FWidget%20Wild%20Ride.jpg?v=1585893555107", "https://cdn.glitch.com/84ebc03b-eca4-4002-8f38-f0a86014f9e8%2FAttack%20of%20the%2050-Foot%20Fleggle.jpg?v=1585893526901", 'https://cdn.glitch.com/84ebc03b-eca4-4002-8f38-f0a86014f9e8%2FWubbzy%20in%20the%20Woods.jpg?v=1585893506049', 'https://cdn.glitch.com/84ebc03b-eca4-4002-8f38-f0a86014f9e8%2FA%20Little%20Help%20From%20Your%20Friends.jpg?v=1585893516804', 'https://cdn.glitch.com/84ebc03b-eca4-4002-8f38-f0a86014f9e8%2FGoo_Goo_Grief!.png?v=1585893550776', 'https://cdn.glitch.com/84ebc03b-eca4-4002-8f38-f0a86014f9e8%2FPerfecto%20Party.jpg?v=1585893545212', 'https://cdn.glitch.com/84ebc03b-eca4-4002-8f38-f0a86014f9e8%2FA%20Clean%20Sweep.jpg?v=1585893553041'];
                var ttfull = ttimages[num];
                const tt = new Discord.MessageAttachment(ttfull);
                message.channel.send(tt);
            } else {
                message.reply('Invalid number!');
            }
        } else {
            message.reply('Put some number!');
        }
    },
    aliases: ['tt'],
    description: "Shows a title card from the Wubbzy show",
}