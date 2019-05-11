package com.zulipmobile.notifications

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import com.zulipmobile.MainApplication

class NotificationIntentReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context?, intent: Intent?) {
        val applicationContext = context!!.applicationContext as? MainApplication ?: return
        val conversations = applicationContext.conversations
        if (ACTION_CLEAR == intent!!.action) {
            onClear(applicationContext, conversations)
        }
    }

}
