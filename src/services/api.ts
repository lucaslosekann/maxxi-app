import axios from "axios";

export const instance = axios.create({
	baseURL: process.env.EXPO_PUBLIC_API_URL,
});

export async function getLaundries() {
	return instance.get("/vmstats/lavanderias");
}

export async function getLaundry(id: string) {
	return instance.get("/vmstats/lavanderias/" + id);
}

export async function getMachines(id: string) {
	return instance.get("/vmstats/machines/" + id);
}

export async function getRoute(coords: {
	latitude1: string;
	longitude1: string;
	latitude2: string;
	longitude2: string;
}) {
	return instance.get("/osrm/route", { params: coords });
}

export async function generateApplicationAccess(taxId?: string) {
	return instance.post("/application-access", { taxId });
}
