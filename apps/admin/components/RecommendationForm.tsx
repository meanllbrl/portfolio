"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Recommendation } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { NativeSelect } from "@/components/ui/select";
import { ArrowLeft, Loader2 } from "lucide-react";
import { saveRecommendation } from "@/app/actions";
import { FileUpload } from "@/components/FileUpload";

interface RecommendationFormProps {
    initialData?: Recommendation;
}

const STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "published", label: "Published" },
];

export function RecommendationForm({ initialData }: RecommendationFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Recommendation>(
        initialData || {
            name: "",
            thought: "",
            status: "draft",
            createdAt: new Date().toISOString(),
            linkedinUrl: "",
            photoUrl: "",
            title: "",
            subtitle: ""
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
            
            const result = await saveRecommendation(dataToSave);
            if (result.success) {
                router.push("/recommendations");
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
                    {initialData ? "Edit Recommendation" : "New Recommendation"}
                </h1>
            </div>

            <Card>
                <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                        <Label>Name</Label>
                        <Input
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. John Doe"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Job Title / Role</Label>
                            <Input
                                value={formData.title || ""}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g. Founder & Software Engineer"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Subtitle / Context</Label>
                            <Input
                                value={formData.subtitle || ""}
                                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                placeholder="e.g. Multiple Exits to Softbank"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Thought / Testimonial</Label>
                        <Textarea
                            required
                            rows={4}
                            value={formData.thought}
                            onChange={(e) => setFormData({ ...formData, thought: e.target.value })}
                            placeholder="Their recommendation text..."
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>LinkedIn URL</Label>
                        <Input
                            type="url"
                            value={formData.linkedinUrl || ""}
                            onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                            placeholder="https://linkedin.com/in/..."
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Profile Photo</Label>
                        <FileUpload
                            value={formData.photoUrl || ""}
                            onChange={(url) => setFormData({ ...formData, photoUrl: url })}
                            label="Upload Photo"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Status</Label>
                        <NativeSelect
                            options={STATUS_OPTIONS}
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' })}
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end gap-3">
                <Button variant="outline" type="button" onClick={() => router.back()}>
                    Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Save Recommendation
                </Button>
            </div>
        </form>
    );
}

