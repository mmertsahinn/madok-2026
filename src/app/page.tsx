import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/sections/HeroSection";
import IntroSection from "@/components/sections/IntroSection";
import SpeakersSection from "@/components/sections/SpeakersSection";
import AboutSection from "@/components/sections/AboutSection";
import SponsorsSection from "@/components/sections/SponsorsSection";

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      
      {/* Container wrapper for padding consistency */}
      <div style={{ paddingTop: "2rem" }}>
        
        {/* Intro Section (MADOK Nedir videolu sol + Sağ Duyurular) */}
        <IntroSection />
        
        {/* Speakers Section */}
        <SpeakersSection />
        
        {/* Kongre Hakkında (with Faculty Image on right) */}
        <AboutSection />
        
        {/* Sponsor logos */}
        <SponsorsSection />
        
      </div>
      
      <Footer />
    </>
  );
}
