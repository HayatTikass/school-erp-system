import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { isSupabaseConfigured } from "./lib/env";

async function boot() {
  const root = createRoot(document.getElementById("root")!);
  if (!isSupabaseConfigured) {
    const { default: MissingConfig } = await import("./pages/MissingConfig");
    root.render(
      <StrictMode>
        <MissingConfig />
      </StrictMode>,
    );
    return;
  }
  const { default: App } = await import("./App");
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

void boot();
