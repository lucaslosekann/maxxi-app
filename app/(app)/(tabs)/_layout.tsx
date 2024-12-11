import { Platform, Text } from "react-native";
import { Redirect, Stack, Tabs } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { Image } from "react-native";

export function TabBarIcon(props: {
	name: React.ComponentProps<typeof FontAwesome>["name"];
	color: string;
}) {
	return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function AppLayout() {
	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarActiveBackgroundColor: "#093a3f",
				tabBarInactiveBackgroundColor: "#093a3f",
				tabBarActiveTintColor: "#29a7a6",
				tabBarInactiveTintColor: "#ddd",
				tabBarStyle: {
					height: Platform.OS === "ios" ? 80 : 55,
					backgroundColor: "#093a3f",
				},
				tabBarItemStyle: {
					paddingVertical: 2,
				},
				tabBarLabelStyle: {
					textTransform: "uppercase",
					fontFamily: "Montserrat_700Bold",
					margin: 0,
					padding: 0,
				},
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					tabBarIcon: (props) => (
						<TabBarIcon name="map-marker" color={props.color} />
					),
					tabBarLabel: "Mais próximos",
				}}
			/>
			<Tabs.Screen
				name="map"
				options={{
					tabBarIcon: (props) => {
						if (props.focused) {
							return (
								<Image
									source={require("../../../src/assets/images/mapa_azul_claro.png")}
									style={{
										width: 30,
										height: 30,
									}}
								/>
							);
						} else {
							return (
								<Image
									source={require("../../../src/assets/images/mapa_branco.png")}
									style={{
										width: 30,
										height: 30,
									}}
								/>
							);
						}
					},
					tabBarLabel: "Mapa",
				}}
			/>
		</Tabs>
	);
}
