import {View, Text, TouchableOpacity} from 'react-native'
import React, {useState} from 'react'
import {styles} from "@/styles/feed.styles"
import {Link} from "expo-router";
import {Image} from "expo-image";
import {Ionicons} from "@expo/vector-icons";
import {COLORS} from "@/constants/theme";
import {Id} from "@/convex/_generated/dataModel";
import {useMutation, useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import CommentsModal from "@/app/components/CommentsModal";
import {formatDistanceToNow} from "date-fns";
import {useUser} from "@clerk/clerk-expo";

type PostProps = {
    _id: Id<"posts">;
    imageUrl: string;
    caption?: string;
    likes: number;
    comments: number;
    _creationTime: number;
    isLiked: boolean;
    isBookmarked: boolean;
    author: {
        _id: string;
        username: string;
        image: string;
    }
}

const Post = ({post}: {post: PostProps}) => {
    const [isLiked, setIsLiked] = useState(post.isLiked);
    const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked);
    const [showComments, setShowComments] = useState(false);

    const {user} = useUser();
    const currentUser = useQuery(api.users.getUsersByClerkId, user ? {clerkId: user.id} : "skip")

    const toggleLike = useMutation(api.posts.toggleLike);
    const toggleBookmark = useMutation(api.bookmarks.toggleBookmark);
    const deletePost = useMutation(api.posts.deletePost);

    const handleLike = async () => {
        try{
            const isLiked = await toggleLike({postId: post._id});
            setIsLiked(isLiked);
        }
        catch(err){
            console.log("Error toggling like: ", err);
        }
    }

    const handleBookmark = async () => {
        try {
            const isBookmarked = await toggleBookmark({postId: post._id});
            setIsBookmarked(isBookmarked);
        } catch(err){
            console.log("Error toggling bookmark: ", err);
        }
    }

    const handleDelete = async () => {
        try {
            await deletePost({postId: post._id})
        } catch(err) {
            console.log("Error deleting post: ", err);
        }
    }

    return (
        <View style={ styles.post}>
            {/*{POST HEADER}*/}
            <View style={styles.postHeader}>
                <Link
                    href = {
                        currentUser?._id === post.author._id ? "/(tabs)/profile" : `/user/${post.author._id}`
                    }
                    asChild
                >
                    <TouchableOpacity style={styles.postHeaderLeft}>
                        <Image
                            source={post.author.image}
                            style={styles.postAvatar}
                            contentFit="cover"
                            transition={200}
                            cachePolicy="memory-disk"
                        />
                        <Text style={styles.postUsername}>{post.author.username}</Text>
                    </TouchableOpacity>
                </Link>

                {/*{If i'm the owner of the post show the delete button otherwise show the ellipsis button}*/}

                {
                    post.author._id === currentUser?._id ? (
                        <TouchableOpacity onPress={handleDelete}>
                            <Ionicons name="trash-outline" size={26} color={COLORS.primary} />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity>
                            <Ionicons name="ellipsis-horizontal" size={26} color={COLORS.primary} />
                        </TouchableOpacity>
                    )
                }

            </View>

            {/*{IMAGE}*/}
            <Image
                source={post.imageUrl}
                style={styles.postImage}
                contentFit="cover"
                transition={200}
                cachePolicy="memory-disk"
            />

            {/*{POST ACTIONS}*/}
            <View style={styles.postActions}>
                <View style={styles.postActionsLeft}>
                    <TouchableOpacity onPress={handleLike}>
                        <Ionicons name={isLiked ? "heart": "heart-outline"} size={26} color={COLORS.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setShowComments(true)}>
                        <Ionicons name="chatbubble-outline" size={26} color={COLORS.primary} />
                    </TouchableOpacity>
                </View>
                    <TouchableOpacity onPress={handleBookmark}>
                        <Ionicons name={isBookmarked ? "bookmark": "bookmark-outline"} size={26} color={COLORS.primary} />
                    </TouchableOpacity>
            </View>

            {/*{POST INFO}*/}
            <View style={styles.postInfo}>
                <Text style={styles.likesText}>
                    {post.likes > 0 ? `${post.likes.toLocaleString()} likes` : "Be the first to like"}
                </Text>
                {post.caption && (
                    <View style={styles.captionContainer}>
                        <Text style={styles.captionUsername}>{post.author.username}</Text>
                        <Text style = {styles.captionText}>{post.caption}</Text>
                    </View>
                )}

                {
                    post.comments > 0 && (
                        <TouchableOpacity onPress={() => setShowComments(true)}>
                            <Text style={styles.commentsText}>View all {post.comments} comments</Text>
                        </TouchableOpacity>
                    )
                }

                <Text style={styles.timeAgo}>
                    {formatDistanceToNow(post._creationTime, {addSuffix: true})}
                </Text>
            </View>
            <CommentsModal
                postId = {post._id}
                visible = {showComments}
                onClose = {() => setShowComments(false)}
            />

        </View>
    )
}
export default Post
