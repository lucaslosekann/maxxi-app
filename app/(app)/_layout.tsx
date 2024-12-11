import { Alert, TouchableOpacity } from "react-native";
import { Text } from "../../src/components/Text";
import { Redirect, router, Stack } from "expo-router";
import { useAuth } from "../../src/contexts/AuthContext";
import { Colors } from "../../src/constants/Colors";
import { useEffect } from "react";
import { useStorageState } from "../../src/hooks/useStorageState";
import { useQueryClient } from "@tanstack/react-query";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AppLayout() {
	const { user, isLoading, signOut } = useAuth();
	const [[_, last_seen], setLastSeen] = useStorageState("last_seen_laundry");

	const mutationClient = useQueryClient();

	useEffect(() => {
		if (isLoading) return;
		if (user == null) return;
		if (last_seen != null) {
			Alert.alert(
				"Voltar para última lavanderia vista",
				"Notamos que você já visualizou uma lavanderia antes, gostaria de ir direto para a página dela?",
				[
					{
						text: "Claro!",
						onPress: () => {
							router.push({
								pathname: "/(app)/laundry",
								params: {
									id: last_seen,
								},
							});
						},
					},
					{
						text: "Agora não",
						style: "cancel",
					},
				]
			);
		}
	}, [last_seen, isLoading, user]);

	useEffect(() => {
		if (!isLoading && !user) {
			setLastSeen(null);
		}
	}, [isLoading, user]);

	// You can keep the splash screen open, or render a loading screen like we do here.
	if (isLoading) {
		return <Text>Loading...</Text>;
	}

	// Only require authentication within the (app) group's layout as users
	// need to be able to access the (auth) group and sign in again.
	if (!user) {
		// On web, static rendering will stop here as the user is not authenticated
		// in the headless Node process that the pages are rendered in.
		return <Redirect href="/login" />;
	}

	// This layout can be deferred because it's not the root layout.
	return (
		<Stack
			screenOptions={{
				headerLeft: (props) => (
					<TouchableOpacity
						onPress={() => {
							router.back();
						}}
						disabled={!props.canGoBack}
					>
						<Text
							style={{
								color: "white",
								fontSize: 14,
								opacity: !props.canGoBack ? 0 : 1,
							}}
							className="font-ms700 tracking-tight transition-all"
						>
							VOLTAR
						</Text>
					</TouchableOpacity>
				),
				headerRight: (props) => (
					<TouchableOpacity
						onPress={() => {
							signOut();
						}}
					>
						<Text
							style={{
								color: "white",
								fontSize: 14,
							}}
							className="font-ms700 tracking-tight"
						>
							SAIR
						</Text>
					</TouchableOpacity>
				),
				headerStyle: {
					backgroundColor: "#093a3f",
				},
				headerTitle: "",
			}}
		>
			<Stack.Screen name="(tabs)" />
			<Stack.Screen name="laundry" />
		</Stack>
	);
}
