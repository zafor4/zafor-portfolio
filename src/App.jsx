import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Projects } from './components/Projects';
import { Experience } from './components/Experience';
import { Skills } from './components/Skills';
import { GitHubStats } from './components/GitHubStats';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground selection:bg-foreground selection:text-background">
        <Navbar />
        <main>
          <Hero />
          <Projects />
          <Experience />
          <Skills />
          <GitHubStats />
          <Contact />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
