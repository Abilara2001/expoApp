import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BorderRadius, Colors, Shadows, Spacing } from '@/constants/theme';
import { AVPlaybackStatus, ResizeMode, Video } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    Dimensions,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function VideoPlayerScreen() {
  const videoRef = useRef<Video>(null);
  const [status, setStatus] = useState<AVPlaybackStatus>({});
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handlePlayPause = async () => {
    if (videoRef.current) {
      if (status.isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
    }
  };

  const handleMute = async () => {
    if (videoRef.current) {
      await videoRef.current.setIsMutedAsync(!isMuted);
      setIsMuted(!isMuted);
    }
  };

  const handleSeek = async (seconds: number) => {
    if (videoRef.current) {
      const currentPosition = status.positionMillis || 0;
      const newPosition = currentPosition + seconds * 1000;
      await videoRef.current.setPositionAsync(newPosition);
    }
  };

  const handleFullscreen = async () => {
    if (videoRef.current) {
      if (isFullscreen) {
        await videoRef.current.dismissFullscreenPlayer();
        setIsFullscreen(false);
      } else {
        await videoRef.current.presentFullscreenPlayer();
        setIsFullscreen(true);
      }
    }
  };

  const formatTime = (millis: number) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = Math.floor((millis % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    if (status.durationMillis && status.positionMillis) {
      return status.positionMillis / status.durationMillis;
    }
    return 0;
  };

  return (
    <ThemedView style={styles.container}>
      <StatusBar hidden={isFullscreen} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <ThemedText type="title" style={styles.headerTitle}>
          HLS Video Player
        </ThemedText>
        <View style={styles.placeholder} />
      </View>

      {/* Video Container */}
      <View style={styles.videoContainer}>
        <Video
          ref={videoRef}
          style={styles.video}
          source={{
            uri: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
          }}
          useNativeControls={false}
          resizeMode={ResizeMode.CONTAIN}
          isLooping={false}
          onPlaybackStatusUpdate={setStatus}
          shouldPlay={false}
        />

        {/* Custom Video Controls Overlay */}
        <View style={styles.controlsOverlay}>
          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${getProgress() * 100}%` }
                ]}
              />
            </View>
          </View>

          {/* Control Buttons */}
          <View style={styles.controlsRow}>
            <View style={styles.leftControls}>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={handlePlayPause}
                activeOpacity={0.7}
              >
                <Text style={styles.controlButtonText}>
                  {status.isPlaying ? '⏸️' : '▶️'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.controlButton}
                onPress={handleMute}
                activeOpacity={0.7}
              >
                <Text style={styles.controlButtonText}>
                  {isMuted ? '🔇' : '🔊'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => handleSeek(-10)}
                activeOpacity={0.7}
              >
                <Text style={styles.controlButtonText}>⏪ 10s</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => handleSeek(10)}
                activeOpacity={0.7}
              >
                <Text style={styles.controlButtonText}>⏩ 10s</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.rightControls}>
              <Text style={styles.timeText}>
                {formatTime(status.positionMillis || 0)} / {formatTime(status.durationMillis || 0)}
              </Text>
              
              <TouchableOpacity
                style={styles.controlButton}
                onPress={handleFullscreen}
                activeOpacity={0.7}
              >
                <Text style={styles.controlButtonText}>
                  {isFullscreen ? '⤓' : '⤢'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Video Info */}
      <View style={styles.infoContainer}>
        <ThemedText type="subtitle" style={styles.infoTitle}>
          Test HLS Stream
        </ThemedText>
        <ThemedText style={styles.infoDescription}>
          This is a test HLS video stream from Mux. Use the controls above to play, pause, 
          seek, mute, and toggle fullscreen mode.
        </ThemedText>
        
        <View style={styles.featureList}>
          <ThemedText style={styles.featureItem}>• Play/Pause controls</ThemedText>
          <ThemedText style={styles.featureItem}>• Seek forward/backward (10s)</ThemedText>
          <ThemedText style={styles.featureItem}>• Mute/unmute audio</ThemedText>
          <ThemedText style={styles.featureItem}>• Fullscreen support</ThemedText>
          <ThemedText style={styles.featureItem}>• Progress tracking</ThemedText>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push('/webview')}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={Colors.light.gradient.primary as [string, string]}
            style={styles.actionButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.actionButtonText}>🌐 Back to WebView</Text>
          </LinearGradient>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    paddingTop: Spacing.xl,
    backgroundColor: Colors.light.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  backButton: {
    padding: Spacing.sm,
  },
  backButtonText: {
    fontSize: 16,
    color: Colors.light.primary,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  placeholder: {
    width: 60, // Same width as back button for centering
  },
  videoContainer: {
    flex: 1,
    margin: Spacing.md,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    backgroundColor: Colors.light.surface,
    ...Shadows.lg,
  },
  video: {
    flex: 1,
    width: '100%',
  },
  controlsOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: Spacing.md,
  },
  progressContainer: {
    marginBottom: Spacing.md,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.light.primary,
    borderRadius: 2,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  rightControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  controlButton: {
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  controlButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  timeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  infoContainer: {
    padding: Spacing.lg,
    backgroundColor: Colors.light.surface,
    margin: Spacing.md,
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: Spacing.sm,
  },
  infoDescription: {
    fontSize: 16,
    color: Colors.light.tabIconDefault,
    lineHeight: 24,
    marginBottom: Spacing.md,
  },
  featureList: {
    gap: Spacing.xs,
  },
  featureItem: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
  },
  actionContainer: {
    padding: Spacing.lg,
  },
  actionButton: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  actionButtonGradient: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
