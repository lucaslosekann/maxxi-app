import { SafeAreaView } from 'react-native-safe-area-context'
import { StyleSheet, FlatList, TouchableOpacity, ImageBackground } from 'react-native'
import { Text } from '../../../src/components/Text'
import React, { useEffect, useState } from 'react'
import * as Location from 'expo-location';
import { useQuery } from '@tanstack/react-query';
import { getLaundries, getRoute } from '../../../src/services/api';
import { router } from 'expo-router';


export default function Closest() {
    const [location, setLocation] = useState<null | Location.LocationObject>(null);
    const [errorMsg, setErrorMsg] = useState<null | string>(null);
    const [laundriesData, setLaundriesData] = useState<null | any>(null);

    const LaundriesQuery = useQuery({
        queryKey: ['laundries'],
        queryFn: async () => {
            const response = await getLaundries()
            return response.data;
        },
    })

    useEffect(() => {
        (async () => {

            let { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }


            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        })();
    }, []);


    useEffect(() => {
        if (LaundriesQuery.data) {
            setLaundriesData(LaundriesQuery.data)
            if (location) {
                const laundries = LaundriesQuery.data
                async function calculateDistance(location: Location.LocationObject) {
                    await Promise.all(laundries.map(async (laundry: any) => {
                        const distance = await getRoute({
                            latitude1: location.coords.latitude.toString(),
                            longitude1: location.coords.longitude.toString(),
                            latitude2: laundry.endereco.latitude,
                            longitude2: laundry.endereco.longitude
                        }).then((response) => {
                            return response.data.routes[0].distance / 1000
                        })
                        setLaundriesData((prev: any) => prev.map((prevLaundry: any) => {
                            if (prevLaundry.id === laundry.id) {
                                return {
                                    ...prevLaundry,
                                    distance
                                }
                            }
                            return prevLaundry
                        }))
                    }))
                }
                calculateDistance(location)
            }
        }
    }, [LaundriesQuery.data])



    return (
        <ImageBackground source={require("../../../src/assets/images/bg_img.png")} resizeMode="cover" style={{
            flex: 1
        }}>
            <SafeAreaView style={styles.container}>
                <FlatList
                    data={laundriesData?.sort((a: any, b: any) => {

                        const distanceA = a.distance
                        const distanceB = b.distance
                        if (distanceA === undefined && distanceB === undefined) return 0
                        if (distanceA === undefined) return 1
                        if (distanceB === undefined) return -1

                        return distanceA - distanceB
                    })}
                    renderItem={({ item }) => {
                        const distance = item.distance

                        return (
                            <TouchableOpacity style={styles.item}
                                onPress={() => {
                                    router.push({
                                        pathname: '/(app)/laundry',
                                        params: {
                                            id: item.id
                                        }
                                    })
                                }}>
                                <Text style={styles.title} className='font-ms600 text-[#093a3f]'>{item.nome}</Text>
                                <Text className='font-ms400 text-sm mb-2 text-[#093a3f]'>{item.endereco.cidade.nome}</Text>
                                {
                                    distance ? <Text className='font-ms600 text-xs text-[#093a3f]'>Distância: {distance.toFixed(2)} km</Text> : null
                                }
                            </TouchableOpacity>
                        )
                    }}
                    keyExtractor={item => item.id}
                />
            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
    },
    paragraph: {
        fontSize: 18,
        textAlign: 'center',
    },
    item: {
        backgroundColor: '#dddddd',
        padding: 20,
        marginVertical: 8,
        borderRadius: 16,
        borderColor: "#093a3f",
        borderWidth: 1
    },
    title: {
        fontSize: 16,
        textTransform: "uppercase"
    },
});