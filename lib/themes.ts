export type Theme = "default" | "autumn" | "winter" | "spring" | "summer" | "space" | "ocean";

export const themes = {
  default: {
    name: "Classique",
    emoji: "🎨",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
    primary: "#667eea",
    secondary: "#764ba2",
    accent: "#f093fb",
    cardGradients: [
      "linear-gradient(135deg, #A8E6CF 0%, #4ECDC4 100%)",
      "linear-gradient(135deg, #FFD93D 0%, #FF8B94 100%)",
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    ],
  },
  autumn: {
    name: "Automne",
    emoji: "🍂",
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #ffa800 100%)",
    primary: "#d84315",
    secondary: "#ff6f00",
    accent: "#ffa726",
    cardGradients: [
      "linear-gradient(135deg, #ff6f00 0%, #d84315 100%)",
      "linear-gradient(135deg, #ffa726 0%, #fb8c00 100%)",
      "linear-gradient(135deg, #8d6e63 0%, #6d4c41 100%)",
    ],
  },
  winter: {
    name: "Hiver",
    emoji: "❄️",
    gradient: "linear-gradient(135deg, #e0f7fa 0%, #80deea 50%, #0097a7 100%)",
    primary: "#0097a7",
    secondary: "#00acc1",
    accent: "#b3e5fc",
    cardGradients: [
      "linear-gradient(135deg, #b3e5fc 0%, #4fc3f7 100%)",
      "linear-gradient(135deg, #81d4fa 0%, #039be5 100%)",
      "linear-gradient(135deg, #4dd0e1 0%, #0097a7 100%)",
    ],
  },
  spring: {
    name: "Printemps",
    emoji: "🌸",
    gradient: "linear-gradient(135deg, #f8bbd0 0%, #f48fb1 50%, #81c784 100%)",
    primary: "#66bb6a",
    secondary: "#ec407a",
    accent: "#f48fb1",
    cardGradients: [
      "linear-gradient(135deg, #81c784 0%, #66bb6a 100%)",
      "linear-gradient(135deg, #f48fb1 0%, #ec407a 100%)",
      "linear-gradient(135deg, #ffb74d 0%, #ffa726 100%)",
    ],
  },
  summer: {
    name: "Été",
    emoji: "☀️",
    gradient: "linear-gradient(135deg, #fff176 0%, #ffb300 50%, #ff6f00 100%)",
    primary: "#ffa000",
    secondary: "#ff6f00",
    accent: "#ffeb3b",
    cardGradients: [
      "linear-gradient(135deg, #ffeb3b 0%, #fbc02d 100%)",
      "linear-gradient(135deg, #ff9800 0%, #f57c00 100%)",
      "linear-gradient(135deg, #ff5722 0%, #e64a19 100%)",
    ],
  },
  space: {
    name: "Espace",
    emoji: "🚀",
    gradient: "linear-gradient(135deg, #1a237e 0%, #311b92 50%, #4a148c 100%)",
    primary: "#5e35b1",
    secondary: "#7e57c2",
    accent: "#b39ddb",
    cardGradients: [
      "linear-gradient(135deg, #5e35b1 0%, #4527a0 100%)",
      "linear-gradient(135deg, #7e57c2 0%, #5e35b1 100%)",
      "linear-gradient(135deg, #9575cd 0%, #7e57c2 100%)",
    ],
  },
  ocean: {
    name: "Océan",
    emoji: "🌊",
    gradient: "linear-gradient(135deg, #006064 0%, #0097a7 50%, #00bcd4 100%)",
    primary: "#00838f",
    secondary: "#0097a7",
    accent: "#26c6da",
    cardGradients: [
      "linear-gradient(135deg, #00acc1 0%, #00838f 100%)",
      "linear-gradient(135deg, #26c6da 0%, #00acc1 100%)",
      "linear-gradient(135deg, #4dd0e1 0%, #26c6da 100%)",
    ],
  },
};

export function getTheme(themeName: Theme) {
  return themes[themeName] || themes.default;
}
