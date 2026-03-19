import AnimatedSection from '@/components/ThourayaSections/AnimatedSection';
import ArticlesSection from '@/components/ThourayaSections/ArticlesSection';
import ContactSection from '@/components/ThourayaSections/ContactSection';
import CoreValues from '@/components/ThourayaSections/CoreValues';
import FAQSection from '@/components/ThourayaSections/FAQSection';
import Footer from '@/components/ThourayaSections/Footer';
import Hero from '@/components/ThourayaSections/Hero';
import Navbar from '@/components/ThourayaSections/Navbar';
import ProductsSection from '@/components/ThourayaSections/Products';
import QualityStandards from '@/components/ThourayaSections/QualityStandards';
import SuccessStory from '@/components/ThourayaSections/SuccessStory';
import WhatsAppButton from '@/components/ThourayaSections/WhatsAppButton';

export default function Welcome() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero: instant — first impression, no scroll-trigger */}
        <Hero />

        {/* Chapter 1: Core Values — fade up with spring feel */}
        <AnimatedSection animation="fade-up" duration={0.8} distance={50} once>
          <CoreValues />
        </AnimatedSection>

        {/* Chapter 2: Success Story — slide in from side, like opening a book */}
        <AnimatedSection animation="fade-left" duration={0.75} distance={60} once>
          <SuccessStory />
        </AnimatedSection>

        {/* Chapter 3: Products — dramatic scale reveal, spotlight moment */}
        <AnimatedSection animation="scale-reveal" duration={0.85} once>
          <ProductsSection />
        </AnimatedSection>

        {/* Chapter 4: Quality Standards — slide in mirrored */}
        <AnimatedSection animation="fade-right" duration={0.75} distance={60} once>
          <QualityStandards />
        </AnimatedSection>

        {/* Chapter 5: Articles — stagger children, each card tells its story */}
        <AnimatedSection animation="stagger" staggerDelay={0.1} duration={0.6} once>
          <ArticlesSection />
        </AnimatedSection>

        {/* Chapter 6: FAQ — blur-in for knowledge reveal */}
        <AnimatedSection animation="blur-in" duration={0.8} once>
          <FAQSection />
        </AnimatedSection>

        {/* Chapter 7: Contact — slide-up-bounce for invitation feel */}
        <AnimatedSection animation="slide-up-bounce" duration={0.85} distance={55} once>
          <ContactSection />
        </AnimatedSection>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}