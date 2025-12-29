"use client";

import { X, Linkedin, Quote } from "lucide-react";
import { Recommendation } from "@/lib/firestore";
import { useEffect, useRef } from "react";

interface RecommendationDialogProps {
    item: Recommendation;
    isOpen: boolean;
    onClose: () => void;
}

export function RecommendationDialog({ item, isOpen, onClose }: RecommendationDialogProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);

    // Handle ESC key to close
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        if (isOpen) {
            window.addEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "hidden"; // Prevent background scrolling
        }

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = ""; // Restore scrolling
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={(e) => {
                // Close when clicking backdrop
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div 
                role="dialog"
                aria-modal="true"
                className="relative w-full max-w-2xl bg-white dark:bg-card border-3 border-ink rounded-[2rem] shadow-hard p-6 md:p-10 flex flex-col max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200"
            >
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 md:top-6 md:right-6 p-2 rounded-full hover:bg-secondary transition-colors"
                    aria-label="Close dialog"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Header with Quote Icon */}
                <div className="mb-6 flex items-start">
                    <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center border-2 border-ink shadow-sm flex-shrink-0">
                        <Quote className="w-5 h-5 rotate-180" />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-grow mb-8 overflow-y-auto">
                    <p className="font-medium text-lg md:text-xl leading-relaxed italic whitespace-pre-wrap text-ink">
                        "{item.thought}"
                    </p>
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-4 pt-6 border-t-2 border-dashed border-gray-100 dark:border-gray-800 mt-auto">
                    {item.photoUrl ? (
                        <img 
                            src={item.photoUrl} 
                            alt={item.name} 
                            className="w-16 h-16 rounded-xl border-2 border-ink object-cover bg-gray-100 flex-shrink-0"
                        />
                    ) : (
                        <div className="w-16 h-16 rounded-xl border-2 border-ink bg-secondary flex items-center justify-center font-black text-xl uppercase flex-shrink-0">
                            {item.name.charAt(0)}
                        </div>
                    )}
                    
                    <div className="min-w-0">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-heading font-black text-xl truncate">
                                    {item.name}
                                </h4>
                                {item.linkedinUrl && (
                                    <a 
                                        href={item.linkedinUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 bg-[#0077b5]/10 hover:bg-[#0077b5]/20 text-[#0077b5] px-2 py-0.5 rounded-full transition-colors text-xs font-bold uppercase tracking-wider"
                                        title="View LinkedIn Profile"
                                    >
                                        <Linkedin className="w-3 h-3 fill-current" />
                                        <span>LinkedIn</span>
                                    </a>
                                )}
                            </div>
                        
                            {item.title && (
                                <p className="font-bold text-sm uppercase tracking-wider text-primary truncate">
                                    {item.title}
                                </p>
                            )}
                            
                            {item.subtitle && (
                                <p className="text-sm text-muted-foreground truncate">
                                    {item.subtitle}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

