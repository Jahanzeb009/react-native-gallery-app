import React from 'react';
import { TouchableOpacity } from 'react-native';

type touchableIconProps = {
  onPress: () => void;
  icon: any;
};

export const TouchableIcon = ({ onPress, icon: Icon }: touchableIconProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      hitSlop={{
        top: 10,
        left: 10,
        right: 10,
        bottom: 10,
      }}
      onPress={onPress}>
      {Icon}
    </TouchableOpacity>
  );
};
