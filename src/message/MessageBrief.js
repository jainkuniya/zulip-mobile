import React from 'react';
import { StyleSheet, TouchableWithoutFeedback, View, Text } from 'react-native';

import ReactionList from '../reactions/ReactionList';
import IconStarMessage from './IconStarMessage';
import styles from '../styles';

const moreStyles = StyleSheet.create({
  message: {
    paddingTop: 0,
    paddingRight: 8,
    paddingBottom: 8,
    overflow: 'hidden',
    flex: 1,
  },
  messageContentWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between'
  },
  messageTextBodyWrapper: {
    flex: 0.9
  },
  messageChildren: {
    paddingLeft: 48,
  }
});

export default class MessageBrief extends React.PureComponent {

  props: {
    message: {},
    selfEmail: string,
    reactions: [],
  };

  render() {
    const { message, children, selfEmail, onLongPress, starred, edited } = this.props;

    return (
      <View style={moreStyles.message}>
        <View style={moreStyles.messageContentWrapper}>
          <View style={moreStyles.messageTextBodyWrapper}>
            <TouchableWithoutFeedback onLongPress={onLongPress}>
              <View style={styles.row}>
                {edited &&
                <Text style={styles.editedTag}>
                  (EDITED)
                </Text>}
                <View style={!edited && moreStyles.messageChildren}>
                  {children}
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
          {starred && <IconStarMessage />}
        </View>
        <ReactionList
          messageId={message.id}
          reactions={message.reactions}
          selfEmail={selfEmail}
        />
      </View>
    );
  }
}
