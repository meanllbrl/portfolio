"use client";

import { useState } from "react";
import { Linkedin, ChevronRight } from "lucide-react";
import { Recommendation } from "@/lib/firestore";
import { RecommendationDialog } from "./RecommendationDialog";

interface RecommendationCardProps {
    item: Recommendation;
}

export function RecommendationCard({ item }: RecommendationCardProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    
    // Heuristic for showing the read more button
    // 6 lines is roughly 300-400 characters depending on width and font size
    const isLongText = item.thought.length > 250;

    return (
        <>
            <div 
                className="snap-center w-[300px] md:w-[450px] bg-white dark:bg-card border-3 border-ink rounded-[2rem] p-8 shadow-hard hover:-translate-y-1 hover:shadow-hard-hover transition-all duration-300 flex flex-col justify-between"
            >
                {/* Thought */}
                <div className="flex-grow mb-8">
                    <p className="font-medium text-lg leading-relaxed italic whitespace-pre-wrap line-clamp-6">
                        "{item.thought}"
                    </p>
                    {isLongText && (
                        <button 
                            onClick={(e) => {
                                e.preventDefault();
                                setIsDialogOpen(true);
                            }}
                            className="mt-3 text-sm font-bold text-primary flex items-center gap-1 hover:underline focus:outline-none"
                        >
                            Read More <ChevronRight className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-4 pt-6 border-t-2 border-dashed border-gray-100 dark:border-gray-800">
                    {item.photoUrl ? (
                        <img 
                            src={item.photoUrl} 
                            alt={item.name} 
                            className="w-14 h-14 rounded-xl border-2 border-ink object-cover bg-gray-100 flex-shrink-0"
                        />
                    ) : (
                        <div className="w-14 h-14 rounded-xl border-2 border-ink bg-secondary flex items-center justify-center font-black text-xl uppercase flex-shrink-0">
                            {item.name.charAt(0)}
                        </div>
                    )}
                    
                    <div className="min-w-0">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <h4 className="font-heading font-black text-lg truncate">
                                    {item.name}
                                </h4>
                                {item.linkedinUrl && (
                                    <a 
                                        href={item.linkedinUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 bg-[#0077b5]/10 hover:bg-[#0077b5]/20 text-[#0077b5] px-2 py-0.5 rounded-full transition-colors text-[10px] font-bold uppercase tracking-wider"
                                        title="View LinkedIn Profile"
                                    >
                                        <Linkedin className="w-3 h-3 fill-current" />
                                        <span>LinkedIn</span>
                                    </a>
                                )}
                            </div>
                        
                            {item.title && (
                                <p className="font-bold text-xs uppercase tracking-wider text-primary truncate">
                                    {item.title}
                                </p>
                            )}
                            
                            {item.subtitle && (
                                <p className="text-xs text-muted-foreground truncate">
                                    {item.subtitle}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <RecommendationDialog 
                item={item} 
                isOpen={isDialogOpen} 
                onClose={() => setIsDialogOpen(false)} 
            />
        </>
    );
}

