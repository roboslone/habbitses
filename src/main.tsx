import { createRoot } from "react-dom/client";
import "./index.css";
import HabitForm from "./components/new-habit-form";
import { Toaster } from "./components/ui/sonner";

createRoot(document.getElementById("root")!).render(
  <>
    <HabitForm onChange={async (h) => console.log(h)} />
    <Toaster />
  </>
);
