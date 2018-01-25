/* @flow */
import { emojiReactionAdd, emojiReactionRemove, queueMarkAsRead } from '../api';
import config from '../config';
import {
  constructActionButtons,
  constructHeaderActionButtons,
  executeActionSheetAction,
} from '../message/messageActionSheet';
import type {
  Actions,
  Auth,
  FlagsState,
  Message,
  MuteState,
  Narrow,
  SubscriptionState,
} from '../types';
import { isUrlAnImage } from '../utils/url';
import { filterUnreadMessagesInRange } from '../utils/unread';

type MessageListEventScroll = {
  innerHeight: number,
  offsetHeight: number,
  scrollY: number,
  startMessageId: number,
  endMessageId: number,
};

type MessageListEventAvatar = {
  fromEmail: string,
};

type MessageListEventNarrow = {
  narrow: string,
  fromEmail: string,
};

type MessageListEventImage = {
  src: string,
  messageId: number,
};

type MessageListEventReaction = {
  messageId: number,
  name: string,
  voted: boolean,
};

type MessageListEventUrl = {
  href: string,
  messageId: number,
};

type MessageListEventLongPress = {
  target: string,
  messageId: number,
};

type MessageListEventDebug = Object;

type Props = {
  actions: Actions,
  auth: Auth,
  currentRoute: string,
  flags: FlagsState,
  flags: Object,
  messages: Message[],
  mute: MuteState,
  narrow: Narrow,
  onReplySelect?: () => void,
  showActionSheetWithOptions: (Object, (number) => void) => void,
  subscriptions: SubscriptionState,
};

export const handleScroll = (props: Props, event: MessageListEventScroll) => {
  const { innerHeight, offsetHeight, scrollY, startMessageId, endMessageId } = event;
  const { actions } = props;

  if (scrollY < config.messageListThreshold) {
    actions.fetchOlder();
  } else if (innerHeight + scrollY >= offsetHeight - config.messageListThreshold) {
    actions.fetchNewer();
  }

  const unreadMessageIds = filterUnreadMessagesInRange(
    props.messages,
    props.flags,
    startMessageId,
    endMessageId,
  );

  if (unreadMessageIds.length > 0) {
    queueMarkAsRead(props.auth, unreadMessageIds);
  }
};

export const handleAvatar = (props: Props, event: MessageListEventAvatar) => {
  props.actions.navigateToAccountDetails(event.fromEmail);
};

export const handleNarrow = ({ actions }: Props, event: MessageListEventNarrow) => {
  actions.doNarrow(JSON.parse(event.narrow.replace(/'/g, '"')));
};

export const handleImage = (props: Props, event: MessageListEventImage) => {
  const { src, messageId } = event;

  const message = props.messages.find(x => x.id === messageId);

  if (message) {
    props.actions.navigateToLightbox(src, message);
  }
};

export const handleLongPress = (
  props: Props,
  event: MessageListEventLongPress,
  context: Object,
) => {
  const { messageId, target } = event;
  const message = props.messages.find(x => x.id === messageId);

  if (!message) return;

  const getString = value => context.intl.formatMessage({ id: value });
  const options =
    target === 'message'
      ? constructActionButtons({
          ...props,
          message,
          getString,
        })
      : constructHeaderActionButtons({ ...props, message, getString });

  const callback = buttonIndex => {
    executeActionSheetAction({
      ...props,
      message,
      title: options[buttonIndex],
      header: target === 'header',
      getString,
    });
  };
  props.showActionSheetWithOptions(
    {
      options,
      cancelButtonIndex: options.length - 1,
    },
    callback,
  );
};

export const handleUrl = (props: Props, event: MessageListEventUrl) => {
  const { actions } = props;

  if (isUrlAnImage(event.href)) {
    const imageEvent = { src: event.href, messageId: event.messageId };
    handleImage(props, imageEvent);
    return;
  }

  actions.messageLinkPress(event.href);
};

export const handleReaction = (props: Props, event: MessageListEventReaction) => {
  const { messageId, name, voted } = event;

  if (voted) {
    emojiReactionRemove(props.auth, messageId, name);
  } else {
    emojiReactionAdd(props.auth, messageId, name);
  }
};

export const handleDebug = (props: Props, event: MessageListEventDebug) => {
  console.debug(props, event); // eslint-disable-line
};
