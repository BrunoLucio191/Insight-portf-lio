import Header from "./Header/Header";
import HeroSection from "./HeroSection/HeroSection";
import AboutSection from "./AboutSection/AboutSection";
import ServicesSection from "./ServicesSection/ServicesSection";
import ProcessSection from "./ProcessSection/ProcessSection";
import PortfolioSection from "./PortfolioSection/PortfolioSection";
import TestimonialsSection from "./TestimonialsSection/TestimonialsSection";
import FAQSection from "./FAQSection/FAQSection";
import ContactSection from "./ContactSection/ContactSection";
import Footer from "../Footer";
import FloatingWhatsApp from "../FloatingWhatsApp";

function HomePage() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:px-4 focus:py-2 focus:bg-[var(--color-amber)] focus:text-black focus:rounded-md focus:font-bold"
      >
        Pular para o conteúdo
      </a>
      <Header />
      <main id="main">
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <ProcessSection />
        <PortfolioSection />
        <TestimonialsSection />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}

export default HomePage;
