import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SponsorsSection from "@/components/sections/SponsorsSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sponsorluk | MADOK 2026",
};

export default function SponsorlukPage() {
  return (
    <>
      <Navbar />
      <div style={{ paddingTop: "6rem" }}>
        <SponsorsSection />
      </div>
      <Footer />
    </>
  );
}
