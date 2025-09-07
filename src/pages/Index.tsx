import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import DSA from "@/components/DSA";
import Certificates from "@/components/Certificates";
import Contact from "@/components/Contact";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <About />
      <Projects />
      <DSA />
      <Certificates />
      <Contact />
    </div>
  );
};

export default Index;