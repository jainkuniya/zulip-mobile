package com.zulipmobile.notifications

import android.app.Notification
import android.content.Context
import android.content.res.Resources
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.text.Spannable
import android.text.SpannableString
import android.text.style.StyleSpan
import android.util.Log
import android.util.TypedValue
import java.io.IOException
import java.io.InputStream
import java.net.MalformedURLException
import java.net.URL
import java.net.URLConnection
import java.util.*

import com.zulipmobile.R

class NotificationHelper {
    companion object {
        const val TAG = "ZulipNotif"

        /**
         * Formats -
         * stream message - fullName:streamName:'stream'
         * group message - fullName:Recipients:'group'
         * private message - fullName:Email:'private'
         */
        private fun buildKeyString(fcmMessage: MessageFcmMessage): String {
            val recipient = fcmMessage.recipient
            return if (recipient is Recipient.Stream)
                String.format("%s:%s:stream", fcmMessage.sender.fullName,
                    recipient.stream)
            else if (recipient is Recipient.GroupPm) {
                String.format("%s:%s:group", fcmMessage.sender.fullName,
                    recipient.getPmUsersString())
            } else {
                String.format("%s:%s:private", fcmMessage.sender.fullName,
                    fcmMessage.sender.email)
            }
        }

        fun addConversationToMap(fcmMessage: MessageFcmMessage, conversations: ConversationMap) {
            val key = buildKeyString(fcmMessage)
            var messages: MutableList<MessageInfo>? = conversations[key]
            val messageInfo = MessageInfo(fcmMessage.content, fcmMessage.zulipMessageId)
            if (messages == null) {
                messages = ArrayList()
            }
            messages.add(messageInfo)
            conversations[key] = messages
        }

        fun removeMessagesFromMap(conversations: ConversationMap, messageIds: Set<Int>) {
            // We don't have the information to compute what key we ought to find each message under,
            // so just walk the whole thing.  If the user has >100 notifications, this linear scan
            // won't be their worst problem anyway...
            //
            // TODO redesign this whole data structure, for many reasons.
            val it = conversations.values.iterator()
            while (it.hasNext()) {
                val messages: MutableList<MessageInfo> = it.next()
                for (i in messages.indices.reversed()) {
                    if (messageIds.contains(messages[i].messageId)) {
                        messages.removeAt(i)
                    }
                }
                if (messages.isEmpty()) {
                    it.remove()
                }
            }
        }

        fun clearConversations(conversations: ConversationMap) {
            conversations.clear()
        }

        @Throws(IOException::class)
        fun fetch(url: URL): Bitmap? {
            Log.i(TAG, "GAFT.fetch: Getting gravatar from url: $url")
            val connection = url.openConnection()
            connection.useCaches = true
            val response = connection.content
            return if (response is InputStream) {
                BitmapFactory.decodeStream(response)
            } else null
        }

        fun sizedURL(context: Context, url: URL, dpSize: Float): URL? {
            // From http://stackoverflow.com/questions/4605527/
            val r = context.resources
            val px = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP,
                dpSize, r.displayMetrics)
            val query = if (url.query != null) url.query + "&s=" + px else "s=$px"
            try {
                return URL(url, "?$query")
            } catch (e: MalformedURLException) {
                Log.e(TAG, "ERROR: $e")
                return null
            }

        }

        private fun extractName(key: String): String {
            return key.split(":".toRegex()).dropLastWhile { it.isEmpty() }.toTypedArray()[0]
        }

        fun buildNotificationContent(conversations: ConversationMap, inboxStyle: Notification.InboxStyle, mContext: Context) {
            for ((key, messages) in conversations) {
                val name = extractName(key)
                val sb = SpannableString(String.format(Locale.ENGLISH, "%s%s: %s", name,
                    mContext.resources.getQuantityString(R.plurals.messages, messages.size, messages.size),
                    messages[messages.size - 1].content))
                sb.setSpan(StyleSpan(android.graphics.Typeface.BOLD), 0, name.length, Spannable.SPAN_EXCLUSIVE_EXCLUSIVE)
                inboxStyle.addLine(sb)
            }
        }

        fun extractNames(conversations: ConversationMap): Array<String?> {
            val names = arrayOfNulls<String>(conversations.size)
            var index = 0
            for ((key) in conversations) {
                names[index++] = key.split(":".toRegex()).dropLastWhile { it.isEmpty() }.toTypedArray()[0]
            }
            return names
        }

        fun extractTotalMessagesCount(conversations: ConversationMap): Int {
            var totalNumber = 0
            for ((_, value) in conversations) {
                totalNumber += value.size
            }
            return totalNumber
        }
    }


    class ConversationMap : LinkedHashMap<String, MutableList<MessageInfo>>()
}
