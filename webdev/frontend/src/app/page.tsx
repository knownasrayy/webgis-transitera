'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useMotionValueEvent, useReducedMotion } from 'framer-motion';

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  const showcaseRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  // Ease curve from PRD
  const defaultEase: [number, number, number, number] = [0.4, 0, 0.2, 1];

  // Parallax calculations for the showcase section
  const { scrollYProgress } = useScroll({
    target: showcaseRef,
    offset: ["start end", "end start"]
  });

  // If reduced motion, don't move the Y axis.
  const backY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? ["0%", "0%"] : ["-5%", "5%"]);
  const middleY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? ["0%", "0%"] : ["0%", "0%"]); // Anchored slightly
  const frontY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? ["0%", "0%"] : ["5%", "-10%"]); // Moves the most

  // Variants
  const heroContainerVars = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  const heroItemVars = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: defaultEase } }
  };

  const cardContainerVars = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const cardVars = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: defaultEase } }
  };

  return (
    <div className="antialiased selection:bg-brand-500 selection:text-white overflow-x-hidden font-montserrat bg-surface-container-lowest text-on-surface">
      {/* BEGIN: Navigation */}
      <motion.nav 
        className={`fixed top-0 w-full z-50 transition-all duration-300 ease-in-out ${isScrolled ? 'glass-panel-stitch' : 'bg-transparent'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <img
                alt="TransitERA Logo"
                className="h-10 w-auto object-contain"
                src="/assets/landing/LOGO.png"
              />
              <span className="text-xl font-bold text-white tracking-tight">
                Transit<span className="text-brand-lime">ERA</span>
              </span>
            </div>
            <div className="hidden md:flex space-x-8">
              <Link className="text-sm font-medium text-on-surface hover:text-white transition-colors" href="#platform">Platform</Link>
              <Link className="text-sm font-medium text-on-surface hover:text-white transition-colors" href="#solutions">Solutions</Link>
              <Link className="text-sm font-medium text-on-surface hover:text-white transition-colors" href="#use-cases">Use Cases</Link>
              <Link className="text-sm font-medium text-on-surface hover:text-white transition-colors" href="#about">About</Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link className="px-5 py-2.5 text-sm font-semibold text-surface-container-lowest bg-brand-lime hover:bg-[#8CE0C4] rounded transition-colors shadow-[0_0_15px_rgba(177,252,145,0.3)] flex items-center gap-2" href="/map">
                <span>Launch App</span>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>
      {/* END: Navigation */}

      {/* BEGIN: Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden min-h-[90vh] flex items-center">
        {/* Background Image with Slow Zoom */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.img
            alt="Smart City H3 Grid"
            className="w-full h-full object-cover opacity-40 origin-center"
            src="/assets/landing/a_high_tech_futuristic_aerial_view_of_a_smart_city_transit_corridor_in_surabaya.png"
            initial={{ scale: 1 }}
            animate={{ scale: prefersReducedMotion ? 1 : 1.05 }}
            transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-surface-container-lowest/80 via-surface-container-lowest/50 to-surface-container-lowest pointer-events-none"></div>
        </div>

        <motion.div 
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          variants={heroContainerVars}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={heroItemVars}>
            <div className="inline-flex items-center px-3 py-1 rounded-full border border-brand-lime/30 bg-brand-lime/10 text-brand-lime text-xs font-semibold uppercase tracking-wider mb-8">
              Maps That Think!
            </div>
          </motion.div>
          
          <motion.h1 variants={heroItemVars} className="text-[32px] font-bold text-white tracking-[-0.02em] mb-6 leading-tight">
            Spatial Intelligence for <br /> <span className="text-gradient italic font-serif">Mass Transportation</span>
          </motion.h1>
          
          <motion.p variants={heroItemVars} className="mt-4 max-w-2xl mx-auto text-base leading-[1.6] text-on-surface-variant mb-10">
            Empowering governments, businesses, and commuters with AI-driven spatial data to optimize transit-oriented development and high-growth urban strategies.
          </motion.p>
          
          <motion.div variants={heroItemVars} className="flex flex-col sm:flex-row justify-center gap-4">
            <Link className="px-8 py-4 text-sm font-bold text-surface-container-lowest bg-brand-lime hover:bg-[#8CE0C4] rounded-lg transition-all shadow-[0_0_20px_rgba(177,252,145,0.4)] hover:shadow-[0_0_30px_rgba(177,252,145,0.6)] flex items-center justify-center gap-2" href="/map">
              <span>Launch App</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </Link>
          </motion.div>
        </motion.div>
      </section>
      {/* END: Hero Section */}

      {/* BEGIN: Data-driven Insights / Use Cases */}
      <section id="use-cases" className="py-24 bg-surface-container-lowest relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16 items-center overflow-hidden">
            <motion.div 
              className="lg:w-1/2"
              initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: defaultEase }}
            >
              <div className="inline-flex gap-2 mb-6">
                <span className="px-3 py-1 rounded-full bg-brand-teal/10 text-brand-teal text-xs font-semibold uppercase">Insights</span>
                <span className="px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant text-xs font-semibold uppercase">AI-Powered</span>
              </div>
              <h2 className="text-[24px] font-semibold text-white mb-6">Data-driven <span className="italic font-serif text-on-surface-variant">property insights</span></h2>
              <p className="text-base leading-[1.6] text-on-surface-variant mb-8">
                Our platform leverages smart analytics and H3 spatial resolution to help you find high-potential investments and plan sustainable infrastructure. We combine real-time data with intuitive visual dashboards so you can pinpoint areas poised for growth.
              </p>
              <div className="space-y-6">
                <motion.div 
                  className="glass-panel-stitch p-6 rounded-2xl border-l-4 border-l-brand-lime"
                  initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1, ease: defaultEase }}
                >
                  <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    <span className="text-brand-lime font-mono text-sm">01</span> Retail Success Score
                  </h3>
                  <p className="text-on-surface-variant text-sm">Analyze foot traffic patterns, demographics, and transit proximity to score commercial viability with pinpoint accuracy.</p>
                </motion.div>
                
                <motion.div 
                  className="glass-panel-stitch p-6 rounded-2xl border-l-4 border-l-brand-600"
                  initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2, ease: defaultEase }}
                >
                  <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    <span className="text-brand-400 font-mono text-sm">02</span> Predictive Insights
                  </h3>
                  <p className="text-on-surface-variant text-sm">Use AI-driven forecasting to spot properties and transit corridors that match long-term urban growth and investment criteria.</p>
                </motion.div>
              </div>
            </motion.div>

            <motion.div 
              className="lg:w-1/2 w-full"
              initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.2, ease: defaultEase }}
              whileHover={!prefersReducedMotion ? { y: -4, transition: { duration: 0.3 } } : {}}
            >
              <div className="relative rounded-3xl overflow-hidden glass-panel-stitch p-2 shadow-2xl transition-shadow duration-300 hover:shadow-brand-500/20">
                <img
                  alt="Retail Success Score Dashboard"
                  className="w-full h-auto rounded-2xl opacity-90 transition-opacity"
                  src="/assets/landing/a_professional_modern_urban_planning_workspace._a_large_high_resolution_monitor.png"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/80 to-transparent pointer-events-none rounded-2xl"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      {/* END: Data-driven Insights */}

      {/* BEGIN: Segmented Solutions */}
      <section id="solutions" className="py-24 bg-surface-container-low relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: defaultEase }}
          >
            <h2 className="text-[24px] font-semibold text-white mb-6">Omni-channel intelligence, <br /> <span className="italic font-serif text-on-surface-variant">any stakeholder</span></h2>
            <p className="text-base leading-[1.6] text-on-surface-variant">
              TransitERA provides tailored interfaces and tools for the diverse ecosystem of urban development, ensuring everyone has the data they need.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={cardContainerVars}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {/* Government */}
            <motion.div variants={cardVars} className="group relative rounded-3xl overflow-hidden bg-surface-container h-[400px] transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-900/40">
              <img
                alt="Government Urban Planning"
                className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-500"
                src="/assets/landing/a_high_tech_futuristic_aerial_view_of_a_smart_city_transit_corridor_in_surabaya.png"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/80 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8">
                <span className="px-3 py-1 rounded-full bg-surface-container/80 text-on-surface border border-surface-container-highest text-xs font-semibold mb-4 inline-block backdrop-blur-sm">Government</span>
                <h3 className="text-2xl font-bold text-white mb-2">Policy &amp; Planning</h3>
                <p className="text-on-surface-variant text-sm">Analyze TOD readiness, plan feeder routes, and simulate urban impact with high-resolution spatial overlays.</p>
              </div>
            </motion.div>

            {/* Business */}
            <motion.div variants={cardVars} className="group relative rounded-3xl overflow-hidden bg-surface-container h-[400px] transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-lime/20">
              <img
                alt="Business Retail Area"
                className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-500"
                src="/assets/landing/a_futuristic_tech_enabled_retail_shopping_district_near_a_transit_hub._subtle.png"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/80 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8">
                <span className="px-3 py-1 rounded-full bg-brand-lime/20 text-brand-lime border border-brand-lime/30 text-xs font-semibold mb-4 inline-block backdrop-blur-sm">Business &amp; Investor</span>
                <h3 className="text-2xl font-bold text-white mb-2">Commercial Viability</h3>
                <p className="text-on-surface-variant text-sm">Discover high-yield locations, analyze foot traffic, and optimize tenant mix near major transit hubs.</p>
              </div>
            </motion.div>

            {/* Commuter */}
            <motion.div variants={cardVars} className="group relative rounded-3xl overflow-hidden bg-surface-container h-[400px] transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-accent-green/20">
              <img
                alt="Commuter Transit Station"
                className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-500"
                src="/assets/landing/a_first_person_perspective_of_a_commuter_walking_through_a_modern_clean_and.png"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/80 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8">
                <span className="px-3 py-1 rounded-full bg-success-green/20 text-success-green border border-success-green/30 text-xs font-semibold mb-4 inline-block backdrop-blur-sm">Commuter &amp; Tourist</span>
                <h3 className="text-2xl font-bold text-white mb-2">Seamless Transit</h3>
                <p className="text-on-surface-variant text-sm">Navigate complex transit networks, discover local POIs, and evaluate walkability indexes for better journeys.</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
      {/* END: Segmented Solutions */}

      {/* BEGIN: Platform Interface Showcase */}
      <section id="platform" className="py-24 bg-surface-container-lowest overflow-hidden relative" ref={showcaseRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16 relative z-30"
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: defaultEase }}
          >
            <h2 className="text-[24px] font-semibold text-white mb-4">A unified interface for complex spatial data</h2>
            <p className="text-on-surface-variant">Explore our specialized dashboards designed for deep analytical insights.</p>
          </motion.div>
          
          <div className="relative h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] flex justify-center items-center">
            <div className="absolute inset-0 bg-gradient-to-t from-brand-900/10 to-transparent blur-3xl z-0"></div>
            
            {/* Parallax Layers */}
            {/* Back Layer (Investor - Right) */}
            <motion.div 
              style={{ y: backY }}
              className="absolute hidden md:block right-[10%] top-[15%] w-3/4 max-w-4xl opacity-40 blur-[4px] z-10"
            >
              <img
                alt="Investor Dashboard Background"
                className="w-full rounded-lg shadow-xl"
                src="/assets/landing/screen.png"
              />
            </motion.div>

            {/* Middle Layer (Commuter - Left) */}
            <motion.div 
              style={{ y: middleY }}
              className="absolute hidden md:block left-[10%] top-[10%] w-3/4 max-w-4xl opacity-50 blur-[2px] z-20"
            >
              <img
                alt="Commuter Dashboard Background"
                className="w-full rounded-lg shadow-xl"
                src="/assets/landing/screen.png"
              />
            </motion.div>

            {/* Front Layer (Main Showcase) */}
            <motion.div 
              style={{ y: frontY }}
              className="absolute top-0 w-full max-w-5xl px-4 md:px-0 z-30"
            >
              <img
                alt="Platform Dashboard Showcase"
                className="w-full rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5"
                src="/assets/landing/screen.png"
              />
            </motion.div>
          </div>
        </div>
      </section>
      {/* END: Platform Interface Showcase */}

      {/* BEGIN: Footer */}
      <footer id="about" className="bg-surface-container-lowest border-t border-surface-container-high py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <img
                  alt="TransitERA Logo"
                  className="h-6 w-auto object-contain"
                  src="/assets/landing/LOGO.png"
                />
                <span className="text-lg font-bold text-white tracking-tight">TransitERA</span>
              </div>
              <p className="text-on-surface-variant text-sm max-w-sm leading-relaxed">
                Spatial Intelligence for Mass Transportation. Building smarter, more connected cities through data.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Products</h4>
              <ul className="space-y-2 text-sm">
                <li><Link className="text-on-surface-variant hover:text-white transition-colors" href="/map">Gov Portal</Link></li>
                <li><Link className="text-on-surface-variant hover:text-white transition-colors" href="/map">Investor Analytics</Link></li>
                <li><Link className="text-on-surface-variant hover:text-white transition-colors" href="/map">Commuter App</Link></li>
                <li><Link className="text-on-surface-variant hover:text-white transition-colors" href="#">API Access</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link className="text-on-surface-variant hover:text-white transition-colors" href="#">About Us</Link></li>
                <li><Link className="text-on-surface-variant hover:text-white transition-colors" href="#">Careers</Link></li>
                <li><Link className="text-on-surface-variant hover:text-white transition-colors" href="#">Contact</Link></li>
                <li><Link className="text-on-surface-variant hover:text-white transition-colors" href="#">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-surface-container-high flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-brand-400 text-xs">
              &copy; 2026 TransitERA Decision Support System. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <Link className="text-brand-400 hover:text-white transition-colors" href="#" aria-label="Twitter">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </Link>
              <Link className="text-brand-400 hover:text-white transition-colors" href="#" aria-label="LinkedIn">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
      {/* END: Footer */}
    </div>
  );
}


