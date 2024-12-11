import {
	Image,
	ImageBackground,
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	TextInput,
	View,
} from "react-native";
import { Text } from "../src/components/Text";
import React from "react";
import { useAuth } from "../src/contexts/AuthContext";
import { Input } from "../src/components/Input";
import { Button } from "../src/components/Button";
import { FontAwesome } from "@expo/vector-icons";
import { TouchableWithoutFeedback } from "react-native";
import { router } from "expo-router";

const CPFMask = (value: string) => {
	if (value.length > 14) return value.slice(0, 14);
	return value
		.replace(/\D/g, "") // Remove tudo o que não é dígito
		.replace(/(\d{3})(\d)/, "$1.$2") // Coloca um ponto entre o terceiro e o quarto dígitos
		.replace(/(\d{3})(\d)/, "$1.$2") // Coloca um ponto entre o terceiro e o quarto dígitos
		.replace(/(\d{3})(\d{1,2})$/, "$1-$2"); // Coloca um hífen entre o terceiro e o quarto dígitos
	//nao permite digitar mais de 14 caracteres
};

export default function Login() {
	const { signIn } = useAuth();

	const [cpf, setCpf] = React.useState("");
	return (
		<ImageBackground
			source={require("../src/assets/images/bg_img.png")}
			resizeMode="cover"
			style={{
				flex: 1,
			}}
		>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={styles.container}
			>
				<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
					<View style={styles.inner}>
						<View
							style={{
								alignItems: "center",
								gap: 15,
							}}
						>
							<Image
								source={require("../src/assets/images/img_login.png")}
								style={{
									width: 300,
									height: 100,
									marginBottom: 70,
									marginTop: -50,
								}}
							/>
							<Text
								className="font-ms700 text-4xl color-[#29a7a6]"
								style={{
									letterSpacing: 3,
								}}
							>
								BEM VINDO
							</Text>
							<Text className="font-ms500 w-[90%] text-center color-[#093a3f]">
								AO APLICATIVO DA{" "}
								<Text className="font-ms700">
									MAXXI LAVANDERIA!
								</Text>
								{`\n\n`}
								FAÇA <Text className="font-ms700">
									LOGIN
								</Text>{" "}
								COM SEU CPF E CONFIRA A MÁQUINA DISPONÍVEL MAIS
								PRÓXIMA DE VOCÊ!
							</Text>

							<View className="relative mb-10 mt-10">
								<Input
									placeholder="CPF"
									value={cpf}
									onChangeText={(m) => setCpf(CPFMask(m))}
									keyboardType="numeric"
									className="w-60 border-b-2 border-b-[#093a3f]"
								/>
								<FontAwesome
									name="user"
									size={25}
									style={{
										position: "absolute",
										top: Platform.OS === "ios" ? 7 : 10,
										right: 15,
										color: "#093a3f",
									}}
								/>
							</View>
							<Button
								label="LOGIN"
								onPress={async () => {
									await signIn(cpf);
									router.replace("/");
								}}
								className="bg-[#093a3f] rounded-3xl px-8 h-12"
								labelClasses="font-ms600 text-xl"
							/>
						</View>
					</View>
				</TouchableWithoutFeedback>
			</KeyboardAvoidingView>
		</ImageBackground>
	);
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	inner: {
		flex: 1,
		justifyContent: "center",
	},
	header: {
		fontSize: 36,
		marginBottom: 48,
	},
	textInput: {
		height: 40,
		borderColor: "#000000",
		borderBottomWidth: 1,
		marginBottom: 36,
	},
	btnContainer: {
		backgroundColor: "white",
		marginTop: 12,
	},
});
