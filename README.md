# 🌟 มาช่วยติวน้องซัมเมอร์สอบกันเถอะ!! — v1.0.0

## 📁 โครงสร้างโปรเจกต์

```
summer-quiz/
├── app/
│   ├── layout.tsx          ← metadata & html wrapper
│   └── page.tsx            ← entry point
├── components/
│   └── SummerQuiz.jsx      ← UI หลักทั้งหมด (import จาก questions/)
├── questions/
│   ├── Thai.js             ← ข้อสอบภาษาไทย 100 ข้อ ✅
│   └── Math.js             ← ข้อสอบคณิตศาสตร์ (รออัพเดท) 🔒
├── package.json
└── README.md
```

## 🚀 Deploy บน Vercel

```bash
# 1. Push ขึ้น GitHub
git init && git add . && git commit -m "v1.0.0"
git remote add origin https://github.com/YOUR/summer-quiz.git
git push -u origin main

# 2. ไปที่ vercel.com → Import repo → Deploy
```

## ➕ เพิ่มข้อสอบ

เปิดไฟล์ `questions/Thai.js` แล้วเพิ่ม object ต่อท้าย array ตาม format:
```js
{
  id: "t101",
  topic: "หัวข้อ",
  question: "คำถาม",
  choices: ["ก", "ข", "ค", "ง"],
  answer: 0,  // index ของคำตอบถูก
  explanation: "อธิบายเมื่อตอบถูก",
  wrongExplanations: { 1: "อธิบายว่าทำไม ข ผิด", 2: "...", 3: "..." }
}
```

## 🔓 เปิดใช้วิชาคณิตศาสตร์

เมื่อเพิ่มข้อสอบใน `Math.js` เสร็จ ให้เปิด `components/SummerQuiz.jsx`
หาบรรทัด `available: false` ของ math แล้วเปลี่ยนเป็น `available: true`

## 📊 Version History
- v1.0.0 — ภาษาไทย 100 ข้อ (เพื่อนรู้ใจ, ช้างน้อยน่ารัก, มาตราตัวสะกด, อักษรสูง/ต่ำ, ฯลฯ)
