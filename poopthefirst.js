module.exports = (() => {
  require("dotenv").config();
  /* changelog-0
    originalcommands - !cutie !handhold !handshake !dab !send !cuddle !slap !kiss !hug !spit !bully !why !smoke !godgamer !untuck !bang !dubtrack
    logs - https://poop.delivery/log/poopthefirst
  */
  try {
    const {
      DEBUG,
      CHANNEL,
      TWITCH_OAUTH_PASSWORD,
      TWITCH_OAUTH_USERNAME,
    } = process.env;
    const EXCLUDE_CHATTERS = [
      "nightbot",
      "moobot",
      "markov_chain_bot",
      "sumbot_",
      "poopthefirst",
      "danitko",
      "moonmoon_nam",
      "scootycoolguy",
      "60121849657221935028128",
    ];
    const sleep = require("util").promisify(setTimeout);
    const { ChatClient } = require("dank-twitch-irc");

    const getRandomArrayElement = (arr) =>
      arr[Math.floor(Math.random() * arr.length)];

    let client = new ChatClient({
      username: TWITCH_OAUTH_USERNAME,
      password: TWITCH_OAUTH_PASSWORD,
      ignoreUnhandledPromiseRejections: true,
    });

    client.on("ready", () => {
      console.log("Successfully connected to chat");
    });
    client.on("close", (error) => {
      if (error != null) {
        console.error("Client closed due to error", error);
      }
    });
    client.connect();
    client.join(CHANNEL);

    let globalCommandCooldown = 4201,
      dtsLastMessageSent = Date.now(),
      isMoonLive = false,
      recentChatters = [],
      recentChatterColors = {};

    client.on("message", (event) => {
      // if (DEBUG) console.info('client event: ', event);

      const {
        senderUsername: sender,
        colorRaw: senderColorHex,
        color: senderColorRgb,
        messageText,
      } = event;

      if (
        !recentChatters.includes(sender) &&
        !EXCLUDE_CHATTERS.includes(sender) &&
        typeof sender === "string"
      ) {
        recentChatters = recentChatters.concat(sender).slice(0, 49);
        if (DEBUG) console.info(`recentChatters `, recentChatters);

        if (!Object.keys(recentChatterColors).includes(sender)) {
          recentChatterColors[sender] = { senderColorHex, senderColorRgb };
        }
        if (DEBUG) console.info(`recentChatterColors `, recentChatterColors);
      }

      // throw a return here for system notice that he is live
      // console.info(senderColorRgb)
      if (event.senderUsername === "60121849657221935028128") {
        console.log(`${sender}: ${messageText}`);
        dtsLastMessageSent = Number(event.serverTimestampRaw);
        return;
      }

      if (typeof messageText != "string") {
        return;
      }

      if (Date.now() < dtsLastMessageSent + globalCommandCooldown) {
        return;
      }

      if (!messageText.startsWith("!")) {
        return;
      }

      let [command, target] = messageText.split(" ");

      command = command.slice(1).toLocaleLowerCase();

      if (!target) {
        target = "chat";
      }

      if (typeof target === "string" && target.startsWith("@")) {
        target = target.slice(1);
      }

      let fullMessage = "";

      if (command === "help") {
        let _target = !target || target === 'chat' ? sender : target
        client.say(CHANNEL, `!commands ${_target}`);
        setTimeout(() => {
          client.me(
            CHANNEL,
            `${_target} !handhold !handshake !dab !send !cuddle !slap !kiss !hug !spit !bully !why !smoke !godgamer !untuck !bang !poop, !color`
          );
        }, 5001);
      }

      if (command === "commands") {
        client.me(
          CHANNEL,
          `${sender} !handhold !handshake !dab !send !cuddle !slap !kiss !hug !spit !bully !why !smoke !godgamer !untuck !bang !poop, !mycolor`
        );
      }

      if (command === "othercommands") {
        const [msgPrefix, msgPostfix] = !target
          .split(" ")
          .map((x) => x.toLowerCase())
          .includes("nam")
          ? [`${sender} PawgChamp`, ""]
          : [`!nammers ${sender} takeTheRob`, "!nam"];

        client.say(
          CHANNEL,
          `${msgPrefix} | !othercommands !recentchatters !bttvsearch !cd !poopthefirst | unlisted bot commands | !onred !peep !mypp !peepod !bas1 !bas4 !pogbas !rq !rs !search !searchuser !piss !shit !cIean !pawgchamp ${msgPostfix}`
        );
      }

      if (["poopthefirst", "thiscode", "thisbot"].includes(command)) {
        client.say(
          CHANNEL,
          `this bot is dumb and the code is shit: https://github.com/chuckxD/chuckxD-60121849657221935028128-copy`
        );
      }

      if (command === "recentchatters") {
        let msgString = [];
        if (recentChatters.length > 0) {
          recentChatters.forEach((chatter) => {
            if (msgString.join(" ").length >= 265 && target !== "nolimit") {
              return;
            }
            msgString = msgString.concat(chatter);
          });
        }

        client.say(CHANNEL, msgString.join(" "));
      }

      if (command === "cd") {
        client.say(
          CHANNEL,
          `${sender} current command cool down is ${globalCommandCooldown} ms`
        );
      }

      if (command === "color") {
        const { r, g, b } = senderColorRgb;
        let msg = `${sender} `;
        if (DEBUG) console.dir(recentChatterColors);

        if (target && target !== "chat" && !recentChatters.includes(target)) {
          msg += `couldn't find ${target} in recent chatters.. Sadge `;
        }

        if (!target || target === "chat") {
          msg += ` here is your color's hex value: ${senderColorHex} | RGB values (respectively): ${r}, ${g}, ${b} ; type /color for more info`;
        }

        if (
          target &&
          recentChatters.includes(target) &&
          Object.keys(recentChatterColors).includes(target)
        ) {
          // do this later
          if (DEBUG && target)
            console.info(`RECENT CHATTER OBJ: `, recentChatterColors[target]);
          const { senderColorHex, senderColorRgb } = recentChatterColors[
            target
          ];

          const sillyStr = [
            `sender `,
            sender,
            `target `,
            target,
            `targetColorHex `,
            senderColorHex,
            ` targetColorRgb `,
            senderColorRgb,
          ].join();
          // if (DEBUG && Object.keys(recentChatterColors).includes(target)) console.info(recentChatterColors[target])

          if (DEBUG) console.info(sillyStr);
          msg += ` here is your half implemented feature ${sillyStr}`;
        }
        client.say(CHANNEL, msg);
      }

      if (command == "poop") {
        const msg1 = `${sender} is pooping`;
        const msg2 = getRandomArrayElement([
          `on ${target}'s bed`,
          `in ${target}'s bathtub`,
          `in the trunk of ${target}'s car`,
          `on ${target}'s chest`,
          `on ${target}'s desk`,
          `on ${target}'s porch`,
          `on ${target}'s carpet`,
          `in ${target}'s sink`,
          `in ${target}'s litter box. ${target} is a cat MYAAA`,
          `in ${target}'s dog bowl. ${target} is a dog EEKUM`,
        ]);
        const msg3 = getRandomArrayElement(["SHITTERS", "moon2DEV", "moon2C"]);
        fullMessage = [msg1, msg2, msg3].join(" ");

        client.say(CHANNEL, fullMessage);
      }

      if (command === "spit") {
        const msg1 = `${sender} is spitting in ${target}'s`;
        const msg2 = getRandomArrayElement(["hair", "food", "ear"]);
        fullMessage = [msg1, msg2, `☄ moon2DEV`].join(" ");
        client.say(CHANNEL, fullMessage);
      }

      if (command === "untuck") {
        const dab = getRandomArrayElement([
          "fuBaldi",
          "peepoD",
          "robDab",
          "HYPERROBDAB",
        ]);
        client.say(
          CHANNEL,
          `${sender} untucks ${target} from bed and dabs on their face ${dab} PEPELEPSY`
        );
      }

      if (command === "ban") {
        if (target === "60121849657221935028128") {
          client.me(
            CHANNEL,
            `🔧  ${target} has been permanently banned. RedTeam NaM 🔫 `
          );
        } else {
          client.me(CHANNEL, `🔧  ${target} has been permanently banned.`);
        }
      }

      if (command === "slap") {
        client.say(
          CHANNEL,
          `${sender} is slapping their cock on ${target}'s face PEPELEPSY`
        );
      }

      if (command === "bully") {
        const insult = getRandomArrayElement([
          "VIRGIN LOOOOLE",
          "LOOOOOOOOSER LOOOOOLE",
          "BITCH LOOOLE",
          "NERD LOOOOOLE",
          "PUSSY LOLE",
        ]);
        client.say(CHANNEL, [target, insult, "moon2LOLE"].join(" "));
      }

      if (command === "bang") {
        const msg1 = `${sender} is banging ${target}'s`;
        const msg2 = getRandomArrayElement([
          "in the thigh",
          "in the elbow",
          "in the tiddies",
          "in the 🅱ussy",
          "in the ass",
        ]);
        const emotes = [
          "gachiW",
          "PEPELEPSY",
          "gachiROLL",
          "pepeBASS",
          "PawgChamp",
        ];
        fullMessage = [
          msg1,
          msg2,
          getRandomArrayElement(emotes),
          getRandomArrayElement(emotes),
        ].join(" ");

        if (DEBUG) console.info(fullMessage);
        client.say(CHANNEL, fullMessage);
      }

      if (command === "godgamer") {
        client.say(
          CHANNEL,
          `${sender}, moon2M 📣 ${getRandomArrayElement([
            "Jump King DLC",
            "Terraria Master Hardcore",
            "DoomEternal Ultra Nightmare",
          ])} I BEAT IT ☑`
        );
      }

      if (command === "why") {
        client.say(
          CHANNEL,
          `${target === "chat" ? sender : target} why are you always here pepeW`
        );
      }

      if (command === "smoke") {
        client.say(
          CHANNEL,
          `${sender} is now smoking a cigarette with ${target} pepeSmoke pepeSmoke`
        );
      }

      if (command === "handshake") {
        client.say(
          CHANNEL,
          `${sender} firmly shakes ${target}'s hand moon2CD 🤝 moon2MD`
        );
      }

      if (command === "hug") {
        client.say(
          CHANNEL,
          `${sender} is hugging ${target} gently moon2CUTE moon2L`
        );
      }

      if (command === "kiss") {
        const bodyPart = getRandomArrayElement([
          "hand",
          "cheek",
          "lips",
          "belly button",
          "the forehead",
          "neck",
        ]);
        const emote = getRandomArrayElement([`💋 moon2S`, `💋 Kissahomie`]);

        client.say(
          CHANNEL,
          `${sender} is kissing ${target} on the ${bodyPart} ${emote}`
        );
      }

      if (command === "send") {
        client.say(CHANNEL, `${sender} sends ${target} on their way! 🚗 💨`);
      }

      if (command === "handhold") {
        client.say(CHANNEL, `${sender} is holding ${target}'s hand moon2L`);
      }

      if (command === "cuddle") {
        client.say(
          CHANNEL,
          `${sender} is cuddling with ${target} in bed moon2BED UwU`
        );
      }

      if (command === "gumiho") {
        client.say(CHANNEL, `is based`);
      }

      if (command === "dab") {
        client.say(
          CHANNEL,
          `HYPERROBDAB ${sender} is dabbing all over ${target}'s face HYPERROBDAB`
        );
      }

      if (command === "bttvsearch") {
        client.say(
          CHANNEL,
          `${sender} here's your link: https://betterttv.com/emotes/shared/search?query=${target}`
        );
      }

      if (command === "peep") {
        if (recentChatters.includes("dantiko")) {
          setTimeout(() => {
            client.say(CHANNEL, `ii am pep heh peepoD`);
          }, 3001);
        }

        if (!recentChatters.includes("dantiko")) {
          const victim = getRandomArrayElement(recentChatters);
          client.say(
            CHANNEL,
            `${sender} PEEPERS peepin in on ${target} fucking ${victim} 's mom peepersD PawgChamp`
          );
        }
      }

      if (command === "pawgchamp") {
        client.say(
          CHANNEL,
          `${getRandomArrayElement(
            recentChatters
          )} -> PawgChamp <- ${getRandomArrayElement(recentChatters)}`
        );
      }

      if (command === "bttv") {
        const ROUGHLY_MESSAGE_CHAR_LIMIT = 250;
        const https = require("https");
        const bttv_url =
          "https://api.betterttv.net/3/cached/users/twitch/121059319";

        https.get(bttv_url, (resp) => {
          let json,
            emoteCount,
            respStr = "",
            bttvEmotes = [],
            bttvEmoteMsgArray = [];

          resp.on("data", (data) => {
            respStr += data.toString();
          });

          resp.on("end", () => {
            json = JSON.parse(respStr);
            //console.log(
            //  `json resp: `,
            //  json.channelEmotes.map((obj) => obj.code).sort()
            //);
            emoteCount = json.channelEmotes.length;
            // console.log(`json.channelEmotes.length: `, json.channelEmotes.length)
            bttvEmotes = json.channelEmotes.map((obj) => obj.code).sort();

            let currentMsg = "";

            for (const emote of bttvEmotes) {
              // console.log(emote)
              currentMsg = currentMsg.split(" ").concat(emote).join(" ");
              if (
                currentMsg.length > ROUGHLY_MESSAGE_CHAR_LIMIT ||
                emote === bttvEmotes[bttvEmotes.length - 1]
              ) {
                bttvEmoteMsgArray = bttvEmoteMsgArray.concat(currentMsg);
                //console.log(`${currentMsg}\n\n\n`)
                //setTimeout(() => {
                //  console.log(`${currentMsg}\n\n\n`)
                //}, 3000)
                currentMsg = "";
              }
            }
          });

          resp.on("close", () => {
            //setTimeout(
            //  () => client.say(CHANNEL, `BTTV count: ${emoteCount}`),
            //  1000
            //);
            //setTimeout(async () => {
            //  await client.say(CHANNEL, `Dumping BTTV emotes...`);
            //}, 2000);
            // setTimeout(() => client.say(CHANNEL, bttvEmoteMsgArray[0]), 500);
            // client.say(CHANNEL, bttvEmoteMsgArray[0])
            // setTimeout(() => client.say(CHANNEL, bttvEmoteMsgArray[1]), 2200);
            // setTimeout(() => client.say(CHANNEL, bttvEmoteMsgArray[2]), 4200);
            //bttvEmoteMsgArray.forEach((str) => {
            //  setTimeout(async () => await client.say(CHANNEL, str), 3000);
            //});
          });
        });
      }
    });
  } catch (err) {
    console.error(err);
  }
})();
