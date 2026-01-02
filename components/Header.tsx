
import React, { useState, useEffect } from 'react';

const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
);


interface HeaderProps {
    theme: string;
    toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', href: '#' },
        { name: 'All Tools', href: '#tools' },
        { name: 'About Us', href: '#about' },
        { name: 'Contact Us', href: '#contact' },
    ];

    return (
        <>
            <header className={`sticky top-0 z-40 transition-shadow duration-300 bg-red-600 dark:bg-red-800 ${isScrolled ? 'shadow-lg bg-red-600/90 dark:bg-red-800/90 backdrop-blur-md' : ''}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <a href="#" className="flex-shrink-0">
                            <h1 className="text-2xl font-bold text-white">One Page Tools</h1>
                        </a>
                        <div className="flex items-center">
                            <nav className="hidden md:flex md:items-center md:space-x-8">
                                {navLinks.map((link) => (
                                    <a key={link.name} href={link.href} className="text-red-100 hover:text-white transition duration-150 ease-in-out font-medium">
                                        {link.name}
                                    </a>
                                ))}
                            </nav>
                            <button onClick={toggleTheme} className="ml-6 text-red-200 hover:text-white focus:outline-none transition-colors duration-200">
                                {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                            </button>
                            <div className="md:hidden ml-4">
                                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="z-50 hamburger-menu focus:outline-none">
                                    <div className={`w-6 h-0.5 bg-white transition-transform duration-300 ${isMenuOpen ? 'rotate-45 translate-y-[7px]' : ''}`}></div>
                                    <div className={`w-6 h-0.5 bg-white my-1.5 transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></div>
                                    <div className={`w-6 h-0.5 bg-white transition-transform duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`}></div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu */}
            <div className={`fixed inset-0 bg-red-600 dark:bg-red-800 z-30 transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out md:hidden`}>
                <div className="flex flex-col items-center justify-center h-full space-y-8">
                    {navLinks.map((link) => (
                        <a key={link.name} href={link.href} onClick={() => setIsMenuOpen(false)} className="text-3xl font-semibold text-white hover:text-red-200 transition-colors duration-200">
                            {link.name}
                        </a>
                    ))}
                </div>
            </div>
        </>
    );
};
