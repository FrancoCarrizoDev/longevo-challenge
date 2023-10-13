import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { PodcastProvider } from "./context/PodcastProvider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <PodcastProvider>
    <App />
  </PodcastProvider>
);
