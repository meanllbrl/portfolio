"use client";

import { useState } from "react";
import { Link as LinkType } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { FileUpload } from "@/components/FileUpload";
import { Plus, Trash, GripVertical, ChevronUp, ChevronDown } from "lucide-react";

interface UrlEditorProps {
    value: LinkType[];
    onChange: (urls: LinkType[]) => void;
}

export function UrlEditor({ value, onChange }: UrlEditorProps) {
    const handleChange = (index: number, field: keyof LinkType, val: string) => {
        const newUrls = [...value];
        newUrls[index] = { ...newUrls[index], [field]: val };
        onChange(newUrls);
    };

    const addUrl = () => {
        onChange([...value, { title: "Website", url: "", icon: "" }]);
    };

    const removeUrl = (index: number) => {
        onChange(value.filter((_, i) => i !== index));
    };

    const moveUp = (index: number) => {
        if (index === 0) return;
        const newUrls = [...value];
        [newUrls[index - 1], newUrls[index]] = [newUrls[index], newUrls[index - 1]];
        onChange(newUrls);
    };

    const moveDown = (index: number) => {
        if (index === value.length - 1) return;
        const newUrls = [...value];
        [newUrls[index], newUrls[index + 1]] = [newUrls[index + 1], newUrls[index]];
        onChange(newUrls);
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <Label>Links / URLs</Label>
                <Button type="button" variant="outline" size="sm" onClick={addUrl}>
                    <Plus className="mr-2 h-4 w-4" /> Add Link
                </Button>
            </div>

            {value.length === 0 && (
                <div className="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-lg">
                    No links added yet.
                </div>
            )}

            {value.map((link, index) => (
                <Card key={index} className="p-4">
                    <div className="flex items-start gap-3">
                        {/* Reorder Controls */}
                        <div className="flex flex-col gap-1 pt-1">
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => moveUp(index)}
                                disabled={index === 0}
                            >
                                <ChevronUp className="h-4 w-4" />
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => moveDown(index)}
                                disabled={index === value.length - 1}
                            >
                                <ChevronDown className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Icon Upload */}
                        <div className="w-16 shrink-0">
                            <Label className="text-xs mb-1 block">Icon</Label>
                            <div className="w-12 h-12 rounded border overflow-hidden bg-muted flex items-center justify-center">
                                {link.icon ? (
                                    <img src={link.icon} alt="Icon" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-xs text-muted-foreground">+</span>
                                )}
                            </div>
                            <FileUpload
                                value={link.icon || ""}
                                onChange={(url) => handleChange(index, "icon", url)}
                                accept="image/*"
                                label=""
                                compact
                            />
                        </div>

                        {/* Title and URL */}
                        <div className="flex-1 space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <Label className="text-xs">Title</Label>
                                    <Input
                                        value={link.title}
                                        onChange={(e) => handleChange(index, "title", e.target.value)}
                                        placeholder="Website"
                                        className="h-9"
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs">URL</Label>
                                    <Input
                                        value={link.url}
                                        onChange={(e) => handleChange(index, "url", e.target.value)}
                                        placeholder="https://..."
                                        className="h-9"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Delete Button */}
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeUrl(index)} className="mt-5">
                            <Trash className="h-4 w-4 text-red-500" />
                        </Button>
                    </div>
                </Card>
            ))}
        </div>
    );
}
