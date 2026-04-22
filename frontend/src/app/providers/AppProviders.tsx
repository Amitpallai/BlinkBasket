import type { ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";
import { AppContextProvider } from "@/context/AppContext";

type AppProvidersProps = {
  children: ReactNode;
};

export default function AppProviders({ children }: AppProvidersProps) {
  return (
    <BrowserRouter>
      <AppContextProvider>{children}</AppContextProvider>
    </BrowserRouter>
  );
}
