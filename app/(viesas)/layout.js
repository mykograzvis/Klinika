// app/layout.js
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "./style.css";


export default function ViesasLayout({ children }) {
  return (
      <>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </>
  );
}
