'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Search, Sparkles, BarChart3, FileText, Save, LogIn, UserPlus } from 'lucide-react';
import Image from 'next/image';
import { ModeToggle } from '@/components/mode-toggle';
import { dummyProjects, recentProjects } from '@/data/projectDummy';

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  // Debug: Log highlighted index changes
  console.log('Current highlighted index:', highlightedIndex);

  // Use imported dummy data instead of inline data
  const allProjects = dummyProjects;

  // Filter projects based on search value - more comprehensive search
  const filteredProjects = searchValue.trim() !== '' 
    ? allProjects.filter(project => 
        project.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        project.name.toLowerCase().startsWith(searchValue.toLowerCase())
      )
    : [];

  // Projects to display: recent projects when no search, filtered when searching
  const projectsToDisplay = searchValue.trim() === '' ? recentProjects : filteredProjects;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Reset highlighted index when search results change
  useEffect(() => {
    setHighlightedIndex(0);
  }, [projectsToDisplay]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 relative">
      {/* Grid Background with Animated Light Circles */}
      <div className="absolute inset-0 opacity-20 z-0">
        <div 
          className="w-full h-full text-gray-400 dark:text-gray-600" 
          style={{
            backgroundImage: `
              linear-gradient(to right, currentColor 1px, transparent 1px),
              linear-gradient(to bottom, currentColor 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
          }} 
        />
        
        {/* Animated Shooting Stars - Only visible when moving */}
        {/* Horizontal shooting stars - centered on grid lines */}
        <div className="absolute top-[60px] left-[-20px] animate-[moveHorizontal_8s_linear_infinite_0.5s]">
          <div className="relative w-8 h-1 bg-gradient-to-r from-transparent via-black/40 to-black/10 dark:via-white/40 dark:to-white/10 rounded-full shadow-[0_0_8px_2px] shadow-black/20 dark:shadow-white/20"></div>
        </div>
        <div className="absolute top-[140px] left-[-20px] animate-[moveHorizontal_12s_linear_infinite_3.2s]">
          <div className="relative w-6 h-0.5 bg-gradient-to-r from-transparent via-black/35 to-black/10 dark:via-gray-200/35 dark:to-gray-200/10 rounded-full shadow-[0_0_6px_1px] shadow-black/20 dark:shadow-gray-200/25"></div>
        </div>
        <div className="absolute top-[220px] left-[-20px] animate-[moveHorizontal_15s_linear_infinite_7.1s]">
          <div className="relative w-10 h-1.5 bg-gradient-to-r from-transparent via-black/30 to-black/10 dark:via-gray-100/30 dark:to-gray-100/10 rounded-full shadow-[0_0_10px_2px] shadow-black/15 dark:shadow-gray-100/20"></div>
        </div>
        <div className="absolute top-[100px] left-[-20px] animate-[moveHorizontal_10s_linear_infinite_2.8s]">
          <div className="relative w-7 h-0.5 bg-gradient-to-r from-transparent via-black/35 to-black/10 dark:via-white/30 dark:to-white/10 rounded-full shadow-[0_0_6px_1px] shadow-black/20 dark:shadow-white/25"></div>
        </div>
        <div className="absolute top-[180px] left-[-20px] animate-[moveHorizontal_14s_linear_infinite_5.5s]">
          <div className="relative w-8 h-1 bg-gradient-to-r from-transparent via-black/30 to-black/10 dark:via-gray-300/30 dark:to-gray-300/10 rounded-full shadow-[0_0_8px_2px] shadow-black/15 dark:shadow-gray-300/20"></div>
        </div>
        <div className="absolute top-[260px] left-[-20px] animate-[moveHorizontal_9s_linear_infinite_1.3s]">
          <div className="relative w-6 h-0.5 bg-gradient-to-r from-transparent via-black/35 to-black/10 dark:via-gray-50/40 dark:to-gray-50/10 rounded-full shadow-[0_0_6px_1px] shadow-black/20 dark:shadow-gray-50/25"></div>
        </div>
        <div className="absolute top-[320px] left-[-20px] animate-[moveHorizontal_13s_linear_infinite_4.7s]">
          <div className="relative w-9 h-1.5 bg-gradient-to-r from-transparent via-black/30 to-black/10 dark:via-white/35 dark:to-white/10 rounded-full shadow-[0_0_10px_2px] shadow-black/15 dark:shadow-white/20"></div>
        </div>
        <div className="absolute top-[380px] left-[-20px] animate-[moveHorizontal_11s_linear_infinite_6.2s]">
          <div className="relative w-7 h-1 bg-gradient-to-r from-transparent via-black/35 to-black/10 dark:via-gray-200/35 dark:to-gray-200/10 rounded-full shadow-[0_0_8px_2px] shadow-black/20 dark:shadow-gray-200/20"></div>
        </div>
        
        {/* Vertical shooting stars - centered on grid lines */}
        <div className="absolute top-[-20px] left-[80px] animate-[moveVertical_10s_linear_infinite_1.1s]">
          <div className="relative w-1 h-8 bg-gradient-to-b from-transparent via-black/35 to-black/10 dark:via-gray-100/35 dark:to-gray-100/10 rounded-full shadow-[0_0_8px_2px] shadow-black/20 dark:shadow-gray-100/25"></div>
        </div>
        <div className="absolute top-[-20px] left-[180px] animate-[moveVertical_14s_linear_infinite_4.3s]">
          <div className="relative w-0.5 h-6 bg-gradient-to-b from-transparent via-black/30 to-black/10 dark:via-white/40 dark:to-white/10 rounded-full shadow-[0_0_6px_1px] shadow-black/15 dark:shadow-white/20"></div>
        </div>
        <div className="absolute top-[-20px] left-[280px] animate-[moveVertical_18s_linear_infinite_8.9s]">
          <div className="relative w-1.5 h-10 bg-gradient-to-b from-transparent via-black/35 to-black/10 dark:via-gray-200/35 dark:to-gray-200/10 rounded-full shadow-[0_0_10px_2px] shadow-black/20 dark:shadow-gray-200/25"></div>
        </div>
        <div className="absolute top-[-20px] left-[120px] animate-[moveVertical_12s_linear_infinite_2.7s]">
          <div className="relative w-0.5 h-7 bg-gradient-to-b from-transparent via-black/35 to-black/10 dark:via-gray-50/35 dark:to-gray-50/10 rounded-full shadow-[0_0_6px_1px] shadow-black/20 dark:shadow-gray-50/25"></div>
        </div>
        <div className="absolute top-[-20px] left-[220px] animate-[moveVertical_16s_linear_infinite_6.1s]">
          <div className="relative w-1 h-8 bg-gradient-to-b from-transparent via-black/30 to-black/10 dark:via-white/35 dark:to-white/10 rounded-full shadow-[0_0_8px_2px] shadow-black/15 dark:shadow-white/20"></div>
        </div>
        <div className="absolute top-[-20px] left-[320px] animate-[moveVertical_9s_linear_infinite_0.8s]">
          <div className="relative w-1.5 h-9 bg-gradient-to-b from-transparent via-black/35 to-black/10 dark:via-gray-100/40 dark:to-gray-100/10 rounded-full shadow-[0_0_10px_2px] shadow-black/20 dark:shadow-gray-100/25"></div>
        </div>
        <div className="absolute top-[-20px] left-[40px] animate-[moveVertical_13s_linear_infinite_3.5s]">
          <div className="relative w-0.5 h-6 bg-gradient-to-b from-transparent via-black/35 to-black/10 dark:via-gray-300/35 dark:to-gray-300/10 rounded-full shadow-[0_0_6px_1px] shadow-black/20 dark:shadow-gray-300/25"></div>
        </div>
        <div className="absolute top-[-20px] left-[160px] animate-[moveVertical_15s_linear_infinite_7.8s]">
          <div className="relative w-1 h-8 bg-gradient-to-b from-transparent via-black/30 to-black/10 dark:via-white/30 dark:to-white/10 rounded-full shadow-[0_0_8px_2px] shadow-black/15 dark:shadow-white/20"></div>
        </div>
        <div className="absolute top-[-20px] left-[260px] animate-[moveVertical_11s_linear_infinite_5.2s]">
          <div className="relative w-0.5 h-7 bg-gradient-to-b from-transparent via-black/35 to-black/10 dark:via-gray-200/40 dark:to-gray-200/10 rounded-full shadow-[0_0_6px_1px] shadow-black/20 dark:shadow-gray-200/25"></div>
        </div>
        <div className="absolute top-[-20px] left-[360px] animate-[moveVertical_17s_linear_infinite_9.4s]">
          <div className="relative w-1.5 h-9 bg-gradient-to-b from-transparent via-black/35 to-black/10 dark:via-gray-50/35 dark:to-gray-50/10 rounded-full shadow-[0_0_10px_2px] shadow-black/20 dark:shadow-gray-50/25"></div>
        </div>
      </div>

      {/* Custom CSS Animations for Grid Light Circles */}
      <style jsx>{`
        @keyframes moveHorizontal {
          0% { transform: translateX(0px); opacity: 0; }
          5% { opacity: 1; }
          95% { opacity: 1; }
          100% { transform: translateX(calc(100vw + 20px)); opacity: 0; }
        }
        
        @keyframes moveVertical {
          0% { transform: translateY(0px); opacity: 0; }
          5% { opacity: 1; }
          95% { opacity: 1; }
          100% { transform: translateY(calc(100vh + 20px)); opacity: 0; }
        }
      `}</style>
      {/* Floating Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'py-4' 
          : 'py-6'
      }`}>
        <div className={`mx-auto transition-all duration-300 ${
          isScrolled 
            ? 'w-full max-w-4xl mx-20 px-6 py-3 bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg border border-gray-200/40 dark:border-gray-700/40 rounded-3xl shadow-lg' 
            : 'w-full max-w-4xl mx-20 px-6 py-4 bg-white/30 dark:bg-gray-900/30 backdrop-blur-md border border-gray-200/20 dark:border-gray-700/20 rounded-3xl shadow-md'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Image 
                src="/quanby.png" 
                alt="PhilProcure AI Logo" 
                width={32} 
                height={32} 
                className="h-8 w-8"
              />
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold">PhilProcure AI</h1>
              </div>
              <div className="sm:hidden">
                <h1 className="text-xl font-bold">PhilProcure AI</h1>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <ModeToggle />
              <Button variant="outline" size="sm" asChild>
                <a href="/login">Login</a>
              </Button>
              <Button size="sm" asChild>
                <a href="/register">Get Started</a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 h-screen flex items-center justify-center relative z-10">
        {/* Floating Glass Icons - 2 left, 2 right, layered with primary background icons */}
        {/* Left Side Icons */}
        <div className="absolute left-8 top-1/4 transform -translate-y-1/2 rotate-12">
          {/* Background Primary Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Save className="h-14 w-14 text-primary/60" />
          </div>
          {/* Glass Container with White Icon */}
          <div className="w-28 h-28 bg-white/10 dark:bg-gray-900/10 backdrop-blur-lg border border-white/20 dark:border-gray-600/20 rounded-2xl flex items-center justify-center shadow-xl relative z-10">
            <Save className="h-14 w-14  text-black/70 dark:text-white/70" strokeWidth={1} />
          </div>
        </div>
        <div className="absolute left-20 bottom-1/3 transform translate-y-1/2 -rotate-6">
          {/* Background Primary Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Search className="h-14 w-14 text-primary/60" />
          </div>
          {/* Glass Container with White Icon */}
          <div className="w-28 h-28 bg-white/10 dark:bg-gray-900/10 backdrop-blur-lg border border-white/20 dark:border-gray-600/20 rounded-2xl flex items-center justify-center shadow-xl relative z-10">
            <Search className="h-14 w-14 text-black/70 dark:text-white/70" strokeWidth={1} />
          </div>
        </div>
        {/* Right Side Icons */}
        <div className="absolute right-8 top-1/3 transform -translate-y-1/2 rotate-6">
          {/* Background Primary Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="h-14 w-14 text-primary/60" />
          </div>
          {/* Glass Container with White Icon */}
          <div className="w-28 h-28 bg-white/10 dark:bg-gray-900/10 backdrop-blur-lg border border-white/20 dark:border-gray-600/20 rounded-2xl flex items-center justify-center shadow-xl relative z-10">
            <Sparkles className="h-14 w-14 text-black/70 dark:text-white/70" strokeWidth={1} />
          </div>
        </div>
        <div className="absolute right-16 bottom-1/4 transform translate-y-1/2 rotate-12">
          {/* Background Primary Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <BarChart3 className="h-14 w-14 text-primary/60" />
          </div>
          {/* Glass Container with White Icon */}
          <div className="w-28 h-28 bg-white/10 dark:bg-gray-900/10 backdrop-blur-lg border border-white/20 dark:border-gray-600/20 rounded-2xl flex items-center justify-center shadow-xl relative z-10">
            <BarChart3 className="h-14 w-14 text-black/70 dark:text-white/70" strokeWidth={1} />
          </div>
        </div>

        <div className="text-center w-full max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-forma font-bold mb-6 text-foreground leading-none tracking-tighter">
            AI Agent that Finds <br />
            Projects for You
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed font-inter">
           An AI-powered system that finds and matches PhilGEPS procurement projects to your company’s capabilities, industry expertise, and budget.
          </p>
          <div className="flex flex-col items-center justify-center">
            {/* Animated Search Bar */}
            <div className="relative">
              <div className={`relative transition-all duration-500 ease-out ${
                isSearchExpanded 
                  ? 'w-[480px]' 
                  : 'w-80'
              }`}>
                {/* Search Input */}
                <div className="relative">
                  <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onFocus={() => setIsSearchExpanded(true)}
                    placeholder="Search Projects..."
                    className="w-full pl-4 pr-11 py-3 text-sm bg-white/20 dark:bg-gray-900/20 backdrop-blur border border-white/30 dark:border-gray-600/30 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all duration-300 placeholder:text-muted-foreground font-inter shadow-lg hover:shadow-xl"
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none z-10">
                    <Search className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>

                {/* Expanded Content - Appears after width expansion */}
                <div className={`absolute top-full left-0 right-0 mt-2 bg-white/20 dark:bg-gray-900/20 backdrop-blur-xl border border-white/30 dark:border-gray-600/30 rounded-xl shadow-2xl overflow-hidden transition-all duration-300 ease-out ${
                  isSearchExpanded && projectsToDisplay.length > 0
                    ? 'opacity-100 translate-y-0 visible' 
                    : 'opacity-0 -translate-y-2 invisible'
                }`}
                style={{
                  transitionDelay: isSearchExpanded && projectsToDisplay.length > 0 ? '200ms' : '0ms'
                }}>
                  <div className="flex">
                    {/* Search Results - Clean Layout - Scrollable after 4 items */}
                    <div 
                      className="flex-1 px-2 py-0"
                      onMouseLeave={() => {
                        console.log('Mouse left results container, resetting to 0');
                        setHighlightedIndex(0);
                      }}
                    >
                      <div className={`flex flex-col ${projectsToDisplay.length > 4 ? 'max-h-80 overflow-y-auto' : ''}`}>
                        {projectsToDisplay.map((project, index) => (
                          <div 
                            key={index}
                            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                              index === highlightedIndex 
                                ? 'bg-primary/10 border border-primary/20 hover:bg-primary/15' 
                                : 'hover:bg-muted/50'
                            }`}
                            onMouseEnter={() => {
                              console.log('Mouse entered item', index);
                              setHighlightedIndex(index);
                            }}
                          >
                            <div className={`text-sm font-medium font-inter ${
                              index === highlightedIndex ? 'text-primary' : 'text-foreground'
                            }`}>{project.name}</div>
                            <div className="text-right">
                              <div className="text-xs text-muted-foreground font-inter">Generated on:</div>
                              <div className={`text-sm font-medium font-inter ${
                                index === highlightedIndex ? 'text-primary' : 'text-foreground'
                              }`}>{project.date}</div>
                            </div>
                          </div>
                        ))}
                        {projectsToDisplay.length > 4 && (
                          <div className="text-center py-2 text-xs text-muted-foreground border-t border-border/50 mt-2">
                            {projectsToDisplay.length} results total
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Click outside to close */}
              {isSearchExpanded && (
                <div 
                  className="fixed inset-0 z-30" 
                  onClick={() => setIsSearchExpanded(false)}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <Image 
                  src="/quanby.png" 
                  alt="PhilProcure AI Logo" 
                  width={32} 
                  height={32} 
                  className="h-8 w-8"
                />
                <span className="text-xl font-bold">PhilProcure AI</span>
              </div>
              <p className="text-gray-400 dark:text-gray-300 text-sm">
                AI-powered project discovery for Philippine government procurement. 
                Never miss another perfect opportunity.
              </p>
            </div>
            <div className="md:col-span-1">
               <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/projects" className="hover:text-white">Project Finder</a></li>
                <li><span className="text-gray-500">Bidding Documents (Coming Soon)</span></li>
                <li><span className="text-gray-500">Avatar Agents (Coming Soon)</span></li>
              </ul>
            </div>
            <div className="md:col-span-1">
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/about" className="hover:text-white">About Us</a></li>
                <li><a href="/pricing" className="hover:text-white">Pricing</a></li>
                <li><a href="/contact" className="hover:text-white">Contact</a></li>
                <li><a href="/privacy" className="hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 PhilProcure AI. All rights reserved. | Empowering businesses in Philippine government procurement.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
