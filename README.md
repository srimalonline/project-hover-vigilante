# Project Hover Vigilante (PHV)

![PHV Logo](chrome-extension/icon128.png)

**An AI-powered visual context assistant using Google Gemini Vision API**

## ⚠️ IMPORTANT DISCLAIMERS

### Academic Integrity Warning

**THIS TOOL CAN BE USED TO VIOLATE ACADEMIC INTEGRITY POLICIES.**

- This extension is designed for educational purposes and assistive technology research
- Using this tool during examinations, quizzes, or assessments **MAY CONSTITUTE ACADEMIC DISHONESTY**
- Users are **SOLELY RESPONSIBLE** for ensuring compliance with their institution's academic integrity policies
- The developers **DO NOT CONDONE** the use of this tool to cheat on exams or assignments

### Legal and Ethical Responsibility

**BY USING THIS SOFTWARE, YOU ACCEPT FULL RESPONSIBILITY FOR ANY CONSEQUENCES.**

- You are responsible for understanding and complying with all applicable laws and regulations
- You are responsible for adhering to your institution's academic codes of conduct
- You are responsible for ensuring your use complies with any terms of service of websites you visit
- **THE AUTHORS AND CONTRIBUTORS ASSUME NO LIABILITY** for misuse of this software

### Detection and Limitations

**THIS TOOL IS DETECTABLE AND HAS KNOWN LIMITATIONS:**

- ❌ **DOES NOT WORK** with Safe Exam Browser (SEB)
- ❌ **DOES NOT WORK** with Respondus LockDown Browser
- ❌ **DOES NOT WORK** with ProctorU, Proctorio, or similar proctoring software
- ❌ Browser extensions can be detected by examination systems
- ❌ Screen recording and monitoring tools can capture extension usage
- ❌ Network traffic analysis may reveal API calls to external services

---

## 🎯 What is PHV?

Project Hover Vigilante is a Chrome extension that provides AI-powered contextual information about elements on a webpage. When enabled, hovering over webpage elements triggers a visual analysis using Google's Gemini Vision API, providing intelligent insights based on the visual context.

The project is branded with a samurai warrior theme, representing a vigilant guardian watching over your browsing experience.

### Key Features

- 🔍 **Hover-activated insights** - Simply hover over any webpage element
- 🧠 **AI-powered analysis** - Leverages Google Gemini Vision API
- 📸 **Visual context** - Analyzes screenshots of the current viewport
- ⌨️ **Keyboard shortcut** - Toggle with `Alt+V`
- 🎨 **Clean UI** - Modern, unobtrusive interface

---

## 🚀 Installation

### Prerequisites

- Google Chrome browser (version 88 or higher)
- A Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Steps

1. **Download the latest release**
   - Go to the [Releases page](https://github.com/yourusername/vigilante/releases)
   - Download the latest `Source code (zip)` file
   - Extract the ZIP file to a folder on your computer

2. **Load the extension in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right corner)
   - Click "Load unpacked"
   - Navigate to the extracted folder and select the `chrome-extension` folder

3. **Configure your API key**
   - Click the PHV extension icon in your browser toolbar
   - Enter your Gemini API key
   - Click "Save Settings"

4. **Start using PHV**
   - Toggle "Enable Insights" in the extension popup
   - Navigate to any webpage and start hovering over elements

---

## 📖 Usage

### Basic Usage

1. Click the PHV extension icon and toggle "Enable Insights"
2. Navigate to any webpage
3. Hover over elements for 800ms to trigger AI analysis
4. View insights displayed in the bottom-left corner of the screen

### Keyboard Shortcuts

- **`Alt+V`** - Quickly toggle insights on/off without opening the popup
- You can customize this shortcut by going to `chrome://extensions/shortcuts` in your browser

### Tips

- Wait for the insight to fully load before moving to the next element
- Insights cycle through multiple lines automatically (5 seconds per line)
- API calls are made for each hover event, so be mindful of API usage limits

---

## 🛠️ Technical Details

### Architecture

```
┌─────────────────┐
│   popup.html    │ ← Extension settings UI
│   popup.js      │
└─────────────────┘

┌─────────────────┐
│  background.js  │ ← Service worker (API calls)
└─────────────────┘

┌─────────────────┐
│   content.js    │ ← Hover detection & UI
│   content.css   │
└─────────────────┘
```

### Files

- **manifest.json** - Extension configuration with keyboard shortcuts
- **popup.html/js** - Settings interface with dark mode UI
- **background.js** - Handles Gemini API communication and screenshot capture
- **content.js** - Injected script for hover detection and tooltip display
- **content.css** - Styling for injected UI elements
- **icon16.png, icon48.png, icon128.png** - Samurai-themed extension icons

### API Integration

PHV uses the Google Gemini Vision API to analyze screenshots of the current viewport along with contextual information about the hovered element.

---

## ⚙️ Configuration

### Chrome Storage

Settings are stored using `chrome.storage.sync`:
- `enabled` (boolean) - Whether insights are currently enabled
- `apiKey` (string) - Your Gemini API key

### Customization

You can modify the following in `content.js`:
- `hoverTimeout` - Delay before triggering (default: 800ms)
- Tooltip positioning and styling
- Element context extraction logic

---

## 🔒 Privacy & Security

### Data Collection

- **NO data is collected or stored** by this extension beyond your API key
- All API calls are made directly to Google's Gemini API
- Screenshots are captured temporarily and sent to the Gemini API only

### API Key Security

- Your API key is stored locally using Chrome's sync storage
- The key is never transmitted to any server other than Google's API
- **Keep your API key private** - do not share it or commit it to version control

---

## 🔧 For Developers & Maintainers

### Creating a New Release

To publish a new version for users to download:

1. **Update version number** in `chrome-extension/manifest.json`

2. **Commit your changes**
   ```bash
   git add .
   git commit -m "Release v1.0.0"
   git push
   ```

3. **Create a GitHub Release**
   - Go to your repository on GitHub
   - Click "Releases" → "Create a new release"
   - Click "Choose a tag" and create a new tag (e.g., `v1.0.0`)
   - Set the release title (e.g., "PHV v1.0.0")
   - Add release notes describing changes
   - Click "Publish release"

4. **GitHub automatically creates ZIP files**
   - Users can download `Source code (zip)` from the release
   - No need to manually create zip files

### Development Setup

If you want to modify the code:

```bash
# Clone the repository
git clone https://github.com/yourusername/vigilante.git
cd vigilante

# Make your changes in the chrome-extension folder

# Load the extension in Chrome for testing
# 1. Go to chrome://extensions/
# 2. Enable Developer mode
# 3. Click "Load unpacked"
# 4. Select the chrome-extension folder
```

---

## 🤝 Contributing

This project is released into the **public domain**. Anyone can:

- ✅ Copy, modify, and distribute the code
- ✅ Use it for commercial purposes
- ✅ Create derivative works
- ✅ Use it without attribution (though attribution is appreciated)

Feel free to fork, modify, and create your own versions of this project.

---

## 📜 License

**NO LICENSE - PUBLIC DOMAIN**

This software is released into the public domain. Anyone is free to copy, modify, publish, use, compile, sell, or distribute this software, either in source code form or as a compiled binary, for any purpose, commercial or non-commercial, and by any means.

See the [UNLICENSE](UNLICENSE) file for more details.

---

## ⚠️ Disclaimer of Liability

**THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.**

THE AUTHORS AND CONTRIBUTORS PROVIDE THIS SOFTWARE WITH NO WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.

**IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR:**
- Any damages arising from use or misuse of this software
- Academic misconduct or violations of institutional policies
- Violations of terms of service of third-party websites
- Any other claims, damages, or liabilities

**YOU USE THIS SOFTWARE ENTIRELY AT YOUR OWN RISK.**

---

## 🆘 Support

This project is provided as-is with no official support. However:

- Issues and pull requests are welcome
- Check existing issues before creating new ones
- For Gemini API issues, consult [Google's documentation](https://ai.google.dev/)

---

## 🙏 Acknowledgments

- Google Gemini API for AI capabilities
- Chrome Extension APIs for browser integration
- The open-source community

---

## 📚 Additional Resources

- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [Google Gemini API Documentation](https://ai.google.dev/)
- [Academic Integrity Resources](https://www.academicintegrity.org/)

---

**Remember: With great power comes great responsibility. Use this tool ethically and in compliance with all applicable rules and regulations.**

---

*Last updated: October 2025*
