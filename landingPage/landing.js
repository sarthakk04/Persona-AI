"use client";
import { useState, useEffect } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
// import Splinecomp from './splinecomp';
import {
  MessageCircle,
  Users,
  Zap,
  Globe,
  Star,
  Shield,
  Spline,
} from "lucide-react";
export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const featuresSection = document.getElementById("features");
      if (featuresSection) {
        const rect = featuresSection.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight && rect.bottom > 0;
        setIsVisible(isInView);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial state
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: MessageCircle,
      title: "Smart Conversations",
      description:
        "Engage in natural, intelligent conversations with AI personalities tailored to your needs.",
    },
    {
      icon: Users,
      title: "Multiple Personalities",
      description:
        "Choose from a diverse range of AI personas - from experts to entertainers.",
    },
    {
      icon: Zap,
      title: "Instant Responses",
      description:
        "Get lightning-fast replies with advanced AI processing and real-time interactions.",
    },
    {
      icon: Globe,
      title: "Global Access",
      description:
        "Connect with AI companions from anywhere in the world, 24/7 availability.",
    },
    {
      icon: Star,
      title: "Premium Quality",
      description:
        "Experience cutting-edge AI technology with continuous learning and improvements.",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description:
        "Your conversations are protected with enterprise-grade security and privacy.",
    },
  ];
  return (
    <>
      {/* <Splinecomp/> */}

      <div className="min-h-screen bg-gradient-to-br from-black via-[#110046] to-black">
        <section id="features" className="px-6 py-20">
          <div className="max-w-7xl mx-auto">
            <div
              className="text-center mb-16"
              style={{ fontFamily: "cardHeading" }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Try out our
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {" "}
                  features
                </span>
              </h2>
              <p
                className="text-xl text-purple-200 max-w-2xl mx-auto"
                style={{ fontFamily: "cardDesc" }}
              >
                Discover the power of AI conversation with our cutting-edge
                features designed to enhance your experience.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className={`relative group ${isVisible ? "animate-fade-in" : ""}`}
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    {/* Shining Border */}
                    <div className="absolute -inset-0.5 rounded-2xl p-[2px] bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 animate-border-shine">
                      <div className="h-full w-full rounded-2xl bg-gradient-to-br from-[#170552]/80 to-[#48237c]/60 backdrop-blur-sm"></div>
                    </div>

                    {/* Card Content */}
                    <div className="relative p-8 rounded-2xl">
                      <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3
                        className="text-2xl font-bold text-white mb-4 group-hover:text-purple-200 transition-colors"
                        style={{ fontFamily: "cardHeading" }}
                      >
                        {feature.title}
                      </h3>
                      <p
                        className="text-purple-200 leading-relaxed group-hover:text-white transition-colors"
                        style={{ fontFamily: "cardDesc" }}
                      >
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 rounded-3xl opacity-75 blur animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-[#170552]/90 to-[#48237c]/80 backdrop-blur-sm rounded-3xl p-12 border border-purple-300/20">
                <h2
                  className="text-4xl md:text-5xl font-bold text-white mb-6"
                  style={{ fontFamily: "cardHeading" }}
                >
                  Ready to start your AI journey?
                </h2>
                <p
                  className="text-xl text-purple-200 mb-8 max-w-2xl mx-auto"
                  style={{ fontFamily: "cardDesc" }}
                >
                  Join thousands of users already experiencing the future of
                  conversation with AI technology.
                </p>
                <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-10 py-4 rounded-full text-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-xl hover:shadow-purple-500/30">
                  Get Started Today
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-6 py-16 border-t border-purple-300/20">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
              <div className="md:col-span-2">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <span
                    className="text-2xl font-bold text-white"
                    style={{ fontFamily: "cardDesc" }}
                  >
                    Persona AI
                  </span>
                </div>
                <p
                  className="text-purple-200 mb-6 max-w-md"
                  style={{ fontFamily: "cardDesc" }}
                >
                  Revolutionizing communication through advanced AI technology.
                  Connect, learn, and explore with intelligent companions that
                  understand you.
                </p>
                <div className="flex space-x-4">
                  <a
                    href="https://github.com/sarthakk04"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center hover:bg-purple-500/40 transition-colors cursor-pointer"
                  >
                    <FaGithub className="text-white text-lg" />
                  </a>

                  <a
                    href="https://www.linkedin.com/in/sarthakshinde04/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center hover:bg-purple-500/40 transition-colors cursor-pointer"
                  >
                    <FaLinkedin className="text-white text-lg" />
                  </a>
                </div>
              </div>

              <div style={{ fontFamily: "cardDesc" }}>
                <h4 className="text-white font-semibold mb-4">Product</h4>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-purple-200 hover:text-white transition-colors"
                    >
                      Features
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-purple-200 hover:text-white transition-colors"
                    >
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-purple-200 hover:text-white transition-colors"
                    >
                      API
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-purple-200 hover:text-white transition-colors"
                    >
                      Documentation
                    </a>
                  </li>
                </ul>
              </div>

              <div style={{ fontFamily: "cardDesc" }}>
                <h4 className="text-white font-semibold mb-4">Company</h4>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-purple-200 hover:text-white transition-colors"
                    >
                      About
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-purple-200 hover:text-white transition-colors"
                    >
                      Blog
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-purple-200 hover:text-white transition-colors"
                    >
                      Careers
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-purple-200 hover:text-white transition-colors"
                    >
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-8 border-t border-purple-300/20 flex flex-col md:flex-row justify-between items-center">
              <p className="text-purple-300 text-sm">Made with ❤️ by Sarthak</p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a
                  href="#"
                  className="text-purple-300 hover:text-white text-sm transition-colors"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="text-purple-300 hover:text-white text-sm transition-colors"
                >
                  Terms of Service
                </a>
                <a
                  href="#"
                  className="text-purple-300 hover:text-white text-sm transition-colors"
                >
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </footer>

        <style jsx>{``}</style>
      </div>
    </>
  );
}
