import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function ViesasLayout({ children }) {
  return (
      <>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </>
  );
}
