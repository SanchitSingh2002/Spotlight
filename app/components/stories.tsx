import {styles} from "@/styles/feed.styles";
import {STORIES} from "@/constants/mock-data";
import Story from "@/app/components/story";
import { ScrollView } from "react-native";

const StoriesSection = () => {
    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.storiesContainer}>
            {
                STORIES.map((story) => (
                    <Story key={story.id} story={story}/>
                ))
            }
        </ScrollView>
    );
}

export default StoriesSection;
