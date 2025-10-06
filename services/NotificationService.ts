import * as Notifications from 'expo-notifications';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export class NotificationService {
  static async requestPermissions(): Promise<boolean> {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return false;
    }

    return true;
  }

  static async scheduleNotification(
    title: string,
    body: string,
    delay: number = 2000,
    data?: any
  ): Promise<string> {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: data || {},
        sound: 'default',
      },
      trigger: {
        seconds: delay / 1000,
      },
    });

    return notificationId;
  }

  static async scheduleNotificationImmediate(
    title: string,
    body: string,
    data?: any
  ): Promise<string> {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: data || {},
        sound: 'default',
      },
      trigger: null, // Immediate
    });

    return notificationId;
  }

  static addNotificationReceivedListener(
    listener: (notification: Notifications.Notification) => void
  ) {
    return Notifications.addNotificationReceivedListener(listener);
  }

  static addNotificationResponseReceivedListener(
    listener: (response: Notifications.NotificationResponse) => void
  ) {
    return Notifications.addNotificationResponseReceivedListener(listener);
  }

  static async cancelNotification(notificationId: string) {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }

  static async cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }
}

