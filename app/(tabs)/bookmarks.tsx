import {View, Text, Animated} from 'react-native'
import React, {useState} from 'react'
import {useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import Loader from "@/app/components/loader";
import {styles} from "@/styles/feed.styles";
import {COLORS} from "@/constants/theme";
import ScrollView = Animated.ScrollView;
import {Image} from "expo-image";

const Bookmarks = () => {

    const bookmarkedPosts = useQuery(api.bookmarks.getBookmarkedPosts);
    if(bookmarkedPosts === undefined) return <Loader/>
    if(bookmarkedPosts.length === 0) return <NoBookmarksFound />

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Bookmarks</Text>
            </View>

            {/*{POSTS}*/}

            <ScrollView
                contentContainerStyle={{padding: 8,
                    flexDirection: "row",
                    flexWrap: "wrap",
                }}
            >
                {
                    bookmarkedPosts.map((post) => {
                        if(!post) return null;
                        return(
                            <View key={post._id} style={{width: "33.33%", padding: 1}}>
                                <Image
                                    source={post.imageUrl}
                                    style={{width: "100%", aspectRatio: 1}}
                                    contentFit="cover"
                                    transition={200}
                                    cachePolicy="memory-disk"
                                />
                            </View>
                        );

                    })
                }
            </ScrollView>
        </View>
    )
}
export default Bookmarks

function NoBookmarksFound() {
    return (
        <View style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: COLORS.background
        }}>
            <Text style={{color: COLORS.primary, fontSize: 22}}>No Bookmarked posts yet.</Text>
        </View>
    )
}
