# Expo React Native Assessment App

A complete Expo React Native app that demonstrates WebView integration, local notifications, and HLS video playback.

## 🎯 Features Implemented

### 1. WebView Page
- **Embedded Website**: Displays React Native documentation (https://reactnative.dev)
- **Custom Buttons**: Two beautifully designed gradient buttons with modern styling
- **Notification Triggers**: Each button schedules a distinct local notification with 2-5 second delays
- **Loading States**: Shows loading indicator while WebView loads
- **Bonus**: Automatic notification when WebView finishes loading

### 2. Notifications
- **Permission Handling**: Requests notification permissions on app start
- **Scheduled Notifications**: Two different notification messages with custom delays
- **Notification Service**: Modular service class for managing notifications
- **Response Handling**: Tracks notification taps and responses
- **Bonus**: Notification tap handling (shows alert, can be extended to navigate)

### 3. Video Player Page
- **HLS Video Stream**: Plays test video from Mux (https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8)
- **Custom Controls**: Play/pause, mute/unmute, seek forward/backward (10s), fullscreen
- **Progress Tracking**: Visual progress bar and time display
- **Professional UI**: Clean layout with elegant spacing and modern design
- **Status Management**: Tracks video state and user interactions

### 4. Navigation
- **Stack Navigator**: Smooth transitions between WebView and Video Player screens
- **Custom Animations**: Slide transitions with proper back navigation
- **Header Design**: Clean headers with back buttons and titles
- **Consistent Theming**: Unified color scheme and typography

## 🛠 Technical Implementation

### Dependencies Added
```json
{
  "expo-notifications": "~0.29.9",
  "expo-av": "~15.0.1", 
  "react-native-webview": "^13.12.2",
  "@react-navigation/stack": "^7.1.1",
  "expo-linear-gradient": "~14.0.1"
}
```

### Architecture
- **Modular Design**: Separate screens, services, and constants
- **TypeScript**: Full type safety throughout the application
- **Theme System**: Centralized colors, spacing, and styling constants
- **Service Layer**: NotificationService for managing notifications
- **Custom Components**: Reusable themed components

### Key Files
- `app/_layout.tsx` - Root layout with navigation setup
- `app/index.tsx` - Home screen with navigation to features
- `app/webview.tsx` - WebView with notification buttons
- `app/video.tsx` - HLS video player with custom controls
- `services/NotificationService.ts` - Notification management service
- `constants/theme.ts` - Design system and theme constants

## 🎨 Design Features

### Modern UI Elements
- **Gradient Buttons**: Beautiful linear gradients for primary actions
- **Card Layouts**: Elevated cards with shadows and rounded corners
- **Consistent Spacing**: Systematic spacing using design tokens
- **Typography Scale**: Proper font weights and sizes
- **Color Palette**: Professional color scheme with light/dark support

### User Experience
- **Loading States**: Visual feedback during WebView loading
- **Smooth Animations**: Fluid transitions between screens
- **Touch Feedback**: Proper button press animations
- **Responsive Design**: Adapts to different screen sizes
- **Accessibility**: Clear visual hierarchy and touch targets

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm start
   ```

3. **Run on Device/Simulator**:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app

## 📱 App Flow

1. **Launch**: App starts with home screen showing feature options
2. **WebView Screen**: Navigate to WebView screen showing React Native docs
3. **WebView Load**: Automatic notification appears when page loads
4. **Button Actions**: Tap buttons to schedule delayed notifications
5. **Video Screen**: Navigate to video player with HLS streaming
6. **Video Controls**: Use custom controls to manage video playback
7. **Navigation**: Smooth navigation between all screens

## ⭐ Bonus Features Implemented

- ✅ Notification when WebView finishes loading
- ✅ Notification tap handling (shows alert, ready for navigation)
- ✅ Custom video controls (mute, seek, fullscreen)
- ✅ Professional UI with gradients and modern design
- ✅ Comprehensive error handling
- ✅ TypeScript throughout
- ✅ Modular, maintainable code structure

## 🔧 Configuration

The app is configured with:
- **Notification Permissions**: Automatically requested on startup
- **HLS Video Support**: Ready for streaming video content
- **WebView Security**: Proper JavaScript and DOM storage enabled
- **Navigation**: Smooth stack navigation with custom animations

## 📝 Code Quality

- **Production Ready**: Error handling, loading states, proper cleanup
- **Well Commented**: Clear explanations of implementation choices
- **Modular**: Separated concerns with service layer
- **Type Safe**: Full TypeScript implementation
- **Consistent**: Unified styling and component patterns

This implementation provides a solid foundation for a production React Native app with all requested features and additional polish.