/* @flow */
import React, { PureComponent } from 'react';
import { Animated, Easing } from 'react-native';

import type { StyleObj } from '../types';

type Props = {
  children: [],
  visible: boolean,
  wrapperStyle?: StyleObj
};

export default class AnimatedScaleComponent extends PureComponent {
  props: Props;

  animatedValue = new Animated.Value(0);

  componentWillReceiveProps(nextProps: Props) {
    Animated.timing(this.animatedValue, {
      toValue: nextProps.visible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.elastic(),
    }).start();
  }

  render() {
    const { children, visible, wrapperStyle } = this.props;
    const animatedStyle = {
      transform: [{ scale: this.animatedValue }],
      opacity: this.animatedValue,
    };

    return (
      <Animated.View style={[animatedStyle, wrapperStyle]}>{visible && children}</Animated.View>
    );
  }
}
