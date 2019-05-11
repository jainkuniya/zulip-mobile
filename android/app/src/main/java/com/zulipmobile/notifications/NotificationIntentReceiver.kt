package com.zulipmobile.notifications

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.Intent.ACTION_VIEW
import com.zulipmobile.MainApplication
import java.net.URL

class NotificationIntentReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context?, intent: Intent?) {
        val applicationContext = context!!.applicationContext as? MainApplication ?: return
        val conversations = applicationContext.conversations

        val data = intent!!.getBundleExtra("data")
        System.out.print("fdfdas")
//        val identity = Identity(
//            data.getString("server_host"),
//            data.getInt("realm_id"),
//            URL(data.getString("realm_url")),
//            data.getInt("user_id"))
//
//        if (ACTION_CLEAR == intent.action) {
//            onClear(applicationContext, conversations, identity)
//        } else if (ACTION_VIEW == intent.action) {
//            onOpened(applicationContext, conversations, data, identity)
//        }
    }

}
