'use client';

import React from 'react';
import { ShopProvider, useShop } from '@/context/ShopContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/home/HeroSection';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { PopularProducts } from '@/components/home/PopularProducts';
import { FlashDeals } from '@/components/home/FlashDeals';
import { NewArrivals } from '@/components/home/NewArrivals';
import { PlatformGuarantees } from '@/components/home/PlatformGuarantees';
import { CustomerTestimonials } from '@/components/home/CustomerTestimonials';
import { HomeFaq } from '@/components/home/HomeFaq';
import { ContactCtaBlock } from '@/components/home/ContactCtaBlock';
import { NewsletterSection } from '@/components/home/NewsletterSection';
import { ProductCatalog } from '@/components/shop/ProductCatalog';
import { ProductLandingPage } from '@/components/product/ProductLandingPage';
import { PromotionsPage } from '@/components/pages/PromotionsPage';
import { AboutPage } from '@/components/pages/AboutPage';
import { ContactPage } from '@/components/pages/ContactPage';
import { LegalPage } from '@/components/pages/LegalPage';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { CheckoutModal } from '@/components/checkout/CheckoutModal';
import { LicenseVaultModal } from '@/components/vault/LicenseVaultModal';
import { FseSpecsModal } from '@/components/wordpress/FseSpecsModal';
import { SocialProofToast } from '@/components/store/SocialProofToast';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { AdminLogin } from '@/components/admin/AdminLogin';

function ShopContent() {
  const { activeTab, selectedProductSlug, isAdminAuthenticated } = useShop();

  if (activeTab === 'admin') {
    return isAdminAuthenticated ? <AdminDashboard /> : <AdminLogin />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1">
        {activeTab === 'home' && (
          <>
            <HeroSection />
            <CategoryGrid />
            <PopularProducts />
            <FlashDeals />
            <NewArrivals />
            <PlatformGuarantees />
            <CustomerTestimonials />
            <HomeFaq />
            <ContactCtaBlock />
          </>
        )}

        {activeTab === 'catalog' && <ProductCatalog />}

        {activeTab === 'product-detail' && (
          <ProductLandingPage
            key={selectedProductSlug || 'chatgpt-plus-abonnement'}
            slug={selectedProductSlug || 'chatgpt-plus-abonnement'}
          />
        )}

        {activeTab === 'promotions' && <PromotionsPage />}

        {activeTab === 'about' && <AboutPage />}

        {activeTab === 'contact' && <ContactPage />}

        {activeTab === 'legal' && <LegalPage />}
      </main>

      {/* VIP Newsletter Capture Section */}
      <NewsletterSection />

      <Footer />

      {/* Global Modals & Drawers */}
      <CartDrawer />
      <CheckoutModal />
      <LicenseVaultModal />
      <FseSpecsModal />
      <SocialProofToast />
    </div>
  );
}

export default function HomePage() {
  return (
    <ShopProvider>
      <ShopContent />
    </ShopProvider>
  );
}
