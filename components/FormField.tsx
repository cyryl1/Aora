import React, { useState } from 'react';
import { View, Text, TextInput, Touchable, TouchableOpacity, Image } from 'react-native';
import { icons } from '../constants';


interface FormFieldProps {
  title: string,
  value: string,
  placeholder: string,
  handleChangeText: (text: string) => void,
  otherStyles: string,
  keyboardType: string,
}

const FormField: React.FC<FormFieldProps> = ({ title, value, placeholder, handleChangeText, otherStyles, ...props }) => {
  const [showPassword, setShowPassword] = useState(false)
  return (
    <View className={`space-y-2 ${otherStyles}`}>
        <Text className="font-pmedium text-base text-gray-100">{title}</Text>

        <View className='border-2 border-black-200 w-full h-16 px-4 bg-black-100 rounded-2xl focus:border-secondary items-center flex-row'>
          <TextInput 
            className='flex-1 text-white font-psemibold text-base'
            value={value}
            placeholder={placeholder}
            placeholderTextColor="#7b7b8b"
            onChangeText={handleChangeText}
            secureTextEntry={title === 'Password' && !showPassword}
          />

          {title === 'Password' && (
            <TouchableOpacity onPress={() => 
              setShowPassword(!showPassword)
            }>
              <Image 
                source={!showPassword ? icons.eye : icons.eyeHide} 
                className='w-6 h-6'
                resizeMode='contain'
              />
            </TouchableOpacity>
          )}
        </View>
    </View>
  );
}

export default FormField