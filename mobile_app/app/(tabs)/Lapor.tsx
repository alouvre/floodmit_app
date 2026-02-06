// app/(tabs)/EmergencyReport.tsx
import { Redirect } from "expo-router";

export default function Placeholder() {
  // Jika user entah bagaimana masuk ke tab ini, lempar ke halaman fullscreen
  return <Redirect href="/emergencyReport" />;
}
