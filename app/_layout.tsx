import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import InitialLayout from "@/app/components/initialLayout";
import { SplashScreen } from "expo-router";
import { useFonts } from "expo-font";
import { useCallback, useEffect } from "react";
import * as NavigationBar from "expo-navigation-bar";
import { Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { ClerkProvider, useAuth, useUser } from "@clerk/clerk-expo";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { convex, EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY } from "@/constants/secrets";

SplashScreen.preventAutoHideAsync();

function ProvidersWrapper({ children }: { children: React.ReactNode }) {
    return (
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
            {children}
        </ConvexProviderWithClerk>
    );
}

export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        "JetBrainsMono-Medium": require("@/assets/fonts/JetBrainsMono-Medium.ttf"),
    });

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    useEffect(() => {
        if (Platform.OS === "android") {
            NavigationBar.setBackgroundColorAsync("#000000");
            NavigationBar.setButtonStyleAsync("light");
        }
    }, []);

    if (!fontsLoaded) return null;

    return (
        <ClerkProvider publishableKey={EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}>
            <ProvidersWrapper>
                <SafeAreaProvider>
                    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }} onLayout={onLayoutRootView}>
                        <InitialLayout />
                    </SafeAreaView>
                </SafeAreaProvider>
                <StatusBar style="light" />
            </ProvidersWrapper>
        </ClerkProvider>
    );
}
