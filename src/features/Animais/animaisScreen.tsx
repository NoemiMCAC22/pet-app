import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Cores, FontSize } from "../../theme/theme";
import { useTema } from "../../theme/TemaContext";
import FotoAnimal from "../../components/FotoAnimal";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types";
import { useAnimais } from "../../context/AnimaisContext";
import ResumoCuidados from "../../components/ResumoCuidados";


type NavigationProps = NativeStackScreenProps<RootStackParamList, "Animais">;


const AnimaisScreen = ({ navigation }: NavigationProps) => {
    const { animais } = useAnimais();
    const { colors, esquema, alternarTema } = useTema();
    const styles = criarEstilos(colors);

    // as cores dos círculos (mudam com o tema)
    const coresCartao = [colors.primary, colors.secondary, colors.accent];



    return (
        <View style={styles.container}>
            <View style={styles.cabecalho}>
                <View>
                    <Text style={styles.titulo}>🐾 Os meus animais</Text>
                    <Text style={styles.subtitulo}>Cuida de quem te faz feliz</Text>
                </View>
                <TouchableOpacity style={styles.botaoTema} onPress={alternarTema}>
                    <Text style={styles.botaoTemaTexto}>{esquema === "dark" ? "☀️" : "🌙"}</Text>
                </TouchableOpacity>
            </View>


            <FlatList
                data={animais}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={<ResumoCuidados />}
                renderItem={({ item, index }) => (
                    <TouchableOpacity
                        style={styles.cartao}
                        onPress={() => navigation.navigate("PerfilAnimal", { animal: item })}
                    >

                        <FotoAnimal
                            animal={item}
                            tamanho={60}
                            cor={coresCartao[index % coresCartao.length]}
                        />


                        <View>
                            <Text style={styles.nome}>{item.nome}</Text>
                            <Text style={styles.detalhe}>
                                {item.raca ?? "Raça desconhecida"}
                                {item.peso ? ` · ${item.peso} kg` : ""}
                            </Text>
                        </View>
                    </TouchableOpacity>
                )}
            />

            <TouchableOpacity
                style={styles.botaoMais}
                onPress={() => navigation.navigate("NovoAnimal")}
            >
                <Text style={styles.botaoMaisTexto}>+</Text>
            </TouchableOpacity>

        </View>
    );
};

const criarEstilos = (colors: Cores) => StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: 20,
        paddingTop: 60,
    },
    titulo: {
        fontSize: FontSize.title,
        fontWeight: "bold",
        color: colors.text,
    },
    subtitulo: {
        fontSize: FontSize.medium,
        color: colors.textLight,
        marginTop: 4,
        marginBottom: 20,
    },
    cartao: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.card,
        borderRadius: 20,
        padding: 16,
        marginBottom: 12,
        gap: 16,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    circulo: {
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
    },
    emoji: {
        fontSize: 30,
    },
    nome: {
        fontSize: FontSize.large,
        fontWeight: "bold",
        color: colors.text,
    },
    detalhe: {
        fontSize: FontSize.small,
        color: colors.textLight,
        marginTop: 2,
    },
    botaoMais: {
        position: "absolute",
        right: 24,
        bottom: 32,
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: colors.primary,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: colors.primary,
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 6,
    },
    botaoMaisTexto: {
        fontSize: 36,
        color: "#FFFFFF",
        marginTop: -3,
    },
        cabecalho: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    botaoTema: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.card,
        alignItems: "center",
        justifyContent: "center",
    },
    botaoTemaTexto: {
        fontSize: 20,
    },


});

export default AnimaisScreen;
