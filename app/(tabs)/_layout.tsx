// import { Tabs, Redirect } from 'expo-router';
// import React from 'react';
// import { View, Text, Image } from 'react-native';

// import { icons } from '../../constants';

// type TabIconProps = {
//   icon: any; // Replace 'any' with the appropriate type if known, e.g., ImageSourcePropType
//   color: string;
//   name: string;
//   focused: boolean;
// };

// const TabIcon = ({ icon, color, name, focused }: TabIconProps) => {
//   return (
//     <View className="items-center justify-center gap-2">
//       <Image
//         source={icon}
//         resizeMode="contain"
//         tintColor={color}
//         // className="w-6 h-6"
//         style={{ width: 26, height: 26 }}
//       />
//       <Text className={`${focused ? 'font-psemibold' : 'font-pregular'} text-[.5rem]`} style={{ color }}>
//         {name}
//       </Text>
//     </View>
//   );
// };

// const TabsLayout = () => {
//   return (
//     <>
//       <Tabs
//         screenOptions={{
//           tabBarShowLabel: false,
//           tabBarActiveTintColor: '#FFA001',
//           tabBarInactiveTintColor: '#CDCDE0',
//           tabBarStyle: {
//             backgroundColor: '#161622',
//             borderTopWidth: 12,
//             borderTopColor: '#232533',
//             height: 84,
//           }
//         }}>
//         <Tabs.Screen
//           name="home"
//           options={{
//             title: 'Home',
//             headerShown: false,
//             tabBarIcon: ({ color, focused }) => (
//               <TabIcon icon={icons.home} color={color} name="Home" focused={focused} />
//             ),
//           }}
//         />
//         <Tabs.Screen
//           name="bookmark"
//           options={{
//             title: 'Bookmark',
//             headerShown: false,
//             tabBarIcon: ({ color, focused }) => (
//               <TabIcon icon={icons.bookmark} color={color} name="Bookmark" focused={focused} />
//             ),
//           }}
//         />
//         <Tabs.Screen
//           name="create"
//           options={{
//             title: 'Create',
//             headerShown: false,
//             tabBarIcon: ({ color, focused }) => (
//               <TabIcon icon={icons.plus} color={color} name="Create" focused={focused} />
//             ),
//           }}
//         />
//         <Tabs.Screen
//           name="profile"
//           options={{
//             title: 'Profile',
//             headerShown: false,
//             tabBarIcon: ({ color, focused }) => (
//               <TabIcon icon={icons.profile} color={color} name="Profile" focused={focused} />
//             ),
//           }}
//         />
//       </Tabs>
//     </>
//   );
// };

// export default TabsLayout;
import { Tabs } from 'expo-router';
import React from 'react';
import { View, Text, Image } from 'react-native';
import { icons } from '../../constants';

type TabIconProps = {
  icon: any;
  color: string;
  name: string;
  focused: boolean;
};

const TabIcon = ({ icon, color, name, focused }: TabIconProps) => {
  return (
    <View className="items-center justify-center gap-2">
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        style={{ width: 26, height: 26 }}
      />
      <Text
        className={`${focused ? 'font-psemibold' : 'font-pregular'} text-[0.5rem]`}
        style={{ color }}
      >
        {name}
      </Text>
    </View>
  );
};

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#FFA001',
        tabBarInactiveTintColor: '#CDCDE0',
        tabBarStyle: {
          backgroundColor: '#161622',
          borderTopWidth: 12,
          borderTopColor: '#232533',
          height: 84
        }
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={icons.home} color={color} name="Home" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="bookmark"
        options={{
          title: 'Bookmark',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={icons.bookmark} color={color} name="Bookmark" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Create',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={icons.plus} color={color} name="Create" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={icons.profile} color={color} name="Profile" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;