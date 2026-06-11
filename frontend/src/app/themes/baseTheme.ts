import type { ThemeOptions } from "@mui/material/styles";

export const baseTheme: ThemeOptions = {
  palette: {
    mode: "dark",
    background: {
      default: "#0F1012",
      paper:   "#1A1C1F",
    },
    text: {
      primary:   "#F0EEE9",
      secondary: "#9CA3A0",
      disabled:  "#5C6360",
    },
    divider: "rgba(255,255,255,0.08)",
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',

    body1: {
        fontWeight: 300,       // Peso leve (Light) para o corpo principal
        lineHeight: 1.6,       // Linhas levemente mais espaçadas para melhor leitura
        letterSpacing: "0.01em",
    },
    body2: {
        fontWeight: 300,       // Peso leve para textos secundários menores
        lineHeight: 1.5,
    },

    h1: { 
      fontFamily: '"Ibarra Real Nova", "Lora", serif', 
      fontWeight: 500, // Um pouco menos negrito deixa a serifa mais editorial
      letterSpacing: "-0.02em" 
    },
    h2: { 
      fontFamily: '"Ibarra Real Nova", "Lora", serif', 
      fontWeight: 500, 
      letterSpacing: "-0.01em"
    },
    h3: { 
      fontFamily: '"Ibarra Real Nova", "Lora", serif', 
      fontWeight: 500, 
      letterSpacing: "-0.01em" 
    },
    h4: { 
      fontFamily: '"Ibarra Real Nova", "Lora", serif', 
      fontWeight: 500,
    },
    h5: { 
      fontFamily: '"Ibarra Real Nova", "Lora", serif', 
      fontWeight: 500,
    },
    
    // Elementos de interface continuam sans-serif, mas limpos
    button: { 
      textTransform: "none", 
      fontWeight: 400, // Botão ligeiramente mais leve
      letterSpacing: "0.02em"
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#0F1012",
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
          minHeight: "100vh",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: "none",
          "&:hover": { boxShadow: "none" },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          border: "0.5px solid rgba(255,255,255,0.08)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 6 },
      },
    },
  },
};