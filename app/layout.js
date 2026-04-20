import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/globals.css";
import { Poppins } from "next/font/google";
import { ToastProvider } from "@/context/ToastContext";

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
        <ToastProvider>
          <main>{children}</main>
        </ToastProvider>
      </body>
    </html>
  );
}
