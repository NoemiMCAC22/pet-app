export const colorsLight = {
    primary: "#B8A1FF",     // botões e destaques
    secondary: "#8ED1FC",   // etiquetas, ícones
    accent: "#FFB5C2",      // lembretes, avisos fofos
    background: "#FAF7FF",  // fundo do ecrã
    card: "#FFFFFF",        // fundo dos cartões
    text: "#2D2A3E",        // texto principal
    textLight: "#8A86A0",   // texto secundário (datas, detalhes)
    primarySoft: "#F1ECFF", // 🆕 lilás clarinho (espécie escolhida)
    border: "#ECE8F5",      // 🆕 contorno dos campos
    danger: "#E5484D",      // 🆕 vermelho (erros, atrasos)
    dangerSoft: "#FFECEE",  // 🆕 fundo rosa dos atrasos
};

export const colorsDark = {
    primary: "#9B82F0",
    secondary: "#5BAEDB",
    accent: "#E8909F",
    background: "#1C1A26",
    card: "#2A2738",
    text: "#F2F0FA",
    textLight: "#A9A5BF",
    primarySoft: "#352E52",
    border: "#3A3650",
    danger: "#FF6B70",
    dangerSoft: "#3A2128",
};

// 🆕 o "molde" das cores: serve para os dois temas
export type Cores = typeof colorsLight;

export const FontSize = {
    small: 12,
    medium: 16,
    large: 20,
    title: 26,
};
