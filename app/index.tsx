import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BorderRadius, Colors, Shadows, Spacing } from '@/constants/theme';
import { NotificationService } from '@/services/NotificationService';
import { LinearGradient } from 'expo-linear-gradient';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  useEffect(() => {
    // Request notification permissions on app start
    NotificationService.requestPermissions();

    // Set up notification listeners
    notificationListener.current = NotificationService.addNotificationReceivedListener(
      (notification) => {
        console.log('Notification received:', notification);
      }
    );

    responseListener.current = NotificationService.addNotificationResponseReceivedListener(
      (response) => {
        console.log('Notification response:', response);
        
        // Bonus: Navigate to Video Player when notification is tapped
        if (response.notification.request.content.data?.action === 'welcome' ||
            response.notification.request.content.data?.action === 'features') {
          router.push('/video');
        }
      }
    );

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  return (
    <ThemedView style={styles.container}> 
        <ScrollView
        contentContainerStyle={{ paddingBottom: Spacing.xxl }}
        showsVerticalScrollIndicator={false}
      >
      <Image
        source={require('../assets/images/coding.png')}
        style={styles.image}
        resizeMode="contain"
      />
     {/* <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Expo Assessment App
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          WebView, Notifications & Video Player
        </ThemedText>
      </View> */}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={() => router.push('/webview')}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={Colors.light.gradient.primary as [string, string]}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.buttonText}>🌐 WebView & Notifications</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => router.push('/video')}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={Colors.light.gradient.secondary as [string, string]}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.buttonText}>🎬 HLS Video Player</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <ThemedText style={styles.infoText}>
          This app demonstrates:
        </ThemedText>
        <ThemedText style={styles.featureItem}>• WebView with React Native docs</ThemedText>
        <ThemedText style={styles.featureItem}>• Local notifications with delays</ThemedText>
        <ThemedText style={styles.featureItem}>• HLS video streaming</ThemedText>
        <ThemedText style={styles.featureItem}>• Custom video controls</ThemedText>
        <ThemedText style={styles.featureItem}>• Modern UI with gradients</ThemedText>
      </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    padding: Spacing.xl,
    paddingTop: Spacing.xxl,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: Colors.light.tabIconDefault,
    textAlign: 'center',
  },
  buttonContainer: {
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  button: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.md,
  },
  buttonGradient: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
  },
  secondaryButton: {
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  infoContainer: {
    padding: Spacing.lg,
    margin: Spacing.lg,
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
  },
  image: {
    width: 250,
    height: 290,
    alignSelf: 'center',
    marginTop: Spacing.xl,
  },
  infoText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: Spacing.md,
  },
  featureItem: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
    marginBottom: Spacing.xs,
  },
});



