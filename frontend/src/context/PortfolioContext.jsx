import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchPortfolioData } from '../services/api';

const PortfolioContext = createContext();

const defaultData = {
  profile: {
    name: 'Humayra Arzooman',
    title: 'UI/UX Designer & Product Designer',
    location: 'Dhaka, Bangladesh',
    statement: '[A product-focused Designer & Founder from Bangladesh, building high-performance digital experiences where modern design meets scalable technology, cloud innovation, and intelligent solutions.]',
    availableForWork: true,
    resumeUrl: '/resume.pdf',
    avatarUrl: '/assets/adina.jpeg',
    showHero: true,
    showProjects: true,
    showExperience: true,
    showSkills: true,
    showGithub: true,
    showContact: true,
  },
  projects: [
    {
      id: '1',
      title: 'Snippit',
      type: 'website',
      image: '/assets/snippit.png',
      description: 'An open-source SaaS starter registry',
      technologies: ['React', 'Tailwind'],
      github: 'https://github.com/adinahawaldar/snippit',
      live: 'https://snippit-dev.vercel.app/'
    },
    {
      id: '2',
      title: 'Zentra',
      type: 'website',
      image: '/assets/zentra.png',
      description: 'Decentralized Civic Infrastructure Management Platform',
      technologies: ['React', 'Tailwind'],
      github: 'https://github.com/adinahawaldar/zentra',
      live: 'https://zentra-ten.vercel.app/'
    },
    {
      id: '3',
      title: 'Autovion',
      type: 'ui/ux',
      image: '/assets/autovion.png',
      description: 'Luxury car showroom UI focused on clarity.',
      technologies: ['Figma', 'Branding'],
      figma: 'https://www.figma.com/design/xX2KTf91gwtdpHaCBSghlz/Autovion?t=oSsae7DAQE5zYa9h-1'
    },
    {
      id: '4',
      title: 'Zen',
      type: 'ui/ux',
      image: '/assets/zen.png',
      description: 'Architecture website design.',
      technologies: ['Figma', 'Prototype'],
      figma: 'https://www.figma.com/design/rMF571Vdq8kAHGTv5srtCp/Untitled?node-id=0-1&t=wTuhogRbZhysb8NY-1'
    },
    {
      id: '5',
      title: 'Smartchain',
      type: 'website',
      image: '/assets/smartchain.png',
      description: 'AI Supply chain control tower',
      technologies: ['React', 'ML'],
      github: 'https://github.com/adinahawaldar/Smart-chain',
      live: 'https://smart-chain-ossk.vercel.app/'
    },
    {
      id: '6',
      title: 'Artwork',
      type: 'ui/ux',
      image: '/assets/artwork.png',
      description: 'Artwork Gallery Design.',
      technologies: ['Figma', 'UI'],
      figma: 'https://www.figma.com/design/xe3V32YLb8xSC1xzgDoxOi/Untitled?node-id=0-1&t=cwGM42qXVpOQ5UpF-1'
    },
    {
      id: '7',
      title: 'Law Firm',
      type: 'ui/ux',
      image: '/assets/lawfirm.png',
      description: 'Law Firm Website Design.',
      technologies: ['Figma', 'UI'],
      figma: 'https://www.figma.com/design/jCyOYI6jSujE0s6aJwg8ca/Untitled?node-id=0-1&t=CuNiBHd9S4i07Pgz-1'
    },
    {
      id: '8',
      title: 'Restaurant',
      type: 'ui/ux',
      image: '/assets/restaurant.png',
      description: 'Restaurant Website UI.',
      technologies: ['Figma', 'UI'],
      figma: 'https://www.figma.com/design/XOE9NAdIeFFysXMO1A3grl/Rumman-%E2%80%94-Modern-Food-Restaurant-Website-UI-Design--Community-?node-id=0-1&t=6fFiP9DJLS83e11K-1'
    }
  ],
  experiences: [
    {
      id: '1',
      company: 'IDEM Studio',
      role: 'Founder & CEO',
      duration: '2026 - current',
      desc: 'Founder of Idem Studio, creating modern digital experiences through design, development, AI, and automation from concept to high-performance products.'
    },
    {
      id: '2',
      company: 'HEProAI',
      role: 'Cloud Engineer',
      duration: 'Nov 2025 - Jan 2026',
      desc: 'Architected scalable AWS environments and automated security protocols for high-availability applications.'
    },
    {
      id: '3',
      company: 'Pinnacle Infotech',
      role: 'Cloud Engineer',
      duration: 'June 2024 - Aug 2024',
      desc: 'Deployed enterprise infrastructure using CloudFormation and boosted deployment velocity by 50%.'
    }
  ],
  skills: [
    { name: 'React', category: 'Frontend Framework', icon: 'Code2', bg: 'bg-[#61dafb]', color: 'text-black' },
    { name: 'Node.js', category: 'Backend Engineering', icon: 'Server', bg: 'bg-[#339933]', color: 'text-white' },
    { name: 'Tailwind CSS', category: 'Styling Framework', icon: 'Layout', bg: 'bg-[#38bdf8]', color: 'text-white' },
    { name: 'Figma', category: 'UI/UX Design', icon: 'Palette', bg: 'bg-zinc-900 dark:bg-zinc-100', color: 'text-white dark:text-black' },
    { name: 'Product Design', category: 'Strategy & UX', icon: 'Layers', bg: 'bg-foreground', color: 'text-background' },
    { name: 'Graphics Design', category: 'Visual Identity', icon: 'Cpu', bg: 'bg-[#ff007f]', color: 'text-white' },
    { name: 'AWS', category: 'Cloud Infrastructure', icon: 'Cloud', bg: 'bg-[#232F3E]', color: 'text-white' },
    { name: 'Firebase', category: 'Backend Services', icon: 'Database', bg: 'bg-[#ffca28]', color: 'text-black' },
    { name: 'Python', category: 'Backend / Scripting', icon: 'Terminal', bg: 'bg-[#3776ab]', color: 'text-white' },
    { name: 'MongoDB', category: 'Database', icon: 'Database', bg: 'bg-[#47a248]', color: 'text-white' },
    { name: 'Git & GitHub', category: 'Version Control', icon: 'GitBranch', bg: 'bg-[#181717]', color: 'text-white' },
    { name: 'Canva', category: 'Design Software', icon: 'Palette', bg: 'bg-[#00c4cc]', color: 'text-white' },
    { name: 'Java', category: 'Programming', icon: 'FileCode', bg: 'bg-[#5382a1]', color: 'text-white' },
    { name: 'HTML & CSS', category: 'Web Foundation', icon: 'Code2', bg: 'bg-[#e34f26]', color: 'text-white' }
  ],
  contact: {
    location: 'DHAKA, BANGLADESH',
    email: 'adinahawaldar895@gmail.com',
    linkedin: 'https://linkedin.com/in/adina-hawaldar-17az6',
    github: 'https://github.com/adinahawaldar',
    figma: 'https://figma.com/@adinahawaldar',
    twitter: 'https://twitter.com/@adina_hawaldar',
    githubUsername: 'adinahawaldar',
    officeImageUrl: '/assets/professional_office.png'
  }
};

export const PortfolioProvider = ({ children }) => {
  const [data, setData] = useState(defaultData);
  const [loading, setLoading] = useState(true);

  const refreshData = async () => {
    try {
      setLoading(true);
      const res = await fetchPortfolioData();
      if (res && res.profile) {
        setData({
          profile: { ...defaultData.profile, ...res.profile },
          projects: res.projects?.length ? res.projects : defaultData.projects,
          experiences: res.experiences?.length ? res.experiences : defaultData.experiences,
          skills: res.skills?.length ? res.skills : defaultData.skills,
          contact: res.contact ? { ...defaultData.contact, ...res.contact } : defaultData.contact,
        });
      }
    } catch (err) {
      console.warn('Backend API unreachable. Serving fallback portfolio data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <PortfolioContext.Provider value={{ data, setData, refreshData, loading }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => useContext(PortfolioContext);
