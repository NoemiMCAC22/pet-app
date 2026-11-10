import { Animal } from "../features/Animais/types";

export type RootStackParamList = {
    Animais: undefined;
    PerfilAnimal: { animal: Animal };
    NovoAnimal: { animal?: Animal } | undefined;

};
