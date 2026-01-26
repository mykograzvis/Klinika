// app/layout.js
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
    icon: "/icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
