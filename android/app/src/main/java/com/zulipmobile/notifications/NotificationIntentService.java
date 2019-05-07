package com.zulipmobile.notifications;

import android.app.IntentService;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.support.annotation.Nullable;
import com.facebook.react.ReactApplication;
import java.net.MalformedURLException;
import java.net.URL;
import org.jetbrains.annotations.NotNull;

import com.zulipmobile.MainApplication;

import static android.content.Intent.ACTION_VIEW;
import static com.zulipmobile.notifications.FCMPushNotifications.ACTION_CLEAR;
import static com.zulipmobile.notifications.FCMPushNotifications.EXTRA_NOTIFICATION_DATA;
import static com.zulipmobile.notifications.FcmMessageKt.getIdentityFromNotificationExtraData;

public class NotificationIntentService extends IntentService {
    public NotificationIntentService() {
        super("NotificationIntentService");
    }

    @Override
    public int onStartCommand(@Nullable Intent intent, int flags, int startId) {
        final Context applicationContext = getApplicationContext();
        if (!(applicationContext instanceof MainApplication)) {
            return super.onStartCommand(intent, flags, startId);
        }
        final ConversationMap conversations =
                ((MainApplication) applicationContext).getConversations();

        final Bundle data = intent.getBundleExtra(EXTRA_NOTIFICATION_DATA);
        final Bundle data2 = intent.getExtras().getBundle(EXTRA_NOTIFICATION_DATA);

        try {
            if (ACTION_VIEW.equals(intent.getAction())) {
                Identity identity = getIdentityFromNotificationExtraData(data);
                FCMPushNotifications.onOpened((ReactApplication) getApplication(), conversations, data, identity);
            } else if (ACTION_CLEAR.equals(intent.getAction())) {
                Identity identity = getIdentityFromNotificationExtraData(intent.getExtras());
                FCMPushNotifications.onClear(this, conversations, identity);
            }
        } catch (MalformedURLException e) {
            e.printStackTrace();
        }

        return super.onStartCommand(intent, flags, startId);
    }

    @Override
    protected void onHandleIntent(Intent intent) {
//        final Context applicationContext = getApplicationContext();
//        if (!(applicationContext instanceof MainApplication)) {
//            return;
//        }
//        final ConversationMap conversations =
//                ((MainApplication) applicationContext).getConversations();
//
//        final Bundle data = intent.getBundleExtra(EXTRA_NOTIFICATION_DATA);
//        final Bundle data2 = intent.getExtras().getBundle(EXTRA_NOTIFICATION_DATA);
//
//        try {
//            if (ACTION_VIEW.equals(intent.getAction())) {
//                Identity identity = getIdentityFromNotificationExtraData(data);
//                FCMPushNotifications.onOpened((ReactApplication) getApplication(), conversations, data, identity);
//            } else if (ACTION_CLEAR.equals(intent.getAction())) {
//                Identity identity = getIdentityFromNotificationExtraData(intent.getExtras());
//                FCMPushNotifications.onClear(this, conversations, identity);
//            }
//        } catch (MalformedURLException e) {
//            e.printStackTrace();
//        }

    }
}
