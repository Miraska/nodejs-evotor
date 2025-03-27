const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const TELEGRAM_TOKEN = "8123060321:AAE0DNgxoeC38XM0CAcgpKdrCMhku4TeO40";

const AIRTABLE_WEBHOOK_URL = "https://hooks.airtable.com/workflows/v1/genericWebhook/appQtEWcAYCim8zEi/wflGJzbMlk37B9123/wtrlsis0vvVw1SJUR";

app.post('/webhook', async (req, res) => {
  try {
    const update = req.body;

    console.log("📥 Получен вебхук от Telegram:", update);
    
    const { message } = update;
    
    // message.chat && (message.chat.type === 'group' || message.chat.type === 'supergroup') - убрал из условия временно
    if (true) {
      console.log("📩 Получено сообщение из группы:", message.chat.title);
      
      if (message.from) {
        const payload = {
          text: message.text || "Нет текста",
          sender: message.from.username || `bot_${message.from.id}`,
          date: new Date(message.date * 1000).toISOString(),
          chatId: String(message.chat.id),
          messageId: String(message.message_id),
          fullJson: message
        };
        
        const response = await axios.post(AIRTABLE_WEBHOOK_URL, payload, {
          headers: {
            "Content-Type": "application/json"
          }
        });
        
        console.log("✅ Данные отправлены в Airtable через вебхук:", response.data);
      }
    }
    
    res.sendStatus(200);
  } catch (error) {
    console.error("❌ Ошибка при обработке вебхука:", error.response ? error.response.data : error.message);
    res.sendStatus(500);
  }
});

async function setTelegramWebhook() {
  try {
    const PUBLIC_URL = "https://1022-89-110-76-58.ngrok-free.app/webhook";
    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/setWebhook?url=${PUBLIC_URL}`;
    const response = await axios.get(url);
    console.log("📡 Вебхук Telegram установлен:", response.data);
  } catch (error) {
    console.error("❌ Ошибка установки вебхука:", error.response ? error.response.data : error.message);
  }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
  setTelegramWebhook();
});
