import "./globals.css";
import { UserProvider } from "@/context/UserContext";
import Navbar from "./components/Navbar";

export const metadata = {
  title: "Shop",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <Navbar />
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
