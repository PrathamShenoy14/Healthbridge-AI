import { Tabs } from "expo-router";
import { Home, MessageCircle, Stethoscope, User } from "lucide-react-native";

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
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: ({ color, size }) => <MessageCircle color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="diagnosis"
        options={{
          title: "Diagnosis",
          tabBarIcon: ({ color, size }) => <Stethoscope color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
