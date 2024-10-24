import { View, ScrollView, ImageBackground, Image, TouchableOpacity } from 'react-native'
import { Text } from '../../src/components/Text'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getLaundry, getMachines } from '../../src/services/api'
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import moment from 'moment-timezone';
import MapView, { Marker } from 'react-native-maps';
import { FontAwesome, Feather } from '@expo/vector-icons';
import { useStorageState } from '../../src/hooks/useStorageState';
import { openURL } from 'expo-linking'
const HORIZONTAL_PADDING = 35;
const PHONE_NUMBER = "(48) 99863-9487"
export default function Laundry() {
    const params = useLocalSearchParams();
    const id = typeof params.id === 'string' ? params.id : params.id[0];

    const navigation = useNavigation()
    const [_, setLastSeen] = useStorageState('last_seen_laundry');


    const OpenedLaundryQuery = useQuery({
        queryKey: ['laundry', id],
        queryFn: async () => {
            const response = await getLaundry(id)
            return response.data;
        },
        enabled: !!id
    })

    const openedLaundry = OpenedLaundryQuery.data;


    const MachinesQuery = useQuery({
        queryKey: ['machines', id],
        queryFn: async () => {
            const response = await getMachines(openedLaundry?.id)
            return response.data;
        },
        refetchInterval: 60 * 1000,
        enabled: !!id
    })


    useEffect(() => {
        if (openedLaundry) {
            setLastSeen(openedLaundry.id.toString())
        }
    }, [])

    if (!openedLaundry) {
        return <Text>Carregando...</Text>
    }

    return (
        <View style={{
            flex: 1,
        }}>
            <ScrollView contentContainerClassName='flex items-center' contentContainerStyle={{
                minHeight: '100%'
            }}>
                <ImageBackground source={require("../../src/assets/images/bg_img.png")} resizeMode="cover" style={{
                    flex: 1,
                    width: "100%",
                }}>
                    <View className='pt-10 mb-10' style={{
                        width: "100%",
                        paddingHorizontal: HORIZONTAL_PADDING,
                    }}>
                        <Text style={{
                            width: '100%',
                            textAlign: 'left',
                            fontSize: 16,
                            paddingTop: 10,
                            marginBottom: -5
                        }} className='font-ms700 uppercase tracking-tight text-center w-full text-[#093a3f]'>{openedLaundry.nome}</Text>
                        <View>

                            <Text style={{
                                width: '100%',
                                textAlign: 'left',
                                verticalAlign: 'middle',
                                fontSize: 16,
                                paddingTop: 10
                            }} className='font-ms500 tracking-tight text-[#093a3f]'>
                                <FontAwesome size={20} name="map-marker" color={"#093a3f"} /> {openedLaundry.endereco.cidade.nome}</Text>
                        </View>
                    </View>

                    <View style={{
                        borderColor: '#093a3f',
                        borderWidth: 1,
                        borderLeftWidth: 0,
                        borderRightWidth: 0,
                        backgroundColor: '#ddd',
                        width: "100%",
                        alignItems: 'flex-start',
                        paddingHorizontal: HORIZONTAL_PADDING,
                        paddingVertical: 10
                    }}>
                        <Text style={{
                            textAlign: 'left',
                            verticalAlign: 'middle',
                            fontSize: 16,
                            paddingTop: 10
                        }} className='font-ms700 text-[#093a3f] uppercase'>
                            <Image source={require("../../src/assets/images/maquina_azul.png")} style={{
                                width: 20,
                                height: 20,
                            }} /> Máquinas</Text>
                        {MachinesQuery?.isLoading && <Text className='font-ms500'>Carregando...</Text>}
                        {MachinesQuery?.isError && <Text className='font-ms500'>Erro ao carregar máquinas</Text>}
                        {MachinesQuery?.data && <View style={{
                            flex: 1,
                            flexWrap: 'wrap',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            position: 'relative',
                            paddingBottom: 20
                        }}>
                            {MachinesQuery?.data?.machines?.map((machine: any) => {
                                return <View key={machine.id} style={{
                                    width: '47%',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    paddingHorizontal: 5,
                                    paddingVertical: 15,
                                    marginVertical: 10,
                                    borderWidth: 3,
                                    borderColor: machine.estadoMaquinaAtual.situacao === 'Operacional' ? '#008000' : '#bc1823',
                                    backgroundColor: machine.estadoMaquinaAtual.situacao === 'Operacional' ? '#e3eee3' : '#f7ecec',
                                    borderRadius: 18
                                }}>
                                    <Text className='font-ms600 tracking-wide'>{machine.nome.replace("SEC", "SECADORA ").replace("LAV", "LAVADORA ")}</Text>
                                    <Text className='font-ms500 text-sm mb-6'>{machine.estadoMaquinaAtual.situacao === 'Operacional' ? "Disponível" : "Ocupada"}</Text>
                                    <Text style={{
                                        textAlign: 'center',
                                        fontSize: 10
                                    }} className='font-ms700'>Previsão de término:</Text>
                                    <Text style={{
                                        textAlign: 'center',
                                        fontSize: 10
                                    }} className='font-ms700 mb-6'>{
                                            machine.estadoMaquinaAtual.situacao === 'Ocupado' ?
                                                moment.tz(machine.estadoMaquinaAtual.periodo.dataInicio, "UTC").tz('America/Sao_Paulo').add(machine.servico.tempoEstimadoMinutos, 'minutes').format('HH:mm')
                                                : "-"
                                        }</Text>
                                </View>
                            })}
                            <Text style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                            }} className='font-ms400 text-sm'>Última atualização: {new Date(MachinesQuery.data.lastUpdate).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}</Text>
                        </View>}

                    </View>
                    <View style={{
                        width: "100%",
                        alignItems: 'flex-start',
                        paddingHorizontal: HORIZONTAL_PADDING,
                        paddingVertical: 10
                    }}>
                        <Text style={{
                            textAlign: 'left',
                            verticalAlign: 'middle',
                            fontSize: 16,
                            paddingTop: 10
                        }} className='font-ms700 text-[#093a3f] uppercase'>
                            <Image source={require("../../src/assets/images/mapa_azul_escuro.png")} style={{
                                width: 25,
                                height: 25,
                            }} /> Como Chegar</Text>
                        <Text className='text-sm font-ms400'>
                            {openedLaundry?.endereco.logradouro} {openedLaundry?.endereco.numero}, {openedLaundry?.endereco.complemento}, {openedLaundry?.endereco.bairro} - {openedLaundry?.endereco.nomeCidade}
                        </Text>


                    </View>

                    <MapView
                        region={{
                            latitude: openedLaundry?.endereco.latitude,
                            longitude: openedLaundry?.endereco.longitude,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                        }}

                        style={{
                            width: '100%',
                            aspectRatio: 1.2,
                            marginVertical: 10,
                            backgroundColor: '#ddd',
                            alignSelf: "stretch"
                        }}
                    >
                        <Marker
                            coordinate={{
                                latitude: openedLaundry?.endereco.latitude,
                                longitude: openedLaundry?.endereco.longitude
                            }}
                            title={openedLaundry?.nome}
                        >
                        </Marker>
                    </MapView>

                    <View style={{
                        width: "100%",
                        alignItems: 'flex-start',
                        paddingHorizontal: HORIZONTAL_PADDING,
                        paddingVertical: 10,
                        justifyContent: "center"
                    }}>
                        <Text style={{
                            textAlign: 'left',
                            verticalAlign: 'middle',
                            fontSize: 15,
                            paddingTop: 10
                        }} className='font-ms700 text-[#093a3f] uppercase'>

                            <Feather name='clock' size={20} color={'#093a3f'} /> Horário de Funcionamento</Text>
                        <Text className='text-sm font-ms400'>
                            Todos os dias, das {moment.tz(openedLaundry?.periodoFuncionamento.dataInicio, "UTC").tz("America/Sao_Paulo").format("HH:mm")} às {moment.tz(openedLaundry?.periodoFuncionamento.dataTermino, "UTC").tz("America/Sao_Paulo").format("HH:mm")}
                        </Text>
                    </View>

                    <View style={{
                        width: "100%",
                        alignItems: 'flex-start',
                        paddingHorizontal: HORIZONTAL_PADDING,
                        paddingVertical: 10
                    }}>
                        <View style={{
                            flexDirection: "row",
                            gap: 5,
                            alignItems: "center"
                        }}>

                            <Image source={require("../../src/assets/images/social.png")} style={{
                                width: 35,
                                height: 35,
                            }} />
                            <Text style={{
                                textAlign: 'left',
                                verticalAlign: 'middle',
                                fontSize: 16,
                                paddingVertical: 10
                            }} className='font-ms700 text-[#093a3f] uppercase'>Nossas Redes Sociais</Text>
                        </View>
                    </View>
                    <View style={{
                        flex: 1,
                        width: '100%',
                        flexDirection: 'row',
                        paddingBottom: 15,
                        paddingHorizontal: HORIZONTAL_PADDING - 10,
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                    }}>
                        <TouchableOpacity style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '33%'
                        }} onPress={() => {
                            openURL(`http://api.whatsapp.com/send?phone=${PHONE_NUMBER}`)
                        }}>
                            <FontAwesome name='whatsapp' size={40} color={'#093a3f'} />
                            <Text className='font-ms400 text-xs text-center'>{PHONE_NUMBER}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '33%'
                        }} onPress={() => {
                            openURL(`http://instagram.com/_u/maxxilavanderia`)
                        }}>
                            <FontAwesome name='instagram' size={40} color={'#093a3f'} />
                            <Text className='font-ms400 text-xs text-center'>@maxxilavanderia</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '33%'
                        }} onPress={() => {
                            openURL(`https://www.facebook.com/profile.php?id=61559332543120`)
                        }}>
                            <FontAwesome name='facebook' size={40} color={'#093a3f'} />
                            <Text className='font-ms400 text-xs text-center'>Maxxi Lavanderia Express</Text>
                        </TouchableOpacity>

                    </View>

                </ImageBackground>



                {/* 
                
                

                <View style={{
                    width: '100%',
                    flex: 1,
                    marginVertical: 10
                }}>
                    <Text style={{
                        width: '100%',
                        textAlign: 'left',
                        fontSize: 20,
                        fontWeight: 'bold',
                    }}>Como chegar</Text>
                    <Text>Estamos localizados no endereço: {`\n`}{openedLaundry?.endereco.logradouro} {openedLaundry?.endereco.numero}, {openedLaundry?.endereco.complemento}, {openedLaundry?.endereco.bairro} - {openedLaundry?.endereco.nomeCidade} - {openedLaundry?.endereco.estado}</Text>
                    <MapView
                        region={{
                            latitude: openedLaundry?.endereco.latitude,
                            longitude: openedLaundry?.endereco.longitude,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                        }}

                        style={{
                            width: '100%',
                            height: 200,
                            marginVertical: 10
                        }}
                    >
                        <Marker
                            coordinate={{
                                latitude: openedLaundry?.endereco.latitude,
                                longitude: openedLaundry?.endereco.longitude
                            }}
                            title={openedLaundry?.nome}
                        >
                        </Marker>
                    </MapView>
                </View>


                <View style={{
                    width: '100%',
                    flex: 1,
                    marginVertical: 10
                }}>
                    <Text style={{
                        width: '100%',
                        textAlign: 'left',
                        fontSize: 20,
                        fontWeight: 'bold'
                    }}>Horário de funcionamento</Text>
                    <Text>Funcionamos todos os dias das {moment.tz(openedLaundry?.periodoFuncionamento.dataInicio, "UTC").tz("America/Sao_Paulo").format("HH:mm")} até as {moment.tz(openedLaundry?.periodoFuncionamento.dataTermino, "UTC").tz("America/Sao_Paulo").format("HH:mm")}</Text>
                </View>


                <View style={{
                    width: '100%',
                    flex: 1,
                    marginVertical: 10
                }}>
                    <Text style={{
                        width: '100%',
                        textAlign: 'left',
                        fontSize: 20,
                        fontWeight: 'bold'
                    }}>Converse conosco</Text>
                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        gap: 20,
                        paddingVertical: 5
                    }}>
                        <FontAwesome name='instagram' size={50} />
                        <FontAwesome name='whatsapp' size={50} />
                    </View>
                </View> */}

            </ScrollView>

        </View >
    )
}