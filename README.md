
Built by https://www.blackbox.ai

---

```markdown
# Text to Speech Indonesia

## Project Overview
Text to Speech Indonesia is a web application that allows users to convert Indonesian text into natural-sounding speech. The application is designed to provide an intuitive interface for transforming text into audio, offering features such as voice speed and volume control as well as the ability to download the generated audio.

## Installation
To run this project locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   ```

2. **Navigate to the project directory:**
   ```bash
   cd text-to-speech-indonesia
   ```

3. **Open `index.html` in a web browser:**
   You can open the HTML files directly in any modern web browser. Simply double-click on `index.html` or use a local server if you have server-side functionalities.

## Usage
1. Open the application in your web browser.
2. Input the Indonesian text you want to convert into speech in the provided text area.
3. Adjust the speech speed and volume using the available sliders.
4. Click the "Konversi ke Suara" button to start the conversion.
5. Listen to the generated audio with the integrated audio player.
6. Optionally, download the audio as an MP3 file.

## Features
- Convert Indonesian text to speech with natural-sounding voice.
- Control speech speed and volume.
- Download audio output in MP3 format.
- Maintain a history of previous conversions for easy access.
- User-friendly interface designed with Tailwind CSS.

## Dependencies
The project uses the following external libraries:
- [Tailwind CSS](https://tailwindcss.com/) for styling.
- [Font Awesome](https://fontawesome.com/) for icons.

## Project Structure
```
├── index.html         # Main entry point for the application
├── about.html         # About page providing information about the application
├── history.html       # History page to display past conversion records
├── js/
│   ├── app.js         # JavaScript logic for handling TTS functionality
│   └── recorder.js     # JavaScript for handling audio recording features
└── styles/
    └── (optional)     # Place for any additional styles if needed
```

## Acknowledgements
This project was inspired by the need for accessible text-to-speech capabilities for Indonesian users. The Speech Synthesis API is leveraged to create a seamless conversion experience.

---
For more information, visit the application pages and explore the functionalities provided.
```