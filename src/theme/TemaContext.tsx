import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { colorsDark, colorsLight, Cores } from "./theme";

type Esquema = "light" | "dark";

type TemaContextType = {
    esquema: Esquema;
    colors: Cores;
    alternarTema: () => void;
};

const TemaContext = createContext<TemaContextType | null>(null);

export const TemaProvider = ({ children }: { children: ReactNode }) => {
    // modo do telemóvel (só usado se ainda não houver escolha guardada)
    const doSistema = useColorScheme() === "dark" ? "dark" : "light";
    const [esquema, setEsquema] = useState<Esquema>(doSistema);

    // ao abrir a app: ler o tema guardado
    useEffect(() => {
        AsyncStorage.getItem("tema").then((guardado) => {
            if (guardado === "dark" || guardado === "light") {
                setEsquema(guardado);
            }
        });
    }, []);

    // muda claro <-> escuro e guarda a escolha
    const alternarTema = () => {
        const novo = esquema === "dark" ? "light" : "dark";
        setEsquema(novo);
        AsyncStorage.setItem("tema", novo);
    };

    const colors = esquema === "dark" ? colorsDark : colorsLight;

    return (
        <TemaContext.Provider value={{ esquema, colors, alternarTema }}>
            {children}
        </TemaContext.Provider>
    );
};

// hook para usar o tema em qualquer ecrã
export const useTema = () => {
    const contexto = useContext(TemaContext);
    if (!contexto) {
        throw new Error("useTema tem de ser usado dentro do TemaProvider");
    }
    return contexto;
};
