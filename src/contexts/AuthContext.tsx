import {
	useContext,
	createContext,
	type PropsWithChildren,
	useEffect,
} from "react";
import { useStorageState } from "../hooks/useStorageState";
import { generateApplicationAccess } from "../services/api";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import axios from "axios";
import Toast from "react-native-toast-message";
import { Platform } from "react-native";
import { OS } from "../lib/utils";

type AuthContextType = {
	signIn: (cpf: string) => Promise<void>;
	signOut: () => void;
	//user?: {
	//	cpf: string;
	//};
	isLoggedIn: boolean;
	isLoading: boolean;
	GenerateApplicationAccess: (cpf?: string) => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// This hook can be used to access the user info.
export function useAuth() {
	const value = useContext(AuthContext);
	if (process.env.NODE_ENV !== "production") {
		if (!value) {
			throw new Error("useAuth must be wrapped in a <AuthProvider />");
		}
	}

	return value;
}

export function AuthProvider({ children }: PropsWithChildren) {
	const [[isLoading, user], setUser] = useStorageState("user");
	const GenerateApplicationAccessMutation = useMutation({
		mutationKey: ["generateApplicationAccess"],
		mutationFn: generateApplicationAccess,
		onError(error) {
			if (axios.isAxiosError(error)) {
				if (error.response?.data?.error?.[0]?.message) {
					Toast.show({
						type: "error",
						text1: "Erro",
						text2: error.response?.data?.error?.[0]?.message,
					});
				}
			}
		},
	});

	useEffect(() => {
		if (OS === "ios") {
			GenerateApplicationAccessMutation.mutateAsync(undefined);
		}
	}, [OS]);

	return (
		<AuthContext.Provider
			value={{
				signIn: async (cpf: string) => {
					await GenerateApplicationAccessMutation.mutateAsync(cpf);
					setUser(
						JSON.stringify({
							cpf,
						})
					);
				},
				signOut: () => {
					setUser(null);
				},
				GenerateApplicationAccess: (cpf?: string) => {
					GenerateApplicationAccessMutation.mutate(cpf);
				},
				// user: undefined,
				//user: user ? JSON.parse(user) : undefined,
				isLoggedIn: user != null || OS === "ios",
				isLoading,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}
