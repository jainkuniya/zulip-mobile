package com.zulipmobile.notifications;

import android.content.Context;
import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

import com.zulipmobile.MainApplication;

public class FcmListenerService extends FirebaseMessagingService {
    @Override
    public void onMessageReceived(RemoteMessage message) {
        final Context applicationContext = getApplicationContext();
        if (!(applicationContext instanceof MainApplication)) {
            return;
        }
        final AllConversationMap allConversations =
                ((MainApplication) applicationContext).getAllConversations();
        FCMPushNotifications.onReceived(this, allConversations, message.getData());
    }
}
