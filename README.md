# 🧙 Witcher’s Satchel (React Native Swiss Army Knife)

![React Native](https://img.shields.io/badge/React%20Native-0.81.4-blue?logo=react)
![Expo](https://img.shields.io/badge/Expo-54.0.10-black?logo=expo)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-3178C6?logo=typescript)
![ESLint](https://img.shields.io/badge/ESLint-9.0.0-4B32C3?logo=eslint)
![Prettier](https://img.shields.io/badge/Prettier-3.6.2-F7B93E?logo=prettier)
![Vector Icons](https://img.shields.io/badge/Vector%20Icons-15.0.2-lightgrey)
![AsyncStorage](https://img.shields.io/badge/AsyncStorage-2.2.0-orange)
![Expo Router](https://img.shields.io/badge/Expo%20Router-6.0.8-lightblue)

---

## 📖 Overview

Welcome, witcher! This is a **Witcher-themed Swiss Army Knife mobile app**, forged in the fires of Kadi’s React Native course on [Frontend Masters](https://frontendmasters.com/).  
It combines **practical utility tools** with **monster-hunting fun** to create an immersive React Native learning and hacking experience.

---

## 🪓 Features

### 🧾 General Utilities

- **Satchel (Shopping List)**: Keep track of potions, herbs, bombs, or your groceries with haptics included.
- **Timer**: Includes countdown and overdue counter. Tracks history to persist through app closure.
- **Monster Tally**: A simple counter for the beasts you’ve slain and a reminder feature to schedule your next hunt. Tracks hunt history to persist through app closure.
- **Bestiary**: A scrollable list of creatures fetched from the [Witcher API](https://github.com/diwashrestha/WitcherAPI).
- **Calculator**: A fully functioning calculator. Tracks history to persist through app closure.
- **Weather**: A local weather display. Tracks weather history to persist through app closure. Fetched from [Weather API](https://openweathermap.org/api/one-call-3#current)
- **Dice Roller**: A rolling kit with all the popular D&D dice. Tracks roll history to persist through app closure.
- **Potion Tracker**: A tracking system to keep track of how often you have stirred a potion. Create, Read, and Delete functionality.
- **Media Player**: A fully functioning media player loaded with the only song you need to hear.
- **Encounter Practice**: A random encounter generator that pairs you with random monsters to guess their sign vulnerability. Interacts with potion system to allow for instant wins.
- **Camera** Camera with overlay options to take a picture of yourself with your favorite signs. COMING SOON- Tensorflow
- **Gwent Viewer** Complete list of Gwent cards powered by the [Gwent API](https://api.gwent.one/) to help build your Gwent decks.

### 🎓 From Kadi’s Course

- Core React Native setup (Expo, React Native, Router).
- AsyncStorage for persistent data.
- ESLint + Prettier setup for clean code.
- Safe Area + Screens for proper navigation and device compatibility.

---

## ⚔️ Tech Stack

- **React Native** `0.81.4`
- **Expo** `~54.0.10`
- **TypeScript** `~5.9.2`
- **ESLint / Prettier** for linting + formatting
- **Vector Icons** for glyph-based buttons
- **AsyncStorage** for persistence
- **Expo Router** for navigation
- **Haptics, Push Notifications, and Scheduling** for device-level integration

---

## 📦 Installation

# Clone the repo

```bash
git clone https://github.com/404pandas/Witchers-Satchel.git
```

# Navigate to the project

```bash
cd witcherssatchel
```

# Install dependencies

```bash
npm install
```

# Run on Expo

```bash
npx expo start
```

---

## 🐉 Videos && Screenshots

Stage 1 Completed 10/02/25

Video:
[Click here to view](https://github.com/user-attachments/assets/bc49c87e-dcc4-4c1b-83bf-8f5e2e5e7ed8)

APK: 
Depreceated

Stage 2 Completed 11/15/25

Video:
[Click here to view](https://dms.licdn.com/playlist/vid/v2/D4E05AQEH4Vj4Nvc4WQ/mp4-720p-30fp-crf28/B4EZqIFRfHGYB0-/0/1763219696636?e=1765346400&v=beta&t=Rt9ElxpvBjR6kK0J_kQWk1J6ZG4wHDt3HTI9vd679Ao)

APK:
[Click here to view](https://drive.google.com/file/d/1_hQYmNwwirsRJc22GjplBl1hT0gi-A5q/view?usp=sharing)

Stage 3 Completed 12/3/25

Video:
[Click here to view](https://drive.google.com/file/d/1Qxlsncfi8tnrSBWKcK8v3hkc0TzQ8KYB/view?usp=drive_link)

APK:
[Click here to view](https://drive.google.com/file/d/1HW5KuxDl4CQWw3dUxndutXRZqcKIh2os/view?usp=sharing)

- [Talley](#talley)
- [Satchel](#satchel)
- [Bestiary](#bestiary)
- [Timer](#timer)
- [Dice Roller](#dice-roller)
- [Calculator](#calculator)
- [Weather](#weather)
- [Media Player](#media-player)
- [Sign Camera](#sign-camera)
- [Encounter Pratice](#encounter-pratice)

### Talley

<img src="https://github.com/user-attachments/assets/f6672393-531d-45ea-9560-7db9ef8b7281" width="200" alt="Talley screen showing character stats" />
<img src="https://github.com/user-attachments/assets/ce104c20-02fb-40ee-bc03-048a3d8ec8bc" width="200" alt="Talley detail screen with additional character information" />

### Satchel

<img src="https://github.com/user-attachments/assets/1742d043-0b46-4379-bc30-f4e22f8013fc" width="200" alt="Satchel screen showing inventory items" />
<img src="https://github.com/user-attachments/assets/11c4e0f2-285e-4f9f-b9d0-36b9af4a1055" width="200" alt="Satchel screen with expanded item details" />

### Bestiary

<img src="https://github.com/user-attachments/assets/406e53a7-d754-49bc-a3a1-cacc2bf1c540" width="200" alt="Bestiary screen showing creature list" />

### Timer

<img src="https://github.com/user-attachments/assets/970f7b81-6471-443f-ab00-77303daed446" width="200" alt="Timer screen overview" />
<img src="https://github.com/user-attachments/assets/211ace8c-da8b-4f70-a726-49530a2c5772" width="200" alt="Timer settings screen" />
<img src="https://github.com/user-attachments/assets/b8619b24-44ab-47a4-a86f-3c85cace633d" width="200" alt="Timer running with countdown view" />
<img src="https://github.com/user-attachments/assets/141e69f9-37ad-428a-807b-03cffe38c2e7" width="200" alt="Timer completed screen" />

### Dice Roller

TODO- ADD IMAGES

### Calculator

TODO- ADD IMAGES

### Weather

TODO- ADD IMAGES

### Media Player

TODO- ADD IMAGES

### Sign Camera

TODO- ADD IMAGES

### Encounter Practice

TODO- ADD IMAGES

---

## 🧙 Credits

- Inspired by [Kadi’s React Native Course](https://frontendmasters.com/).
- Beasts from the [Witcher API](https://github.com/diwashrestha/WitcherAPI).
- Confetti, haptics, and dark magic powered by Expo & React Native.
- Weather API provided by [OpenWeather](https://openweathermap.org/api/one-call-3#current)
- Dice rolling animation from [Lottie Files](https://lottiefiles.com/iwb5945qedidagn9)

---

## ⚔️ License

This project is licensed under the **MIT License**.  
Use it wisely, witcher.

---
