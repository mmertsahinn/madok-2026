import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SpeakersSection from "@/components/sections/SpeakersSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Konuşmacılar | MADOK 2026",
};

export default function KonusmacilarPage() {
  return (
    <>
      <Navbar />
      <div style={{ paddingTop: "6rem" }}>
        <SpeakersSection />
      </div>
      <Footer />
    </>
  );
}
