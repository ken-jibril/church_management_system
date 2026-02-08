import AppRouter from "./routes/AppRouter";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;

