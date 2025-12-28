"use client";

import { Recommendation } from "@/lib/types";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Check, X, Edit, Trash2, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { saveRecommendation, deleteRecommendation } from "@/app/actions";
import { format } from "date-fns";

interface RecommendationListProps {
    items: Recommendation[];
}

export function RecommendationList({ items }: RecommendationListProps) {
    const router = useRouter();
    const [filter, setFilter] = useState<'draft' | 'published'>('draft');

    const filteredItems = items.filter(item => (item.status || 'draft') === filter);

    const handleStatusChange = async (item: Recommendation, newStatus: 'draft' | 'published') => {
        await saveRecommendation({ ...item, status: newStatus });
        router.refresh();
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this recommendation?")) {
            await deleteRecommendation(id);
            router.refresh();
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Recommendations
                </h2>
                <Button onClick={() => router.push("/recommendations/new")} className="gap-2">
                    <Plus className="w-4 h-4" /> Add Recommendation
                </Button>
            </div>

            <div className="flex space-x-2 border-b pb-2">
                <Button
                    variant={filter === 'draft' ? "default" : "ghost"}
                    onClick={() => setFilter('draft')}
                >
                    Drafts ({items.filter(i => (i.status || 'draft') === 'draft').length})
                </Button>
                <Button
                    variant={filter === 'published' ? "default" : "ghost"}
                    onClick={() => setFilter('published')}
                >
                    Published ({items.filter(i => i.status === 'published').length})
                </Button>
            </div>

            <div className="space-y-4">
                {filteredItems.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed rounded-lg text-muted-foreground">
                        No {filter} recommendations found.
                    </div>
                ) : (
                    filteredItems.map((item) => (
                        <Card key={item.id} className="p-4 flex flex-col md:flex-row gap-4 items-start md:items-center">
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-lg">{item.name}</h3>
                                    <span className="text-xs text-muted-foreground">
                                        {item.createdAt ? format(new Date(item.createdAt), 'PPP') : 'No date'}
                                    </span>
                                </div>
                                <p className="text-muted-foreground italic">&quot;{item.thought}&quot;</p>
                                {item.linkedinUrl && (
                                    <a href={item.linkedinUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline">
                                        LinkedIn Profile
                                    </a>
                                )}
                            </div>
                            
                            <div className="flex items-center gap-2 mt-2 md:mt-0">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => router.push(`/recommendations/${item.id}`)}
                                >
                                    <Edit className="w-4 h-4 mr-1" /> Edit
                                </Button>
                                
                                {item.status === 'draft' ? (
                                    <Button
                                        size="sm"
                                        className="bg-green-600 hover:bg-green-700"
                                        onClick={() => handleStatusChange(item, 'published')}
                                    >
                                        <Check className="w-4 h-4 mr-1" /> Approve
                                    </Button>
                                ) : (
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        onClick={() => handleStatusChange(item, 'draft')}
                                    >
                                        <X className="w-4 h-4 mr-1" /> Unpublish
                                    </Button>
                                )}

                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDelete(item.id!)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}

