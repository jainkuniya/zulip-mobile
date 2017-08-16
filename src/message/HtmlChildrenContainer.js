/* @flow */
import React, { PureComponent } from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';

import type { Message, Auth, Actions } from '../types';
import htmlToDomTree from '../html/htmlToDomTree';
import renderHtmlChildren from '../html/renderHtmlChildren';
import getMessageContent from './getMessageContent';

class HtmlChildrenContainer extends PureComponent {
  props: {
    message: Message,
    auth: Auth,
    actions: Actions,
    handleLinkPress: string => void,
  };

  render() {
    const { message, auth, actions, handleLinkPress, onLongPress } = this.props;
    const content = getMessageContent(message.match_content || message.content);
    const childrenNodes = htmlToDomTree(content);

    return (
      <TouchableWithoutFeedback onLongPress={onLongPress}>
        <View>
          {renderHtmlChildren({
            childrenNodes,
            auth,
            actions,
            message,
            onPress: handleLinkPress,
          })}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default HtmlChildrenContainer;
