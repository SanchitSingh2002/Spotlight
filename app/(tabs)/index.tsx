import {Text, TouchableOpacity, View, FlatList, RefreshControl} from "react-native";
import {styles} from "@/styles/feed.styles";
import {useAuth} from "@clerk/clerk-expo";
import {Ionicons} from "@expo/vector-icons";
import {COLORS} from "@/constants/theme";
import {useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import Loader from "@/app/components/loader";
import Post from "@/app/components/post";
import StoriesSection from "@/app/components/stories";
import {useState} from "react";

export default function Index() {
    const {signOut} = useAuth();
    const [refreshing, setRefreshing] = useState(false);
    const posts = useQuery(api.posts.getFeedPosts);
    if (posts == undefined) return <Loader/>
    if (posts.length === 0) return <NoPostsFound/>

    const refresh = () => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }

    return (
        <View style={styles.container}>

            {/*HEADER SECTION*/}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Social</Text>
                <TouchableOpacity onPress={() => signOut()}>
                    <Ionicons name="log-out-outline" size={30} color={COLORS.primary}/>
                </TouchableOpacity>
            </View>

            <FlatList
                data={posts}
                renderItem={({item}) => <Post post={item}/>}
                keyExtractor={(item) => item._id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: 60}}
                ListHeaderComponent={<StoriesSection/>}
                refreshControl = {
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={refresh}
                        tintColor={COLORS.primary}
                    />
                }
            />
        </View>
    );
}

const NoPostsFound = () => (
    <View
        style={{
            flex: 1,
            backgroundColor: COLORS.background,
            justifyContent: "center",
            alignItems: "center"
        }}
    >
        <Text style={{fontSize: 20, color: COLORS.primary,}}>No Posts Yet</Text>
    </View>
);

