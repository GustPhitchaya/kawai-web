import BranchesSection from "@/components/sections/branches-section";
import ContactSection from "@/components/sections/contact-section";
import CoursesSection from "@/components/sections/courses-section";
import EventsSection from "@/components/sections/events-section";
import ExamSection from "@/components/sections/exam-section";
import HarmonySection from "@/components/sections/harmony-section";
import HeroScrub from "@/components/sections/hero-scrub";
import HeroStatic from "@/components/sections/hero-static";
import PhilosophySection from "@/components/sections/philosophy-section";
import { StatementBreak } from "@/components/sections/statement-break";
import ReviewsSection from "@/components/sections/reviews-section";
import StrengthsSection from "@/components/sections/strengths-section";
import { statements } from "@/content";

export default function Home() {
  return (
    <main id="main" tabIndex={-1}>
      <HeroScrub />
      <HeroStatic />
      <PhilosophySection />
      <StrengthsSection />
      <StatementBreak statement={statements.learning} />
      <CoursesSection />
      <HarmonySection />
      <ExamSection />
      <StatementBreak statement={statements.livePiano} />
      <EventsSection />
      <ReviewsSection />
      <BranchesSection />
      <ContactSection />
    </main>
  );
}
