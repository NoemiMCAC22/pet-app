export type Especie = "cao" | "gato" | "coelho" | "passaro" | "outro";

export type Vacina = {
    id: string;
    nome: string;          // ex: "Raiva"
    data: string;          // quando levou, ex: "2025-03-10"
    proximaDose?: string;  // quando tem de levar outra vez
};

export type Consulta = {
    id: string;
    data: string;
    motivo: string;        // ex: "Check-up anual"
    veterinario?: string;  // ex: "Dra. Sofia"
};

export type Lembrete = {
    id: string;
    texto: string;         // ex: "Dar comprimido da desparasitação"
    feito: boolean;        // ✅ ou não
};

export type Animal = {
    id: string;
    nome: string;
    especie: Especie;
    raca?: string;
    nascimento?: string; // ex: "2021-05-14"
    peso?: number;       // em kg
    foto?: string;       // endereço da imagem escolhida
    vacinas?: Vacina[];
    consultas?: Consulta[];
    lembretes?: Lembrete[];
};
