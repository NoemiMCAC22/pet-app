import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import AnimaisScreen from "./src/features/Animais/animaisScreen";
import PerfilAnimalScreen from "./src/features/PerfilAnimal/perfilAnimalScreen";
import NovoAnimalScreen from "./src/features/NovoAnimal/novoAnimalScreen";
import { RootStackParamList } from "./src/navigation/types";
import { AnimaisProvider } from "./src/context/AnimaisContext";
import { TemaProvider, useTema } from "./src/theme/TemaContext";

const Stack = createNativeStackNavigator<RootStackParamList>();

// a navegação fica num componente à parte para poder usar o useTema()
const Navegacao = () => {
  const { esquema, colors } = useTema();
  const temaBase = esquema === "dark" ? DarkTheme : DefaultTheme;

  return (
    <NavigationContainer
      theme={{
        ...temaBase,
        colors: { ...temaBase.colors, background: colors.background },
      }}
    >
      <Stack.Navigator
        initialRouteName="Animais"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Animais" component={AnimaisScreen} />
        <Stack.Screen name="PerfilAnimal" component={PerfilAnimalScreen} />
        <Stack.Screen name="NovoAnimal" component={NovoAnimalScreen} />
      </Stack.Navigator>
      <StatusBar style={esquema === "dark" ? "light" : "dark"} />
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <TemaProvider>
      <AnimaisProvider>
        <Navegacao />
      </AnimaisProvider>
    </TemaProvider>
  );
};

export default App;
