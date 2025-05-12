import {View, Text, TouchableOpacity, FlatList, ScrollView, Pressable} from 'react-native'
import React from 'react'
import {useMutation, useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import {useLocalSearchParams, useRouter} from "expo-router";
import {Id} from "@/convex/_generated/dataModel";
import Loader from "@/app/components/loader";
import {styles} from "@/styles/profile.styles";
import {Ionicons} from "@expo/vector-icons";
import {COLORS} from "@/constants/theme";
import {Image} from "expo-image";

const UserProfileScreen = () => {

    const {id} = useLocalSearchParams();// using hook
    const profile = useQuery(api.users.getUserProfile, {id: id as Id<"users">});
    const posts = useQuery(api.posts.getPostByUser, {userId: id as Id<"users">});
    const isFollowing = useQuery(api.users.isFollowing, {followingId: id as Id<"users">});
    const router = useRouter();

    const toggleFollow = useMutation(api.users.toggleFollow);
    const handleBack = () => {
        if(router.back) router.back();
        else router.replace("/(tabs)");
    }

    if(profile === undefined || posts === undefined || isFollowing === undefined) return <Loader/>

    return (
        <View style={styles.container}>
            {/*{HEADER}*/}
            <View style={styles.header}>
                <TouchableOpacity style={styles.header} onPress={handleBack}>
                    <Ionicons name="arrow-back" size={26} color={COLORS.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{profile.username}</Text>
                <View style={{width: 24}}></View>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.profileInfo}>
                    {/*AVATAR*/}
                    <View style={styles.avatarAndStats}>
                        <Image source={profile.image}
                               style={styles.avatar}
                               contentFit="cover"
                               transition={200}
                        />
                        {/*{STATS}*/}
                        <View style={styles.statsContainer}>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{profile.posts}</Text>
                                <Text style={styles.statLabel}>Posts</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{profile.followers}</Text>
                                <Text style={styles.statLabel}>Followers</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{profile.following}</Text>
                                <Text style={styles.statLabel}>Following</Text>
                            </View>
                        </View>
                    </View>
                    <Text style={styles.name}>{profile.fullname}</Text>
                    {
                        profile.bio && (
                            <Text style={styles.bio}>{profile.bio}</Text>
                        )
                    }
                    <Pressable
                        style={[styles.followButton,  isFollowing && styles.followingButton]}
                        onPress={() => toggleFollow({followingId: id as Id<"users">})}
                    >
                        <Text style={[styles.followButtonText, isFollowing && styles.followingButtonText]}>
                            {isFollowing ? "Following" : "Follow"}
                        </Text>
                    </Pressable>
                </View>
                {posts.length === 0 && <NoPostsFound/> }

                <FlatList
                    data={posts}
                    numColumns={3}
                    scrollEnabled={false}
                    renderItem={({item}) => (
                        <TouchableOpacity style={styles.gridItem}>
                            <Image
                                source={item.imageUrl}
                                style={styles.gridImage}
                                contentFit="cover"
                                transition={200}
                            />
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item._id}
                />
            </ScrollView>
        </View>

    )
}
    export default UserProfileScreen


function NoPostsFound() {
    return (
        <View style={{
            height: "100%",
            backgroundColor: COLORS.background,
            justifyContent: "center",
            alignItems: "center"
        }}>
            <Ionicons name="images-outline" size={64} color={COLORS.primary} />
            <Text style={{fontSize: 20, color: COLORS.white}}>No Posts yet</Text>
        </View>
    )
}
