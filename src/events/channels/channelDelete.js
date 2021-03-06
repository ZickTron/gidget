const MessageModel = require("../../database/models/tmembers.js");
const MessageModel2 = require("../../database/models/ticket");
const MessageModel3 = require("../../database/models/poll");
module.exports = async (bot, channel) => {

  await MessageModel3.deleteMany({ channelId: channel.id });

  if(channel.guild && channel.guild.available) {
  await MessageModel2.deleteMany({ channelId: channel.id })
  let msgDocument = await MessageModel.findOne({ guildId: channel.guild.id, channelId: channel.id });
  if(msgDocument) {
    const { memberId } = msgDocument;
    const member = await channel.guild.members.fetch(memberId);
    if (member) {
      let auditlog = await channel.guild.fetchAuditLogs({
        limit: 1,
        type: 12
      });
      let entry = auditlog.entries.first()
      if (entry.executor.id === bot.user.id) return;
      else member.send("Your ticket was deleted by "  + entry.executor.tag).catch(() => {});
    }
    msgDocument.deleteOne();
  }
  } else if (channel.type === "text") {
    let msgDocument = await MessageModel.findOne({ guildId: channel.guild.id, channelId: channel.id });
    if(msgDocument) msgDocument.deleteOne();
  }
}