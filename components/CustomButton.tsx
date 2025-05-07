import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

interface CustomButtonProps {
  title: string;
  handlePress: () => void;
  containerStyles?: string;
  textStyles?: string;
  isLoading?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`min-h-[62px] items-center justify-center rounded-xl bg-secondary ${containerStyles} ${isLoading ? 'opacity-50' : ''}`}
      disabled={isLoading}>
      <Text className={`font-psemibold text-lg text-primary ${textStyles}`}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
