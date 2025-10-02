import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import 'dotenv/config';

const app = express();
app.use(bodyParser.json());

// ตั้งค่า Channel access token (จาก LINE Developers Console)
const CHANNEL_ACCESS_TOKEN = process.env.CHANNEL_ACCESS_TOKEN;

// ฟังก์ชันส่งข้อความกลับไปยัง LINE
async function replyMessage(replyToken, text) {
  try {
    await axios.post(
      "https://api.line.me/v2/bot/message/reply",
      {
        replyToken: replyToken,
        messages: [{ type: "text", text: text }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`,
        },
      }
    );
  } catch (err) {
    console.error("Reply Error:", err.response?.data || err.message);
  }
}

// webhook endpoint
app.post("/webhook", async (req, res) => {
  const events = req.body.events;

  for (const event of events) {
    if (event.type === "message" && event.message.type === "text") {
      const userMessage = event.message.text;
      const userId = event.source.userId;
      console.log(`User ID: ${userId}, Message: ${userMessage}`);

      // ตอบกลับพร้อมแสดง User ID
      await replyMessage(event.replyToken, `User ID: ${userId}
ข้อความที่คุณพิมพ์: ${userMessage}`);
    }
  }

  res.sendStatus(200); // ส่ง OK กลับให้ LINE
});

// เริ่ม server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`LINE Webhook running on port ${PORT}`);
});
