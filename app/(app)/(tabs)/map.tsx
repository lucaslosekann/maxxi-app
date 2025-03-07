import { Image, StyleSheet, View } from "react-native";
import React from "react";
import MapView, {
	Marker,
	PROVIDER_DEFAULT,
	PROVIDER_GOOGLE,
} from "react-native-maps";
import { useQuery } from "@tanstack/react-query";
import { getLaundries } from "../../../src/services/api";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

const Map = () => {
	const LaundriesQuery = useQuery({
		queryKey: ["laundries"],
		queryFn: async () => {
			const response = await getLaundries();
			return response.data;
		},
	});

	return (
		<View style={styles.container}>
			<MapView
				style={{ flex: 1 }}
				provider={PROVIDER_DEFAULT}
				region={{
					latitude: -29.13585879806053,
					latitudeDelta: 0.15342876023022,
					longitude: -49.61036005988717,
					longitudeDelta: 0.08375566452741623,
				}}
			>
				{LaundriesQuery?.data?.map((laundry: any) => {
					return (
						<Marker
							key={laundry.id}
							coordinate={{
								latitude: laundry.endereco.latitude,
								longitude: laundry.endereco.longitude,
							}}
							title={laundry.name}
							onPress={() => {
								router.push({
									pathname: "/(app)/laundry",
									params: {
										id: laundry.id,
									},
								});
							}}
						>
							<Image
								source={require("../../../src/assets/images/map_icon.png")}
								style={{ width: 40, height: 40 }}
								resizeMode="contain"
							/>
						</Marker>
					);
				})}
			</MapView>
		</View>
	);
};

export default Map;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		fontFamily: "Roboto",
	},
	// map: {
	//     width: '100%',
	//     height: '100%',
	// },
});
