/* @flow strict-local */
import type { Auth } from './transportTypes';
import messagesFlags from './messages/messagesFlags';

let unsentMessageIds = [];
let lastSentTime = 0;

const processQueue = (auth: Auth) => {
  if (Date.now() - lastSentTime > 2000) {
    messagesFlags(auth, unsentMessageIds, 'add', 'read');
    unsentMessageIds = [];
    lastSentTime = Date.now();
  }
};

export default (auth: Auth, messageIds: number[]): void => {
  unsentMessageIds.push(...messageIds);
  processQueue(auth);
};
