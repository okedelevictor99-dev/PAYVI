
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";

import "@/index.css"
import App from "@/app/App";

import { queryClient } from "@/app/queryClent.ts";
import { AuthProvider } from "@/context/authContext.tsx";
import { ToastProvider } from "@/context/toastContext.tsx";
import ScrollToTop from "@/components/ui/scrollToTop";

createRoot(document.getElementById("root")!).render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
      <ScrollToTop/>
        <AuthProvider>
            <ToastProvider>
              <App />
            </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
);