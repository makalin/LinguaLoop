# 🗣️ LinguaLoop

**Learn German, French, Spanish & Russian — hands-free, eyes-closed.**  
LinguaLoop is a minimalist language immersion app designed to run anywhere — even in bed. It speaks short bilingual phrases, listens to your replies, and gives instant feedback on pronunciation and understanding.

---

## 🌍 Core Features

- 🎧 **Listen Mode** — Continuous playback of bilingual sentences  
  e.g. _Ich möchte einen Kaffee_, _Je voudrais un café_, _Quiero un café_, _Я хочу кофе_.  
- 🗣️ **Speak Mode** — Practice aloud; LinguaLoop compares your pronunciation using the Web Speech API.  
- 🧠 **Quiz Mode** — Test your knowledge with interactive quizzes and instant feedback.
- 🧠 **Smart Repetition** — Uses spaced repetition (SRS) to prioritize words you struggle with.  
- 💤 **Bed Mode** — Big fonts, dark UI, auto-scroll, no typing required.  
- 🔊 **Offline Support** — Works in airplane mode via service workers.  
- 🌐 **Multi-language Pairs** — Mix & match:
  - German ↔ English (70 phrases)
  - French ↔ English (70 phrases)
  - Spanish ↔ English (70 phrases)
  - Russian ↔ English (70 phrases)

---

## ✨ Pro Features

### 📊 Statistics & Progress Tracking
- **Total phrases studied** — Track your learning journey
- **Session tracking** — Monitor study time and frequency
- **Streak system** — Maintain daily learning streaks
- **Accuracy rate** — Measure your pronunciation accuracy
- **Per-language stats** — See progress for each language
- **Daily goals** — Set and track daily learning targets

### 📈 Dashboard
- Visual progress cards with key metrics
- Language breakdown charts
- Time spent tracking
- Achievement badges and milestones
- Daily goal progress visualization

### ⚙️ Settings & Customization
- **Playback speed control** — Adjust TTS speed (0.5x - 2x)
- **Daily goal adjustment** — Set your target (5-100 phrases)
- **Auto-play toggle** — Control automatic phrase playback
- **Translation display** — Show/hide translations by default
- **Sound effects** — Enable/disable audio feedback
- **Theme management** — Dark/light/auto theme switching

### ⭐ Favorites System
- Bookmark your favorite phrases
- Quick access to saved phrases
- Star indicators on phrase cards
- Persistent favorites storage

### 💾 Data Management
- **Export to JSON** — Full backup of all data (SRS, stats, favorites, settings)
- **Export to Anki** — Import your phrases into Anki for advanced study
- **Export to CSV** — Spreadsheet-compatible format
- **Import JSON** — Restore your data from backup
- **Reset options** — Clear stats, favorites, or settings

### 🎯 Advanced Learning Tools
- **Pronunciation scoring** — Real-time feedback on speech accuracy
- **SRS algorithm** — Intelligent spaced repetition scheduling
- **Priority phrases** — Focus on difficult phrases automatically
- **Session time tracking** — Monitor your study habits

---

## 🧩 Tech Stack

| Layer | Technology |
|-------|-------------|
| Frontend | Preact + TailwindCSS |
| Voice | Web Speech API (TTS + SpeechRecognition) |
| Data | Local JSON phrase decks (280+ phrases total) |
| Storage | LocalStorage (SRS, Stats, Favorites, Settings) |
| Offline | Service Worker + PWA Manifest |
| Build | Vite + TypeScript |

---

## 🚀 Getting Started

```bash
git clone https://github.com/makalin/LinguaLoop.git
cd LinguaLoop
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.
Grant microphone access to start speaking.

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
LinguaLoop/
├── public/               # Manifest, icons, service worker
├── src/
│   ├── data/            # JSON phrase decks (de, fr, es, ru, en)
│   ├── components/      # UI elements (PhraseCard, VoiceButton, StatsCard)
│   ├── hooks/           # Custom hooks (useSpeech, useSRS, useStats, useFavorites, useSettings)
│   ├── pages/           # Modes (Listen, Speak, Quiz, Dashboard, Settings)
│   ├── utils/           # Utilities (export functions)
│   └── main.tsx         # App entry
└── package.json
```

---

## 🎮 Usage Guide

### Listen Mode
1. Select your target languages
2. Enable auto-play for continuous learning
3. Adjust playback interval (3s - 10s)
4. Listen and absorb the phrases

### Speak Mode
1. Click the microphone button to start listening
2. Speak the phrase shown on screen
3. Get instant pronunciation feedback
4. Track your accuracy over time

### Quiz Mode
1. Review phrases without seeing translations
2. Reveal answers when ready
3. Mark correct/incorrect to update SRS
4. Track your quiz scores

### Dashboard
- View your learning statistics
- Monitor streaks and achievements
- Check language-specific progress
- Track daily goal completion

### Settings
- Customize playback speed
- Set daily learning goals
- Export your data for backup
- Import previous data
- Reset specific data sets

---

## 🧠 Learning Philosophy

LinguaLoop is built for **micro-immersion**:
Short, frequent, low-effort exposure that gradually reprograms your ear and tongue.
The best time to learn is when you're relaxed — not staring at a grammar chart.

You can:

* Focus on one language at a time (e.g. only German)
* Or alternate: DE → FR → ES → RU loops for broad exposure
* Set daily goals to maintain consistency
* Track your progress with detailed statistics
* Export data to continue learning elsewhere

---

## 📊 Data & Privacy

All data is stored locally in your browser:
- **SRS data** — Spaced repetition scheduling
- **Statistics** — Learning progress and streaks
- **Favorites** — Bookmarked phrases
- **Settings** — User preferences

No data is sent to external servers. Your learning data stays private and secure.

---

## 🧩 Roadmap

### ✅ Completed
- [x] Streak & progress tracking
- [x] Export learned phrases to Anki format
- [x] Dashboard with analytics
- [x] Settings page with customization
- [x] Favorites/bookmarking system
- [x] Playback speed control
- [x] Daily goals system

### 🔄 Planned
- [ ] Per-language difficulty levels (A1–B2)
- [ ] Add "focus mode" for a single language
- [ ] Integrate Whisper for local speech recognition
- [ ] Mobile-friendly Flutter port (LinguaLoop Go)
- [ ] Phrase categories/tags
- [ ] Custom phrase decks
- [ ] Social sharing of achievements
- [ ] Multi-user support

---

## 💡 Inspiration

> "Language learning doesn't need a desk — just a loop."

---

## 🧑‍💻 Idea & Developer

**Mehmet T. AKALIN**  
Full-Stack Developer / AI & Language Enthusiast  
[github.com/makalin](https://github.com/makalin)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 🪶 License

MIT License © 2025 Mehmet T. AKALIN
