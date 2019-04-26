@file:JvmName("NotificationHelper")

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
import com.zulipmobile.R
import java.io.IOException
import java.io.InputStream
import java.net.URL
import java.util.*

@JvmField
val TAG = "ZulipNotif"

/**
 * The Zulip messages we're showing as a notification, grouped by conversation.
 *
 * Each key identifies a conversation; see @{link buildKeyString}.
 *
 * Each value is the messages in the conversation, in the order we
 * received them.
 */
open class ByConversationMap : LinkedHashMap<String, MutableList<MessageInfo>>()
class AllConversationMap : ByConversationMap()

fun fetchBitmap(url: URL): Bitmap? {
    Log.i(TAG, "GAFT.fetch: Getting gravatar from url: $url")
    return try {
        val connection = url.openConnection()
        connection.useCaches = true
        (connection.content as? InputStream)
            ?.let { BitmapFactory.decodeStream(it) }
    } catch (e: IOException) {
        Log.e(TAG, "ERROR: $e")
        null
    }
}

fun sizedURL(context: Context, url: URL, dpSize: Float): URL {
    // From http://stackoverflow.com/questions/4605527/
    val r = context.resources
    val px = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP,
        dpSize, r.displayMetrics)
    val query = if (url.query != null) "${url.query}&s=$px" else "s=$px"
    return URL(url, "?$query")
}

private fun extractName(key: String): String {
    return key.split(":".toRegex()).dropLastWhile { it.isEmpty() }.toTypedArray()[0]
}

fun buildNotificationContent(allConversations: AllConversationMap, inboxStyle: Notification.InboxStyle, mContext: Context) {
    for ((key, messages) in allConversations) {
        val name = extractName(key)
        val sb = SpannableString(String.format(Locale.ENGLISH, "%s%s: %s", name,
            mContext.resources.getQuantityString(R.plurals.messages, messages.size, messages.size),
            messages[messages.size - 1].content))
        sb.setSpan(StyleSpan(android.graphics.Typeface.BOLD), 0, name.length, Spannable.SPAN_EXCLUSIVE_EXCLUSIVE)
        inboxStyle.addLine(sb)
    }
}

fun extractTotalMessagesCount(allConversations: AllConversationMap): Int {
    var totalNumber = 0
    for ((_, value) in allConversations) {
        totalNumber += value.size
    }
    return totalNumber
}

/**
 * Formats -
 * stream message - fullName:streamName:'stream'
 * group message - fullName:Recipients:'group'
 * private message - fullName:Email:'private'
 */
private fun buildKeyString(fcmMessage: MessageFcmMessage): String {
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

fun extractNames(allConversations: AllConversationMap): ArrayList<String> {
    val names = arrayListOf<String>()
    for ((key) in allConversations) {
        names.add(key.split(":".toRegex()).dropLastWhile { it.isEmpty() }.toTypedArray()[0])
    }
    return names
}

fun addConversationToMap(fcmMessage: MessageFcmMessage, allConversations: AllConversationMap) {
    val key = buildKeyString(fcmMessage)
    var messages: MutableList<MessageInfo>? = allConversations[key]
    val messageInfo = MessageInfo(fcmMessage.content, fcmMessage.zulipMessageId)
    if (messages == null) {
        messages = ArrayList()
    }
    messages.add(messageInfo)
    allConversations[key] = messages
}

fun removeMessagesFromMap(allConversations: AllConversationMap, messageIds: Set<Int>) {
    // We don't have the information to compute what key we ought to find each message under,
    // so just walk the whole thing.  If the user has >100 notifications, this linear scan
    // won't be their worst problem anyway...
    //
    // TODO redesign this whole data structure, for many reasons.
    val it = allConversations.values.iterator()
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

fun clearConversations(allConversations: AllConversationMap) {
    allConversations.clear()
}