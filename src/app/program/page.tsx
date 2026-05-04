import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TimelineSection from "@/components/sections/TimelineSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bilimsel Program | MADOK 2026",
};

export default function ProgramPage() {
  return (
    <>
      <Navbar />
      <div style={{ paddingTop: "6rem" }}>
        <TimelineSection />
      </div>
      <Footer />
    </>
  );
}
