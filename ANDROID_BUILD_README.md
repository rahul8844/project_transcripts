# Android Build Instructions

This document explains how to build debug and release APKs for the Menu Listener App.

## Prerequisites

1. Make sure you have the following installed:
   - Node.js (>=16)
   - Java Development Kit (JDK) 11 or 17
   - Android Studio with Android SDK
   - Android NDK

2. Set up environment variables:
   ```bash
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/tools
   export PATH=$PATH:$ANDROID_HOME/tools/bin
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

## Building Debug APK

1. Navigate to the project directory:
   ```bash
   cd project_transcript
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start Metro bundler:
   ```bash
   npm start
   ```

4. In a new terminal, build and run the debug APK:
   ```bash
   npm run android
   ```

   Or build the debug APK without installing:
   ```bash
   cd android
   ./gradlew assembleDebug
   ```

   The debug APK will be located at:
   `android/app/build/outputs/apk/debug/app-debug.apk`

## Building Release APK

### Option 1: Using Debug Keystore (for testing only)

1. Build the release APK:
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

   The release APK will be located at:
   `android/app/build/outputs/apk/release/app-release.apk`

### Option 2: Using Custom Keystore (for production)

1. Generate a keystore file:
   ```bash
   keytool -genkey -v -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
   ```

2. Move the keystore to `android/app/` directory

3. Configure the signing in `android/gradle.properties`:
   ```properties
   MYAPP_UPLOAD_STORE_FILE=my-upload-key.keystore
   MYAPP_UPLOAD_KEY_ALIAS=my-key-alias
   MYAPP_UPLOAD_STORE_PASSWORD=your-store-password
   MYAPP_UPLOAD_KEY_PASSWORD=your-key-password
   ```

4. Build the release APK:
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

## Troubleshooting

### Gradle Download Timeout
If you encounter Gradle download timeout issues:
1. Check your internet connection
2. Try using a VPN
3. The project is configured to use Gradle 7.6.3 which is more stable

### Build Errors
1. Clean the project:
   ```bash
   cd android
   ./gradlew clean
   ```

2. Clear Gradle cache:
   ```bash
   ./gradlew cleanBuildCache
   ```

3. Invalidate Android Studio caches (if using Android Studio)

### Permission Issues
The app requires the following permissions:
- Internet access
- Audio recording
- File storage access
- Location access

Make sure these are properly configured in `AndroidManifest.xml`.

## File Structure

```
android/
├── app/
│   ├── src/main/
│   │   ├── java/com/menulistenerapp/
│   │   │   ├── MainActivity.java
│   │   │   └── MainApplication.java
│   │   ├── res/
│   │   │   ├── drawable/
│   │   │   ├── mipmap/
│   │   │   └── values/
│   │   └── AndroidManifest.xml
│   ├── build.gradle
│   ├── proguard-rules.pro
│   └── gradle.properties
├── build.gradle
├── gradle.properties
├── settings.gradle
└── gradle/wrapper/
    └── gradle-wrapper.properties
```

## Notes

- The app is configured to use React Native 0.72.6
- Hermes JavaScript engine is enabled by default
- New Architecture (Fabric) is disabled by default
- The app supports multiple CPU architectures (armeabi-v7a, arm64-v8a, x86, x86_64)
- Debug builds are automatically signed with the debug keystore
- Release builds require proper signing configuration
