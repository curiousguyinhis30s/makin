import Image from "next/image";
import Hero from "@/components/organisms/Hero";
import Services from "@/components/organisms/Services";
import Team from "@/components/organisms/Team";
import Pricing from "@/components/organisms/Pricing";
import LogoMarquee from "@/components/organisms/LogoMarquee";
import Stats from "@/components/organisms/Stats";
import Testimonials from "@/components/organisms/Testimonials";
import FAQ from "@/components/organisms/FAQ";
import ContactForm from "@/components/organisms/ContactForm";

export default function Home() {
  return (
    <div className="flex flex-col gap-0">
      <Hero />
      <LogoMarquee />
      <Services />
      <Team />
      <Testimonials />
      <Pricing />
      <FAQ />
      <ContactForm />
    </div>
  );
}
