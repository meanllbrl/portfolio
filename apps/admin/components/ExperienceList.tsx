"use client";

import React, { useState, useEffect } from "react";
import { Experience } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Edit, GripVertical, Save, Plus } from "lucide-react";
import Link from "next/link";
import { DeleteButton } from "@/components/DeleteButton";
import { SortableList } from "@/components/SortableList";
import { updateCollectionOrder } from "@/app/actions/reorder";

interface ExperienceListProps {
    initialItems: Experience[];
}

type SortableExperience = Experience & { id: string };

export function ExperienceList({ initialItems }: ExperienceListProps) {
    const [items, setItems] = useState<SortableExperience[]>(initialItems as SortableExperience[]);
    const [hasChanges, setHasChanges] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setItems(initialItems as SortableExperience[]);
        setHasChanges(false);
    }, [initialItems]);

    const handleReorder = (newOrder: SortableExperience[]) => {
        setItems(newOrder);
        setHasChanges(true);
    };

    const handleSaveOrder = async () => {
        setSaving(true);
        const payload = items.map((p, index) => ({
            id: p.id!,
            sortOrder: index
        }));

        const result = await updateCollectionOrder("experiences", payload);

        setSaving(false);
        if (result.success) {
            setHasChanges(false);
        } else {
            alert("Failed to save order: " + result.error);
        }
    };

    return (
        <div className="space-y-4">
            {hasChanges && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-md flex items-center justify-between sticky top-4 z-50 shadow-sm">
                    <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                        You have unsaved order changes.
                    </p>
                    <Button size="sm" onClick={handleSaveOrder} disabled={saving}>
                        <Save className="mr-2 h-4 w-4" />
                        {saving ? "Saving..." : "Save Order"}
                    </Button>
                </div>
            )}

            <SortableList
                items={items}
                onReorder={handleReorder}
                className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
                itemClassName="h-full"
                renderItem={(exp) => (
                    <Card key={exp.id} className="group relative">
                        {/* Drag Handle */}
                        <div className="absolute top-2 right-2 p-2 cursor-grab active:cursor-grabbing text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 rounded z-10">
                            <GripVertical className="h-5 w-5" />
                        </div>

                        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                            <div className="space-y-1">
                                <CardTitle className="text-base font-semibold leading-none pr-8">
                                    {exp.title}
                                </CardTitle>
                                <p className="text-sm text-muted-foreground">{exp.workTitle}</p>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-4 text-xs text-muted-foreground">{exp.years}</div>
                            <p className="line-clamp-3 text-sm text-gray-600 mb-4">
                                {exp.description}
                            </p>
                            <div className="flex items-center gap-2">
                                <Link href={`/experience/${exp.id}`}>
                                    <Button variant="outline" size="sm">
                                        <Edit className="mr-2 h-4 w-4" /> Edit
                                    </Button>
                                </Link>
                                <DeleteButton id={exp.id!} collection="experiences" />
                            </div>
                        </CardContent>
                    </Card>
                )}
            />
            {items.length === 0 && (
                <div className="col-span-full text-center py-10 text-gray-500">
                    No experiences found. Add one to get started.
                </div>
            )}
        </div>
    );
}
