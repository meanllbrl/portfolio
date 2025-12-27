"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Plus, Trash } from "lucide-react";

interface ChangelogItem {
    date: string;
    description: string;
}

interface ChangelogEditorProps {
    value: ChangelogItem[];
    onChange: (items: ChangelogItem[]) => void;
}

export function ChangelogEditor({ value, onChange }: ChangelogEditorProps) {
    const addLog = () => {
        const today = new Date().toISOString().split('T')[0];
        onChange([{ date: today, description: "" }, ...value]); // Newest first
    };

    const handleChange = (index: number, field: keyof ChangelogItem, val: string) => {
        const newItems = [...value];
        newItems[index] = { ...newItems[index], [field]: val };
        onChange(newItems);
    };

    const removeLog = (index: number) => {
        onChange(value.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <Label>Changelog</Label>
                <Button type="button" variant="outline" size="sm" onClick={addLog}>
                    <Plus className="mr-2 h-4 w-4" /> Add Entry
                </Button>
            </div>

            {value.length === 0 && (
                <div className="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-lg">
                    No changelogs yet.
                </div>
            )}

            <div className="space-y-3">
                {value.map((item, index) => (
                    <Card key={index} className="p-3">
                        <div className="flex items-start gap-3">
                            <div className="space-y-2 flex-1">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                    <div className="md:col-span-1">
                                        <Input
                                            type="date"
                                            value={item.date}
                                            onChange={(e) => handleChange(index, "date", e.target.value)}
                                            className="h-9"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <Input
                                            value={item.description}
                                            onChange={(e) => handleChange(index, "description", e.target.value)}
                                            placeholder="Update description..."
                                            className="h-9"
                                        />
                                    </div>
                                </div>
                            </div>
                            <Button type="button" variant="ghost" size="icon" onClick={() => removeLog(index)}>
                                <Trash className="h-4 w-4 text-red-500" />
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
