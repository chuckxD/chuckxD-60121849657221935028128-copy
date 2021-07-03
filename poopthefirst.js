// poopthefirst port: repl/novelty bot for moonmoon
// irc dank chat usage - https://github.com/robotty/dank-twitch-irc#usage
module.exports = (() => {
  try {
    
    const getFivePercentChance = () => (Math.floor(Math.random() * 100) + 1 > 95);
    
    const {
      appEnvRuntime,
      DEBUG,
      TWITCH_OAUTH_PASSWORD,
      CHANNEL,
      TWITCH_OAUTH_USERNAME,
      CLIENT_EVENT_DEBUG,
      NODE_EVAL_ENABLED,
      SPECIAL_COMMAND_COOLDOWN_MS: specialCommandCooldown,
      GLOBAL_COMMAND_COOLDOWN_MS: globalCommandCooldown,
    } = require("./env");

    const {
      BOT_DISPLAY_NAME,
      EXCLUDE_CHATTERS,
      BASE_COMMANDS_HELP,
    } = require("./constants");

    const excludeUsersFromRq = require("./excludeUsersFromRq");

    const hoppers = require("./hoppers").filter(
      (v, i, a) => a.indexOf(v) === i
    );

    const Uwuifier = require("uwuifier");
    const uwu = new Uwuifier();

    console.log(`BOT_DISPLAY_NAME: `, BOT_DISPLAY_NAME);

    const { getRandomArrayElement, rollNum } = require("./utils");

    const tinyText = require("tiny-text");
    const fetch = require("node-fetch");

    const { ChatClient } = require("dank-twitch-irc");

    let client = new ChatClient({
      username: TWITCH_OAUTH_USERNAME,
      password: TWITCH_OAUTH_PASSWORD,
      ignoreUnhandledPromiseRejections: true,
    });

    client.on("ready", () => {
      console.log(
        `Successfully connected to ${CHANNEL}! Debug = ${DEBUG} | Env = ${appEnvRuntime}`
      );
    });

    client.on("close", (error) => {
      if (error != null) {
        console.error("Client closed due to error", error);
      }
    });

    client.connect();
    client.join(CHANNEL);

    let __specialCommandCooldown = Number(specialCommandCooldown),
      __globalCommandCooldown = Number(globalCommandCooldown),
      currentCooldown,
      lastBotMessageEpoch = Date.now(),
      isMoonLive = false,
      activechatters = [],
      recentChatterColors = {},
      nodeEval;

    client.on("message", (event) => {
      // TODO: broadcaster status
      // https://dev.twitch.tv/docs/v5/reference/streams#get-live-streams
      // - for polling if broadcaster is offline/online

      if (DEBUG && CLIENT_EVENT_DEBUG) console.info("client event: ", event);

      const {
        displayName: sender,
        colorRaw: senderColorHex,
        color: senderColorRgb,
        messageText,
        serverTimestampRaw,
      } = event;

      // don't know what this is
      /* if (
        typeof currentCooldown === "number" &&
        lastBotMessageEpoch + currentCooldown > Number(serverTimestampRaw) &&
        typeof messageText === "string" &&
        messageText.startsWith("!")
      ) {
        if (DEBUG) console.info(`[${serverTimestampRaw}] ${sender}: ${messageText}`);
      } */
      if (!sender) return;

      if (!activechatters.includes(sender)) {
        activechatters.unshift(sender);
        activechatters.slice(0, 49);
      }
      recentChatterColors[sender] = { senderColorHex, senderColorRgb };

      if (sender === BOT_DISPLAY_NAME) {
        lastBotMessageEpoch = Number(serverTimestampRaw);
      }

      if (
        typeof messageText === "undefined" ||
        (typeof messageText === "string" && !messageText.startsWith("!"))
      ) {
        return;
      }

      let [command, target] = messageText.split(" ");
      if (!target) {
        target = "chat";
      }

      if (DEBUG) console.info(`[${(new Date()).toUTCString()}] ${sender}: ${messageText}`);
      command = command.slice(1).toLocaleLowerCase();

      if (typeof target === "string" && target.startsWith("@")) {
        target = target.slice(1);
      }

      currentCooldown =
        typeof messageText === "string" &&
        messageText.startsWith("!") &&
        typeof command === "string" &&
        ["activechatters", "dothepasta", "botping", "rollnum", "eval"].includes(
          command
        )
          ? __specialCommandCooldown
          : __globalCommandCooldown;

      let fullMessage = "";
      
      if (sender === "Evacuationz") {
        let msgArray = [].concat(uwu.uwuifySentence(messageText));
        const hopperQuote = getRandomArrayElement(hoppers);
        msgArray = msgArray.concat(hopperQuote);
        client.say(CHANNEL, getRandomArrayElement(msgArray));
      }


      if (command === "help" || command === "commands") {
        let _target = !target || target === "chat" ? sender : target;

        if (command === "help") {
          client.say(CHANNEL, `!commands ${_target}`);
          setTimeout(() => {
            client.me(CHANNEL, `${sender} ${BASE_COMMANDS_HELP}`);
          }, currentCooldown + 1);
        }

        if (command === "commands") {
          client.me(CHANNEL, `${sender} ${BASE_COMMANDS_HELP}`);
        }
      }

      if (["poopthefirst", "thiscode", "thisbot", "code"].includes(command)) {
        client.say(
          CHANNEL,
          `poopthefirst port; novelty bot for fun 4Head https://github.com/chuckxD/chuckxD-60121849657221935028128-copy | PR's, issues, and other contributions welcome; props to og creator Mish_al and api.ivr.fi and logs.ivr.fi.`
        );
      }

      if (command === "dothepasta") {
        if (target === "chat") {
          return;
        }

        const TITLE_CHAR_LEN = 28; // ?
        const SPECIAL_PASTA_CHAR = "ᅚ";
        const SPECIAL_PASTA_TITLE_SEP = "█";
        const ENABLE_TITLE_OPTION = true;

        let emote1,
          emote2,
          title,
          _title,
          pastaString = "",
          pastaStringTemplate =
            "ᅚᅚᅚᅚ ᅚᅚᅚᅚ clintD clintD clintD ᅚ ᅚᅚᅚᅚᅚᅚ ᅚᅚ ᅚᅚ ᅚ ᅚ clintD ᅚᅚ ᅚ ᅚᅚ clintD ᅚᅚ ᅚᅚᅚᅚᅚᅚ clintD ᅚ ᅚ cJerk ᅚᅚ clintD ᅚᅚ ᅚᅚᅚᅚᅚᅚᅚ clintD ᅚᅚᅚᅚᅚᅚ clintD ᅚᅚᅚᅚ ᅚᅚᅚᅚᅚᅚᅚᅚᅚ clintD clintD clintD 󠀀";

        [emote1, emote2, title] = messageText.split(" ").slice(1);
        console.info(`[emote1, emote2, title] `, [emote1, emote2, title]);

        if (!emote1 || !emote2) {
          console.info("missing emote1 & 2: ", emote1, emote2);
          return;
        }
        pastaString = pastaStringTemplate
          .replace(/clintD/g, emote1)
          .replace(/cJerk/g, emote2);

        if (
          typeof title === "string" &&
          title.length > 2 &&
          ENABLE_TITLE_OPTION &&
          title.length <= 10
        ) {
          _title =
            SPECIAL_PASTA_TITLE_SEP +
            title.toUpperCase().split("").join(SPECIAL_PASTA_TITLE_SEP) +
            SPECIAL_PASTA_TITLE_SEP;
          console.info(`_title: `, _title);

          for (; TITLE_CHAR_LEN > _title.length; ) {
            _title = SPECIAL_PASTA_CHAR + _title + SPECIAL_PASTA_CHAR;
          }
          console.info(`_title: `, _title);
          client.me(CHANNEL, `${_title} ${pastaString}`);
          return;
        }

        client.me(
          CHANNEL,
          `ᅚᅚᅚᅚᅚᅚᅚᅚᅚᅚᅚᅚᅚᅚᅚᅚᅚᅚᅚᅚᅚᅚ ${pastaString}`
        );
        return;
      }

      if (command === "emotelookup") {
        if (target === "chat") {
          client.say(
            CHANNEL,
            "NOPERS - this command gets channel by emote - usage e.g. !emotelookup moon2A"
          );
          return;
        }
        let channelid, channel, error, status;
        fetch(`https://api.ivr.fi/twitch/emotes/${target}`)
          .then((response) => response.json())
          .then((__result) => {
            ({ channel, error, status, channelid } = __result);
            if (error && status === 404) {
              throw new Error(error);
            }
            if (!error && status === 200) {
              client.say(
                CHANNEL,
                `${sender} emote: ${target} belongs to channel: ${channel} | https://twitchemotes.com/channels/${channelid}`
              );
            }
          })
          .catch(
            (err) =>
              console.error(err.message) && client.say(CHANNEL, err.message)
          );
      }

      if (command === "uwu") {
        if (
          typeof target === "undefined" ||
          target === sender ||
          target === ""
        ) {
          client.say(CHANNEL, `${sender} NOPERS i can not uwu that, gib pasta`);
        }

        const uwuMsg = uwu.uwuifySentence(messageText.replace("!uwu", ""));
        client.say(CHANNEL, uwuMsg);
      }

      if (command === "botping") {
        client.say(CHANNEL, "!ping");
        setTimeout(() => {
          client.say(CHANNEL, "!namping");
        }, 5001);
        setTimeout(() => {
          client.say(CHANNEL, "!chain");
        }, 10001);
        setTimeout(() => {
          client.say(CHANNEL, "!peepod");
        }, 15001);
        setTimeout(() => {
          client.say(CHANNEL, "!onred");
        }, 20001);
        setTimeout(() => {
          client.say(CHANNEL, "!lastseen dantiko");
        }, 25001);
        setTimeout(() => {
          client.say(CHANNEL, "!commands");
        }, 30001);
      }

      if (command === "tinytext") {
        let newMsgText = tinyText(messageText.replace(`!tinytext`, "").trim());
        client.say(CHANNEL, newMsgText);
      }

      if (command === "swag") {
        client.say(
          CHANNEL,
          `${
            target === "chat" ? sender : target
          } https://streamable.com/9dy2iu moon2G`
        );
      }

      if (command === "cd") {
        client.say(
          CHANNEL,
          `${sender} current global command cool down is ${globalCommandCooldown} ms, speical commands cd is ${specialCommandCooldown} ms`
        );
      }

      if (command === "color") {
        let { r, g, b } = senderColorRgb;
        let msg = `${sender} `;
        if (DEBUG) console.dir(recentChatterColors);
        if (target && target !== "chat" && !activechatters.includes(target)) {
          msg += `couldn't find ${target} in recent chatters.. Sadge `;
        }

        if (!target || target === "chat") {
          msg += ` here is your color's hex value: ${senderColorHex} | RGB values (respectively): ${r}, ${g}, ${b} ; type /color for more info`;
        }

        if (
          target &&
          activechatters.includes(target) &&
          Object.keys(recentChatterColors).includes(target)
        ) {
          // do this later
          if (DEBUG && target)
            console.info(`RECENT CHATTER: `, recentChatterColors[target]);

          const { senderColorHex, senderColorRgb } =
            recentChatterColors[target];

          ({ r, g, b } = senderColorRgb);
          msg += ` here is ${target}'s hex color's value: ${senderColorHex} | RGB values (respectively): ${r}, ${g}, ${b} ; type /color for more info `;
        }
        if (DEBUG) console.log('{ r, g, b } ', { r, g, b });
        // client.setColor({ r, g, b });
        setTimeout(() => {
          client.say(CHANNEL, msg);
        }, 500);
      }

      if (command.startsWith('poop')) {
        const msg1 = `${sender} is pooping`;
        const __target = (command === 'pooproll' || getFivePercentChance() === true) ? getRandomArrayElement(activechatters) : target;
        const msg2 = getRandomArrayElement([
          `on ${__target}'s bed`,
          `in ${__target}'s bathtub`,
          `in the trunk of ${__target}'s car`,
          `on ${__target}'s chest`,
          `on ${__target}'s desk`,
          `on ${__target}'s porch`,
          `on ${__target}'s carpet`,
          `on ${__target}'s toes moon2SNIFF`,
          `in ${__target}'s sink`,
          `in ${__target}'s litter box. ${target} is a cat MYAAA`,
          `in ${__target}'s dog bowl. ${target} is a dog EEKUM`,
        ]);
        const msg3 = getRandomArrayElement(["SHITTERS", "moon2DEV", "moon2C"]);
        fullMessage = [msg1, msg2, msg3].join(" ");
        client.say(CHANNEL, fullMessage);
      }

      if (command === "hopperquote") {
        client.say(CHANNEL, getRandomArrayElement(hoppers));
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
          `${sender} untucks ${target} from bed and dabs on their face ${dab} Grumpge`
        );
      }

      if (command === "rq2") {
        try {
          const [chan, username] = messageText
            .replace("!rq2", "")
            .split(" ")
            .filter((ele) => ele.length > 0);

          if (typeof chan === "string" || typeof username === "string") {
            if (
              (username && excludeUsersFromRq.includes(username)) ||
              (chan && excludeUsersFromRq.includes(chan))
            ) {
              client.say(CHANNEL, "NOPERS user excluded from rq2");
              return;
            }
          }
          if (
            target === "chat" &&
            typeof chan === "undefined" &&
            typeof username === "undefined"
          ) {
            fetch(`https://api.ivr.fi/logs/rq/moonmoon/${sender}`)
              .then((response) => response.json())
              .then((result) => {
                const { user, message, time, error } = result;
                if (!error)
                  client.say(CHANNEL, `(${time}) ${user}: ${message}`);
                if (error)
                  client.say(
                    CHANNEL,
                    "NOPERS invalid channel or no message found"
                  );
              });
            return;
          }

          if (typeof chan === "string" && typeof username === "undefined") {
            fetch(`https://api.ivr.fi/logs/rq/moonmoon/${chan}`)
              .then((response) => response.json())
              .then((result) => {
                const { user, message, time, error } = result;
                if (!error)
                  client.say(CHANNEL, `(${time}) ${user}: ${message}`);
                if (error)
                  client.say(
                    CHANNEL,
                    "NOPERS invalid channel or no message found"
                  );
              });
            return;
          }

          if (typeof chan === "string" && typeof username === "string") {
            fetch(`https://api.ivr.fi/logs/rq/${chan}/${username}`)
              .then((response) => response.json())
              .then((result) => {
                const { user, message, time, error } = result;
                if (!error)
                  client.say(CHANNEL, `(${time}) ${user}: ${message}`);
                if (error)
                  client.say(
                    CHANNEL,
                    "NOPERS invalid channel or no message found"
                  );
              });
            return;
          }
        } catch (err) {
          console.error(err);
          client.say(CHANNEL, "NOPERS something went wrong");
        }
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
        const emotes = ["gachiW", "PEPELEPSY", "gachiROLL", "pepeBASS"];
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
        const flex = getRandomArrayElement([
          "Jump King DLC",
          "Terraria Master Hardcore",
          "DoomEternal Ultra Nightmare",
        ]);

        client.say(CHANNEL, `${sender}, moon2M 📣  ${flex} I BEAT IT ☑`);
      }

      if (command === "why") {
        client.say(
          CHANNEL,
          `${target === "chat" ? sender : target} why are you always here pepeW`
        );
      }

      if (command === "smoke") {
        if (
          sender.toLowerCase() === "chupawunga" ||
          sender.toLowerCase() === "qc_bajs"
        ) {
          client.say(
            CHANNEL,
            `${sender} is now hittin dat good kush with ${target} CiGrip CiGrip`
          );
        } else {
          client.say(
            CHANNEL,
            `${sender} is now smoking a cigarette with ${target} pepeSmoke pepeSmoke`
          );
        }
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

      if (command.startsWith("gumiho")) {
        client.say(CHANNEL, getRandomArrayElement([`is based`, `is cringe`]));
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
          `${sender} here's your bttv link: https://betterttv.com/emotes/shared/search?query=${target}`
        );
      }

      if (command === "ffzsearch") {
        client.say(
          CHANNEL,
          `${sender} here's your ffz link: https://www.frankerfacez.com/emoticons?q=${target}`
        );
      }

      if (command === "rollnum") {
        const _numSides = parseInt(target);
        const numSides =
          Number.isSafeInteger(_numSides) && _numSides > 1 ? _numSides : 100;
        client.say(
          CHANNEL,
          `${sender} rolls(${numSides}): ${
            Math.floor(Math.random() * numSides) + 1
          }!`
        );
        return;
      }

      if (command === "eval" && NODE_EVAL_ENABLED === "true") {
        try {
          let _cmd;
          if (typeof nodeEval !== "module") {
            nodeEval = require("node-eval");
          }
          _cmd = messageText.replace("!eval", "").trim();
          console.info("nodeEval command: ", _cmd);
          client.say(CHANNEL, nodeEval(_cmd));
        } catch (err) {
          client.say(CHANNEL, err.message);
        }
      }
    });
  } catch (err) {
    console.error(err);
  }
})();
