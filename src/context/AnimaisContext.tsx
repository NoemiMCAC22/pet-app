import AsyncStorage from "@react-native-async-storage/async-storage"; // 🆕
import { createContext, ReactNode, useContext, useEffect, useState } from "react"; // 🆕 useEffect
import { Animal } from "../features/Animais/types";
import { animaisExemplo } from "../features/Animais/data";

const CHAVE = "animais"; // 🆕 nome da "gaveta" onde guardamos

type AnimaisContextType = {
    animais: Animal[];
    adicionarAnimal: (novo: Omit<Animal, "id">) => void;
    atualizarAnimal: (id: string, alteracoes: Partial<Animal>) => void;
    removerAnimal: (id: string) => void;

};

const AnimaisContext = createContext<AnimaisContextType | null>(null);

export const AnimaisProvider = ({ children }: { children: ReactNode }) => {
    // a lista começa com os animais de exemplo
    const [animais, setAnimais] = useState<Animal[]>(animaisExemplo);
    const [carregado, setCarregado] = useState(false); // 🆕

    // 🆕 1) ao abrir a app: ler a lista guardada
    useEffect(() => {
        AsyncStorage.getItem(CHAVE).then((guardado) => {
            if (guardado) {
                setAnimais(JSON.parse(guardado));
            }
            setCarregado(true);
        });
    }, []);

    // 🆕 2) sempre que a lista muda: guardar
    useEffect(() => {
        if (carregado) {
            AsyncStorage.setItem(CHAVE, JSON.stringify(animais));
        }
    }, [animais, carregado]);

    // junta um animal novo ao fim da lista
    const adicionarAnimal = (novo: Omit<Animal, "id">) => {
        const animalComId: Animal = { ...novo, id: Date.now().toString() };
        setAnimais([...animais, animalComId]);
    };

    // altera só os campos que mudaram de um animal
    const atualizarAnimal = (id: string, alteracoes: Partial<Animal>) => {
        setAnimais(
            animais.map((a) => (a.id === id ? { ...a, ...alteracoes } : a))
        );
    };

    
    // apaga um animal: fica com todos MENOS o que tem este id
    const removerAnimal = (id: string) => {
        setAnimais(animais.filter((a) => a.id !== id));
    };


    return (
        <AnimaisContext.Provider value={{ animais, adicionarAnimal, atualizarAnimal, removerAnimal }}>
            {children}
        </AnimaisContext.Provider>
    );
};

// hook para usar os animais em qualquer ecrã
export const useAnimais = () => {
    const contexto = useContext(AnimaisContext);
    if (!contexto) {
        throw new Error("useAnimais tem de ser usado dentro do AnimaisProvider");
    }
    return contexto;
};
