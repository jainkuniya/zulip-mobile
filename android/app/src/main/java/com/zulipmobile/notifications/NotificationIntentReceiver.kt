package com.zulipmobile.notifications

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.Intent.ACTION_VIEW
import com.zulipmobile.MainApplication

class NotificationIntentReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context?, intent: Intent?) {
        val applicationContext = context!!.applicationContext as? MainApplication ?: return
        val conversations = applicationContext.conversations
        if (ACTION_CLEAR == intent!!.action) {
            onClear(applicationContext, conversations)
        } else if (ACTION_VIEW == intent.action) {
            val data = intent.getBundleExtra(EXTRA_NOTIFICATION_DATA)
            onOpened(applicationContext, conversations, data)
        }
    }

}
