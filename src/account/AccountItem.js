import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { BRAND_COLOR } from '../common/styles';
import { Button, Touchable } from '../common';

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 8,
  },
  accountItem: {
    flexDirection: 'row',
    alignItems: 'stretch',
    padding: 8,
    height: 52,
  },
  details: {
    flex: 1,
    justifyContent: 'space-between',
    height: 36,
  },
  text: {
    color: BRAND_COLOR,
    fontWeight: 'bold',
  },
  removeButton: {
    width: 36,
    height: 36,
  },
});

export default class AccountItem extends React.PureComponent {

  props: {
    index: number,
    email: string,
    realm: string,
    onSelect: () => void,
    onRemove: () => void,
  };

  handleSelect = () =>
  this.props.onSelect(this.props.index);

  handleRemove = () =>
  this.props.onRemove(this.props.index);

  render() {
    const { email, realm, index } = this.props;

    return (
      <Touchable style={styles.wrapper} onPress={this.handleSelect}>
        <View style={[styles.accountItem, this.getDynamicStyles(index)]}>
          <View style={styles.details}>
            <Text style={[styles.text, this.getTextColor(index)]}>{email}</Text>
            <Text style={[styles.text, this.getTextColor(index)]}>{realm}</Text>
          </View>
          {this.getRemoveButton(index)}
        </View>
      </Touchable>
    );
  }
  getDynamicStyles = function getDynamicStyles(index) {
    let bColor;
    let bRadius;
    if (index === 0) {
      bColor = BRAND_COLOR;
      bRadius = 2;
    } else {
      bColor = 'rgba(36, 202, 194, 0.1)';
      bRadius = 5;
    }
    return {
      backgroundColor: bColor,
      borderRadius: bRadius
    };
  };
  getTextColor = function getTextColor(index) {
    let color;
    if (index === 0) {
      color = 'white';
    } else {
      color = BRAND_COLOR;
    }
    return {
      color,
    };
  };
  getRemoveButton = function getRemoveButton(index) {
    if (index === 0) {
      return (<Button
        primary
        text="X"
        customStyles={
        styles.removeButton
      }
        onPress={
        this.handleRemove
      }
      />);
    } else {
      return (<Button
        secondary
        text="X"
        customStyles={
        styles.removeButton
      }
        onPress={
        this.handleRemove
      }
      />);
    }
  };
}
