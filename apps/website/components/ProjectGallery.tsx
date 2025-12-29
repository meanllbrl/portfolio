"use client";

import { FC, useRef, useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface GalleryItem {
    id: string;
    type: 'image' | 'video';
    url: string;
}

interface ProjectGalleryProps {
    gallery: GalleryItem[];
}

export const ProjectGallery: FC<ProjectGalleryProps> = ({ gallery }) => {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const { current } = scrollContainerRef;
            const scrollAmount = window.innerWidth > 768 ? 600 : 300;
            if (direction === 'left') {
                current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    const handlePrev = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        setSelectedIndex(prev => (prev !== null && prev > 0 ? prev - 1 : prev));
    }, []);

    const handleNext = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        setSelectedIndex(prev => (prev !== null && prev < gallery.length - 1 ? prev + 1 : prev));
    }, [gallery.length]);

    // Handle Keyboard Navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedIndex === null) return;

            if (e.key === 'Escape') setSelectedIndex(null);
            if (e.key === 'ArrowLeft') handlePrev();
            if (e.key === 'ArrowRight') handleNext();
        };

        if (selectedIndex !== null) {
            window.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        }
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [selectedIndex, handlePrev, handleNext]);

    if (!gallery || gallery.length === 0) return null;

    const selectedItem = selectedIndex !== null ? gallery[selectedIndex] : null;

    return (
        <>
            <div className="relative group">
                {/* Left Button */}
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-card/80 p-3 rounded-full border-2 border-ink shadow-sm opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 hover:scale-110 hidden md:block"
                    aria-label="Scroll left"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>

                {/* Right Button */}
                <button
                    onClick={() => scroll('right')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-card/80 p-3 rounded-full border-2 border-ink shadow-sm opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 hover:scale-110 hidden md:block"
                    aria-label="Scroll right"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>

                {/* Scroll Container */}
                <div
                    ref={scrollContainerRef}
                    className="w-full overflow-x-auto pb-4 scrollbar-hide -mx-5 px-5 md:mx-0 md:px-0 scroll-smooth"
                >
                    <div className="flex gap-4 md:gap-6 min-w-min">
                        {gallery.map((item, index) => (
                            <div
                                key={item.id}
                                onClick={() => setSelectedIndex(index)}
                                className="relative shrink-0 h-[40vh] md:h-[60vh] max-w-[40vh] md:max-w-[60vh] rounded-2xl overflow-hidden border-2 border-ink shadow-[4px_4px_0px_var(--ink-black)] bg-gray-100 dark:bg-gray-800 cursor-zoom-in hover:opacity-95 transition-opacity"
                            >
                                {item.type === 'image' ? (
                                    <img
                                        src={item.url}
                                        alt="Gallery item"
                                        className="h-full w-auto object-contain mx-auto"
                                        style={{
                                            maxWidth: '100%',
                                            aspectRatio: 'unset'
                                        }}
                                    />
                                ) : (
                                    <video
                                        src={item.url}
                                        className="h-full w-auto object-contain mx-auto"
                                        style={{
                                            maxWidth: '100%'
                                        }}
                                        muted
                                        playsInline
                                    />
                                )}
                                {/* Play icon overlay for videos */}
                                {item.type === 'video' && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 pointer-events-none">
                                        <div className="p-3 bg-black/50 rounded-full text-white">
                                            <ChevronRight className="w-6 h-6 fill-current" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Lightbox Overlay */}
            {selectedItem && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-in fade-in duration-200"
                    onClick={() => setSelectedIndex(null)}
                >
                    {/* Close Button */}
                    <button
                        onClick={() => setSelectedIndex(null)}
                        className="absolute top-4 right-4 p-3 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors z-50 pointer-events-auto"
                        aria-label="Close"
                    >
                        <X className="w-8 h-8" />
                    </button>

                    {/* Prev Button */}
                    {selectedIndex !== null && selectedIndex > 0 && (
                        <button
                            onClick={handlePrev}
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors z-50 pointer-events-auto"
                            aria-label="Previous image"
                        >
                            <ChevronLeft className="w-10 h-10" />
                        </button>
                    )}

                    {/* Next Button */}
                    {selectedIndex !== null && selectedIndex < gallery.length - 1 && (
                        <button
                            onClick={handleNext}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors z-50 pointer-events-auto"
                            aria-label="Next image"
                        >
                            <ChevronRight className="w-10 h-10" />
                        </button>
                    )}

                    {/* Media Content */}
                    <div
                        className="relative w-full h-full flex items-center justify-center pointer-events-none"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {selectedItem.type === 'image' ? (
                            <img
                                key={selectedItem.id} // Re-render on change
                                src={selectedItem.url}
                                alt="Fullscreen gallery item"
                                className="max-w-full max-h-screen object-contain pointer-events-auto shadow-2xl animate-in zoom-in-95 duration-200"
                            />
                        ) : (
                            <video
                                key={selectedItem.id} // Re-render logic
                                src={selectedItem.url}
                                controls
                                autoPlay
                                className="max-w-full max-h-screen object-contain pointer-events-auto shadow-2xl animate-in zoom-in-95 duration-200"
                            />
                        )}
                    </div>

                    {/* Counter */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-sm font-mono tracking-widest">
                        {selectedIndex! + 1} / {gallery.length}
                    </div>
                </div>
            )}
        </>
    );
};
