import { Image, StyleSheet, Text, View } from "react-native";
import { Animal } from "../features/Animais/types";
import { emojiEspecie } from "../features/Animais/data";

type Props = {
    animal: Pick<Animal, "especie" | "foto">;
    tamanho: number;
    cor: string;
};

const FotoAnimal = ({ animal, tamanho, cor }: Props) => {
    const redondo = {
        width: tamanho,
        height: tamanho,
        borderRadius: tamanho / 2,
    };

    // se tiver foto, mostra a foto
    if (animal.foto) {
        return <Image source={{ uri: animal.foto }} style={redondo} />;
    }

    // se não tiver, mostra o emoji num círculo colorido
    return (
        <View style={[styles.circulo, redondo, { backgroundColor: cor }]}>
            <Text style={{ fontSize: tamanho / 2 }}>{emojiEspecie[animal.especie]}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    circulo: {
        alignItems: "center",
        justifyContent: "center",
    },
});

export default FotoAnimal;
