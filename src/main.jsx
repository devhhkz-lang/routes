import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./services/queryClient";
import { AuthProvider } from "./context/AuthContext";
import App from "./App";
import "./styles/style.css";
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/instrument-sans";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AuthProvider><App /></AuthProvider>
    </QueryClientProvider>
  </BrowserRouter>
);
