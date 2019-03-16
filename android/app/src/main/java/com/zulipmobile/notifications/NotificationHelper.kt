package com.zulipmobile.notifications

import android.app.Notification
import android.content.Context
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
import java.util.*

import com.zulipmobile.R
import kotlin.collections.ArrayList
import kotlin.collections.LinkedHashMap

class NotificationHelper {
    companion object {
        const val TAG = "ZulipNotif"

        private fun buildKey(fcmMessage: MessageFcmMessage): ConversationMapKey {
            return ConversationMapKey(fcmMessage.identity, fcmMessage.zulipMessageId)
        }

        fun addMessagesToMap(fcmMessage: MessageFcmMessage, conversations: ConversationMap) {
            val key = buildKey(fcmMessage)
            conversations[key] = fcmMessage
        }

        fun removeMessagesFromMap(fcmMessage: RemoveFcmMessage, conversations: ConversationMap) {
            val it = fcmMessage.messageIds.iterator()
            while (it.hasNext()) {
                conversations.remove(ConversationMapKey(fcmMessage.identity, it.next()))
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
            return try {
                URL(url, "?$query")
            } catch (e: MalformedURLException) {
                Log.e(TAG, "ERROR: $e")
                null
            }

        }

        private fun extractName(key: String): String {
            return key.split(":".toRegex()).dropLastWhile { it.isEmpty() }.toTypedArray()[0]
        }

        /**
         * Formats -
         * stream message - fullName:streamName:'stream'
         * group message - fullName:Recipients:'group'
         * private message - fullName:Email:'private'
         */
        private fun buildKeyForLegacyNotification(fcmMessage: MessageFcmMessage): String {
            val recipient = fcmMessage.recipient
            return when (recipient) {
                is Recipient.Stream -> String.format("%s:%s:stream", fcmMessage.sender.fullName,
                    recipient.stream)
                is Recipient.GroupPm -> String.format("%s:%s:group", fcmMessage.sender.fullName,
                    recipient.getPmUsersString())
                else -> String.format("%s:%s:private", fcmMessage.sender.fullName,
                    fcmMessage.sender.email)
            }
        }

        fun getNarrowMapForLegacyNotification(conversations: ConversationMap): LinkedHashMap<String, MutableList<MessageInfo>> {
            // build map of narrow string as key and list of messages in that narrow
            val narrowMap: LinkedHashMap<String, MutableList<MessageInfo>> = LinkedHashMap()

            for ((_, message) in conversations) {
                val key: String = buildKeyForLegacyNotification(message)
                var messageList: MutableList<MessageInfo>? = narrowMap[key]
                if (messageList == null) {
                    messageList = ArrayList()
                }
                messageList.add(MessageInfo(message.content, message.zulipMessageId))
                narrowMap[key] = messageList
            }
            return narrowMap
        }

        fun buildLegacyNotificationContent(narrowMap: LinkedHashMap<String, MutableList<MessageInfo>>,
                                           inboxStyle: Notification.InboxStyle, mContext: Context) {
            for ((key, messages) in narrowMap) {
                val name = extractName(key)
                val sb = SpannableString(String.format(Locale.ENGLISH, "%s%s: %s", name,
                    mContext.resources.getQuantityString(R.plurals.messages, messages.size, messages.size),
                    messages[messages.size - 1].content))
                sb.setSpan(StyleSpan(android.graphics.Typeface.BOLD), 0, name.length, Spannable.SPAN_EXCLUSIVE_EXCLUSIVE)
                inboxStyle.addLine(sb)
            }
        }

        fun extractNamesForLegacyNotification(narrowMap: LinkedHashMap<String, MutableList<MessageInfo>>): Array<String?> {
            val names = arrayOfNulls<String>(narrowMap.size)
            var index = 0
            for ((key) in narrowMap) {
                names[index++] = key.split(":".toRegex()).dropLastWhile { it.isEmpty() }.toTypedArray()[0]
            }
            return names
        }

        fun extractTotalMessagesCount(conversations: ConversationMap): Int {
            return conversations.size
        }
    }

    class ConversationMapKey(
        var identity: Identity?,
        var messageId: Int
    ){
        @Override
        override fun equals(other: Any?): Boolean {
            //TODO implement this
            return super.equals(other)
        }

        override fun hashCode(): Int {
            var result = identity?.hashCode() ?: 0
            result = 31 * result + messageId
            return result
        }
    }

    class ConversationMap : LinkedHashMap<ConversationMapKey, MessageFcmMessage>()
}
