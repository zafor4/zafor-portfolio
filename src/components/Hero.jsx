import React from 'react';
import { motion } from 'framer-motion';

export const Hero = () => {
  return (
    <section id="about" className="relative pt-32 pb-20 md:pt-40 md:pb-32 bg-background overflow-hidden min-h-screen flex flex-col justify-between">
      <div className="max-w-[1800px] w-full mx-auto px-4 md:px-6 lg:px-10 flex-1 flex flex-col justify-center">
        
        {/* Main Display Name */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center my-8 md:my-16"
        >
          <h1 className="text-[13vw] sm:text-[14vw] lg:text-[14.5vw] font-bold leading-[0.85] tracking-tight uppercase text-foreground select-none">
            ADINA HAWALDAR
          </h1>
        </motion.div>

        {/* Info Grid Bar */}
        <div className="border-t border-foreground/15 pt-6 pb-12 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm md:text-base font-medium text-foreground/80">
          <div className="text-left">
            <span>Cloud Engineer &</span><br />
            <span>Full-Stack Developer</span>
          </div>
          <div className="text-center">
            <span>Based in</span><br />
            <span className="font-semibold text-foreground">Navi Mumbai, India</span>
          </div>
          <div className="text-right">
            <span>Working</span><br />
            <span>Globally</span>
          </div>
        </div>

        {/* Bio Intro Statement */}
        <motion.div
          initial={{ y: 40, opacity: 0, filter: 'blur(10px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 md:mt-16 max-w-5xl mx-auto text-center px-2 sm:px-4"
        >
          <p className="text-xl sm:text-2xl md:text-4xl lg:text-[42px] font-medium leading-[1.25] tracking-tight text-foreground">
            [A product-focused Designer, Developer &{' '}
            <a
              href="https://www.idemstudio.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="group text-zinc-600 dark:text-zinc-300 hover:text-foreground underline decoration-zinc-400 hover:decoration-foreground underline-offset-4 md:underline-offset-8 transition-all duration-300 inline-flex items-center"
            >
              Founder
              <svg
                width="0.7em"
                height="0.7em"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="inline-block ml-1 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
              >
                <path d="M7 17l9.2-9.2M17 17V7H7" />
              </svg>
            </a>
            {' '}from India, building high-performance digital experiences where modern design meets scalable technology, cloud innovation, and intelligent solutions.]
          </p>
        </motion.div>

        {/* CTA Badges */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.6, ease: 'easeOut' }}
          className="mt-12 md:mt-20 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-foreground/20 rounded-full hover:bg-foreground hover:text-background transition-colors duration-300 cursor-pointer group text-xs sm:text-sm font-medium">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span>Available for work</span>
          </div>

          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2 border border-foreground/20 rounded-full hover:bg-foreground hover:text-background transition-colors duration-300 text-xs sm:text-sm font-medium"
          >
            <span>Resume / CV</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M7 17l9.2-9.2M17 17V7H7" />
            </svg>
          </a>
        </motion.div>

      </div>
    </section>
  );
};
