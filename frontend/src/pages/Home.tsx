import React from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../components/layout/HeroSection';
import PopularJobsSection from '../components/layout/PopularJobsSection';
import FeaturesBanner from '../components/layout/FeaturesBanner';
import WhyUseSection from '../components/layout/WhyUseSection';
import HowItWorksSection from '../components/layout/HowItWorksSection';
import PromotionalSection from '../components/layout/PromotionalSection';
import ServiceProviderTiers from '../components/layout/ServiceProviderTiers';
import ServiceProviderCards from '../components/layout/ServiceProviderCards';
import Footer from '../components/layout/Footer';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/jobs?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection onSearch={handleSearch} />
      <PopularJobsSection />

      <FeaturesBanner />

      <WhyUseSection />

      <HowItWorksSection />

      <PromotionalSection />

      <ServiceProviderTiers />

      <ServiceProviderCards />

      <Footer />

    </div>
  );
};

export default Home;
