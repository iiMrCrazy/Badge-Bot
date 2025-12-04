require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

// إنشاء عميل الديسكورد
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

// عند اتصال البوت
client.once('clientReady', () => {
    console.log(`✅ البوت متصل! باسم: ${client.user.tag}`);
    console.log(`🆔 معرف البوت: ${client.user.id}`);
});

// عند استلام رسالة
client.on('messageCreate', (message) => {
    // تجاهل الرسائل من البوتات الأخرى
    if (message.author.bot) return;

    // مثال: رد على رسالة "مرحبا"
    if (message.content.toLowerCase() === 'مرحبا') {
        message.reply('مرحباً! 👋');
    }
});

// تسجيل الدخول بالتوكن
const token = process.env.DISCORD_TOKEN;

if (!token) {
    console.error('❌ خطأ: لم يتم العثور على DISCORD_TOKEN في ملف .env');
    console.log('📝 يرجى إنشاء ملف .env وإضافة التوكن الخاص بك');
    process.exit(1);
}

client.login(token);

