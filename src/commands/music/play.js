const ytdl = require("ytdl-core");
const ytsr = require("ytsr");
const ytpl = require("ytpl");
ytpl.do_warn_deprecate = false
const moment = require("moment");
require("moment-duration-format");
module.exports = {
  run: async (bot, message, args, seek) => {
    if (!message.guild)
      return message.channel.send("This command only works on servers.");
    if (!args[1])
      return message.channel.send(
        "Please enter a YouTube link or search term."
      );
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel)
      return message.channel.send(
        "You need to be in a voice channel to play music!"
      );
    const serverQueue = message.guild.queue;
    if (serverQueue) {
      if (serverQueue.voiceChannel.id !== voiceChannel.id)
        return message.channel.send(
          "I'm on another voice channel! I cannot be on two channels at the same time."
        );
    }
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
      return message.channel.send(
        "I need the permissions to join and speak in your voice channel!"
      );
    }
    if (message.guild.afkChannelID === voiceChannel.id) {
      return message.channel.send("I cannot play music on an AFK channel.");
    }
    let musicVariables = message.guild.musicVariables
    if (musicVariables && musicVariables.other)
      return message.channel.send("I'm doing another operation");
    if (!musicVariables) {
      message.guild.musicVariables = {
        merror: 0,
        perror: 0,
        inp: 0,
        py: 0,
        memberVoted: [],
        i: 0,
        o: 0,
        time: null,
        time1: null,
        other: false
      };
      musicVariables = message.guild.musicVariables
    }
    if (musicVariables.inp == 1) return message.channel.send("I'm catching your playlist. Hang on!");

    if(typeof seek === "number") {
      return await play(message.guild, serverQueue.songs[0], seek)
    } else if (ytdl.validateURL(args[1])) {
      if (serverQueue) {
        if (serverQueue.loop) {
          serverQueue.loop = false;
          message.channel.send("🔁 The song repeat has been disabled.");
        }
      }
      message.channel.startTyping();
      return handleVideo(message, voiceChannel, args[1]);
    } else if (ytdl.validateID(args[1])) {
      if (serverQueue) {
        if (serverQueue.loop) {
          serverQueue.loop = false;
          message.channel.send("🔁 The song repeat has been disabled.");
        }
      }
      message.channel.startTyping();
      return handleVideo(message, voiceChannel, "https://www.youtube.com/watch?v=" + args[1]);
    } else if (ytpl.validateURL(args[1])) {
      let form1 = await message.channel.send("Hang on! <:WaldenRead:665434370022178837>");
      message.channel.startTyping();
      try {
        const playlist = await ytpl(args[1]);
        const videos = playlist.items;
        message.channel.startTyping(playlist.items.length - 1);
        musicVariables.inp = 1;
        if (serverQueue) {
          if (serverQueue.loop) {
            serverQueue.loop = false;
            message.channel.send("🔁 The song repeat has been disabled.");
          }
        }
        for (const video of Object.values(videos)) {
          await handleVideo(message, voiceChannel, video.url_simple, true).catch(error =>
            console.log(error)
          );
        }
        if (musicVariables.inp == 1) {
          musicVariables.inp = 0;
          musicVariables.perror = 0;
          message.channel.stopTyping(true);
          message.channel
            .send(`Playlist: **${playlist.title}** has been added to the queue (${playlist.items.length} songs)!`)
            .then(m => form1.delete());
        } else {
          musicVariables.inp = 0;
          musicVariables.perror = 0;
          message.channel.stopTyping(true);
          message.channel
            .send("I couldn't queue your playlist.")
            .then(m => form1.delete());
        }
      } catch (err) {
        if (!serverQueue) message.guild.musicVariables = null;
        message.channel.stopTyping(true);
        message.channel.send("Some error ocurred. Here's a debug: " + err);
      }
    } else {
      let filter;
      try {
        message.channel.startTyping();
        const filters = await ytsr.getFilters(args.slice(1).join(" "));
        filter = filters.get("Type").find(o => o.name === "Video");
        let options = {
          limit: 1,
          nextpageRef: filter.ref
        };
        const searchResults = await ytsr(null, options);
        if (serverQueue) {
          if (serverQueue.loop) {
            serverQueue.loop = false;
            message.channel.send("🔁 The song repeat has been disabled.");
          }
        }
        if (!searchResults) {
          message.channel.stopTyping(true);
          return message.reply(
            `I didn't find any video. Check your term and try again.`
          );
        }
        if (!searchResults.items[0]) {
          message.channel.stopTyping(true);
          return message.reply(
            `I didn't find any video. Check your term and try again.`
          );
        }
        return handleVideo(message, voiceChannel, searchResults.items[0].link);
      } catch (err) {
        if (!serverQueue) message.guild.musicVariables = null;
        message.channel.stopTyping(true);
        message.channel.send("Some error ocurred. Here's a debug: " + err);
      }
    }
  },
  aliases: ["join"],
  description: "Play music from YouTube"
};

async function handleVideo(message, voiceChannel, ytlink, playlist = false) {
  const serverQueue = message.guild.queue;

  const musicVariables = message.guild.musicVariables;
  const songInfo = await ytdl.getInfo(ytlink).catch(err => {
      console.log(err);
      musicVariables.merror = 1;
    });
  if (musicVariables.merror == 1) {
    message.channel.stopTyping(true);
    musicVariables.merror = 0;
    if (playlist && musicVariables.perror == 0) {
      musicVariables.perror = 1;
      return message.reply(`I couldn't catch all the videos.`);
    } else if (!playlist) {
      return message.reply("something bad happened. Try again!");
    } else {
      return;
    }
  } else {
    const song = {
      title: songInfo.videoDetails.title,
      url: songInfo.videoDetails.video_url,
      duration: songInfo.videoDetails.lengthSeconds,
      seektime: 0,
    };

    if (!serverQueue) {
      const queueConstruct = {
        textChannel: message.channel,
        voiceChannel: voiceChannel,
        connection: null,
        songs: [],
        volume: 5,
        playing: true,
        loop: false,
        inseek: false,
      };
      queueConstruct.songs.push(song);
      message.guild.queue = queueConstruct;

      try {
        let connection = await voiceChannel.join();
        if (connection.voice.mute) {
          setTimeout(async () => {
            await voiceChannel.leave();
          }, 10000);
          message.guild.queue = null;;
          message.guild.musicVariables = null;
          message.channel.stopTyping();
          return message.channel.send(
            "Sorry, but I'm muted. Contact an admin to unmute me."
          );
        }
        queueConstruct.connection = connection;
        musicVariables.py = 1;
        await play(message.guild, queueConstruct.songs[0]);
        message.channel.stopTyping();
      } catch (error) {
        console.error(error);
        await voiceChannel.leave();
        message.guild.queue = null;
        message.guild.musicVariables = null;
        message.channel.stopTyping();
        return message.channel.send(
          "I could not join the voice channel. To prevent the bot from turning off the queue has been removed. Here's a debug: " +
            error
        );
      }
    } else {
      serverQueue.songs.push(song);
      if (playlist) return;
      else {
        message.channel.stopTyping();
        return message.channel.send(
          `**${song.title}** has been added to the queue!`
        );
      }
    }
    return;
  }
}
async function play(guild, song, seek = 0) {
  const serverQueue = guild.queue;

  const musicVariables = guild.musicVariables;

  if (!song) {
    if(serverQueue) {
      if (serverQueue.textChannel) {
      serverQueue.textChannel.stopTyping();
    }
    if (serverQueue.voiceChannel) {
      serverQueue.voiceChannel.leave();
    }
    }
    guild.queue = null;
    guild.musicVariables = null;
    return;
  }
  try {
    const dispatcher = serverQueue.connection.play(ytdl(song.url, { filter: "audioonly", highWaterMark: 1 << 25 }), { seek: seek });
    dispatcher.on("start", async () => {
      if (serverQueue.inseek) {
        serverQueue.inseek = false
        serverQueue.textChannel.stopTyping();
        return serverQueue.textChannel.send("Position moved to " + moment.duration(seek, "seconds").format());
      };
      dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
      if (!serverQueue.loop)
        serverQueue.textChannel.send(
          `<:JukeboxRobot:610310184484732959> Now playing: **${song.title}**`
        );
      serverQueue.textChannel.stopTyping();
    });
    dispatcher.on("finish", async () => {
      if(serverQueue.inseek) return;
      musicVariables.memberVoted = [];
      if (!serverQueue.loop) serverQueue.songs.shift();
      if (!serverQueue.playing) serverQueue.playing = true;
      await play(guild, serverQueue.songs[0]);
    });
    dispatcher.on("close", async () => {
      if (serverQueue.inseek) return;
      if(!guild.me.voice.channel) {
        clearTimeout(musicVariables.time);
        if (serverQueue.textChannel) {
          serverQueue.textChannel.stopTyping();
        }
        if (serverQueue.voiceChannel) {
          serverQueue.voiceChannel.leave();
        }
        guild.queue = null;
        guild.musicVariables = null;
        return;
      }
    });
    dispatcher.on("error", async err => {
      musicVariables.memberVoted = [];
      serverQueue.songs.shift();
      await serverQueue.textChannel
        .send("An error occurred with the dispatcher. Here's a debug: " + err)
        .catch(err => console.log(err));
      if (!serverQueue.playing) serverQueue.playing = true;
      await play(guild, serverQueue.songs[0]);
    });
  } catch (err) {
    console.log(err);
    musicVariables.memberVoted = [];
    serverQueue.songs.shift();
    if(serverQueue.textChannel) {
      serverQueue.textChannel.stopTyping();
      await serverQueue.textChannel
      .send("An error occurred. Here's a debug: " + err)
      .catch(err => console.log(err));
    }
    if (!serverQueue.playing) serverQueue.playing = true;
    await play(guild, serverQueue.songs[0]);
  }
}
