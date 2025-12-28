"use client";

import React, { useState, useEffect } from "react";
import { Project } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Edit, GripVertical, Save } from "lucide-react";
import Link from "next/link";
import { SafeDeleteButton } from "@/components/SafeDeleteButton";
import { SortableList } from "@/components/SortableList";
import { updateCollectionOrder } from "@/app/actions/reorder";

interface ProjectListProps {
    initialProjects: Project[];
}

// Helper type ensuring ID is present for DnD
type SortableProject = Project & { id: string };

export function ProjectList({ initialProjects }: ProjectListProps) {
    // Cast initial projects to have required ID since they come from DB
    const [projects, setProjects] = useState<SortableProject[]>(initialProjects as SortableProject[]);
    const [hasChanges, setHasChanges] = useState(false);
    const [saving, setSaving] = useState(false);

    // Update local state when initialProjects changes (e.g. after server revalidation)
    useEffect(() => {
        setProjects(initialProjects as SortableProject[]);
        setHasChanges(false);
    }, [initialProjects]);

    const handleReorder = (newOrder: SortableProject[]) => {
        setProjects(newOrder);
        setHasChanges(true); // Flag that we need to save
    };

    const handleSaveOrder = async () => {
        setSaving(true);
        // Create the payload: id + index as sortOrder
        const payload = projects.map((p, index) => ({
            id: p.id!,
            sortOrder: index
        }));

        const result = await updateCollectionOrder("projects", payload);

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
                items={projects}
                onReorder={handleReorder}
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                itemClassName="h-full"
                strategy="grid"
                renderItem={(project, dragListeners) => (
                    <Card key={project.id} className="flex flex-col h-full group relative bg-card">
                        {/* Drag Handle */}
                        <div 
                            {...dragListeners}
                            className="absolute top-2 right-2 p-2 cursor-grab active:cursor-grabbing text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 rounded z-10 touch-none"
                            onPointerDown={(e) => {
                                // Prevent card interactions when dragging from handle
                                e.stopPropagation();
                                dragListeners?.onPointerDown?.(e);
                            }}
                        >
                            <GripVertical className="h-5 w-5" />
                        </div>

                        <CardHeader>
                            <CardTitle className="line-clamp-1 pr-8">{project.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1">
                            {project.image && (
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="w-full h-48 object-cover rounded-md mb-4"
                                />
                            )}
                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {project.subtitle}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-4">
                                <span className={`px-2 py-1 rounded text-xs ${project.featured === 3 ? "bg-purple-100 text-purple-800" :
                                        project.featured === 2 ? "bg-blue-100 text-blue-800" :
                                            project.featured === 1 ? "bg-gray-100 text-gray-800" : "bg-red-50 text-red-500"
                                    }`}>
                                    {project.featured === 3 ? "Priority" : project.featured === 2 ? "Featured" : project.featured === 1 ? "Standard" : "Hidden"}
                                </span>
                                {project.tags?.slice(0, 3).map(tag => (
                                    <span key={tag} className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between mt-auto pt-4 border-t">
                            <Link href={`/projects/${project.id}`}>
                                <Button variant="outline" size="sm">
                                    <Edit className="h-4 w-4 mr-2" /> Edit
                                </Button>
                            </Link>

                            <SafeDeleteButton id={project.id!} type="project" />
                        </CardFooter>
                    </Card>
                )}
            />
        </div>
    );
}
