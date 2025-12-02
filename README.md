# 🗣️ LinguaLoop

**Learn German, French, Spanish & Russian — hands-free, eyes-closed.**  
LinguaLoop is a minimalist language immersion app designed to run anywhere — even in bed. It speaks short bilingual phrases, listens to your replies, and gives instant feedback on pronunciation and understanding.

---

## 🌍 Features

- 🎧 **Listen Mode** — Continuous playback of bilingual sentences  
  e.g. _Ich möchte einen Kaffee_, _Je voudrais un café_, _Quiero un café_, _Я хочу кофе_.  
- 🗣️ **Speak Mode** — Practice aloud; LinguaLoop compares your pronunciation using the Web Speech API.  
- 🧠 **Smart Repetition** — Uses spaced repetition (SRS) to prioritize words you struggle with.  
- 💤 **Bed Mode** — Big fonts, dark UI, auto-scroll, no typing required.  
- 🔊 **Offline Support** — Works in airplane mode via service workers.  
- 🌐 **Multi-language Pairs** — Mix & match:
  - German ↔ English  
  - French ↔ English  
  - Spanish ↔ English  
  - Russian ↔ English  

---

## 🧩 Tech Stack

| Layer | Technology |
|-------|-------------|
| Frontend | Preact + TailwindCSS |
| Voice | Web Speech API (TTS + SpeechRecognition) |
| Data | Local JSON phrase decks (de, fr, es, ru + en) |
| Storage | LocalStorage / IndexedDB |
| Offline | Service Worker + PWA Manifest |

---

## 🚀 Getting Started

```bash
git clone https://github.com/makalin/LinguaLoop.git
cd LinguaLoop
npm install
npm run dev
````

Then open [http://localhost:5173](http://localhost:5173) in your browser.
Grant microphone access to start speaking.

---

## 📁 Project Structure

```
LinguaLoop/
├── public/               # Manifest, icons, service worker
├── src/
│   ├── data/             # JSON phrase decks (de, fr, es, ru, en)
│   ├── components/       # UI elements (PhraseCard, VoiceButton)
│   ├── hooks/            # Custom hooks (useSpeech, useSRS)
│   ├── pages/            # Modes (Listen, Speak, Quiz)
│   └── main.tsx          # App entry
└── package.json
```

---

## 🧠 Learning Philosophy

LinguaLoop is built for **micro-immersion**:
Short, frequent, low-effort exposure that gradually reprograms your ear and tongue.
The best time to learn is when you’re relaxed — not staring at a grammar chart.

You can:

* Focus on one language at a time (e.g. only German)
* Or alternate: DE → FR → ES → RU loops for broad exposure

---

## 🧩 Roadmap

* [ ] Per-language difficulty levels (A1–B2)
* [ ] Add “focus mode” for a single language
* [ ] Integrate Whisper for local speech recognition
* [ ] Add streak & progress tracking
* [ ] Export learned phrases to Anki format
* [ ] Mobile-friendly Flutter port (LinguaLoop Go)

---

## 💡 Inspiration

> “Language learning doesn’t need a desk — just a loop.”

---

## 🧑‍💻 Idea & Developer

**Mehmet T. AKALIN**
Full-Stack Developer / AI & Language Enthusiast
[github.com/makalin](https://github.com/makalin)

---

## 🪶 License

MIT License © 2025 Mehmet T. AKALIN
