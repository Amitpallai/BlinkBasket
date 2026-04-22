import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import AppProviders from "./app/providers/AppProviders";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <AppProviders>
    <App />
  </AppProviders>
);