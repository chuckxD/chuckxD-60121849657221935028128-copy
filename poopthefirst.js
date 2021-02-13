// poopthefirst port: repl/novelty bot for moonmoon
// irc dank chat usage - https://github.com/robotty/dank-twitch-irc#usage
module.exports = (() => {
  try {
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

    console.log(`BOT_DISPLAY_NAME: `, BOT_DISPLAY_NAME);

    const { getRandomArrayElement, rollNum } = require("./utils");

    const { ChatClient } = require("dank-twitch-irc");

    console.info(`NODE_EVAL_ENABLED: `, NODE_EVAL_ENABLED);
    if (NODE_EVAL_ENABLED === true) {
      // const nodeEval = require("node-eval");
    }

    // const nodeEval = require("node-eval");
    // const moduleContents = `
    //     const package = require('./package.json'); // to resolve this require need to know the path of current module (./index.js)
    //
    //     module.exports = {
    //         name: package.name
    //     };
    // `;

    let client = new ChatClient({
      username: TWITCH_OAUTH_USERNAME,
      password: TWITCH_OAUTH_PASSWORD,
      ignoreUnhandledPromiseRejections: true,
    });
    //const evalAccessString = `
    //module.exports = {
    //    BOT_DISPLAY_NAME,
    //    EXCLUDE_CHATTERS,
    //    BASE_COMMANDS_HELP,
    //    appEnvRuntime,
    //    DEBUG,
    //    TWITCH_OAUTH_USERNAME,
    //    CHANNEL,
    //    client
    //  }`;

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
        senderUsername: sender,
        colorRaw: senderColorHex,
        color: senderColorRgb,
        messageText,
        serverTimestampRaw,
      } = event;

      if (
        typeof currentCooldown === "number" &&
        lastBotMessageEpoch + currentCooldown > Number(serverTimestampRaw) &&
        messageText.startsWith("!")
      ) {
        if (DEBUG)
          console.info(
            `SENDER: ${sender} | MESSAGE: ${messageText} | DEBUG INFO: serverTimestampRaw message: ${new Date(
              Number(serverTimestampRaw)
            ).toUTCString()} | current cooldown ms: ${currentCooldown} | next bot msg request available: ${
              currentCooldown + lastBotMessageEpoch - Number(serverTimestampRaw)
            } ms`
          );
        return;
      }
      if (!sender) return;

      if (
        !activechatters.includes(sender) &&
        !EXCLUDE_CHATTERS.includes(sender) &&
        typeof sender === "string"
      ) {
        activechatters.unshift(sender);
        activechatters.slice(0, 49);
        recentChatterColors[sender] = { senderColorHex, senderColorRgb };
      }

      if (sender === BOT_DISPLAY_NAME) {
        lastBotMessageEpoch = Number(serverTimestampRaw);
      }

      if (!messageText.startsWith("!")) {
        return;
      }

      if (typeof messageText != "string") {
        return;
      }

      let [command, target] = messageText.split(" ");
      if (!target) {
        target = "chat";
      }

      if (DEBUG)
        console.log(
          `SENDER: `,
          sender,
          ` | COMMAND: `,
          command,
          ` | TARGET: `,
          target
        );
      command = command.slice(1).toLocaleLowerCase();

      if (typeof target === "string" && target.startsWith("@")) {
        target = target.slice(1);
      }

      currentCooldown =
        messageText.startsWith("!") &&
        command &&
        [
          "activechatters",
          "pawgchamp",
          "pg",
          "dothepasta",
          "botping",
          "rollnum",
          "eval",
        ].includes(command)
          ? __specialCommandCooldown
          : __globalCommandCooldown;

      let fullMessage = "";

      if (command === "help" || command === "commands") {
        let _target = !target || target === "chat" ? sender : target;

        // const commandsString = ;

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

      if (["poopthefirst", "thiscode", "thisbot"].includes(command)) {
        client.say(
          CHANNEL,
          `poopthefirst port; bot is dumb and the code is shit: https://raw.githubusercontent.com/chuckxD/chuckxD-60121849657221935028128-copy/master/poopthefirst.js`
        );
      }

      if (command === "dothepasta") {
        // disabled
        // return
        // wip

        // given a standard/normal chat width
        // take 2 required args as emotes and output theh former emote around the latter as such: https://pastebin.com/raw/13wj6PsJ see also pastaStringTemplate below

        // optionally take a  3rd title arg and prepend it to the output above left/right padded with filler asciii code and inner padding each character of title with SEP charaacter e.g. ᅚᅚᅚᅚᅚT■E■S■Tᅚᅚᅚᅚᅚᅚ

        // the title final result should evenly occuppy the whole line or ignore it if it's too long

        // return
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
        // ᅚᅚᅚᅚᅚᅚᅚᅚᅚᅚᅚᅚᅚᅚᅚᅚᅚᅚᅚᅚᅚᅚ ᅚᅚᅚᅚ ᅚᅚᅚᅚ clintD clintD clintD ᅚ ᅚᅚᅚᅚᅚᅚ ᅚᅚ ᅚᅚ ᅚ ᅚ clintD ᅚᅚ ᅚ ᅚᅚ clintD ᅚᅚ ᅚᅚᅚᅚᅚᅚ clintD ᅚ ᅚ cJerk ᅚᅚ clintD ᅚᅚ ᅚᅚᅚᅚᅚᅚᅚ clintD ᅚᅚᅚᅚᅚᅚ clintD ᅚᅚᅚᅚ ᅚᅚᅚᅚᅚᅚᅚᅚᅚ clintD clintD clintD 󠀀
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

      // banned command
      // if (command === "activechatters") {
      //   let msgString = [];
      //   if (activechatters.length > 0) {
      //     activechatters.forEach((chatter) => {
      //       msgString = msgString.concat(chatter);
      //     });
      //   }
      //   client.say(CHANNEL, msgString.join(" "));
      //   console.info(`active chatters (${msgString.length}): `, msgString.join(' '));
      // }

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

        // setTimeout(() => {
        //   client.say(CHANNEL, "!lastseen ");
        // }, 20001);
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
          `${sender} current global command cool down is ${globalCommandCooldown} ms, [redacted] / pawgchamp / speical commands cd is ${specialCommandCooldown} ms`
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

          const { senderColorHex, senderColorRgb } = recentChatterColors[
            target
          ];

          ({ r, g, b } = senderColorRgb);
          msg += ` here is ${target}'s hex color's value: ${senderColorHex} | RGB values (respectively): ${r}, ${g}, ${b} ; type /color for more info `;
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
          "BlueMovingPixel RedMovingPixel 󠀀 ",
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

      if (command.startsWith("gumi")) {
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
          `${sender} here's your link: https://betterttv.com/emotes/shared/search?query=${target}`
        );
      }

      if (command === "peep") {
        if (activechatters.includes("dantiko")) {
          return;
        }

        if (!activechatters.includes("dantiko")) {
          const victim = getRandomArrayElement(activechatters);
          client.say(
            CHANNEL,
            `${sender} PEEPERS peepin in on ${target} fucking ${victim}'s mom peepersD BlueMovingPixel RedMovingPixel`
          );
        }
      }

      if (command === "pawgchamp" || command === "pg") {
        const randomRecentChatter = getRandomArrayElement(activechatters);
        const randomIndex = Math.floor(Math.random() * 2);

        client.say(
          CHANNEL,
          `${
            randomIndex === 0 ? sender : randomRecentChatter
          } -> BlueMovingPixel RedMovingPixel 󠀀<- ${
            randomIndex === 0 ? randomRecentChatter : sender
          }`
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

      if (command === "eval" && NODE_EVAL_ENABLED === true) {
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

      // if (command === 'activechatters' || command === 'activechatters') {
      //   setTimeout(() => console.log('sleep'), specialCommandCooldown)
      // } else {
      //   setTimeout(() => console.log('sleep'), globalCommandCooldown)
      // }
    });
  } catch (err) {
    console.error(err);
  }
})();
