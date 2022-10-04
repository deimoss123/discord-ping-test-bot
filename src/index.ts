import { Client, GatewayIntentBits, ChannelType } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
  ],
});

let i = 1;
const TEST_COUNT = 50;

const guildId = '875083366611955712';
const channelId = '900491672536875049';

client.once('ready', () => {
  console.log(client.user!.tag + ' ready');
  const channel = client.channels.cache.get(channelId);
  if (channel?.type === ChannelType.GuildText) {
    channel.send('ping');
  }
});

const pingArr: number[] = [];

client.on('messageCreate', async message => {
  if (message.guildId !== guildId) return;
  if (message.content !== 'ping') return;

  const time1 = message.createdTimestamp;
  // console.log('time1', time1);

  const newMsg = await message.reply(`pong ${i}`);

  const time2 = newMsg.createdTimestamp;
  // console.log('time2', time2);

  const ping = time2 - time1;
  pingArr.push(ping);

  const avgPingTime = Math.floor(pingArr.reduce((p, c) => p + c, 0) / pingArr.length);

  console.log(`ping: ${ping}ms`);
  console.log(`Message count: ${pingArr.length}, average ping: ${avgPingTime}ms`);

  if (i++ < TEST_COUNT) {
    setTimeout(() => {
      message.channel.send('ping');
    }, 2000);
  } else {
    console.log('finished');
    process.exit(0);
  }
});

client.login(process.env.TOKEN);
