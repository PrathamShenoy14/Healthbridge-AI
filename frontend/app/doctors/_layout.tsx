import { Tabs } from "expo-router";
import { Home, LayoutDashboard} from "lucide-react-native";

export default function PatientLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#13abec",
        tabBarInactiveTintColor: "#6b7280",
        tabBarStyle: { backgroundColor: "#f6f7f8" },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => <LayoutDashboard color={color} size={size} />,
        }}
      />

    </Tabs>
  );
}
