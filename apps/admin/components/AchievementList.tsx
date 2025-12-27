"use client";

import { Achievement } from "@/lib/types";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, Trophy, Award, TrendingUp, Edit, GripVertical } from "lucide-react";
import { SortableList } from "@/components/SortableList";
import { updateCollectionOrder } from "@/app/actions/reorder";
import { Card, CardContent } from "@/components/ui/card";
import { DeleteButton } from "@/components/DeleteButton";

interface AchievementListProps {
    items: Achievement[];
}

const iconMap: Record<string, any> = {
    Trophy,
    TrendingUp,
    Award
};

export function AchievementList({ items }: AchievementListProps) {
    const router = useRouter();

    const renderItem = (item: Achievement, dragListeners?: any) => {
        const Icon = iconMap[item.icon] || Award;
        // Need to cast or ensure ID exists. SortableList guarantees ID in items if generics work, but here type is Achievement
        const id = item.id!;

        return (
            <Card className="group relative flex items-center p-4">
                {/* Drag Handle */}
                <div 
                    {...dragListeners}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 cursor-grab active:cursor-grabbing text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <GripVertical className="h-5 w-5" />
                </div>

                <div className="ml-8 mr-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6 text-primary" />
                </div>

                <div className="flex-1 min-w-0 mr-4">
                    <h3 className="font-semibold text-lg truncate">{item.title}</h3>
                    <p className="text-sm text-gray-500 truncate">{item.description}</p>
                    {item.date && <span className="text-xs text-gray-400">{item.date}</span>}
                </div>

                <div className="flex items-center gap-2" onPointerDown={(e) => e.stopPropagation()}>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/achievements/${id}`);
                        }}
                    >
                        <Edit className="w-4 h-4" />
                    </Button>
                    <div onPointerDown={(e) => e.stopPropagation()}>
                        <DeleteButton id={id} collection="achievements" />
                    </div>
                </div>
            </Card>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Achievements
                </h2>
                <Button onClick={() => router.push("/achievements/new")} className="gap-2">
                    <Plus className="w-4 h-4" /> Add Achievement
                </Button>
            </div>

            <SortableList<Achievement & { id: string }>
                items={items as (Achievement & { id: string })[]}
                onReorder={async (newItems) => {
                    const updates = newItems.map((item, index) => ({
                        id: item.id,
                        sortOrder: index
                    }));
                    await updateCollectionOrder("achievements", updates);
                }}
                renderItem={renderItem}
                className="space-y-3"
            />

            {items.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed rounded-lg text-muted-foreground">
                    No achievements yet. Click "Add Achievement" to create one.
                </div>
            )}
        </div>
    );
}
