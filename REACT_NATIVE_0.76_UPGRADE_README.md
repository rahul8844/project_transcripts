# React Native 0.76.0 Upgrade Guide

This document outlines the upgrade from React Native 0.72.6 to React Native 0.76.0 for the project_transcript app.

## What Was Updated

### Core Dependencies
- **React Native**: 0.72.6 → 0.76.0
- **React**: 18.2.0 → 18.3.1
- **Node.js requirement**: >=16 → >=18

### React Native Ecosystem
- **@react-native/eslint-config**: 0.72.2 → 0.76.0
- **@react-native/metro-config**: 0.72.11 → 0.76.0
- **metro-react-native-babel-preset**: 0.76.8 → 0.77.0

### Navigation & UI Libraries
- **@react-navigation/native**: 6.1.7 → 6.1.18
- **@react-navigation/stack**: 6.3.17 → 6.4.1
- **@react-navigation/bottom-tabs**: 6.5.8 → 6.6.1
- **react-native-gesture-handler**: 2.12.1 → 2.15.0
- **react-native-reanimated**: 3.4.2 → 3.10.1
- **react-native-safe-area-context**: 4.7.1 → 4.10.5
- **react-native-screens**: 3.24.0 → 3.32.1
- **react-native-vector-icons**: 10.0.0 → 10.1.0
- **react-native-permissions**: 3.8.4 → 4.1.1
- **react-native-share**: 9.2.3 → 10.0.2

### Development Tools
- **TypeScript**: 4.8.4 → 5.3.3
- **ESLint**: 8.19.0 → 8.57.0
- **Prettier**: 2.4.1 → 3.2.5
- **Jest**: 29.2.1 → 29.7.0
- **Babel**: 7.20.0 → 7.24.0

## Android Configuration Updates

### Gradle & Build Tools
- **Android Gradle Plugin**: 7.3.1 → 8.1.4
- **Gradle**: 7.6.3 → 8.4
- **NDK**: 23.1.7779620 → 25.1.8937393
- **Java compatibility**: 1.8 → 17

### React Native Gradle Plugin
- Re-enabled the React Native Gradle plugin for proper dependency management
- Updated Flipper version to 0.201.0

## Key Changes Made

### 1. Package.json Updates
- Updated all React Native related packages to 0.76.0 compatible versions
- Updated development dependencies to latest stable versions
- Changed Node.js requirement to >=18

### 2. Android Build Configuration
- Updated Android Gradle Plugin to 8.1.4
- Updated Gradle wrapper to 8.4
- Updated NDK to 25.1.8937393
- Changed Java compatibility to version 17
- Re-enabled React Native Gradle plugin

### 3. Gradle Properties
- Updated Flipper version to 0.201.0
- Maintained existing configuration for new architecture and Hermes

## Breaking Changes & Considerations

### 1. Node.js Version
- **Requirement**: Node.js 18 or higher
- **Impact**: Older Node.js versions will not work

### 2. Java Version
- **Requirement**: Java 17 or higher
- **Impact**: Android builds require Java 17

### 3. Android Studio
- **Requirement**: Android Studio Hedgehog (2023.1.1) or higher
- **Impact**: Older Android Studio versions may not support AGP 8.1.4

### 4. React Native CLI
- The React Native CLI has been updated to support 0.76.0
- Some commands may have changed behavior

## Migration Steps

### 1. Update Dependencies
```bash
# Remove old node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Install new dependencies
npm install
```

### 2. Clean Android Build
```bash
cd android
./gradlew clean
```

### 3. Update Android Studio
- Ensure Android Studio is updated to Hedgehog (2023.1.1) or higher
- Update Android SDK Build Tools to 34.0.0
- Update Android SDK Platform to API 34

### 4. Test the Build
```bash
# Test Android build
npm run android

# Test iOS build (if applicable)
npm run ios
```

## Potential Issues & Solutions

### 1. Java Version Issues
- **Problem**: Build fails with Java version errors
- **Solution**: Ensure Java 17 is installed and JAVA_HOME is set correctly

### 2. Android Gradle Plugin Issues
- **Problem**: Build fails with AGP compatibility errors
- **Solution**: Update Android Studio and Android SDK tools

### 3. Metro Bundler Issues
- **Problem**: Metro bundler fails to start
- **Solution**: Clear Metro cache: `npx react-native start --reset-cache`

### 4. Native Module Compatibility
- **Problem**: Some native modules may not be compatible
- **Solution**: Check module compatibility and update to latest versions

## Testing Checklist

- [ ] App builds successfully on Android
- [ ] App builds successfully on iOS (if applicable)
- [ ] All screens render correctly
- [ ] Navigation works properly
- [ ] Voice recording functionality works
- [ ] File operations work correctly
- [ ] Permissions are requested properly
- [ ] App runs without crashes

## Rollback Plan

If issues arise, you can rollback to the previous version:

1. Revert package.json changes
2. Revert Android configuration changes
3. Restore previous node_modules (if available)
4. Run `npm install` to restore previous dependencies

## Additional Resources

- [React Native 0.76.0 Release Notes](https://reactnative.dev/blog/2024/01/15/0.76.0)
- [React Native Upgrade Helper](https://react-native-community.github.io/upgrade-helper/)
- [Android Gradle Plugin 8.1.4 Release Notes](https://developer.android.com/studio/releases/gradle-plugin)

## Notes

- This upgrade brings significant performance improvements and bug fixes
- The new architecture (Fabric) is still disabled by default
- Hermes JavaScript engine remains enabled by default
- All existing functionality should work as expected
- Consider enabling the new architecture in future updates for better performance
