
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
    const [librariesLoaded, setLibrariesLoaded] = useState(false);
    const [libraryLoadError, setLibraryLoadError] = useState<string | null>(null);

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
    
    // Check for required libraries before rendering the app
    useEffect(() => {
        const requiredLibs: (keyof Window)[] = ['pdfLib', 'pdfjsLib', 'Tesseract', 'html2pdf', 'mammoth', 'XLSX', 'pptxgen', 'fabric', 'JSZip', 'Tiff'];
        let checks = 0;
        const maxChecks = 100; // 10 seconds timeout (100 * 100ms)

        const intervalId = setInterval(() => {
            const allLoaded = requiredLibs.every(lib => window[lib]);

            if (allLoaded) {
                // Once all libs are loaded, configure pdf.js worker
                if (window.pdfjsLib) {
                    window.pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js`;
                }
                setLibrariesLoaded(true);
                clearInterval(intervalId);
            } else if (checks > maxChecks) {
                const missing = requiredLibs.filter(lib => !window[lib]);
                setLibraryLoadError(`Failed to load essential libraries: ${missing.join(', ')}. Please check your network and refresh the page.`);
                clearInterval(intervalId);
            }
            checks++;
        }, 100);

        return () => clearInterval(intervalId);
    }, []);

    if (libraryLoadError) {
        return (
            <div className="flex items-center justify-center h-screen bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300 p-4">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-2">Application Error</h1>
                    <p>{libraryLoadError}</p>
                </div>
            </div>
        );
    }

    if (!librariesLoaded) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-200">Initializing PDF Tools...</p>
                </div>
            </div>
        );
    }

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
