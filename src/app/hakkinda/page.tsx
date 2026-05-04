import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AboutSection from "@/components/sections/AboutSection";
import InfoSection from "@/components/sections/InfoSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kongre Hakkında | MADOK 2026",
};

export default function HakkindaPage() {
  return (
    <>
      <Navbar />
      <div style={{ paddingTop: "6rem" }}>
        <AboutSection />
        <InfoSection />
      </div>
      <Footer />
    </>
  );
}
