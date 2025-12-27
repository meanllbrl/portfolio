"use client";

import { useState } from "react";
import { GalleryItem } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/FileUpload";
import { X, ArrowUp, ArrowDown, Image as ImageIcon, Video, Plus } from "lucide-react";
import Image from "next/image";
import { Label } from "@/components/ui/label";

interface GalleryEditorProps {
    value: GalleryItem[];
    onChange: (items: GalleryItem[]) => void;
}

export function GalleryEditor({ value, onChange }: GalleryEditorProps) {
    const [isAdding, setIsAdding] = useState(false);

    const handleAdd = (url: string) => {
        if (!url) return;

        // Check for video extension, handling query parameters (e.g. Firebase URLs)
        const isVideo = url.match(/\.(mp4|webm|mov|ogg)(\?|$)/i);
        const type = isVideo ? 'video' : 'image';

        const newItem: GalleryItem = {
            id: crypto.randomUUID(),
            type,
            url
        };

        onChange([...value, newItem]);
        setIsAdding(false);
    };

    const remove = (id: string) => {
        onChange(value.filter(item => item.id !== id));
    };

    const move = (index: number, direction: 'left' | 'right') => {
        const newHelper = [...value];
        const targetIndex = direction === 'left' ? index - 1 : index + 1;

        if (targetIndex < 0 || targetIndex >= newHelper.length) return;

        [newHelper[index], newHelper[targetIndex]] = [newHelper[targetIndex], newHelper[index]];
        onChange(newHelper);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Label className="text-base">Gallery (Images & Videos)</Label>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAdding(!isAdding)}
                >
                    <Plus className="w-4 h-4 mr-2" /> Add Media
                </Button>
            </div>

            {isAdding && (
                <div className="p-4 border rounded-lg bg-secondary/50 animate-in fade-in slide-in-from-top-2">
                    <Label className="mb-2 block">Upload Media</Label>
                    <FileUpload
                        value=""
                        onChange={handleAdd}
                        label="Select Image or Video"
                        accept="image/*,video/*"
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="mt-2"
                        onClick={() => setIsAdding(false)}
                    >
                        Cancel
                    </Button>
                </div>
            )}

            <div className="space-y-2">
                {value.map((item, index) => (
                    <div key={item.id} className="flex items-center gap-4 p-3 bg-card border rounded-lg hover:border-primary/50 transition-colors group">
                        {/* Thumbnail */}
                        <div className="relative w-32 aspect-video bg-black/10 rounded overflow-hidden shrink-0 border">
                            {item.type === 'image' ? (
                                <Image
                                    src={item.url}
                                    alt="Gallery item"
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <video
                                    src={item.url}
                                    className="w-full h-full object-cover"
                                    muted
                                />
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-grow min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded text-white flex items-center gap-1 ${item.type === 'image' ? 'bg-blue-500' : 'bg-red-500'}`}>
                                    {item.type === 'image' ? <ImageIcon className="w-3 h-3" /> : <Video className="w-3 h-3" />}
                                    {item.type}
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground truncate" title={item.url}>
                                {item.url}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1">
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                disabled={index === 0}
                                onClick={() => move(index, 'left')}
                                title="Move Up"
                            >
                                <ArrowUp className="w-4 h-4" />
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                disabled={index === value.length - 1}
                                onClick={() => move(index, 'right')}
                                title="Move Down"
                            >
                                <ArrowDown className="w-4 h-4" />
                            </Button>
                            <div className="w-px h-4 bg-border mx-1" />
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive-foreground hover:bg-destructive"
                                onClick={() => remove(item.id)}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {value.length === 0 && !isAdding && (
                <div className="text-sm text-muted-foreground text-center py-8 border-2 border-dashed rounded-lg bg-muted/20">
                    No items in gallery. Add images or videos.
                </div>
            )}
        </div>
    );
}
