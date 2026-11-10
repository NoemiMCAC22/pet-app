import { Animal, Especie } from "./types";

export const animaisExemplo: Animal[] = [
    {
        id: "1",
        nome: "Bolinha",
        especie: "cao",
        raca: "Labrador",
        nascimento: "2021-05-14",
        peso: 28,
                vacinas: [
            { id: "v1", nome: "Raiva", data: "2025-05-20", proximaDose: "2026-05-20" },
            { id: "v2", nome: "Polivalente", data: "2025-11-02", proximaDose: "2026-11-02" },
        ],
        consultas: [
            { id: "c1", data: "2025-09-12", motivo: "Check-up anual", veterinario: "Dra. Sofia" },
        ],
        lembretes: [
            { id: "l1", texto: "Dar comprimido da desparasitação", feito: false },
            { id: "l2", texto: "Passeio da manhã", feito: true },
        ],

    },
    {
        id: "2",
        nome: "Mia",
        especie: "gato",
        raca: "Siamês",
        nascimento: "2023-02-01",
        peso: 4.5,
    },
    {
        id: "3",
        nome: "Tambor",
        especie: "coelho",
    },
];

export const emojiEspecie: Record<Especie, string> = {
    cao: "🐶",
    gato: "🐱",
    coelho: "🐰",
    passaro: "🐦",
    outro: "🐾",
};
