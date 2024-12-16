# React Native Expo Project Setup and Development Guide

## 🚀 Project Overview
This is a React Native application developed using Expo, providing a streamlined mobile development experience that allows you to build native iOS and Android applications using JavaScript and React.

## 📱 Prerequisites
Before you begin, ensure you have the following installed:

- **Node.js** (version 16 or newer)
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify installation by running `node --version` in your terminal

- **npm or Yarn** (package managers)
   - npm comes bundled with Node.js
   - Or install Yarn globally: `npm install -g yarn`

- **Expo CLI**
   - Install globally using npm:
     ```bash
     npm install -g expo-cli
     ```
   - Or with Yarn:
     ```bash
     yarn global add expo-cli
     ```

## 📲 Mobile Device Setup

### iOS Users
- Download Expo Go from the App Store
   - Open the App Store
   - Search for "Expo Go"
   - Tap "Get" to install the application
   - Launch Expo Go after installation

### Android Users
- Download Expo Go from Google Play Store
   - Open Google Play Store
   - Search for "Expo Go"
   - Tap "Install"
   - Launch Expo Go after installation

## 💻 Local Development Setup

1. Clone the Repository
   ```bash
   # Using HTTPS
   git clone https://github.com/samuelorobosa/roqsense.git

   # Or using SSH
   git clone https://github.com/samuelorobosa/roqsense.git

   # Navigate to project directory
   cd roqsense
    ```
2. Install Dependencies
   ```bash
   npm install
   ```

3. Start the Development Server
   ```bash
    npm start
   ```

After running npm start, Expo will generate a QR code in the terminal and open a web interface
For iOS:

Open the Camera app on your iPhone
Point the camera at the QR code
Tap the notification banner that appears to open in Expo Go


For Android:

Open the Expo Go app
Tap "Scan QR Code"
Scan the QR code displayed in the terminal


## 🛠 Troubleshooting Common Issues
Connection Problems

Ensure your computer and mobile device are on the same Wi-Fi network
Check firewall settings
Restart Expo development server

## QR Code Not Scanning

Refresh the Expo developer tools by pressing r in the terminal
Regenerate the QR code
Restart Expo Go app

## 📦 Available Scripts

npm start or yarn start: Start the Expo development server
npm run ios or yarn ios: Run the app on an iOS simulator
npm run android or yarn android: Run the app on an Android emulator
npm run build or yarn build: Create a production build
   
