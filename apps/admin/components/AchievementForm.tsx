"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Achievement } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { NativeSelect } from "@/components/ui/select";
import { ArrowLeft, Loader2 } from "lucide-react";
import { saveAchievement } from "@/app/actions";

interface AchievementFormProps {
    initialData?: Achievement;
}

const ICONS = [
    { value: "Trophy", label: "Trophy" },
    { value: "Award", label: "Award" },
    { value: "TrendingUp", label: "Trending Up" },
];

export function AchievementForm({ initialData }: AchievementFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Achievement>(
        initialData || {
            title: "",
            description: "",
            icon: "Award",
            date: new Date().getFullYear().toString()
        }
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Ensure ID is preserved when editing
            const dataToSave = initialData?.id 
                ? { ...formData, id: initialData.id }
                : formData;
            
            const result = await saveAchievement(dataToSave);
            if (result.success) {
                router.push("/achievements");
                router.refresh();
            } else {
                alert("Error saving: " + (result.error || "Unknown error"));
            }
        } catch (error) {
            console.error(error);
            alert("Unexpected error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4 mb-6">
                <Button variant="ghost" type="button" onClick={() => router.back()}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <h1 className="text-2xl font-bold">
                    {initialData ? "Edit Achievement" : "New Achievement"}
                </h1>
            </div>

            <Card>
                <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="e.g. TUBITAK Grant"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                            required
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Brief description of the achievement"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Date / Year</Label>
                            <Input
                                value={formData.date || ""}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                placeholder="2024"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Icon</Label>
                            <NativeSelect
                                options={ICONS}
                                value={formData.icon}
                                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end gap-3">
                <Button variant="outline" type="button" onClick={() => router.back()}>
                    Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Save Achievement
                </Button>
            </div>
        </form>
    );
}

