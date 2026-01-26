export default function AuthLayout({ children }) {
  return (
    <div className="auth-container">
      {/* Čia nėra jokio Navbar, tik grynas puslapis */}
      {children}
    </div>
  );
}