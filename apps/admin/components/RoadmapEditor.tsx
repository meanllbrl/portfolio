"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Plus, Trash, GripVertical, ChevronUp, ChevronDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface RoadmapItem {
    id: string;
    title: string;
    done: boolean;
}

interface RoadmapEditorProps {
    value: RoadmapItem[];
    onChange: (items: RoadmapItem[]) => void;
}

export function RoadmapEditor({ value, onChange }: RoadmapEditorProps) {
    const addItem = () => {
        const id = Math.random().toString(36).substr(2, 9);
        onChange([...value, { id, title: "", done: false }]);
    };

    const handleChange = (index: number, field: keyof RoadmapItem, val: string | boolean) => {
        const newItems = [...value];
        newItems[index] = { ...newItems[index], [field]: val };
        onChange(newItems);
    };

    const removeUrl = (index: number) => {
        onChange(value.filter((_, i) => i !== index));
    };

    const moveUp = (index: number) => {
        if (index === 0) return;
        const newItems = [...value];
        [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
        onChange(newItems);
    };

    const moveDown = (index: number) => {
        if (index === value.length - 1) return;
        const newItems = [...value];
        [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
        onChange(newItems);
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <Label>Roadmap</Label>
                <Button type="button" variant="outline" size="sm" onClick={addItem}>
                    <Plus className="mr-2 h-4 w-4" /> Add Item
                </Button>
            </div>

            {value.length === 0 && (
                <div className="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-lg">
                    No roadmap items yet.
                </div>
            )}

            <div className="space-y-2">
                {value.map((item, index) => (
                    <Card key={item.id} className="p-3">
                        <div className="flex items-center gap-3">
                            <div className="flex flex-col gap-0.5">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-5 w-5"
                                    onClick={() => moveUp(index)}
                                    disabled={index === 0}
                                >
                                    <ChevronUp className="h-3 w-3" />
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-5 w-5"
                                    onClick={() => moveDown(index)}
                                    disabled={index === value.length - 1}
                                >
                                    <ChevronDown className="h-3 w-3" />
                                </Button>
                            </div>

                            <Checkbox
                                checked={item.done}
                                onChange={(e) => handleChange(index, "done", e.target.checked)}
                            />

                            <Input
                                value={item.title}
                                onChange={(e) => handleChange(index, "title", e.target.value)}
                                placeholder="To-do item..."
                                className="h-9 flex-1"
                            />

                            <Button type="button" variant="ghost" size="icon" onClick={() => removeUrl(index)}>
                                <Trash className="h-4 w-4 text-red-500" />
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
