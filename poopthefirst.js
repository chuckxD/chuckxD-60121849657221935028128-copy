module.exports = (() => {
  try {
    let appEnvRuntime = "";
    const path = require("path");
    const sleep = require("util").promisify(setTimeout);

    if (
      !Object.keys(process.env).includes("NODE_APP_ENV") ||
      !process.env["NODE_APP_ENV"] ||
      process.env["NODE_APP_ENV"] === "moonmoon" ||
      process.env["NODE_APP_ENV"] === "production"
    ) {
      appEnvRuntime = "moon";
      console.info("loading default env...");
      require("dotenv").config();
    }

    if (
      Object.keys(process.env).includes("NODE_APP_ENV") &&
      process.env["NODE_APP_ENV"] === "local"
    ) {
      appEnvRuntime = "local";
      console.info("loading " + process.env["NODE_APP_ENV"] + " env...");
      require("dotenv").config({ path: path.resolve(".env.local") });
    }

    const {
      DEBUG,
      TWITCH_OAUTH_PASSWORD,
      CHANNEL,
      TWITCH_OAUTH_USERNAME,
      CLIENT_EVENT_DEBUG,
    } = process.env;

    const getRandomArrayElement = (arr) =>
      arr[Math.floor(Math.random() * arr.length)];

    const BOT_DISPLAY_NAME = "60121849657221935028128";
    const EXCLUDE_CHATTERS = [
      "nightbot",
      "moobot",
      "markov_chain_bot",
      "sumbot_",
      "poopthefirst",
      "moonmoon_nam",
      "scootycoolguy",
      "60121849657221935028128",
      "moonmoon",
      "moonmoon_has_tiny_teeth",
      "je_ek",
    ];
    const BASE_COMMANDS_HELP = `!handhold !handshake !dab !send !cuddle !slap !kiss !hug !spit !bully !why !smoke !godgamer !untuck !bang !poop, | !color !cd !pawgchamp !bttvsearch !poopthefirst !othercommands`;

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

    // https://dev.twitch.tv/docs/v5/reference/streams#get-live-streams
    // - for polling if broadcaster is offline/online
    let globalCommandCooldown = 8201,
      specialCommandCooldown = 30001,
      lastBotMessageEpoch = Date.now(),
      isMoonLive = false,
      activechatters = [],
      recentChatterColors = {},
      currentCooldown;

    client.on("message", (event) => {
      if (DEBUG && CLIENT_EVENT_DEBUG) console.info("client event: ", event);

      const {
        senderUsername: sender,
        colorRaw: senderColorHex,
        color: senderColorRgb,
        messageText,
        serverTimestampRaw,
      } = event;

      if (
        !activechatters.includes(sender) &&
        !EXCLUDE_CHATTERS.includes(sender) &&
        typeof sender === "string"
      ) {
        activechatters.unshift(sender);
        activechatters.slice(0, 49);
        if (DEBUG) console.info(`activechatters `, activechatters);
        recentChatterColors[sender] = { senderColorHex, senderColorRgb };
        if (DEBUG) console.info(`recentChatterColors `, recentChatterColors);
      }

      if (typeof messageText != "string") {
        return;
      }

      let [command, target] = messageText.split(" ");
      command = command.slice(1).toLocaleLowerCase();

      if (sender === BOT_DISPLAY_NAME) {
        console.log(`${sender} ${messageText}`);

        lastBotMessageEpoch = Number(serverTimestampRaw);
        currentCooldown =
          command === "activechatters" ||
          command === "pawgchamp" ||
          command === "supapasta"
            ? specialCommandCooldown
            : globalCommandCooldown;
        return;
      }

      if (Date.now() < lastBotMessageEpoch + currentCooldown) {
        return;
      }

      if (!messageText.startsWith("!")) {
        return;
      }

      if (!target) {
        target = "chat";
      }

      if (typeof target === "string" && target.startsWith("@")) {
        target = target.slice(1);
      }

      let fullMessage = "";

      if (command === "help" || command === "commands") {
        let _target = !target || target === "chat" ? sender : target;

        // const commandsString = ;

        if (command === "help") {
          client.say(CHANNEL, `!commands ${_target}`);
          setTimeout(() => {
            client.me(CHANNEL, `${sender} ${BASE_COMMANDS_HELP}`);
          }, 1001);
        }

        if (command === "commands") {
          client.me(CHANNEL, `${sender} ${BASE_COMMANDS_HELP}`);
        }
      }

      if (
        command === "othercommands" ||
        command === "60121849657221935028128"
      ) {
        const [msgPrefix, msgPostfix] = !target
          .split(" ")
          .map((x) => x.toLowerCase())
          .includes("nam")
          ? [`${sender} 🟦 🟥 󠀀 `, ""]
          : [`!nammers ${sender} takeTheRob`, "!nam"];

        client.say(
          CHANNEL,
          "NOPERS"
          // `${msgPrefix} | unlisted bot commands | !onred !peep !mypp !peepod !bas1 !bas4 !pogbas !rq !rs !search !searchuser !piss !shit !cIean !gachiquote !100stress !200stress ${msgPostfix}`
        );
      }

      if (["poopthefirst", "thiscode", "thisbot"].includes(command)) {
        client.say(
          CHANNEL,
          `poopthefirst port; bot is dumb and the code is shit: https://raw.githubusercontent.com/chuckxD/chuckxD-60121849657221935028128-copy/master/poopthefirst.js`
        );
      }

      if (command === "supapasta") {
        // wip
        return
        if (target === "chat") {
          return;
        }

        const TITLE_CHAR_LEN = 22; // ?
        const SPECIAL_PASTA_CHAR = "ᅚ";
        const SPECIAL_PASTA_TITLE_SEP = "█";

        let emote1,
          emote2,
          title,
          _title,
          pastaString = "",
          pastaStringTemplate = `ᅚᅚᅚᅚ EMOTE_1 EMOTE_1 EMOTE_1 ᅚ ᅚᅚᅚᅚᅚᅚ ᅚᅚ ᅚᅚ ᅚ ᅚ EMOTE_1 ᅚᅚ ᅚ ᅚᅚ EMOTE_1 ᅚᅚ ᅚᅚᅚᅚᅚᅚ EMOTE_1 ᅚ ᅚ EMOTE_2 ᅚᅚ EMOTE_1 ᅚᅚ ᅚᅚᅚᅚᅚᅚᅚ EMOTE_1 ᅚᅚᅚᅚᅚᅚ EMOTE_1 ᅚᅚᅚᅚ ᅚᅚᅚᅚᅚᅚᅚᅚᅚ EMOTE_1 EMOTE_1 EMOTE_1`;

        [emote1, emote2, title] = messageText.split(" ").slice(1);
        console.info(`[emote1, emote2, title] `, [emote1, emote2, title]);

        if (!emote1 || !emote2) {
          console.info("missing emote1 & 2: ", emote1, emote2);
          return;
        }
        pastaString = pastaStringTemplate
          .replace(/EMOTE_1/g, emote1)
          .replace(/EMOTE_2/g, emote2);

        if (typeof title === "string" && title.length > 1) {
          _title = title.split("").join(SPECIAL_PASTA_TITLE_SEP);
          console.info(`_title: `, _title);

          for (; TITLE_CHAR_LEN > _title.length; ) {
            _title = SPECIAL_PASTA_CHAR + _title + SPECIAL_PASTA_CHAR;
          }
          console.info(`_title: `, _title);
          client.say(CHANNEL, `${_title} ${pastaString}`);
          return;
        }

        _title = new Array(TITLE_CHAR_LEN)
          .fill(SPECIAL_PASTA_CHAR, 0, TITLE_CHAR_LEN)
          .join("");
        client.say(CHANNEL, `${_title} ${pastaString}`);
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
            console.info(`RECENT CHATTER OBJ: `, recentChatterColors[target]);

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
          "🟦 🟥 󠀀 ",
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
            `${sender} PEEPERS peepin in on ${target} fucking ${victim} 's mom peepersD BlueMovingPixel RedMovingPixel`
          );
        }
      }

      if (command === "pawgchamp") {
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
