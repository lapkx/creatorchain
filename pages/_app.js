// pages/_app.js
import { AuthProvider } from "../context/AuthContext";  // ✅ Import your context
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>               {/* ✅ Wrap your entire app */}
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
