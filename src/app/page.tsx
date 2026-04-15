import { HeroSection } from "@/components/landing/hero-section";
import { FeaturedDestinations } from "@/components/landing/featured-destinations";
import { TripBuilderPromo } from "@/components/landing/trip-builder-promo";
import { ActivitiesShowcase } from "@/components/landing/activities-showcase";
import { OperatorValue } from "@/components/landing/operator-value";
import { AnalyticsTeaser } from "@/components/landing/analytics-teaser";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Testimonials } from "@/components/landing/testimonials";
import { CtaSection } from "@/components/landing/cta-section";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturedDestinations />
      <TripBuilderPromo />
      <ActivitiesShowcase />
      <OperatorValue />
      <AnalyticsTeaser />
      <HowItWorks />
      <Testimonials />
      <CtaSection />
    </>
  );
}