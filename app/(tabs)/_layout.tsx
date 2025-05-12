import React from 'react'
import {Tabs} from "expo-router";
import {Ionicons} from "@expo/vector-icons";
import {COLORS} from "@/constants/theme";

const TabLayout = () => {
    return (
        <Tabs
            screenOptions = {{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.grey,
                tabBarStyle: {
                    backgroundColor: "black",
                    borderTopWidth: 0,
                    position: "absolute",
                    elevation: 0,
                    height: 40,
                    paddingBottom: 8

                }
            }}>
            <Tabs.Screen name = "index"
                options = {{tabBarIcon: ({color, size}) => <Ionicons name = "home" size = {28} color = {color} /> }}
            />
            <Tabs.Screen name = "create"
                options = {{tabBarIcon: ({color, size}) => <Ionicons name = "add-circle" size = {28} color = {color} /> }}
            />
            <Tabs.Screen name = "bookmarks"
                options = {{tabBarIcon: ({color, size}) => <Ionicons name = "bookmark" size = {28} color = {color} /> }}
            />
            <Tabs.Screen name = "notifications"
                options = {{tabBarIcon: ({color, size}) => <Ionicons name = "notifications" size = {28} color = {color} /> }}
            />
            <Tabs.Screen name = "profile"
                options = {{tabBarIcon: ({color, size}) => <Ionicons name = "person" size = {28} color = {color}  />}}
            />
        </Tabs>
    )
}
export default TabLayout
