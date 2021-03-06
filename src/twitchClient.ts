import { Client, Options } from "tmi.js";

import config from './config';

interface ChatCounts {
  [username:string]: number
}

export const botName = config.botName;

export const chatCounts: ChatCounts = {};

const tmiOptions: Options = {
  options: {
    debug: config.debug,
  },
  connection: {
    reconnect: true,
  },
  identity: {
    username: botName,
    password: config.twitchToken,
  },
  channels: [ config.channel ],
};

export const client = new (Client as unknown as { new(opts: Options): Client })(tmiOptions);

client.on('chat', (channel, userstate, _) => {
  const username = userstate.username;
  if (!username || username === botName) return;

  chatCounts[username] = (chatCounts[username] || 0) + 1

  if (chatCounts[username] === 1 && config.userGreeting) {
    const greetingTemplate = Array.isArray(config.userGreeting) ?
          config.userGreeting[Math.floor(Math.random() * config.userGreeting.length)] :
          config.userGreeting

    const greetingText = greetingTemplate.replace('$user', username);

    client.say(channel, greetingText);
  }
})

export default client;
