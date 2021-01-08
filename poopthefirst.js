require("dotenv").config();
/* changelog-0
    originalcommands - !cutie !handhold !handshake !dab !send !cuddle !slap !kiss !hug !spit !bully !why !smoke !godgamer !untuck !bang !dubtrack
    logs - https://poop.delivery/log/poopthefirst
  */

const {
  DEBUG,
  CHANNEL,
  TWITCH_OAUTH_PASSWORD,
  TWITCH_OAUTH_USERNAME,
} = process.env;
const sleep = require("util").promisify(setTimeout);
const { ChatClient } = require("dank-twitch-irc");

const getRandomArrayElement = (arr) =>
  arr[Math.floor(Math.random() * arr.length)];

try {
  let client = new ChatClient({
    username: TWITCH_OAUTH_USERNAME,
    password: TWITCH_OAUTH_PASSWORD,
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

  let globalCommandCooldown = 5001,
  (dtsLastMessageSent = Date.now()), (isMoonLive = false);

  client.on("message", (event) => {
    if (DEBUG) console.info(event);
    const { senderUsername: sender, messageText } = event;
    // throw a return here for system notice that he is live

    if (event.senderUsername === "60121849657221935028128") {
      dtsLastMessageSent = Number(event.serverTimestampRaw);
      return;
    }

    if (typeof messageText != "string") {
      return;
    }

    if (Date.now() < dtsLastMessageSent + globalCommandCooldown) {
      return;
    }

    // if (
    //   messageText.toLowerCase().includes("tanties") &&
    //   ["duwubson", "tifas_sweaty_feet", "ii57rx", "nice_name_skye"].includes(
    //     event.senderUsername.toLowerCase()
    //   )
    // ) {
    //   if (DEBUG) console.log(event, getRandomArrayElement(["heads", "tails"]));
    //   if (getRandomArrayElement(["heads", "tails"]) === "heads") {
    //     client.say(
    //       CHANNEL,
    //       getRandomArrayElement([
    //         "TANTIES",
    //         "TANTIES wtf",
    //         `TANTIES ${event.senderUsername}`,
    //         "TANTIES",
    //         `Madge ${event.senderUsername}`,
    //       ])
    //     );
    //   }
    // }

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

    if (command === "poop") {
      const msg1 = `${sender} is pooping on ${target}'s`;
      const msg2 = getRandomArrayElement([
        "bed",
        "bathtub",
        "car",
        "chest",
        "desk",
        "porch",
        "carpet",
        "sink",
        "clothes",
      ]);
      const msg3 = getRandomArrayElement(["SHITTERS", "moon2DEV", "moon2C"]);
      fullMessage = [msg1, msg2, msg3].join(" ");

      if (DEBUG) console.info(fullMessage);
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
        `${sender} untucks ${target}'s face PEPELEPSY from bed and dabs on their face ${dab}`
      );
    }

    if (command === "ban") {
      if (target === "60121849657221935028128") {
        client.me(
          CHANNEL,
          `🔧  ${target} has beenpermanently banned. RedTeam FishMoley 🔫 `
        );
      } else {
        client.me(CHANNEL, `🔧  ${target} has beenpermanently banned.`);
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
      client.say(CHANNEL, [target, insult].join(" "));
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
      const emote = getRandomArrayElement([
        `💋 moon2S`,
        `💋 Kissahomie`,
        `💋 Lickahomie`,
      ]);

      client.say(
        CHANNEL,
        `${sender} is kissing ${target} on the ${bodyPart} ${emote}`
      );
    }

    if (command === "send") {
      client.say(CHANNEL, `${sender} sends ${target} on their way! 🚗 💨`);
    }

    if (command === "commands") {
      client.say(
        CHANNEL,
        `${sender} poopthefirst copycat | mish_al modCheck | !handhold !handshake !dab !send !cuddle !slap !kiss !hug !spit !bully !why !smoke !godgamer !untuck !bang !poop`
      );
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

    //if (command === 'code') {
    //  client.say(CHANNEL, `https://github.com/chuckxD/chuckxD-60121849657221935028128-copy ${target}`)
    //}
  });
} catch (err) {
  console.error(err);
}
