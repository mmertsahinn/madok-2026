"use client";
import ScrollReveal from "@/components/ScrollReveal";
import { Calendar, MapPin, Building, Globe, Users } from "lucide-react";
import Link from "next/link";

export default function AboutSection() {
  return (
    <section className="section" id="about" style={{ 
      position: "relative", 
      padding: "6rem 0",
      minHeight: "600px",
      display: "flex",
      alignItems: "center",
      overflow: "hidden"
    }}>
      
      {/* Background Image Area */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: "url('/fakulte.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        zIndex: 0
      }}></div>

      {/* Dark Overlay for Readability */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0, bottom: 0,
        background: "linear-gradient(to right, rgba(15,28,48,0.95) 0%, rgba(15,28,48,0.7) 50%, rgba(15,28,48,0.3) 100%)",
        zIndex: 1
      }}></div>

      <div className="section-container" style={{ position: "relative", zIndex: 2, width: "100%" }}>
        
        <div style={{ maxWidth: "600px", color: "white" }}>
          <ScrollReveal>
             <h2 style={{ fontSize: "3rem", fontWeight: 800, marginBottom: "2rem", fontFamily: "'Playfair Display', serif", color: "#cba867" }}>
               Kongre Hakkında
             </h2>
             
             <ul style={{ listStyle: "none", padding: 0, margin: "0 0 3rem 0", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
               <li style={{ display: "flex", alignItems: "center", gap: "1rem", fontSize: "1.1rem" }}>
                 <Calendar className="text-primary" style={{ color: "#cba867" }} />
                 <strong>Tarih:</strong> 19-21 Haziran 2026
               </li>
               <li style={{ display: "flex", alignItems: "center", gap: "1rem", fontSize: "1.1rem" }}>
                 <MapPin className="text-primary" style={{ color: "#cba867" }} />
                 <strong>Mekan:</strong> MAKÜ Konferans ve Sergi Salonu
               </li>
               <li style={{ display: "flex", alignItems: "center", gap: "1rem", fontSize: "1.1rem" }}>
                 <Building className="text-primary" style={{ color: "#cba867" }} />
                 <strong>Tür:</strong> Ulusal Bilimsel Kongre
               </li>
               <li style={{ display: "flex", alignItems: "center", gap: "1rem", fontSize: "1.1rem" }}>
                 <Globe className="text-primary" style={{ color: "#cba867" }} />
                 <strong>Bilimsel Dil:</strong> Türkçe ve İngilizce
               </li>
               <li style={{ display: "flex", alignItems: "center", gap: "1rem", fontSize: "1.1rem" }}>
                 <Users className="text-primary" style={{ color: "#cba867" }} />
                 <strong>Kapasite:</strong> 500+ Katılımcı
               </li>
             </ul>

             <div style={{ marginBottom: "2rem" }}>
               <h3 style={{ fontSize: "1.5rem", fontWeight: 600 }}>Burdur Mehmet Akif Ersoy Üniversitesi</h3>
               <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "1rem" }}>Merkez Kampüs / Burdur, Türkiye</p>
             </div>

             <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <Link href="/paketler" className="btn-primary" style={{ background: "#cba867", color: "white", padding: "1rem 2rem", fontWeight: 600, border: "none" }}>
                  Kayıt Ol
                </Link>
                <a href="https://maps.google.com/?q=Mehmet+Akif+Ersoy+Üniversitesi+Konferans+Sergi+Salonu+Burdur" target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ border: "2px solid #cba867", color: "#cba867", padding: "1rem 2rem", fontWeight: 600, background: "transparent" }}>
                  Yol Tarifi Al
                </a>
             </div>
          </ScrollReveal>
        </div>

      </div>
    </section>
  );
}
