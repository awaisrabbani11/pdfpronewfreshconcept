
import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer id="contact" className="bg-gray-800 dark:bg-black text-white">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-1">
                        <h3 className="text-xl font-bold mb-4">About PDFPRO.PRO</h3>
                        <p className="text-gray-400 text-sm">
                            Your free, secure, and simple solution for all PDF-related tasks. Process files directly in your browser without uploading anything.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Tools</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#tools" className="text-gray-400 hover:text-white">Merge PDF</a></li>
                            <li><a href="#tools" className="text-gray-400 hover:text-white">Split PDF</a></li>
                            <li><a href="#tools" className="text-gray-400 hover:text-white">Compress PDF</a></li>
                            <li><a href="#tools" className="text-gray-400 hover:text-white">Convert PDF</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Company</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Contact</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="mailto:contact@pdfpro.pro" className="text-gray-400 hover:text-white">contact@pdfpro.pro</a></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
                    <p>&copy; 2024 PDFPRO.PRO. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
};
