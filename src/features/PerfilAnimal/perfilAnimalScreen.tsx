import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { Alert, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { escolherFoto } from "../../utils/escolherFoto";
import FotoAnimal from "../../components/FotoAnimal";
import NovoRegistoModal from "./NovoRegistoModal";
import { useAnimais } from "../../context/AnimaisContext";
import { RootStackParamList } from "../../navigation/types";
import { Cores, FontSize } from "../../theme/theme";
import { useTema } from "../../theme/TemaContext";

type NavigationProps = NativeStackScreenProps<RootStackParamList, "PerfilAnimal">;

type Separador = "vacinas" | "consultas" | "lembretes";

// calcula a idade a partir da data de nascimento
const calcularIdade = (nascimento?: string) => {
    if (!nascimento) return "—";
    const data = new Date(nascimento);
    const hoje = new Date();
    let meses =
        (hoje.getFullYear() - data.getFullYear()) * 12 +
        (hoje.getMonth() - data.getMonth());
    if (meses < 12) return `${meses} meses`;
    const anos = Math.floor(meses / 12);
    return anos === 1 ? "1 ano" : `${anos} anos`;
};

// passa "2025-05-20" para "20/05/2025"
const formatarData = (data: string) => data.split("-").reverse().join("/");

// dá true se a data já passou
const jaPassou = (data: string) => new Date(data) < new Date();


const PerfilAnimalScreen = ({ navigation, route }: NavigationProps) => {
    const { animais, atualizarAnimal, removerAnimal } = useAnimais();
    const { colors } = useTema();
    const styles = criarEstilos(colors);

    // vai buscar a versão mais recente deste animal ao Context
    const animal =
        animais.find((a) => a.id === route.params.animal.id) ?? route.params.animal;

    const trocarFoto = async () => {
        const nova = await escolherFoto();
        if (nova) atualizarAnimal(animal.id, { foto: nova });
    };    

    
    // 🗑️ pergunta antes de apagar
    const eliminarAnimal = () => {
        const apagar = () => {
            removerAnimal(animal.id);
            navigation.goBack();
        };
        const pergunta = `Tens a certeza que queres eliminar ${animal.nome}?`;

        if (Platform.OS === "web") {
            // no browser o Alert não funciona, por isso usamos o confirm
            if (window.confirm(pergunta)) apagar();
        } else {
            Alert.alert("Eliminar animal", pergunta, [
                { text: "Cancelar", style: "cancel" },
                { text: "Eliminar", style: "destructive", onPress: apagar },
            ]);
        }
    };


    const [separador, setSeparador] = useState<Separador>("vacinas");

    const [modalAberto, setModalAberto] = useState(false);

    // quantos registos tem o separador escolhido (para saber se está vazio)
    const quantos =
        separador === "vacinas" ? animal.vacinas?.length
            : separador === "consultas" ? animal.consultas?.length
                : animal.lembretes?.length;

    // apagar: fica com todos MENOS o que tem este id
    const eliminarVacina = (id: string) =>
        atualizarAnimal(animal.id, { vacinas: (animal.vacinas ?? []).filter((v) => v.id !== id) });

    const eliminarConsulta = (id: string) =>
        atualizarAnimal(animal.id, { consultas: (animal.consultas ?? []).filter((c) => c.id !== id) });

    const eliminarLembrete = (id: string) =>
        atualizarAnimal(animal.id, { lembretes: (animal.lembretes ?? []).filter((l) => l.id !== id) });

    // ✅ troca feito <-> por fazer
    const alternarLembrete = (id: string) =>
        atualizarAnimal(animal.id, {
            lembretes: (animal.lembretes ?? []).map((l) =>
                l.id === id ? { ...l, feito: !l.feito } : l
            ),
        });


    return (
        <View style={styles.container}>
            {/* Barra do topo */}
            <View style={styles.topo}>
                <TouchableOpacity style={styles.voltar} onPress={() => navigation.goBack()}>
                    <Text style={styles.voltarTexto}>‹</Text>
                </TouchableOpacity>

                <View style={styles.topoDireita}>
                    <TouchableOpacity
                        style={styles.voltar}
                        onPress={() => navigation.navigate("NovoAnimal", { animal })}
                    >
                        <Text style={styles.iconeTopo}>✏️</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.voltar} onPress={eliminarAnimal}>
                        <Text style={styles.iconeTopo}>🗑️</Text>
                    </TouchableOpacity>
                </View>
            </View>



            {/* Cabeçalho com o animal */}
            <View style={styles.cabecalho}>
                <TouchableOpacity onPress={trocarFoto}>
                    <FotoAnimal animal={animal} tamanho={110} cor={colors.accent} />
                    <View style={styles.botaoFoto}>
                        <Text style={styles.botaoFotoTexto}>✏️</Text>
                    </View>
                </TouchableOpacity>

                <Text style={styles.nome}>{animal.nome}</Text>
                <Text style={styles.raca}>{animal.raca ?? "Raça desconhecida"}</Text>
            </View>

            {/* Caixinhas de informação */}
            <View style={styles.infoLinha}>
                <View style={[styles.infoCaixa, { backgroundColor: colors.primary }]}>
                    <Text style={styles.infoValor}>{calcularIdade(animal.nascimento)}</Text>
                    <Text style={styles.infoLabel}>Idade</Text>
                </View>
                <View style={[styles.infoCaixa, { backgroundColor: colors.secondary }]}>
                    <Text style={styles.infoValor}>{animal.peso ? `${animal.peso} kg` : "—"}</Text>
                    <Text style={styles.infoLabel}>Peso</Text>
                </View>
            </View>

            {/* Separadores */}
            <View style={styles.separadores}>
                {(["vacinas", "consultas", "lembretes"] as Separador[]).map((s) => (
                    <TouchableOpacity
                        key={s}
                        style={[styles.separador, separador === s && styles.separadorAtivo]}
                        onPress={() => setSeparador(s)}
                    >
                        <Text style={[styles.separadorTexto, separador === s && styles.separadorTextoAtivo]}>
                            {s === "vacinas" ? "💉 Vacinas" : s === "consultas" ? "🩺 Consultas" : "⏰ Lembretes"}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Conteúdo do separador escolhido */}
            <ScrollView style={styles.conteudo} contentContainerStyle={{ gap: 10 }}>
                {!quantos && (
                    <Text style={styles.vazio}>Ainda não há {separador} registados.</Text>
                )}

                {/* 💉 VACINAS */}
                {separador === "vacinas" &&
                    (animal.vacinas ?? []).map((v) => {
                        const atrasada = v.proximaDose ? jaPassou(v.proximaDose) : false;
                        return (
                            <View key={v.id} style={[styles.registo, atrasada && styles.registoAtrasado]}>
                                <Text style={styles.registoIcone}>💉</Text>
                                <View style={styles.registoInfo}>
                                    <Text style={styles.registoTitulo}>{v.nome}</Text>
                                    <Text style={styles.registoDetalhe}>Levou a {formatarData(v.data)}</Text>
                                    {v.proximaDose && (
                                        <Text style={[styles.registoDetalhe, atrasada && styles.textoAtrasado]}>
                                            {atrasada ? "⚠️ Atrasada desde " : "Próxima dose: "}
                                            {formatarData(v.proximaDose)}
                                        </Text>
                                    )}
                                </View>
                                <TouchableOpacity onPress={() => eliminarVacina(v.id)}>
                                    <Text style={styles.lixo}>🗑️</Text>
                                </TouchableOpacity>
                            </View>
                        );
                    })}

                {/* 🩺 CONSULTAS */}
                {separador === "consultas" &&
                    (animal.consultas ?? []).map((c) => (
                        <View key={c.id} style={styles.registo}>
                            <Text style={styles.registoIcone}>🩺</Text>
                            <View style={styles.registoInfo}>
                                <Text style={styles.registoTitulo}>{c.motivo}</Text>
                                <Text style={styles.registoDetalhe}>
                                    {formatarData(c.data)}
                                    {c.veterinario ? ` · ${c.veterinario}` : ""}
                                </Text>
                            </View>
                            <TouchableOpacity onPress={() => eliminarConsulta(c.id)}>
                                <Text style={styles.lixo}>🗑️</Text>
                            </TouchableOpacity>
                        </View>
                    ))}

                {/* ⏰ LEMBRETES */}
                {separador === "lembretes" &&
                    (animal.lembretes ?? []).map((l) => (
                        <View key={l.id} style={styles.registo}>
                            <TouchableOpacity
                                style={[styles.visto, l.feito && styles.vistoFeito]}
                                onPress={() => alternarLembrete(l.id)}
                            >
                                {l.feito && <Text style={styles.vistoTexto}>✓</Text>}
                            </TouchableOpacity>
                            <Text style={[styles.registoTitulo, styles.registoInfo, l.feito && styles.riscado]}>
                                {l.texto}
                            </Text>
                            <TouchableOpacity onPress={() => eliminarLembrete(l.id)}>
                                <Text style={styles.lixo}>🗑️</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
            </ScrollView>
            
            {/* Botão para adicionar */}
            <TouchableOpacity style={styles.botaoAdicionar} onPress={() => setModalAberto(true)}>
                <Text style={styles.botaoAdicionarTexto}>
                    ➕ Adicionar {separador === "vacinas" ? "vacina" : separador === "consultas" ? "consulta" : "lembrete"}
                </Text>
            </TouchableOpacity>

            <NovoRegistoModal
                visivel={modalAberto}
                tipo={separador}
                animal={animal}
                onFechar={() => setModalAberto(false)}
            />

        </View>

    );
};

const criarEstilos = (colors: Cores) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: 20,
        paddingTop: 50,
    },
    voltar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.card,
        alignItems: "center",
        justifyContent: "center",
    },
    voltarTexto: {
        fontSize: 28,
        color: colors.text,
        marginTop: -4,
    },
    cabecalho: {
        alignItems: "center",
        marginTop: 10,
        marginBottom: 20,
    },
    circulo: {
        width: 110,
        height: 110,
        borderRadius: 55,
        backgroundColor: colors.accent,
        alignItems: "center",
        justifyContent: "center",
    },
    emoji: {
        fontSize: 56,
    },
    nome: {
        fontSize: FontSize.title,
        fontWeight: "bold",
        color: colors.text,
        marginTop: 12,
    },
    raca: {
        fontSize: FontSize.medium,
        color: colors.textLight,
    },
    infoLinha: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 20,
    },
    infoCaixa: {
        flex: 1,
        borderRadius: 20,
        padding: 16,
        alignItems: "center",
    },
    infoValor: {
        fontSize: FontSize.large,
        fontWeight: "bold",
        color: colors.text,
    },
    infoLabel: {
        fontSize: FontSize.small,
        color: colors.text,
        marginTop: 2,
    },
    separadores: {
        flexDirection: "row",
        backgroundColor: colors.card,
        borderRadius: 20,
        padding: 4,
    },
    separador: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 16,
        alignItems: "center",
    },
    separadorAtivo: {
        backgroundColor: colors.primary,
    },
    separadorTexto: {
        fontSize: FontSize.small,
        color: colors.textLight,
    },
    separadorTextoAtivo: {
        color: "#FFFFFF",
        fontWeight: "bold",
    },
    conteudo: {
        flex: 1,
        backgroundColor: colors.card,
        borderRadius: 20,
        marginTop: 12,
        padding: 12,
    },
    vazio: {
        color: colors.textLight,
        fontSize: FontSize.medium,
        textAlign: "center",
        marginTop: 30,
    },
    registo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        backgroundColor: colors.background,
        borderRadius: 16,
        padding: 12,
    },
    registoAtrasado: {
        backgroundColor: colors.dangerSoft,
    },
    registoIcone: {
        fontSize: 26,
    },
    registoInfo: {
        flex: 1,
    },
    registoTitulo: {
        fontSize: FontSize.medium,
        fontWeight: "bold",
        color: colors.text,
    },
    registoDetalhe: {
        fontSize: FontSize.small,
        color: colors.textLight,
        marginTop: 2,
    },
    textoAtrasado: {
        color: colors.danger,
        fontWeight: "bold",
    },
    lixo: {
        fontSize: 20,
    },
    visto: {
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: colors.primary,
        alignItems: "center",
        justifyContent: "center",
    },
    vistoFeito: {
        backgroundColor: colors.primary,
    },
    vistoTexto: {
        color: "#FFFFFF",
        fontWeight: "bold",
    },
    riscado: {
        textDecorationLine: "line-through",
        color: colors.textLight,
    },

    botaoFoto: {
        position: "absolute",
        right: 0,
        bottom: 0,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.primary,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 3,
        borderColor: colors.background,
    },
    botaoFotoTexto: {
        fontSize: 16,
    },
        botaoAdicionar: {
        backgroundColor: colors.primary,
        borderRadius: 16,
        padding: 16,
        alignItems: "center",
        marginTop: 12,
    },
    botaoAdicionarTexto: {
        color: "#FFFFFF",
        fontWeight: "bold",
        fontSize: FontSize.medium,
    },
        topo: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    topoDireita: {
        flexDirection: "row",
        gap: 8,
    },
    iconeTopo: {
        fontSize: 18,
    },


});

export default PerfilAnimalScreen;
