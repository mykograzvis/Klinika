// app/layout.js
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap CSS
import "../styles/globals.css"; // Global styles
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
});

export const metadata = {
  title: "Gelmidenta",
  description: "Aukščiausios kokybės odontologijos paslaugos Panevėžyje. Dantų priežiūra, gydymas ir estetika vienoje vietoje.",
  icons: {
    icon: "/icon.png", // Jei failas public aplanke, naudok "/"
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
