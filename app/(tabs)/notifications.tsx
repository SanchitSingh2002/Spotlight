import {View, Text, FlatList} from 'react-native'
import React from 'react'
import {useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import Loader from '../components/loader';
import {styles} from "@/styles/notification.styles";
import {Ionicons} from "@expo/vector-icons";
import {COLORS} from "@/constants/theme";
import NotificationItem from "@/app/components/Notifications";

const Notifications = () => {
    const notifications = useQuery(api.notifications.getNotifications);

    if(notifications === undefined) return < Loader/>
    if(notifications.length === 0) return <NoNotificationsFound />

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Notifications</Text>
            </View>

            <FlatList
                data={notifications}
                renderItem={({item}) => <NotificationItem notification = {item} /> }
                keyExtractor={(item) => item._id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    )
}
export default Notifications

const NoNotificationsFound = () => {
    return (
        <View style={[styles.container, styles.centered]}>
            <Ionicons name="notifications-outline" size={64} color={COLORS.primary} />
            <Text style={{fontSize: 20, color: COLORS.white}}>No Notifications yet</Text>
        </View>
    )
}
