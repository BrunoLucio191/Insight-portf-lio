import logoInsight from "../../../assets/logo_insight.png";
import "./Header.css";

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <img src={logoInsight} alt="logo" />
      </div>
      <nav className="nav-menu">
        <a href="#sobreNos">Sobre nós</a>
        <a href="#inicio">Início</a>
        <a href="#portfolio">Portfólio</a>
        <a href="#feed">Feed</a>
        <a href="#contato" className="btn-contato">
          Contato
        </a>
      </nav>
    </header>
  );
}
export default Header;
