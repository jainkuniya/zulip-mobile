import React, { Component } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { BORDER_COLOR } from '../styles';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderColor: BORDER_COLOR,
    borderWidth: 1,
    borderRadius: 2,
  },
});

export default class Popup extends Component {
  render() {
    const { height } = this.props;

    return (
      <ScrollView
        style={styles.container}
        height={height}
      >
        {this.props.children}
      </ScrollView>
    );
  }
}
