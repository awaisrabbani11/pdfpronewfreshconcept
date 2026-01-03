
import React from 'react';

export const ArticleSection: React.FC = () => {
    return (
        <section id="about" className="bg-white dark:bg-gray-800 py-16 sm:py-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose lg:prose-xl dark:prose-invert">
                <h2>Why PDF Tools are Essential in the Digital Age</h2>
                <p>
                    In today's fast-paced digital environment, the Portable Document Format (PDF) has become the standard for sharing and archiving documents. Its ability to preserve formatting across different devices and operating systems makes it indispensable. However, working with PDFs can often be challenging. That's where <strong>PDFPRO.PRO</strong> comes in. We provide a complete suite of free, browser-based tools to make your PDF management seamless and secure.
                </p>
                <h3>Your All-in-One, Secure PDF Solution</h3>
                <p>
                    Privacy is our top priority. Unlike other online services, we process all your files directly in your browser. This means your sensitive documents are never uploaded to a server, giving you complete peace of mind. Whether you need to combine reports, extract specific pages, or prepare a document for signing, our tools are designed for efficiency and ease of use.
                </p>
                <ul>
                    <li><strong>Merge PDF:</strong> Combine multiple PDF files into a single, organized document. Perfect for compiling reports, presentations, or portfolios.</li>
                    <li><strong>Split PDF:</strong> Extract a specific range of pages, or save each page as a separate PDF. Ideal for breaking up large documents.</li>
                    <li><strong>Compress PDF:</strong> Reduce the file size of your PDFs without sacrificing quality, making them easier to email and share.</li>
                    <li><strong>Convert to and from PDF:</strong> Effortlessly convert Word, PowerPoint, Excel, and JPG files to PDF, and vice-versa. Our powerful converters maintain your original formatting as closely as possible.</li>
                    <li><strong>Edit & Sign PDF:</strong> Make quick edits, add text, highlight content, or draw your signature directly on your PDF. Our intuitive editor gives you the power to modify documents on the fly.</li>
                </ul>
            </div>
        </section>
    );
};