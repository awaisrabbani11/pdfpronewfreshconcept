
import React from 'react';

export const Hero: React.FC = () => {
    return (
        <section className="bg-gradient-to-b from-white to-[#f8f8fa] dark:from-gray-900 dark:to-gray-900 py-20 sm:py-28 text-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-gray-100 leading-tight">
                    Every tool you need to work with PDFs in one place
                </h2>
                <p className="mt-6 max-w-3xl mx-auto text-lg sm:text-xl text-gray-600 dark:text-gray-400">
                    Completely free, secure, and easy to use. Convert, merge, split, and edit your PDF files without ever leaving your browser.
                </p>
            </div>
        </section>
    );
};
