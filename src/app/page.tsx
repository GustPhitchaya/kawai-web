import { SoundProvider } from "@/lib/sound/SoundContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Philosophy } from "@/components/sections/Philosophy";
import { Features } from "@/components/sections/Features";
import { Courses } from "@/components/sections/Courses";
import { Exams } from "@/components/sections/Exams";
import { Events } from "@/components/sections/Events";
import { Testimonials } from "@/components/sections/Testimonials";
import { Branches } from "@/components/sections/Branches";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <SoundProvider>
      <Navbar />
      <main>
        <Hero />
        <Philosophy />
        <Features />
        <Courses />
        <Exams />
        <Events />
        <Testimonials />
        <Branches />
        <Contact />
      </main>
      <Footer />
    </SoundProvider>
  );
}
