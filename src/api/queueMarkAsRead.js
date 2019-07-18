/* @flow strict-local */
import type { Auth } from './transportTypes';
import messagesFlags from './messages/messagesFlags';

const TIME_INTERVAL_BETWEEN_CONSECUTIVE_CALLS_MS = 2000;
let unsentMessageIds = [];
let lastSentTime = 0;
let timeout = null;

const updateMessageFlags = (auth: Auth) => {
  messagesFlags(auth, unsentMessageIds, 'add', 'read');
  unsentMessageIds = [];
  lastSentTime = Date.now();
};

export default (auth: Auth, messageIds: number[]): void => {
  unsentMessageIds.push(...messageIds);

  if (Date.now() - lastSentTime > TIME_INTERVAL_BETWEEN_CONSECUTIVE_CALLS_MS) {
    updateMessageFlags(auth);
  } else if (timeout === null) {
    timeout = setTimeout(() => {
      updateMessageFlags(auth);
      timeout = null;
    }, TIME_INTERVAL_BETWEEN_CONSECUTIVE_CALLS_MS);
  }
};
