import React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import LoginScreen from "./screens/LoginScreen"
import ProfileScreen from "./screens/ProfileScreen"
import FoodScreen from "./screens/FoodScreen"

export type RootStackParamList = {
Login: undefined
Profile: { group: string; rollNo: string; password: string;name: string}
Food: { rollNo: string };
}

const Stack = createNativeStackNavigator<RootStackParamList>()

export default function App() {
return (
<NavigationContainer>
<Stack.Navigator
initialRouteName="Login"
screenOptions={{
headerShown: false,
}}
>
<Stack.Screen name="Login" component={LoginScreen} />
<Stack.Screen name="Profile" component={ProfileScreen} />
<Stack.Screen name="Food" component={FoodScreen} />
</Stack.Navigator>
</NavigationContainer>
)
}