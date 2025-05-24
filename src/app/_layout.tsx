import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';
import 'event-target-shim';
// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import 'buffer';
import "../global.css";
import { Slot } from "expo-router";

export default function Layout() {
  return <Slot />;
}
