## 📱 Audio & File Preview App

This React Native Expo app enables users to:

- 🎙️ **Record and preview audio** clips
- 📂 **Upload and view documents** (PDF, image, video)
- 💾 **Save recordings** and documents locally using `AsyncStorage`

---

### 📁 Folder Structure

```
app/
├── (modals)/               # Modal-only routes
│   └── audio/
│       ├── record.tsx      # Audio recording screen
│       └── preview.tsx     # Preview newly recorded audio
│   └── files/
│       └── preview.tsx     # Preview PDF, image, or video
├── audio/
│   └── index.tsx           # Lists saved audio clips
├── files/
│   └── index.tsx           # Lists uploaded files
styles/
├── theme.ts                # App-wide color definitions
utils/
├── storage.ts              # AsyncStorage helper functions
```

---

### ▶️ How to Run the App

```bash
# 1. Install dependencies
npm install
npx expo install

# 2. Start development server
npx expo start
```

Open the app in **Expo Go** by scanning the QR code.

---

### 📦 Libraries Used

| Library                                     | Purpose                                 |
|--------------------------------------------|-----------------------------------------|
| `expo-av`                                   | Audio recording and playback            |
| `expo-file-system`                          | File metadata and local file access     |
| `expo-document-picker`                      | Upload files (PDF, image, video)        |
| `expo-router`                               | File-based routing with modals/tabs     |
| `@react-native-community/slider`            | Audio progress slider                   |
| `@react-native-async-storage/async-storage` | Local data storage                      |
| `@expo/vector-icons`                        | Icon library                            |
| `react-native-webview`                      | Inline file previews (PDF/video)        |

---