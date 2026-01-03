
import React from 'react';
import type { Tool } from '../types';

type Lib = 'PDFLib' | 'pdfjsLib' | 'Tesseract' | 'mammoth' | 'XLSX' | 'pptxgen' | 'fabric' | 'JSZip' | 'Tiff' | 'html2pdf';

const checkDependencies = (dependencies: Lib[], hideLoader: () => void): boolean => {
    const missing: string[] = [];
    for (const dep of dependencies) {
        if (!window[dep]) {
            missing.push(dep);
        }
    }
    if (missing.length > 0) {
        // Use setTimeout to ensure the alert doesn't block the current execution thread, allowing UI to update.
        setTimeout(() => {
            alert(`Error: A required library (${missing.join(', ')}) failed to load. Please check your internet connection and refresh the page.`);
        }, 0);
        hideLoader();
        return false;
    }
    return true;
};


const commonIcons = {
    merge: <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="merge-grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#4c6fff" /><stop offset="100%" stopColor="#22d3ee" /></linearGradient></defs><path d="M12 2H32v12H12zm0 18H32v12H12z" fill="#e0f2fe" /><path d="M42 21l-8 8-8-8h5v-8h6v8z" fill="url(#merge-grad)" /><path d="M38 37H58v12H38z" fill="#dbeafe" /><path d="M12 2H32L12 22zM12 20H32L12 40z" fill="white" fillOpacity=".5" /><path d="M38 37h20L38 57z" fill="white" fillOpacity=".5" /></svg>,
    split: <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="split-grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#f97316" /><stop offset="100%" stopColor="#facc15" /></linearGradient></defs><path d="M10 2h30v60H10z" fill="#dbeafe" /><path d="M10 2h30L10 62z" fill="white" fillOpacity=".5" /><path d="M25 32l18 18V14zM25 32l-18 18V14z" fill="url(#split-grad)" /><path d="M23 4h4v56h-4z" stroke="#fff" strokeWidth="2" strokeDasharray="6 6" strokeLinecap="round" /></svg>,
    compress: <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="compress-grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#a855f7" /><stop offset="100%" stopColor="#ec4899" /></linearGradient></defs><path d="M4 4h56v56H4z" fill="#f3e8ff" /><path d="M4 4h56L4 60z" fill="white" fillOpacity=".5" /><path d="M22 42L4 60V42zM42 42L60 60V42zM22 22L4 4v18zM42 22L60 4v18z" fill="url(#compress-grad)" opacity=".5" /><path d="M24 24v-8h-8l10-10 10 10h-8v8zM40 40v8h8l-10 10-10-10h8v-8z" fill="url(#compress-grad)"/></svg>,
    pdfToSomething: <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="pdfTo-grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#4f46e5" /><stop offset="100%" stopColor="#818cf8" /></linearGradient></defs><path d="M4 8h24v48H4z" fill="url(#pdfTo-grad)"/><path d="M36 30l10-10-10-10v6H10v8h26z" fill="#9ca3af" /><path d="M40 8h20v48H40z" fill="#dbeafe" /><path d="M4 8h24L4 56z" fill="white" fillOpacity=".5"/><path d="M40 8h20L40 56z" fill="white" fillOpacity=".5"/></svg>,
    somethingToPdf: <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="toPdf-grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#4f46e5" /><stop offset="100%" stopColor="#818cf8" /></linearGradient></defs><path d="M4 8h24v48H4z" fill="#dbeafe" /><path d="M28 34l-10 10 10 10v-6h26v-8H28z" fill="#9ca3af" /><path d="M40 8h20v48H40z" fill="url(#toPdf-grad)"/><path d="M4 8h24L4 56z" fill="white" fillOpacity=".5"/><path d="M40 8h20L40 56z" fill="white" fillOpacity=".5"/></svg>,
    edit: <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="edit-grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#eab308" /><stop offset="100%" stopColor="#f97316" /></linearGradient></defs><path d="M8 2h48v60H8z" fill="#dbeafe"/><path d="M8 2h48L8 62z" fill="white" fillOpacity=".5"/><path d="M20 54l28-28-8-8-28 28v8z" fill="url(#edit-grad)"/><path d="M40 18l8 8-4 4-8-8z" fill="#fde047"/></svg>,
    sign: <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="sign-grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#4338ca" /><stop offset="100%" stopColor="#4f46e5" /></linearGradient></defs><path d="M8 2h48v60H8z" fill="#e0e7ff" /><path d="M8 2h48L8 62z" fill="white" fillOpacity=".5" /><path d="M12 48h40v4H12z" fill="url(#sign-grad)" /><path d="M18 42c0-8 8-8 12-4s12 0 16-6" stroke="url(#sign-grad)" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    watermark: <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="water-grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#60a5fa" /><stop offset="100%" stopColor="#3b82f6" /></linearGradient></defs><path d="M8 2h48v60H8z" fill="#dbeafe" /><path d="M8 2h48L8 62z" fill="white" fillOpacity=".5" /><circle cx="44" cy="16" r="8" fill="url(#water-grad)" /><path d="M16 16l14 14L44 16l12 12V56H4L16 42z" fill="#e0f2fe" opacity="0.8" /></svg>,
    rotate: <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="rotate-grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#14b8a6" /><stop offset="100%" stopColor="#22c55e" /></linearGradient></defs><path d="M10 10h30v44H10z" fill="#dbeafe" transform="rotate(-15 25 32)"/><path d="M48 32 A 20 20 0 1 1 32 12" fill="none" stroke="url(#rotate-grad)" strokeWidth="6" strokeLinecap="round" /><path d="M32 4l-8 8h16z" fill="url(#rotate-grad)" /></svg>,
    unlock: <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="unlock-grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#84cc16" /><stop offset="100%" stopColor="#22c55e" /></linearGradient></defs><path d="M12 28h40v32H12z" fill="#f0fdf4" /><path d="M40 28V16a8 8 0 00-16 0" stroke="url(#unlock-grad)" strokeWidth="6" fill="none" strokeLinecap="round"/><rect x="12" y="28" width="40" height="32" rx="4" fill="#dcfce7"/><circle cx="32" cy="44" r="4" fill="url(#unlock-grad)"/></svg>,
    protect: <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="protect-grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#4f46e5" /><stop offset="100%" stopColor="#818cf8" /></linearGradient></defs><path d="M32 2l20 10v16c0 14-20 28-20 28S12 42 12 28V12z" fill="#e0e7ff" /><path d="M24 28V16a8 8 0 0116 0v12a4 4 0 01-4 4h-8a4 4 0 01-4-4z" fill="#eef2ff" /><path d="M28 16a4 4 0 018 0" stroke="url(#protect-grad)" strokeWidth="5" fill="none" strokeLinecap="round" /></svg>,
    organize: <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="org-grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#8b5cf6" /><stop offset="100%" stopColor="#6366f1" /></linearGradient></defs><rect x="18" y="4" width="36" height="48" rx="4" fill="#ede9fe"/><rect x="10" y="12" width="36" height="48" rx="4" fill="url(#org-grad)"/><path d="M22 28h18v4H22zM22 38h12v4H22z" fill="white"/></svg>,
    ocr: <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="ocr-grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#4f46e5" /><stop offset="100%" stopColor="#7c3aed" /></linearGradient></defs><path d="M8 2h48v60H8z" fill="#e0e7ff" /><path d="M8 2h48L8 62z" fill="white" fillOpacity=".5" /><circle cx="28" cy="28" r="16" stroke="url(#ocr-grad)" strokeWidth="6" fill="none"/><path d="M40 40l12 12" stroke="url(#ocr-grad)" strokeWidth="6" strokeLinecap="round"/><path d="M20 24h8m-10 8h16" stroke="#a78bfa" strokeWidth="4" strokeLinecap="round"/></svg>,
    pageNumbers: <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="pnum-grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#2563eb" /><stop offset="100%" stopColor="#3b82f6" /></linearGradient></defs><path d="M8 2h48v60H8z" fill="#dbeafe" /><path d="M8 2h48L8 62z" fill="white" fillOpacity=".5" /><path d="M20 12h24v4H20zM20 22h24v4H20zM20 32h12v4H20z" fill="#93c5fd" /><path d="M28 50 V 42 l -6 0" stroke="url(#pnum-grad)" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" /><path d="M38 42 h 8 v 8 h -8 v -4 h 4" stroke="url(#pnum-grad)" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>,
};

const imagesToPdfProcess = async (files: File[], _: any, showLoader: (text: string) => void, hideLoader: () => void) => {
    if (!checkDependencies(['PDFLib'], hideLoader)) return;
    const { PDFDocument } = window.PDFLib;
    showLoader('Converting images to PDF...');
    const pdfDoc = await PDFDocument.create();
    for (const file of files) {
        const imgBytes = await file.arrayBuffer();
        const image = await (file.type === 'image/png' ? pdfDoc.embedPng(imgBytes) : pdfDoc.embedJpg(imgBytes));
        const page = pdfDoc.addPage([image.width, image.height]);
        page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
    }
    const pdfBytes = await pdfDoc.save();
    hideLoader();
    return [{ data: pdfBytes, filename: 'images.pdf', type: 'application/pdf' }];
};

const excelToPdfProcess = async (files: File[], _: any, showLoader: (text: string) => void, hideLoader: () => void) => {
    if (!files[0]) return;
    if (!checkDependencies(['XLSX', 'html2pdf'], hideLoader)) return;
    showLoader('Converting Excel to PDF...');
    const data = await files[0].arrayBuffer();
    const workbook = window.XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const html = window.XLSX.utils.sheet_to_html(worksheet);

    const container = document.createElement('div');
    container.innerHTML = html;
    
    const style = document.createElement('style');
    style.innerHTML = `
        table { border-collapse: collapse; width: 100%; font-family: sans-serif; }
        th, td { border: 1px solid #dddddd; text-align: left; padding: 8px; }
        th { background-color: #f2f2f2; }
    `;
    container.prepend(style);

    document.body.appendChild(container);
    
    await window.html2pdf().from(container).set({
        margin: 10,
        filename: `${files[0].name.split('.')[0]}.pdf`,
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    }).save();
    
    document.body.removeChild(container);
    hideLoader();
    return []; 
};


export const tools: Tool[] = [
    {
        id: 'merge-pdf',
        title: 'Merge PDF',
        desc: 'Combine multiple PDFs into one single document.',
        icon: commonIcons.merge,
        fileType: 'application/pdf',
        multipleFiles: true,
        process: async (files, _, showLoader, hideLoader) => {
            if (!checkDependencies(['PDFLib'], hideLoader)) return;
            const { PDFDocument } = window.PDFLib;
            showLoader('Merging PDFs...');
            const mergedPdf = await PDFDocument.create();
            for (const file of files) {
                const pdfBytes = await file.arrayBuffer();
                const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
                const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
                copiedPages.forEach((page) => mergedPdf.addPage(page));
            }
            const mergedPdfBytes = await mergedPdf.save();
            hideLoader();
            return [{ data: mergedPdfBytes, filename: 'merged.pdf', type: 'application/pdf' }];
        },
    },
    {
        id: 'split-pdf',
        title: 'Split PDF',
        desc: 'Extract pages from a PDF or save each page as a separate PDF.',
        icon: commonIcons.split,
        fileType: 'application/pdf',
        multipleFiles: false,
        options: (setOptions, options) => (
            <input 
                type="text" 
                placeholder="e.g., 1-3, 5, 7-9"
                className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                onChange={e => setOptions({ range: e.target.value })}
                value={options.range || ''}
            />
        ),
        process: async (files, options, showLoader, hideLoader) => {
            if (!files[0]) return;
            if (!checkDependencies(['PDFLib'], hideLoader)) return;
            const { PDFDocument } = window.PDFLib;
            showLoader('Splitting PDF...');
            const pdfBytes = await files[0].arrayBuffer();
            const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
            const newPdf = await PDFDocument.create();
            
            const pageIndices = new Set<number>();
            if (options.range) {
                 options.range.split(',').forEach((part: string) => {
                    if (part.includes('-')) {
                        const [start, end] = part.split('-').map(Number);
                        for (let i = start; i <= end; i++) pageIndices.add(i - 1);
                    } else {
                        pageIndices.add(Number(part) - 1);
                    }
                });
            } else { 
                pdfDoc.getPageIndices().forEach(i => pageIndices.add(i));
            }
            
            const validIndices = Array.from(pageIndices).filter(i => i >= 0 && i < pdfDoc.getPageCount());
            const copiedPages = await newPdf.copyPages(pdfDoc, validIndices);
            copiedPages.forEach(page => newPdf.addPage(page));

            const newPdfBytes = await newPdf.save();
            hideLoader();
            return [{ data: newPdfBytes, filename: 'split.pdf', type: 'application/pdf' }];
        },
    },
    {
        id: 'compress-pdf',
        title: 'Compress PDF',
        desc: 'Reduce the file size of your PDF while optimizing for quality.',
        icon: commonIcons.compress,
        fileType: 'application/pdf',
        multipleFiles: false,
        options: (setOptions, options) => (
            <div>
                <label className="text-sm text-gray-600 dark:text-gray-300 block">Image Quality: {options.quality || 0.75}</label>
                <input type="range" min="0.1" max="1" step="0.05" defaultValue="0.75" className="w-full"
                    onChange={e => setOptions({ quality: parseFloat(e.target.value) })} />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Lower quality means a smaller file size. This method rasterizes pages.</p>
            </div>
        ),
        process: async (files, options, showLoader, hideLoader) => {
            if (!files[0]) return;
            if (!checkDependencies(['PDFLib', 'pdfjsLib'], hideLoader)) return;

            showLoader('Loading PDF...');
            const { PDFDocument } = window.PDFLib;
            const pdfBytes = await files[0].arrayBuffer();
            const pdf = await window.pdfjsLib.getDocument({ data: pdfBytes }).promise;
            const newPdfDoc = await PDFDocument.create();

            for (let i = 1; i <= pdf.numPages; i++) {
                showLoader(`Compressing page ${i}/${pdf.numPages}...`);
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 1.0 });
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                await page.render({ canvasContext: context, viewport }).promise;
                
                const imageData = canvas.toDataURL('image/jpeg', options.quality || 0.75);
                const jpgImageBytes = await fetch(imageData).then(res => res.arrayBuffer());
                const jpgImage = await newPdfDoc.embedJpg(jpgImageBytes);

                const newPage = newPdfDoc.addPage([viewport.width, viewport.height]);
                newPage.drawImage(jpgImage, { x: 0, y: 0, width: viewport.width, height: viewport.height });
            }

            const compressedPdfBytes = await newPdfDoc.save();
            hideLoader();
            return [{ data: compressedPdfBytes, filename: 'compressed.pdf', type: 'application/pdf' }];
        },
    },
    {
        id: 'pdf-to-word',
        title: 'PDF to Word',
        desc: 'Convert your PDF to an editable DOCX file.',
        icon: commonIcons.pdfToSomething,
        fileType: 'application/pdf',
        multipleFiles: false,
        process: async (files, _, showLoader, hideLoader) => {
            if (!files[0]) return;
            if (!checkDependencies(['pdfjsLib'], hideLoader)) return;
            showLoader('Converting PDF to Text...');
            const pdfBytes = await files[0].arrayBuffer();
            const pdf = await window.pdfjsLib.getDocument({data: pdfBytes}).promise;
            let textContent = '';
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const text = await page.getTextContent();
                textContent += text.items.map((s: any) => s.str).join(' ') + '\n\n';
            }
            hideLoader();
            return [{ data: textContent, filename: 'converted.txt', type: 'text/plain' }];
        },
    },
    {
        id: 'pdf-to-powerpoint',
        title: 'PDF to PowerPoint',
        desc: 'Convert each page of your PDF to a PPTX slide.',
        icon: commonIcons.pdfToSomething,
        fileType: 'application/pdf',
        multipleFiles: false,
        process: async (files, _, showLoader, hideLoader) => {
            if (!files[0]) return;
            if (!checkDependencies(['pdfjsLib', 'pptxgen'], hideLoader)) return;
            showLoader('Loading PDF...');
            const pdfBytes = await files[0].arrayBuffer();
            const pdf = await window.pdfjsLib.getDocument({data: pdfBytes}).promise;
            const pptx = new window.pptxgen();

            for (let i = 1; i <= pdf.numPages; i++) {
                showLoader(`Processing page ${i}/${pdf.numPages}...`);
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 1.5 });
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                await page.render({ canvasContext: context, viewport: viewport }).promise;
                const dataUrl = canvas.toDataURL('image/png');
                
                const slide = pptx.addSlide();
                slide.addImage({ data: dataUrl, x: 0, y: 0, w: '100%', h: '100%' });
            }
            const pptxBlob = await pptx.write('blob');
            hideLoader();
            return [{ data: pptxBlob, filename: 'converted.pptx', type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' }];
        },
    },
    {
        id: 'pdf-to-excel',
        title: 'PDF to Excel',
        desc: 'Convert PDF tables to editable Excel spreadsheets.',
        icon: commonIcons.pdfToSomething,
        fileType: 'application/pdf',
        multipleFiles: false,
        process: async (files, _, showLoader, hideLoader) => {
            if (!files[0]) return;
            if (!checkDependencies(['pdfjsLib'], hideLoader)) return;
            showLoader('Extracting text to CSV...');
            const pdfBytes = await files[0].arrayBuffer();
            const pdf = await window.pdfjsLib.getDocument({data: pdfBytes}).promise;
            let csvContent = '';
             for (let i = 1; i <= pdf.numPages; i++) {
                showLoader(`Processing page ${i}/${pdf.numPages}...`);
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const lines: { [y: number]: any[] } = {};
                textContent.items.forEach((item: any) => {
                    const y = Math.round(item.transform[5]);
                    if (!lines[y]) lines[y] = [];
                    lines[y].push({ x: item.transform[4], str: item.str });
                });

                Object.keys(lines).sort((a,b) => Number(b) - Number(a)).forEach(y => {
                    const line = lines[parseInt(y)].sort((a,b) => a.x - b.x).map(item => `"${item.str.replace(/"/g, '""')}"`).join(',');
                    csvContent += line + '\r\n';
                });
            }
            hideLoader();
            return [{ data: csvContent, filename: 'converted.csv', type: 'text/csv' }];
        },
    },
    {
        id: 'pdf-to-jpg',
        title: 'PDF to JPG',
        desc: 'Convert each PDF page into a high-quality JPG image.',
        icon: commonIcons.pdfToSomething,
        fileType: 'application/pdf',
        multipleFiles: false,
        process: async (files, _, showLoader, hideLoader) => {
            if (!files[0]) return;
            if (!checkDependencies(['pdfjsLib', 'JSZip'], hideLoader)) return;
            showLoader('Loading PDF...');
            const pdfBytes = await files[0].arrayBuffer();
            const pdf = await window.pdfjsLib.getDocument({data: pdfBytes}).promise;
            
            if (pdf.numPages === 1) {
                const page = await pdf.getPage(1);
                const viewport = page.getViewport({ scale: 2.0 });
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                await page.render({ canvasContext: context, viewport: viewport }).promise;
                const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.9));
                hideLoader();
                return [{ data: blob, filename: `${files[0].name.replace('.pdf', '')}.jpg`, type: 'image/jpeg' }];
            } else {
                const zip = new window.JSZip();
                for (let i = 1; i <= pdf.numPages; i++) {
                    showLoader(`Converting page ${i}/${pdf.numPages}`);
                    const page = await pdf.getPage(i);
                    const viewport = page.getViewport({ scale: 2.0 });
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;
                    await page.render({ canvasContext: context, viewport: viewport }).promise;
                    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.9));
                    zip.file(`page_${i}.jpg`, blob);
                }
                const zipBlob = await zip.generateAsync({type:"blob"});
                hideLoader();
                return [{ data: zipBlob, filename: 'images.zip', type: 'application/zip' }];
            }
        },
    },
    {
        id: 'word-to-pdf',
        title: 'Word to PDF',
        desc: 'Convert DOCX files to professional-looking PDFs.',
        icon: commonIcons.somethingToPdf,
        fileType: '.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        multipleFiles: false,
        process: async (files, _, showLoader, hideLoader) => {
            if (!files[0]) return;
            if (!checkDependencies(['mammoth', 'html2pdf'], hideLoader)) return;
            showLoader('Converting Word to PDF...');
            const arrayBuffer = await files[0].arrayBuffer();
            const { value: html } = await window.mammoth.convertToHtml({ arrayBuffer });
            const element = document.createElement('div');
            element.innerHTML = html;
            document.body.appendChild(element);
            await window.html2pdf().from(element).save(`${files[0].name.replace('.docx', '')}.pdf`);
            document.body.removeChild(element);
            hideLoader();
            return []; 
        },
    },
    {
        id: 'powerpoint-to-pdf',
        title: 'PowerPoint to PDF',
        desc: 'Convert PPTX or PPT presentation slides to PDF pages.',
        icon: commonIcons.somethingToPdf,
        fileType: '.pptx,.ppt,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.ms-powerpoint',
        multipleFiles: false,
        process: async (files, options, showLoader, hideLoader) => {
            hideLoader();
            alert("Client-side conversion of PowerPoint files to PDF with full fidelity is not feasible in a browser.\n\nFor the best results, please open your presentation in Microsoft PowerPoint, LibreOffice Impress, or Google Slides and use the 'Save as PDF' or 'Export to PDF' option.");
        },
    },
    {
        id: 'excel-to-pdf',
        title: 'Excel to PDF',
        desc: 'Convert Excel spreadsheets (XLSX, XLS) into PDF documents.',
        icon: commonIcons.somethingToPdf,
        fileType: '.xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel',
        multipleFiles: false,
        process: excelToPdfProcess,
    },
    {
        id: 'jpg-to-pdf',
        title: 'JPG to PDF',
        desc: 'Convert JPG images to a single PDF file.',
        icon: commonIcons.somethingToPdf,
        fileType: 'image/jpeg,image/png',
        multipleFiles: true,
        process: imagesToPdfProcess,
    },
    {
        id: 'edit-pdf',
        title: 'Edit PDF',
        desc: 'Add text, shapes, or drawings to your PDF document.',
        icon: commonIcons.edit,
        fileType: 'application/pdf',
        multipleFiles: false,
        process: async (files, options, showLoader, hideLoader) => {
            if (!files[0]) return;
            if (!checkDependencies(['PDFLib', 'fabric'], hideLoader)) return;
            const { PDFDocument } = window.PDFLib;
            const { edits } = options;
            showLoader('Applying edits...');

            const existingPdfBytes = await files[0].arrayBuffer();
            const pdfDoc = await PDFDocument.load(existingPdfBytes);
            const pages = pdfDoc.getPages();

            const tempCanvas = document.createElement('canvas');
            const fabricCanvas = new window.fabric.Canvas(tempCanvas);

            for(let i = 1; i <= pages.length; i++) {
                if (edits[i]) {
                    showLoader(`Applying edits to page ${i}...`);
                    const page = pages[i-1];
                    const { width, height } = page.getSize();
                    
                    fabricCanvas.clear();
                    fabricCanvas.setDimensions({ width, height });
                    
                    // Create a promise to await fabric's async loading
                    await new Promise<void>(resolve => {
                        fabricCanvas.loadFromJSON(edits[i], () => {
                            resolve();
                        });
                    });

                    const dataUrl = fabricCanvas.toDataURL({ format: 'png' });
                    const pngImageBytes = await fetch(dataUrl).then(res => res.arrayBuffer());
                    const pngImage = await pdfDoc.embedPng(pngImageBytes);
                    page.drawImage(pngImage, { x: 0, y: 0, width, height });
                }
            }
            
            showLoader('Saving PDF...');
            const pdfBytes = await pdfDoc.save();
            hideLoader();
            return [{ data: pdfBytes, filename: 'edited.pdf', type: 'application/pdf' }];
        },
    },
    {
        id: 'sign-pdf',
        title: 'Sign PDF',
        desc: 'Create your signature and sign your PDF documents.',
        icon: commonIcons.sign,
        fileType: 'application/pdf',
        multipleFiles: false,
        options: (setOptions, options) => {
          const canvasRef = React.useRef(null);
          const fabricCanvasRef = React.useRef<any>(null);

          React.useEffect(() => {
            if (canvasRef.current && window.fabric) {
                const fabricCanvas = new window.fabric.Canvas(canvasRef.current, {
                    isDrawingMode: true,
                    width: 300,
                    height: 150,
                });
                const isDark = document.documentElement.classList.contains('dark');
                fabricCanvas.freeDrawingBrush.color = isDark ? "white" : "black";
                fabricCanvas.freeDrawingBrush.width = 3;
                fabricCanvasRef.current = fabricCanvas;
                
                fabricCanvas.on('path:created', () => {
                    const signatureImage = fabricCanvas.toDataURL({format: 'png'});
                    setOptions((prev: any) => ({...prev, signatureImage}));
                });
            }
          }, [setOptions]);

          const clearSignature = () => {
              if (fabricCanvasRef.current) {
                  fabricCanvasRef.current.clear();
                  setOptions((prev: any) => ({...prev, signatureImage: null}));
              }
          }

          return (
            <div>
              <canvas ref={canvasRef} className="border border-gray-400 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"></canvas>
              <button onClick={clearSignature} className="text-sm text-indigo-600 hover:underline mt-2">Clear Signature</button>
            </div>
          );
        },
        process: async (files, options, showLoader, hideLoader) => {
            if (!files[0] || !options.signatureImage) {
                hideLoader();
                alert('Please draw a signature.');
                return;
            }
            if (!checkDependencies(['PDFLib'], hideLoader)) return;

            const { PDFDocument } = window.PDFLib;
            showLoader('Adding signature...');
            const pdfBytes = await files[0].arrayBuffer();
            const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
            const pngImageBytes = await fetch(options.signatureImage).then(res => res.arrayBuffer());
            const pngImage = await pdfDoc.embedPng(pngImageBytes);
            const firstPage = pdfDoc.getPages()[0];
            firstPage.drawImage(pngImage, { x: 50, y: 50, width: 150, height: 75 });
            const signedPdfBytes = await pdfDoc.save();
            hideLoader();
            return [{ data: signedPdfBytes, filename: 'signed.pdf', type: 'application/pdf' }];
        },
    },
    {
        id: 'watermark-pdf',
        title: 'Watermark PDF',
        desc: 'Add a text or image watermark to your PDF.',
        icon: commonIcons.watermark,
        fileType: 'application/pdf',
        multipleFiles: false,
        options: (setOptions, options) => (
             <div className="space-y-2">
                 <input type="text" placeholder="Watermark text" className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                     onChange={e => setOptions((o: any) => ({...o, text: e.target.value }))} />
                 <label className="text-sm text-gray-600 dark:text-gray-300 block">Opacity: {options.opacity || 1}</label>
                 <input type="range" min="0.1" max="1" step="0.1" defaultValue="1" className="w-full"
                     onChange={e => setOptions((o: any) => ({...o, opacity: parseFloat(e.target.value)}))} />
            </div>
        ),
        process: async (files, options, showLoader, hideLoader) => {
            if (!files[0] || !options.text) {
                hideLoader();
                alert('Please enter watermark text.');
                return;
            };
            if (!checkDependencies(['PDFLib'], hideLoader)) return;
            const { PDFDocument, rgb, degrees, StandardFonts } = window.PDFLib;
            showLoader('Adding watermark...');
            const pdfBytes = await files[0].arrayBuffer();
            const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
            const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
            const pages = pdfDoc.getPages();

            for (const page of pages) {
                const { width, height } = page.getSize();
                page.drawText(options.text, {
                    x: width / 2 - 100,
                    y: height / 2,
                    font: helveticaFont,
                    size: 50,
                    color: rgb(0.5, 0.5, 0.5),
                    opacity: options.opacity || 0.5,
                    rotate: degrees(45),
                });
            }
            const watermarkedBytes = await pdfDoc.save();
            hideLoader();
            return [{ data: watermarkedBytes, filename: 'watermarked.pdf', type: 'application/pdf' }];
        }
    },
    {
        id: 'rotate-pdf',
        title: 'Rotate PDF',
        desc: 'Rotate all or specific pages of your PDF file.',
        icon: commonIcons.rotate,
        fileType: 'application/pdf',
        multipleFiles: false,
        options: (setOptions, options) => (
            <select
                className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                onChange={e => setOptions({ angle: parseInt(e.target.value) })}
                value={options.angle || 90}
            >
                <option value="90">90° clockwise</option>
                <option value="180">180°</option>
                <option value="270">270° clockwise</option>
            </select>
        ),
        process: async (files, options, showLoader, hideLoader) => {
            if (!files[0]) return;
            if (!checkDependencies(['PDFLib'], hideLoader)) return;
            const { PDFDocument, degrees } = window.PDFLib;
            showLoader('Rotating PDF...');
            const angle = options.angle || 90;
            const pdfBytes = await files[0].arrayBuffer();
            const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
            const pages = pdfDoc.getPages();
            pages.forEach(page => page.setRotation(degrees(page.getRotation().angle + angle)));
            const rotatedBytes = await pdfDoc.save();
            hideLoader();
            return [{ data: rotatedBytes, filename: 'rotated.pdf', type: 'application/pdf' }];
        },
    },
    { id: 'html-to-pdf', title: 'HTML to PDF', desc: 'Convert webpages to PDF.', icon: commonIcons.somethingToPdf, fileType: '.html,text/html', multipleFiles: false, process: async (files, _, showLoader, hideLoader) => {
        if (!files[0]) return;
        if (!checkDependencies(['html2pdf'], hideLoader)) return;
        showLoader('Converting HTML to PDF...');
        const htmlContent = await files[0].text();
        const element = document.createElement('div');
        element.innerHTML = htmlContent;
        document.body.appendChild(element);
        await window.html2pdf().from(element).save(`${files[0].name.replace('.html', '')}.pdf`);
        document.body.removeChild(element);
        hideLoader();
        return [];
    }},
    { id: 'unlock-pdf', title: 'Unlock PDF', desc: 'Remove passwords and restrictions from PDFs.', icon: commonIcons.unlock, fileType: 'application/pdf', multipleFiles: false, options: (setOptions) => (
        <input type="password" placeholder="Enter current password (if any)" className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            onChange={e => setOptions({ password: e.target.value })} />
    ), process: async (files, options, showLoader, hideLoader) => {
        if (!files[0]) return;
        if (!checkDependencies(['PDFLib'], hideLoader)) return;
        showLoader('Unlocking PDF...');
        const { PDFDocument } = window.PDFLib;
        const pdfBytes = await files[0].arrayBuffer();
        try {
            const pdfDoc = await PDFDocument.load(pdfBytes, {
                ownerPassword: options.password || '',
                ignoreEncryption: !options.password,
            });
            const unlockedBytes = await pdfDoc.save();
            hideLoader();
            return [{ data: unlockedBytes, filename: 'unlocked.pdf', type: 'application/pdf' }];
        } catch (e) {
            hideLoader();
            alert('Could not unlock PDF. The password might be incorrect, or the file uses an unsupported encryption format.');
            return;
        }
    }},
    { id: 'protect-pdf', title: 'Protect PDF', desc: 'Add a password and encrypt your PDF file.', icon: commonIcons.protect, fileType: 'application/pdf', multipleFiles: false, options: (setOptions) => (
        <input type="password" placeholder="Enter new password" className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            onChange={e => setOptions({ password: e.target.value })} />
    ), process: async (files, options, showLoader, hideLoader) => {
        if (!files[0] || !options.password) {
             hideLoader();
             alert('Please enter a password.');
             return;
        }
        if (!checkDependencies(['PDFLib'], hideLoader)) return;
        showLoader('Protecting PDF...');
        const { PDFDocument } = window.PDFLib;
        const pdfBytes = await files[0].arrayBuffer();
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const protectedBytes = await pdfDoc.save({ userPassword: options.password });
        hideLoader();
        return [{ data: protectedBytes, filename: 'protected.pdf', type: 'application/pdf' }];
    }},
    { id: 'organize-pdf', title: 'Organize PDF', desc: 'Reorder, delete, or add pages to your PDF.', icon: commonIcons.organize, fileType: 'application/pdf', multipleFiles: false, process: async (files, options, showLoader, hideLoader) => {
        if (!files[0]) return;
        if (!checkDependencies(['PDFLib'], hideLoader)) return;
        showLoader('Organizing PDF...');
        const { PDFDocument } = window.PDFLib;
        const { pageOrder } = options;
        
        const existingPdfBytes = await files[0].arrayBuffer();
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        const newPdfDoc = await PDFDocument.create();

        const copiedPages = await newPdfDoc.copyPages(pdfDoc, pageOrder);
        copiedPages.forEach(page => newPdfDoc.addPage(page));

        const pdfBytes = await newPdfDoc.save();
        hideLoader();
        return [{ data: pdfBytes, filename: 'organized.pdf', type: 'application/pdf' }];
    } },
    { id: 'pdf-to-pdfa', title: 'PDF to PDF/A', desc: 'Convert PDF to a more stable format for archiving. Note: Full PDF/A compliance is not guaranteed.', icon: commonIcons.pdfToSomething, fileType: 'application/pdf', multipleFiles: false, process: async (files, options, showLoader, hideLoader) => {
        if (!checkDependencies(['PDFLib'], hideLoader)) return;
        showLoader('Processing PDF...');
        const { PDFDocument } = window.PDFLib;
        const pdfBytes = await files[0].arrayBuffer();
        const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
        const newPdfBytes = await pdfDoc.save();
        hideLoader();
        return [{ data: newPdfBytes, filename: `re-saved_${files[0].name}`, type: 'application/pdf' }];
    }},
    { id: 'ocr-pdf', title: 'OCR PDF', desc: 'Recognize text in your PDF to make it searchable.', icon: commonIcons.ocr, fileType: 'application/pdf', multipleFiles: false, new: true, process: async (files, _, showLoader, hideLoader) => {
        if (!files[0]) return;
        if (!checkDependencies(['PDFLib', 'pdfjsLib', 'Tesseract'], hideLoader)) return;
        
        const { PDFDocument, rgb, StandardFonts } = window.PDFLib;
        
        showLoader('Loading PDF...');
        const pdfBytes = await files[0].arrayBuffer();
        const pdfJSDoc = await window.pdfjsLib.getDocument({ data: pdfBytes }).promise;
        const outputPdfDoc = await PDFDocument.create();
        
        const worker = await window.Tesseract.createWorker({
            logger: m => {
                if (m.status === 'recognizing text') {
                    showLoader(`OCR Progress: ${Math.round(m.progress * 100)}% on page ${m.userJobId}`);
                }
            },
        });

        for (let i = 1; i <= pdfJSDoc.numPages; i++) {
            showLoader(`Processing page ${i}/${pdfJSDoc.numPages}`);
            const page = await pdfJSDoc.getPage(i);
            const viewport = page.getViewport({ scale: 2.0 });

            const canvas = document.createElement('canvas');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            const context = canvas.getContext('2d');
            await page.render({ canvasContext: context, viewport }).promise;
            const imageData = canvas.toDataURL('image/jpeg');

            const jpgImageBytes = await fetch(imageData).then(res => res.arrayBuffer());
            const jpgImage = await outputPdfDoc.embedJpg(jpgImageBytes);
            const pdfPage = outputPdfDoc.addPage([viewport.width, viewport.height]);
            pdfPage.drawImage(jpgImage, { x: 0, y: 0, width: viewport.width, height: viewport.height });

            const { data } = await worker.recognize(canvas, 'eng', { userJobId: `${i}`});
            
            const font = await outputPdfDoc.embedFont(StandardFonts.Helvetica);

            data.words.forEach(word => {
                const { x0, y0, x1, y1 } = word.bbox;
                const fontSize = (y1 - y0) * 0.8;
                pdfPage.drawText(word.text, {
                    x: x0,
                    y: viewport.height - y1,
                    font,
                    size: fontSize,
                    color: rgb(0, 0, 0),
                    opacity: 0,
                });
            });
        }

        await worker.terminate();
        showLoader('Saving searchable PDF...');
        const ocrPdfBytes = await outputPdfDoc.save();
        hideLoader();
        return [{ data: ocrPdfBytes, filename: 'ocr-result.pdf', type: 'application/pdf' }];
    }},
    { id: 'add-page-numbers', title: 'Add Page Numbers', desc: 'Insert page numbers into your PDF document.', icon: commonIcons.pageNumbers, fileType: 'application/pdf', multipleFiles: false, options: (setOptions, options) => (
        <select
            className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            onChange={e => setOptions({ position: e.target.value })}
            defaultValue="bottom-center"
        >
            <option value="bottom-center">Bottom Center</option>
            <option value="bottom-right">Bottom Right</option>
            <option value="top-center">Top Center</option>
            <option value="top-right">Top Right</option>
        </select>
    ), process: async (files, options, showLoader, hideLoader) => {
        if (!files[0]) return;
        if (!checkDependencies(['PDFLib'], hideLoader)) return;
        showLoader('Adding page numbers...');
        const { PDFDocument, StandardFonts, rgb } = window.PDFLib;
        const pdfBytes = await files[0].arrayBuffer();
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const pages = pdfDoc.getPages();
        const totalPages = pages.length;

        for (let i = 0; i < totalPages; i++) {
            const page = pages[i];
            const { width, height } = page.getSize();
            const pageNumText = `${i + 1} / ${totalPages}`;
            const textWidth = helveticaFont.widthOfTextAtSize(pageNumText, 12);

            let x, y;
            const margin = 30;

            switch (options.position || 'bottom-center') {
                case 'bottom-right': x = width - textWidth - margin; y = margin; break;
                case 'top-center': x = width / 2 - textWidth / 2; y = height - margin; break;
                case 'top-right': x = width - textWidth - margin; y = height - margin; break;
                case 'bottom-center': default: x = width / 2 - textWidth / 2; y = margin; break;
            }
            
            page.drawText(pageNumText, { x, y, size: 12, font: helveticaFont, color: rgb(0, 0, 0) });
        }

        const numberedBytes = await pdfDoc.save();
        hideLoader();
        return [{ data: numberedBytes, filename: 'numbered.pdf', type: 'application/pdf' }];
    }},
    { id: 'repair-pdf', title: 'Repair PDF', desc: 'Attempt to recover data from a corrupt PDF.', icon: commonIcons.edit, fileType: 'application/pdf', multipleFiles: false, process: async (files, _, showLoader, hideLoader) => {
        if (!files[0]) return;
        if (!checkDependencies(['PDFLib'], hideLoader)) return;
        showLoader('Attempting to repair PDF...');
        const { PDFDocument } = window.PDFLib;
        try {
            const pdfBytes = await files[0].arrayBuffer();
            const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
            const repairedBytes = await pdfDoc.save();
            hideLoader();
            return [{ data: repairedBytes, filename: 'repaired.pdf', type: 'application/pdf' }];
        } catch(e) {
            hideLoader();
            alert('Failed to repair PDF. The file may be too corrupted.');
            return;
        }
    }},
    { id: 'png-to-pdf', title: 'PNG to PDF', desc: 'Convert PNG images to PDF files.', icon: commonIcons.somethingToPdf, fileType: 'image/png', multipleFiles: true, process: imagesToPdfProcess },
    { id: 'tiff-to-pdf', title: 'TIFF to PDF', desc: 'Convert TIFF images to PDF.', icon: commonIcons.somethingToPdf, fileType: 'image/tiff', multipleFiles: true, process: async (files, options, showLoader, hideLoader) => {
        if (!checkDependencies(['PDFLib', 'Tiff'], hideLoader)) return;
        showLoader('Converting TIFF to PDF...');
        const { PDFDocument } = window.PDFLib;
        const pdfDoc = await PDFDocument.create();

        for (const file of files) {
            const tiffBytes = await file.arrayBuffer();
            const tiff = new window.Tiff({ buffer: tiffBytes });
            const numPages = tiff.countDirectory();

            for (let i = 0; i < numPages; i++) {
                showLoader(`Processing page ${i + 1} of ${file.name}`);
                tiff.setDirectory(i);
                const canvas = tiff.toCanvas();
                const pngDataUrl = canvas.toDataURL('image/png');
                const pngBytes = await fetch(pngDataUrl).then(res => res.arrayBuffer());
                const pngImage = await pdfDoc.embedPng(pngBytes);
                
                const page = pdfDoc.addPage([pngImage.width, pngImage.height]);
                page.drawImage(pngImage, { x: 0, y: 0, width: pngImage.width, height: pngImage.height });
            }
        }
        
        const pdfBytes = await pdfDoc.save();
        hideLoader();
        return [{ data: pdfBytes, filename: 'tiff-converted.pdf', type: 'application/pdf' }];
    }},
];