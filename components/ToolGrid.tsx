
import React, { useEffect, useRef } from 'react';
import type { Tool } from '../types';

interface ToolGridProps {
    tools: Tool[];
    onToolSelect: (tool: Tool) => void;
}

const ToolCard: React.FC<{ tool: Tool; onSelect: () => void }> = ({ tool, onSelect }) => {
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-reveal');
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.1 }
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => {
            if (cardRef.current) {
                observer.unobserve(cardRef.current);
            }
        };
    }, []);

    return (
        <div
            ref={cardRef}
            onClick={onSelect}
            className="reveal-target group relative bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-2xl dark:hover:shadow-red-900/40 hover:-translate-y-2 border border-gray-200 dark:border-gray-700 hover:border-red-500 transition-all duration-300 cursor-pointer flex flex-col items-center text-center"
        >
            {tool.new && (
                 <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">NEW!</span>
            )}
            <div className="w-16 h-16 mb-4">{tool.icon}</div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">{tool.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 flex-grow">{tool.desc}</p>
        </div>
    );
};

export const ToolGrid: React.FC<ToolGridProps> = ({ tools, onToolSelect }) => {
    return (
        <section id="tools" className="py-16 sm:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <style>{`
                    .reveal-target {
                        opacity: 0;
                        transform: translateY(20px);
                        transition: opacity 0.6s ease-out, transform 0.6s ease-out;
                    }
                    .animate-reveal {
                        opacity: 1;
                        transform: translateY(0);
                    }
                `}</style>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {tools.map((tool) => (
                        <ToolCard key={tool.id} tool={tool} onSelect={() => onToolSelect(tool)} />
                    ))}
                </div>
            </div>
        </section>
    );
};
