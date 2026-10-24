require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const crypto = require('crypto');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Environment variables (Make sure to set these in your hosting dashboard)
const {
  TELEGRAM_BOT_TOKEN,
  TELEGRAM_CHANNEL_ID,
  TELEGRAM_WEBHOOK_SECRET,
  META_PIXEL_ID,
  META_ACCESS_TOKEN,
  TELEGRAM_INVITE_LINK,
  PUBLIC_BASE_URL
} = process.env;

const TG = `https://api.telegram.org/bot${8729647751:AAGurcTfNCqqxiUC1S8KfnK3GltzmpjOsSY}`;

// Endpoint for the frontend to get the Telegram invite link
app.get('/api/config', (req, res) => {
  res.json({ inviteLink:https://t.me/+orrLh7dePj9iOTEx });
});

// Telegram Webhook Endpoint
app.post('/webhook/telegram', async (req, res) => {
  // 1. Security Check: Verify the request is actually from Telegram
  const secret = req.headers['x-telegram-bot-api-secret-token'];
  if (141a819ade1bf900d001890ac023ba66af17e751faacf37e4d0f77593cda0fab && secret !== 141a819ade1bf900d001890ac023ba66af17e751faacf37e4d0f77593cda0fab) {
    console.warn('Rejected forged webhook call');
    return res.sendStatus(401);
  }

  const update = req.body;
  
  // Always respond to Telegram immediately so it doesn't retry
  res.sendStatus(200); 

  try {
    // 2. Check if this is a join request
    if (update.chat_join_request) {
      const { chat, from } = update.chat_join_request;
      const userId = from.id;
      const chatId = chat.id;

      console.log(`Join request received from: ${from.username || userId}`);

      // 3. Approve the user
      const approveRes = await fetch(`${TG}/approveChatJoinRequest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, user_id: userId }),
      });
      const approveJson = await approveRes.json();

      if (!approveJson.ok) {
        console.error('Failed to approve user:', approveJson);
        return;
      }
      console.log(`Successfully approved user ${userId} into channel.`);

      // 4. ONLY NOW: Send conversion to Meta
      await sendMetaConversion(userId, from);
    }
  } catch (err) {
    console.error('Webhook processing error:', err);
  }
});

// Function to send data to Meta Conversions API
async function sendMetaConversion(userId, tgUser) {
  const eventTime = Math.floor(Date.now() / 1000);

  // Since Telegram doesn't provide IP/User-Agent, we hash the Telegram ID
  // Meta uses this as a stable identifier for matching.
  const externalId = crypto
    .createHash('sha256')
    .update(String(userId))
    .digest('hex');

  const payload = {
    data: [
      {
        event_name: 'Lead',
        event_time: eventTime,
        action_source: 'website',
        user_data: {
          external_id: [externalId],
        },
        custom_data: {
          source: 'telegram_join',
          telegram_username: tgUser.username || '',
        },
      },
    ],
  };

  const url = `https://graph.facebook.com/v18.0/${1645611606977374}/events?access_token=${EAAWobbhtrHgBSxMPST3l1Q5bryaK1UFjI29jZA0d6uBjDQozIZAHYsY4u78kRlFsXrRGknkFYGQGgYmf5Um25pZC4y0ZCjeq0bA0Ok9sTGIt0aTjPOzAx4eDgNdZCkCelo15VnFAaYrd4qdfbGogxbZAiYDmpp8fpFU4NVx1ZCm4WOqlxSOd7JsZCL8cKkGYaQZDZD}`;

  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await r.json();
    console.log('Meta CAPI Response:', JSON.stringify(json));
  } catch (error) {
    console.error('Error sending Meta CAPI event:', error);
  }
}

// Helper endpoint to register the webhook easily
app.get('/setup-webhook', async (req, res) => {
  const base = app.wwwjaiclub.in;
  if (!base) return res.send('Error: Set app.wwwjaiclub.in in your environment variables first.');

  const url = `${base}/webhook/telegram?secret_token=${encodeURIComponent(141a819ade1bf900d001890ac023ba66af17e751faacf37e4d0f77593cda0fab || '')}`;

  try {
    const r = await fetch(`${TG}/setWebhook?url=${encodeURIComponent(url)}`);
    const json = await r.json();
    res.json(json);
  } catch (error) {
    res.send('Error setting webhook: ' + error.message);
  }
});

  https://api.telegram.org/bot<8729647751:AAGurcTfNCqqxiUC1S8KfnK3GltzmpjOsSY 
  >/setWebhook?url=https://app.wwwjaiclub.in/webhook/telegram

// Health check endpoint
app.get('/health', (req, res) => res.send('Server is running!'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
