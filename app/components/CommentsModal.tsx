import {View, Text, Modal, KeyboardAvoidingView, Platform, TouchableOpacity, FlatList, TextInput} from 'react-native'
import React, {useState} from 'react'
import {Id} from "@/convex/_generated/dataModel"
import {useMutation, useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import {styles} from "@/styles/feed.styles"
import {Ionicons} from "@expo/vector-icons";
import {COLORS} from "@/constants/theme";
import Loader from "@/app/components/loader";
import Comment from "@/app/components/comment";

type CommentsModal = {
    postId: Id<"posts">
    visible: boolean
    onClose: () => void
}

const CommentsModal = ({onClose, postId, visible, }:CommentsModal) => {
    const [newComment, setNewComment] =useState("");
    const comments = useQuery(api.comments.getComments, {postId});
    const addComment = useMutation(api.comments.addComment);

    const handleAddComment = async () => {
        if(!newComment.trim()) return;
        try{
            await addComment({
                content: newComment,
                postId
            })
            setNewComment("");
        } catch(err){
            console.log("Error adding comment: ", err);
        }
    }

    return (
        <Modal visible = {visible} animationType = "slide" transparent = {true} onRequestClose={onClose}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.modalContainer}
            >
                <View style={styles.modalHeader}>
                    <TouchableOpacity onPress={onClose}>
                        <Ionicons name="close-outline" size={28} color={COLORS.white} />
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>Comments</Text>
                    <View style={{width: 24}}></View>
                </View>

                {
                    comments === undefined ? (
                        <Loader />
                    ) : (
                        <FlatList
                            data={comments}
                            keyExtractor={(item) => item._id}
                            renderItem={({item}) => <Comment comment={item} />}
                            contentContainerStyle={styles.commentsList}
                        />
                    )
                }

                <View style={styles.commentInput}>
                    <TextInput
                        style={styles.input}
                        placeholder="Add a comment..."
                        placeholderTextColor={COLORS.grey}
                        multiline
                        value={newComment}
                        onChangeText={setNewComment}
                    />
                    <TouchableOpacity onPress={handleAddComment} disabled={!newComment.trim()}>
                        <Text
                            style={[styles.postButton, !newComment.trim() && styles.postButtonDisabled]}
                        >
                            Post
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    )
}
export default CommentsModal
