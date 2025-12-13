import { RouterProvider } from "@tanstack/react-router"
import { createRoot } from "react-dom/client"

import "./index.css"
import { router } from "./routes"

createRoot(document.getElementById("root")!).render(<RouterProvider router={router} />)
