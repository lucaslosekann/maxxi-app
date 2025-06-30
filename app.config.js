module.exports = {
	expo: {
		name: "Maxxi Lavanderia Express",
		slug: "maxxi-lavanderia-express",
		version: "1.0.9",
		orientation: "portrait",
		icon: "./src/assets/images/icon.png",
		scheme: "myapp",
		userInterfaceStyle: "automatic",
		splash: {
			image: "./src/assets/images/splash.png",
			resizeMode: "contain",
			backgroundColor: "#ffffff",
		},
		ios: {
			supportsTablet: true,
			bundleIdentifier: "com.maxxilavanderia.app",
			config: {
				googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY_IOS,
				googleMaps: {
					apiKey: process.env.GOOGLE_MAPS_API_KEY_IOS,
				},
			},
		},
		android: {
			package: "com.maxxilavanderia.app",
			versionCode: 7,
			adaptiveIcon: {
				foregroundImage: "./src/assets/images/adaptive-icon.png",
				backgroundColor: "#ffffff",
			},
			permissions: [
				"android.permission.ACCESS_COARSE_LOCATION",
				"android.permission.ACCESS_FINE_LOCATION",
			],
			config: {
				googleMaps: {
					apiKey: process.env.GOOGLE_MAPS_API_KEY,
				},
			},
		},
		web: {
			bundler: "metro",
			output: "static",
			favicon: "./src/assets/images/favicon.png",
		},
		plugins: [
			"expo-router",
			"expo-secure-store",
			[
				"expo-location",
				{
					locationAlwaysAndWhenInUsePermission:
						"Usamos sua localização para mostrar lavanderias próximas e melhorar sua experiência.",
					locationWhenInUsePermission:
						"Precisamos acessar sua localização para mostrar lavanderias próximas.",
					locationAlwaysPermission:
						"Precisamos acessar sua localização para mostrar lavanderias próximas.",
				},
			],
			"expo-font",
		],
		experiments: {
			typedRoutes: true,
		},
		extra: {
			router: {
				origin: false,
			},
			eas: {
				projectId: "937c4877-79b6-4d3a-8d8e-09094dfae661",
			},
		},
		updates: {
			url: "https://u.expo.dev/937c4877-79b6-4d3a-8d8e-09094dfae661",
		},
		runtimeVersion: {
			policy: "appVersion",
		},
	},
};
