
import React, { useState, useCallback, useRef, useEffect } from 'react';
import type { Tool } from '../types';

interface ToolModalProps {
    tool: Tool;
    isOpen: boolean;
    onClose: () => void;
}

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
);

const FileIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const DownloadIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);


export const ToolModal: React.FC<ToolModalProps> = ({ tool, isOpen, onClose }) => {
    const [files, setFiles] = useState<File[]>([]);
    const [options, setOptions] = useState<any>({});
    const [output, setOutput] = useState<{ data: any; filename: string; type: string }[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [loaderText, setLoaderText] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const resetModal = useCallback(() => {
        setFiles([]);
        setOptions({});
        setOutput([]);
        setIsLoading(false);
        setLoaderText('');
    }, []);

    useEffect(() => {
        // Reset state when tool changes
        resetModal();
    }, [tool, resetModal]);

    const handleFileSelect = (selectedFiles: FileList | null) => {
        if (!selectedFiles) return;

        const newFiles = Array.from(selectedFiles);
        const allFiles = tool.multipleFiles ? [...files, ...newFiles] : newFiles;

        const validFiles = allFiles.filter(file => file.type.match(tool.fileType.replace('*', '.*')));
        if (validFiles.length !== allFiles.length) {
            alert(`Please select only ${tool.fileType} files.`);
            return;
        }

        setFiles(validFiles);
        if (tool.onFileSelect) {
            tool.onFileSelect(validFiles, setOptions);
        }
    };
    
    const handleDragEvents = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDragEnter = (e: React.DragEvent) => {
        handleDragEvents(e);
        setIsDragging(true);
    };
    
    const handleDragLeave = (e: React.DragEvent) => {
        handleDragEvents(e);
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        handleDragEvents(e);
        setIsDragging(false);
        handleFileSelect(e.dataTransfer.files);
    };

    const removeFile = (index: number) => {
        const newFiles = [...files];
        newFiles.splice(index, 1);
        setFiles(newFiles);
    };

    const showLoader = (text: string) => {
        setLoaderText(text);
        setIsLoading(true);
    };

    const hideLoader = () => {
        setIsLoading(false);
    };

    const handleProcess = async () => {
        if (files.length === 0) return;
        setOutput([]);
        try {
            const result = await tool.process(files, options, showLoader, hideLoader);
            if (result) {
                setOutput(result);
            }
        } catch (error) {
            console.error("Processing error:", error);
            alert(`An error occurred: ${error instanceof Error ? error.message : String(error)}`);
            hideLoader();
        }
    };

    const createDownloadLink = (data: any, filename: string, type: string) => {
        const blob = new Blob([data], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };


    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onMouseDown={onClose}>
            <div className="absolute inset-0 bg-black/60"></div>
            <div
                className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl mx-4 transition-transform duration-300 ${isOpen ? 'scale-100' : 'scale-95'}`}
                onMouseDown={e => e.stopPropagation()}
            >
                {isLoading && (
                    <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 z-20 flex flex-col items-center justify-center rounded-lg">
                        <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-200">{loaderText}</p>
                    </div>
                )}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{tool.title}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-800 dark:hover:text-white transition">
                        <CloseIcon />
                    </button>
                </div>
                <div className="p-6 max-h-[75vh] overflow-y-auto">
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-grow">
                            {files.length === 0 && output.length === 0 && (
                                <div
                                    onDragEnter={handleDragEnter}
                                    onDragOver={handleDragEvents}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragging ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                                >
                                    <UploadIcon />
                                    <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300">Drag & drop files here</p>
                                    <p className="text-gray-500 dark:text-gray-400">or click to select files</p>
                                    <p className="text-sm text-gray-400 mt-2">({tool.fileType})</p>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept={tool.fileType}
                                        multiple={tool.multipleFiles}
                                        onChange={(e) => handleFileSelect(e.target.files)}
                                    />
                                </div>
                            )}

                            {files.length > 0 && (
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-gray-700 dark:text-gray-300">Selected Files:</h3>
                                    <ul className="space-y-2">
                                        {files.map((file, index) => (
                                            <li key={index} className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded-md text-sm">
                                                <div className="flex items-center gap-2 truncate">
                                                    <FileIcon />
                                                    <span className="truncate text-gray-800 dark:text-gray-200">{file.name}</span>
                                                </div>
                                                <button onClick={() => removeFile(index)} className="text-gray-400 hover:text-red-500 font-bold p-1">
                                                   &times;
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                    {tool.multipleFiles &&
                                      <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full text-center py-2 px-4 border border-dashed border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        Add more files
                                      </button>
                                    }
                                </div>
                            )}
                            
                            {tool.options && files.length > 0 && (
                                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-3">Options:</h3>
                                    {tool.options(setOptions, options)}
                                </div>
                            )}

                             {output.length > 0 && (
                                <div className="mt-6">
                                    <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-3">Your Files are Ready:</h3>
                                    <div className="space-y-3">
                                        {output.map((file, index) => (
                                            <button
                                                key={index}
                                                onClick={() => createDownloadLink(file.data, file.filename, file.type)}
                                                className="w-full flex items-center justify-center py-3 px-4 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                                            >
                                                <DownloadIcon /> Download {file.filename}
                                            </button>
                                        ))}
                                    </div>
                                    <button onClick={resetModal} className="mt-4 w-full text-center py-2 px-4 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                                        Process more files
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="w-full md:w-[200px] flex-shrink-0">
                            <div className="h-full w-full border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800">
                                Sidebar Ad (200x400)
                            </div>
                        </div>
                    </div>
                </div>

                {output.length === 0 && (
                  <div className="p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 rounded-b-lg">
                      <button
                          onClick={handleProcess}
                          disabled={files.length === 0 || isLoading}
                          className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-300"
                      >
                          {tool.title}
                      </button>
                  </div>
                )}
            </div>
        </div>
    );
};
