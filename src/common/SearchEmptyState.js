/* @flow */
import React, { PureComponent } from 'react';
import { StyleSheet, View } from 'react-native';

import { ZulipButton, Label } from './';
import { nullFunction } from '../nullObjects';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 10,
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
  },
  button: {
    marginTop: 15,
  },
});

type Props = {
  text: string,
  buttonText: string,
  buttonAction: () => void,
};

export default class SearchEmptyState extends PureComponent<Props> {
  props: Props;

  static defaultProps = {
    text: 'No Results',
    buttonText: 'Show All',
    buttonAction: undefined,
  };

  render() {
    const { text, buttonText, buttonAction } = this.props;

    return (
      <View style={styles.container}>
        <Label style={styles.text} text={text} />
        {buttonAction && (
          <ZulipButton style={styles.button} secondary text={buttonText} onPress={buttonAction} />
        )}
      </View>
    );
  }
}
