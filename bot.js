const { Client, GatewayIntentBits, EmbedBuilder, MessageAttachment } = require('discord.js');


const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
	],
});


client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

const puppeteer = require('puppeteer');
const { chromium } = require('playwright');

async function takeScreenshot(url) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(url);
  const screenshot = await page.screenshot();
  await browser.close();
  return screenshot;
}

// Discordへの送信コマンド
async function sendScreenshot(message, url) {
  try {
    const screenshot = await takeScreenshot(url);

    const embed = new EmbedBuilder()
      .setTitle('サイトのスクリーンショットを表示します。')
      .setDescription('`' + url + '`' + `のスクリーンショットはこちら:`)
      .setColor('#00ff00');

    message.channel.send({ embeds: [embed] });
    message.channel.send({ files: [{ attachment: screenshot, name: 'screenshot.png' }] });
  } catch (error) {
    console.error('スクリーンショットの取得に失敗しました:', error);
    message.channel.send('スクリーンショットの取得に失敗しました。');
  }
}

// メッセージに反応してコマンドを実行する
client.on('messageCreate', (message) => {
  if (message.content.startsWith('!screenshot')) {
    const args = message.content.split(' ');
    if (args.length === 2) {
      const url = args[1];
      sendScreenshot(message, url);
    } else {
      message.channel.send('正しい使用法: !screenshot <URL>');
    }
  }
});

client.login("TOKEN");
