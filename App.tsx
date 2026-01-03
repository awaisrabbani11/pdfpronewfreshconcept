
import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ToolGrid } from './components/ToolGrid';
import { ArticleSection } from './components/ArticleSection';
import { Footer } from './components/Footer';
import { ToolModal } from './components/ToolModal';
import { tools } from './constants/tools';
import type { Tool } from './types';

const App: React.FC = () => {
    const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    const handleToolSelect = useCallback((tool: Tool) => {
        setSelectedTool(tool);
        setIsModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        // Delay clearing the tool to allow for modal close animation
        setTimeout(() => setSelectedTool(null), 300);
    }, []);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                closeModal();
            }
        };

        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isModalOpen, closeModal]);
    
    useEffect(() => {
      // Set pdf.js worker source
      if (window.pdfjsLib) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js`;
      }
    }, []);

    return (
        <div className="bg-[#f8f8fa] dark:bg-gray-900">
            <Header theme={theme} toggleTheme={toggleTheme} />
            <main>
                <Hero />
                <div className="my-8 text-center">
                    <div className="inline-block w-[728px] max-w-full h-[90px] border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800">
                        Advertisement (728x90)
                    </div>
                </div>
                <ToolGrid tools={tools} onToolSelect={handleToolSelect} />
                <ArticleSection />
            </main>
            <Footer />
            {isModalOpen && selectedTool && (
                <ToolModal
                    tool={selectedTool}
                    isOpen={isModalOpen}
                    onClose={closeModal}
                />
            )}
        </div>
    );
};

export default App;
