import { StyleSheet, Text, View } from "react-native";
import { useAnimais } from "../context/AnimaisContext";
import { Cores, FontSize } from "../theme/theme";
import { useTema } from "../theme/TemaContext";

const ResumoCuidados = () => {
    const { animais } = useAnimais();
    const { colors } = useTema();
    const styles = criarEstilos(colors);

    // junta os lembretes de TODOS os animais numa lista só
    const lembretes = animais.flatMap((a) => a.lembretes ?? []);
    const feitos = lembretes.filter((l) => l.feito).length;
    const total = lembretes.length;
    const percentagem = total > 0 ? feitos / total : 0;

    // conta as vacinas com a próxima dose já passada
    const atrasadas = animais
        .flatMap((a) => a.vacinas ?? [])
        .filter((v) => v.proximaDose && new Date(v.proximaDose) < new Date()).length;

    return (
        <View style={styles.cartao}>
            <Text style={styles.titulo}>📊 Cuidados de hoje</Text>

            {total === 0 ? (
                <Text style={styles.texto}>
                    Ainda não tens lembretes. Adiciona-os no perfil dos teus animais!
                </Text>
            ) : (
                <>
                    <Text style={styles.texto}>
                        {feitos} de {total} lembretes feitos {feitos === total ? "🎉" : ""}
                    </Text>
                    <View style={styles.barraFundo}>
                        <View style={[styles.barraCheia, { width: `${percentagem * 100}%` }]} />
                    </View>
                </>
            )}

            {atrasadas > 0 && (
                <View style={styles.aviso}>
                    <Text style={styles.avisoTexto}>
                        ⚠️ {atrasadas} {atrasadas === 1 ? "vacina atrasada" : "vacinas atrasadas"}
                    </Text>
                </View>
            )}
        </View>
    );
};

const criarEstilos = (colors: Cores) => StyleSheet.create({
    cartao: {
        backgroundColor: colors.card,
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
    },
    titulo: {
        fontSize: FontSize.medium,
        fontWeight: "bold",
        color: colors.text,
    },
    texto: {
        fontSize: FontSize.small,
        color: colors.textLight,
        marginTop: 6,
    },
    barraFundo: {
        height: 12,
        borderRadius: 6,
        backgroundColor: colors.background,
        marginTop: 10,
        overflow: "hidden",
    },
    barraCheia: {
        height: "100%",
        borderRadius: 6,
        backgroundColor: colors.primary,
    },
    aviso: {
        backgroundColor: colors.dangerSoft,
        borderRadius: 12,
        padding: 10,
        marginTop: 12,
    },
    avisoTexto: {
        color: colors.danger,
        fontWeight: "bold",
        fontSize: FontSize.small,
    },
});

export default ResumoCuidados;
