import * as ImagePicker from "expo-image-picker";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";

// abre a galeria, encolhe a foto e devolve-a em texto (base64)
// se a pessoa cancelar, devolve undefined
export const escolherFoto = async () => {
    const resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
    });
    if (resultado.canceled) return undefined;

    // encolher para 400 píxeis de largura
    const contexto = ImageManipulator.manipulate(resultado.assets[0].uri);
    contexto.resize({ width: 400 });
    const imagem = await contexto.renderAsync();
    const pequena = await imagem.saveAsync({
        compress: 0.6,            // qualidade 60% (fica bem e é leve)
        format: SaveFormat.JPEG,
        base64: true,             // queremos a foto em texto
    });

    return `data:image/jpeg;base64,${pequena.base64}`;
};
