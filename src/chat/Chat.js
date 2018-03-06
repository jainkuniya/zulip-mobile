/* @flow */
import React, { PureComponent } from 'react';
import { View } from 'react-native';

import { KeyboardAvoider, OfflineNotice } from '../common';
import MessageListContainer from '../message/MessageListContainer';
import NoMessages from '../message/NoMessages';
import ComposeBoxContainer from '../compose/ComposeBoxContainer';
import UnreadNotice from './UnreadNotice';

export default class Chat extends PureComponent<{}> {
  messageInputRef = null;
  messageInputRef: any;

  static contextTypes = {
    styles: () => null,
  };

  scrollOffset: number = 0;
  listComponent: any;

  handleReplySelect = () => {
    if (this.messageInputRef) {
      try {
        this.messageInputRef.focus();
      } catch (e) {
        // do not crash if component is mounted
      }
    }
  };

  render() {
    const { styles } = this.context;
    const { narrow } = this.props;

    return (
      <KeyboardAvoider style={styles.flexed} behavior="padding">
        <View style={styles.flexed}>
          <OfflineNotice />
          <UnreadNotice narrow={narrow} />
          <NoMessages narrow={narrow} />
          <MessageListContainer
            narrow={narrow}
            onReplySelect={this.handleReplySelect}
            listRef={component => {
              this.listComponent = component || this.listComponent;
            }}
          />
          <ComposeBoxContainer
            narrow={narrow}
            messageInputRef={(component: any) => {
              this.messageInputRef = component || this.messageInputRef;
            }}
          />
        </View>
      </KeyboardAvoider>
    );
  }
}
