import { useState } from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useAnimais } from "../../context/AnimaisContext";
import { Cores, FontSize } from "../../theme/theme";
import { useTema } from "../../theme/TemaContext";
import { Animal } from "../Animais/types";

type Props = {
    visivel: boolean;
    tipo: "vacinas" | "consultas" | "lembretes";
    animal: Animal;
    onFechar: () => void;
};

const titulos = {
    vacinas: "💉 Nova vacina",
    consultas: "🩺 Nova consulta",
    lembretes: "⏰ Novo lembrete",
};

const labelPrincipal = {
    vacinas: "Nome da vacina *",
    consultas: "Motivo *",
    lembretes: "O que tens de fazer? *",
};

const formatoData = /^\d{4}-\d{2}-\d{2}$/;

const NovoRegistoModal = ({ visivel, tipo, animal, onFechar }: Props) => {
    const { atualizarAnimal } = useAnimais();
    const { colors } = useTema();
    const styles = criarEstilos(colors);

    const [texto, setTexto] = useState(""); // nome da vacina / motivo / lembrete
    const [data, setData] = useState("");
    const [extra, setExtra] = useState(""); // próxima dose / veterinário
    const [erro, setErro] = useState("");

    const limparEFechar = () => {
        setTexto("");
        setData("");
        setExtra("");
        setErro("");
        onFechar();
    };

    const guardar = () => {
        // validação
        if (texto.trim().length < 2) {
            setErro("Escreve pelo menos 2 letras");
            return;
        }
        if (tipo !== "lembretes" && !formatoData.test(data)) {
            setErro("A data tem de ser AAAA-MM-DD (ex: 2026-11-10)");
            return;
        }
        if (tipo === "vacinas" && extra && !formatoData.test(extra)) {
            setErro("A próxima dose tem de ser AAAA-MM-DD");
            return;
        }

        const id = Date.now().toString();

        if (tipo === "vacinas") {
            atualizarAnimal(animal.id, {
                vacinas: [
                    ...(animal.vacinas ?? []),
                    { id, nome: texto.trim(), data, proximaDose: extra || undefined },
                ],
            });
        } else if (tipo === "consultas") {
            atualizarAnimal(animal.id, {
                consultas: [
                    ...(animal.consultas ?? []),
                    { id, motivo: texto.trim(), data, veterinario: extra.trim() || undefined },
                ],
            });
        } else {
            atualizarAnimal(animal.id, {
                lembretes: [
                    ...(animal.lembretes ?? []),
                    { id, texto: texto.trim(), feito: false },
                ],
            });
        }

        limparEFechar();
    };

    return (
        <Modal visible={visivel} transparent animationType="slide" onRequestClose={limparEFechar}>
            <KeyboardAvoidingView
                style={styles.fundo}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <View style={styles.caixa}>
                    <Text style={styles.titulo}>{titulos[tipo]}</Text>

                    <Text style={styles.label}>{labelPrincipal[tipo]}</Text>
                    <TextInput
                        style={styles.input}
                        value={texto}
                        onChangeText={setTexto}
                        placeholder={tipo === "vacinas" ? "Ex: Raiva" : tipo === "consultas" ? "Ex: Check-up" : "Ex: Dar banho"}
                    />

                    {/* data e extra só para vacinas e consultas */}
                    {tipo !== "lembretes" && (
                        <>
                            <Text style={styles.label}>Data *</Text>
                            <TextInput
                                style={styles.input}
                                value={data}
                                onChangeText={setData}
                                placeholder="AAAA-MM-DD"
                            />

                            <Text style={styles.label}>
                                {tipo === "vacinas" ? "Próxima dose" : "Veterinário"}
                            </Text>
                            <TextInput
                                style={styles.input}
                                value={extra}
                                onChangeText={setExtra}
                                placeholder={tipo === "vacinas" ? "AAAA-MM-DD" : "Ex: Dra. Sofia"}
                            />
                        </>
                    )}

                    {erro ? <Text style={styles.erro}>{erro}</Text> : null}

                    <View style={styles.botoes}>
                        <TouchableOpacity style={styles.botaoCancelar} onPress={limparEFechar}>
                            <Text style={styles.botaoCancelarTexto}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.botaoGuardar} onPress={guardar}>
                            <Text style={styles.botaoGuardarTexto}>Guardar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const criarEstilos = (colors: Cores) => StyleSheet.create({
    fundo: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0, 0, 0, 0.4)",
    },
    caixa: {
        backgroundColor: colors.card,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        padding: 24,
        paddingBottom: 36,
    },
    titulo: {
        fontSize: FontSize.large,
        fontWeight: "bold",
        color: colors.text,
        marginBottom: 8,
    },
    label: {
        fontSize: FontSize.medium,
        fontWeight: "bold",
        color: colors.text,
        marginTop: 12,
        marginBottom: 6,
    },
    input: {
        backgroundColor: colors.background,
        borderRadius: 14,
        padding: 14,
        fontSize: FontSize.medium,
        color: colors.text,
    },
    erro: {
        color: colors.danger,
        fontSize: FontSize.small,
        marginTop: 10,
    },
    botoes: {
        flexDirection: "row",
        gap: 12,
        marginTop: 20,
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
});

export default NovoRegistoModal;
