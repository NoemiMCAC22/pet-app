import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useAnimais } from "../../context/AnimaisContext";
import { RootStackParamList } from "../../navigation/types";
import { Cores, FontSize } from "../../theme/theme";
import { useTema } from "../../theme/TemaContext";
import { emojiEspecie } from "../Animais/data";
import { Especie } from "../Animais/types";
import { escolherFoto } from "../../utils/escolherFoto";
import FotoAnimal from "../../components/FotoAnimal";

type NavigationProps = NativeStackScreenProps<RootStackParamList, "NovoAnimal">;

type Erros = {
    nome?: string;
    nascimento?: string;
    peso?: string;
};

const especies: { valor: Especie; nome: string }[] = [
    { valor: "cao", nome: "Cão" },
    { valor: "gato", nome: "Gato" },
    { valor: "coelho", nome: "Coelho" },
    { valor: "passaro", nome: "Pássaro" },
    { valor: "outro", nome: "Outro" },
];

const NovoAnimalScreen = ({ navigation, route }: NavigationProps) => {
    const { adicionarAnimal, atualizarAnimal } = useAnimais();
    const { colors } = useTema();
    const styles = criarEstilos(colors);

    // se recebeu um animal, estamos a EDITAR; se não, a CRIAR
    const aEditar = route.params?.animal;

    // os campos começam preenchidos com os dados do animal (se houver)
    const [nome, setNome] = useState(aEditar?.nome ?? "");
    const [especie, setEspecie] = useState<Especie>(aEditar?.especie ?? "cao");
    const [raca, setRaca] = useState(aEditar?.raca ?? "");
    const [nascimento, setNascimento] = useState(aEditar?.nascimento ?? "");
    const [peso, setPeso] = useState(aEditar?.peso ? String(aEditar.peso) : "");
    const [foto, setFoto] = useState<string | undefined>(aEditar?.foto);
    const [erros, setErros] = useState<Erros>({});

    // quando tocas no círculo da foto
    const tocarNaFoto = async () => {
        const nova = await escolherFoto();
        if (nova) setFoto(nova);
    };

    const validar = () => {
        const novosErros: Erros = {};
        if (nome.trim().length < 2) {
            novosErros.nome = "O nome precisa de pelo menos 2 letras";
        }
        if (nascimento && !/^\d{4}-\d{2}-\d{2}$/.test(nascimento)) {
            novosErros.nascimento = "Usa o formato AAAA-MM-DD (ex: 2022-03-15)";
        }
        if (peso && isNaN(Number(peso.replace(",", ".")))) {
            novosErros.peso = "O peso tem de ser um número";
        }
        setErros(novosErros);
        return Object.keys(novosErros).length === 0;
    };

    const guardar = () => {
        if (!validar()) return;

        const dados = {
            nome: nome.trim(),
            especie,
            raca: raca.trim() || undefined,
            nascimento: nascimento || undefined,
            peso: peso ? Number(peso.replace(",", ".")) : undefined,
            foto,
        };

        if (aEditar) {
            atualizarAnimal(aEditar.id, dados); // ✏️ altera o que já existe
        } else {
            adicionarAnimal(dados);             // ➕ cria um novo
        }
        navigation.goBack();
    };


    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            {/* Barra do topo */}
            <View style={styles.topo}>
                <TouchableOpacity style={styles.voltar} onPress={() => navigation.goBack()}>
                    <Text style={styles.voltarTexto}>‹</Text>
                </TouchableOpacity>
                    <Text style={styles.titulo}>{aEditar ? "Editar animal" : "Novo animal"}</Text>
            </View>

            <ScrollView contentContainerStyle={styles.conteudo}>
                {/* Foto */}
                <View style={styles.fotoArea}>
                    <TouchableOpacity onPress={tocarNaFoto}>
                        <FotoAnimal animal={{ especie, foto }} tamanho={110} cor={colors.accent} />
                        <View style={styles.botaoFoto}>
                            <Text style={styles.botaoFotoTexto}>{foto ? "✏️" : "+"}</Text>
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.fotoDica}>Toca para escolher uma foto</Text>
                </View>

                {/* Espécie: escolhe-se a tocar */}
                <Text style={styles.label}>Espécie</Text>
                <View style={styles.especies}>
                    {especies.map((e) => (
                        <TouchableOpacity
                            key={e.valor}
                            style={[styles.especie, especie === e.valor && styles.especieAtiva]}
                            onPress={() => setEspecie(e.valor)}
                        >
                            <Text style={styles.especieEmoji}>{emojiEspecie[e.valor]}</Text>
                            <Text style={styles.especieNome}>{e.nome}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.label}>Nome *</Text>
                <TextInput
                    style={[styles.input, erros.nome && styles.inputErro]}
                    placeholder="Ex: Bolinha"
                    value={nome}
                    onChangeText={setNome}
                />
                {erros.nome && <Text style={styles.erro}>{erros.nome}</Text>}

                <Text style={styles.label}>Raça</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ex: Labrador"
                    value={raca}
                    onChangeText={setRaca}
                />

                <Text style={styles.label}>Data de nascimento</Text>
                <TextInput
                    style={[styles.input, erros.nascimento && styles.inputErro]}
                    placeholder="AAAA-MM-DD"
                    value={nascimento}
                    onChangeText={setNascimento}
                />
                {erros.nascimento && <Text style={styles.erro}>{erros.nascimento}</Text>}

                <Text style={styles.label}>Peso (kg)</Text>
                <TextInput
                    style={[styles.input, erros.peso && styles.inputErro]}
                    placeholder="Ex: 4.5"
                    keyboardType="decimal-pad"
                    value={peso}
                    onChangeText={setPeso}
                />
                {erros.peso && <Text style={styles.erro}>{erros.peso}</Text>}
            </ScrollView>

            {/* Barra de baixo */}
            <View style={styles.barraBaixo}>
                <TouchableOpacity style={styles.botaoCancelar} onPress={() => navigation.goBack()}>
                    <Text style={styles.botaoCancelarTexto}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.botaoGuardar} onPress={guardar}>
                    <Text style={styles.botaoGuardarTexto}>Guardar 🐾</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const criarEstilos = (colors: Cores) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: 50,
    },
    topo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingHorizontal: 20,
        marginBottom: 10,
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
    titulo: {
        fontSize: FontSize.title,
        fontWeight: "bold",
        color: colors.text,
    },
    conteudo: {
        padding: 20,
    },
    label: {
        fontSize: FontSize.medium,
        fontWeight: "bold",
        color: colors.text,
        marginTop: 16,
        marginBottom: 8,
    },
    especies: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
    },
    especie: {
        width: 80,
        paddingVertical: 12,
        borderRadius: 16,
        backgroundColor: colors.card,
        alignItems: "center",
        borderWidth: 2,
        borderColor: "transparent",
    },
    especieAtiva: {
        borderColor: colors.primary,
        backgroundColor: colors.primarySoft,
    },
    especieEmoji: {
        fontSize: 28,
    },
    especieNome: {
        fontSize: FontSize.small,
        color: colors.text,
        marginTop: 4,
    },
    input: {
        backgroundColor: colors.card,
        borderRadius: 14,
        padding: 14,
        fontSize: FontSize.medium,
        color: colors.text,
        borderWidth: 1,
        borderColor: colors.border,
    },
    inputErro: {
        borderColor: colors.danger,
    },
    erro: {
        color: colors.danger,
        fontSize: FontSize.small,
        marginTop: 4,
    },
    barraBaixo: {
        flexDirection: "row",
        gap: 12,
        padding: 20,
        backgroundColor: colors.card,
    },
    botaoCancelar: {
        flex: 1,
        padding: 16,
        borderRadius: 16,
        alignItems: "center",
        backgroundColor: colors.background,
    },
    botaoCancelarTexto: {
        color: colors.textLight,
        fontWeight: "bold",
        fontSize: FontSize.medium,
    },
    botaoGuardar: {
        flex: 2,
        padding: 16,
        borderRadius: 16,
        alignItems: "center",
        backgroundColor: colors.primary,
    },
    botaoGuardarTexto: {
        color: "#FFFFFF",
        fontWeight: "bold",
        fontSize: FontSize.medium,
    },
        fotoArea: {
        alignItems: "center",
        marginBottom: 4,
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
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "bold",
    },
    fotoDica: {
        fontSize: FontSize.small,
        color: colors.textLight,
        marginTop: 8,
    },

});

export default NovoAnimalScreen;
