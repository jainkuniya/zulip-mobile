/* @flow */
// import { Vibration } from 'react-native';

import type { GlobalState } from '../types';
import { isHomeNarrow, isMessageInNarrow } from '../utils/narrow';
import { getActiveAccount, getCurrentRouteParams, getOwnEmail, getIsActive } from '../selectors';
import { playMessageSound } from '../utils/sound';

export default (state: GlobalState, event: Object) => {
  switch (event.type) {
    case 'message': {
      const isActive = getIsActive(state);
      const isPrivateMessage = Array.isArray(event.message.display_recipient);
      if (!isActive || (!isPrivateMessage && !event.message.is_mentioned)) {
        break;
      }

      const activeAccount = getActiveAccount(state);
      const { narrow } = getCurrentRouteParams(state);
      const isUserInSameNarrow =
        !(narrow && isHomeNarrow(narrow)) &&
        activeAccount &&
        (narrow && isMessageInNarrow(event.message, narrow, activeAccount.email));
      const isSenderSelf = getOwnEmail(state) === event.message.sender_email;
      if (!isUserInSameNarrow && !isSenderSelf) {
        playMessageSound();
        // Vibration.vibrate();
      }

      break;
    }
    default:
  }
};
