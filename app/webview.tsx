import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BorderRadius, Colors, Shadows, Spacing } from '@/constants/theme';
import { NotificationService } from '@/services/NotificationService';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';

const { width, height } = Dimensions.get('window');

export default function WebViewScreen() {
  const [loading, setLoading] = useState(true);
  const [webViewLoaded, setWebViewLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const webViewRef = useRef<WebView>(null);

  // Fallback URLs in case the primary URL fails
  const urls = [
    'https://reactnative.dev',
    'https://reactnative.dev/docs/getting-started',
    'https://docs.expo.dev',
    'https://developer.mozilla.org/en-US/docs/Web/API/WebView'
  ];
  
  const [currentUrlIndex, setCurrentUrlIndex] = useState(0);

  // Simple network connectivity check using fetch
  const checkNetworkConnectivity = async () => {
    try {
      // Create an AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      // Try to fetch a simple resource to check connectivity
      const response = await fetch('https://www.google.com/favicon.ico', {
        method: 'HEAD',
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      console.log('Network check failed:', error);
      return false;
    }
  };

  const handleWebViewLoad = () => {
    setLoading(false);
    setWebViewLoaded(true);
    setHasError(false);
    setErrorMessage('');
    
    // Bonus: Show notification when WebView finishes loading
    NotificationService.scheduleNotificationImmediate(
      'WebView Loaded!',
      'The React Native website has finished loading successfully.',
      { screen: 'webview' }
    );
  };

  const handleWebViewError = async (error: any) => {
    console.log('WebView Error:', error);
    setLoading(false);
    setHasError(true);
    
    // Extract error message from the error object
    const errorMsg = error?.nativeEvent?.description || error?.message || 'Unknown error occurred';
    setErrorMessage(errorMsg);
    
    // Check network connectivity
    const isConnected = await checkNetworkConnectivity();
    
    if (!isConnected) {
      Alert.alert(
        'Network Error',
        'No internet connection detected. Please check your network settings and try again.',
        [
          { text: 'Retry', onPress: retryLoad },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    } else if (retryCount < urls.length - 1) {
      // Try next fallback URL
      Alert.alert(
        'Loading Error',
        `Failed to load the current page. Trying alternative URL...`,
        [
          { text: 'Try Alternative', onPress: tryNextUrl },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    } else {
      // All URLs failed
      Alert.alert(
        'Loading Failed',
        'Unable to load any of the available pages. Please check your internet connection and try again.',
        [
          { text: 'Retry All', onPress: retryAllUrls },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    }
  };

  const tryNextUrl = () => {
    const nextIndex = currentUrlIndex + 1;
    if (nextIndex < urls.length) {
      setCurrentUrlIndex(nextIndex);
      setRetryCount(prev => prev + 1);
      setLoading(true);
      setHasError(false);
      setErrorMessage('');
    }
  };

  const retryLoad = () => {
    setLoading(true);
    setHasError(false);
    setErrorMessage('');
    setRetryCount(0);
    setCurrentUrlIndex(0);
  };

  const retryAllUrls = () => {
    setCurrentUrlIndex(0);
    setRetryCount(0);
    setLoading(true);
    setHasError(false);
    setErrorMessage('');
  };

  const handleNotification1 = async () => {
    try {
      const notificationId = await NotificationService.scheduleNotification(
        'Welcome Notification! 🎉',
        'This is your first custom notification from the WebView screen.',
        3000, // 3 second delay
        { screen: 'webview', action: 'welcome' }
      );
      
      Alert.alert(
        'Notification Scheduled',
        'Your first notification will appear in 3 seconds!',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to schedule notification');
    }
  };

  const handleNotification2 = async () => {
    try {
      const notificationId = await NotificationService.scheduleNotification(
        'Amazing Features! ✨',
        'Discover the power of React Native with this interactive demo.',
        5000, // 5 second delay
        { screen: 'webview', action: 'features' }
      );
      
      Alert.alert(
        'Notification Scheduled',
        'Your second notification will appear in 5 seconds!',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to schedule notification');
    }
  };

  const navigateToVideo = () => {
    router.push('/video');
  };

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText type="title" style={styles.headerTitle}>
          WebView & Notifications
        </ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          Explore React Native documentation
        </ThemedText>
      </View>

      {/* WebView Container */}
      <View style={styles.webViewContainer}>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.light.primary} />
            <ThemedText style={styles.loadingText}>
              Loading {urls[currentUrlIndex]}...
            </ThemedText>
            {retryCount > 0 && (
              <ThemedText style={styles.retryText}>
                Attempt {retryCount + 1} of {urls.length}
              </ThemedText>
            )}
          </View>
        )}

        {hasError && !loading && (
          <View style={styles.errorContainer}>
            <ThemedText style={styles.errorTitle}>⚠️ Loading Error</ThemedText>
            <ThemedText style={styles.errorMessage}>{errorMessage}</ThemedText>
            <ThemedText style={styles.errorUrl}>
              Failed URL: {urls[currentUrlIndex]}
            </ThemedText>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={retryLoad}
              activeOpacity={0.8}
            >
              <Text style={styles.retryButtonText}>🔄 Retry</Text>
            </TouchableOpacity>
          </View>
        )}
        
        <WebView
          ref={webViewRef}
          key={`webview-${currentUrlIndex}`} // Force re-render when URL changes
          source={{ uri: urls[currentUrlIndex] }}
          style={styles.webView}
          onLoad={handleWebViewLoad}
          onError={handleWebViewError}
          onHttpError={handleWebViewError}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          mixedContentMode="compatibility"
          thirdPartyCookiesEnabled={true}
          sharedCookiesEnabled={true}
          onShouldStartLoadWithRequest={(request) => {
            // Allow navigation to external URLs
            return true;
          }}
        />
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={handleNotification1}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={Colors.light.gradient.primary as [string, string]}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.buttonText}>Send Notification 1</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={handleNotification2}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={Colors.light.gradient.secondary as [string, string]}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.buttonText}>Send Notification 2</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.videoButton]}
          onPress={navigateToVideo}
          activeOpacity={0.8}
        >
          <Text style={styles.videoButtonText}>🎬 Go to Video Player</Text>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    padding: Spacing.lg,
    paddingTop: Spacing.xl,
    backgroundColor: Colors.light.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.light.tabIconDefault,
  },
  webViewContainer: {
    flex: 1,
    margin: Spacing.md,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.md,
  },
  webView: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.light.surface,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: 16,
    color: Colors.light.tabIconDefault,
  },
  buttonContainer: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  button: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  buttonGradient: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    // Additional styles if needed
  },
  secondaryButton: {
    // Additional styles if needed
  },
  videoButton: {
    backgroundColor: Colors.light.surface,
    borderWidth: 2,
    borderColor: Colors.light.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  videoButtonText: {
    color: Colors.light.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  retryText: {
    marginTop: Spacing.sm,
    fontSize: 14,
    color: Colors.light.tabIconDefault,
    fontStyle: 'italic',
  },
  errorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.light.surface,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
    zIndex: 1,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.error || '#FF6B6B',
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: Spacing.sm,
    textAlign: 'center',
    lineHeight: 22,
  },
  errorUrl: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
    marginBottom: Spacing.lg,
    textAlign: 'center',
    fontFamily: 'monospace',
  },
  retryButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    ...Shadows.sm,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
