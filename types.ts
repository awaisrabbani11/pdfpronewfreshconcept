// Augment the global window object
declare global {
    interface Window {
        pdfLib: any;
        pdfjsLib: any;
        Tesseract: any;
        html2pdf: any;
        mammoth: any;
        XLSX: any;
        pptxgen: any;
        fabric: any;
        JSZip: any;
        // FIX: Add Tiff to window interface for TIFF to PDF conversion.
        Tiff: any;
    }
}

export interface Tool {
    id: string;
    title: string;
    desc: string;
    icon: React.ReactNode;
    fileType: string;
    multipleFiles: boolean;
    new?: boolean;
    options?: (setOptions: React.Dispatch<React.SetStateAction<any>>, options: any) => React.ReactNode;
    process: (files: File[], options: any, showLoader: (text: string) => void, hideLoader: () => void) => Promise<{ data: any; filename: string; type: string }[] | void>;
    onFileSelect?: (files: File[], setOptions: React.Dispatch<React.SetStateAction<any>>) => void;
}
