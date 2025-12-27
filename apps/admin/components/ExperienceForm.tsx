"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Experience, Link as LinkType } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { FileUpload } from "@/components/FileUpload";
import { UrlEditor } from "@/components/UrlEditor";

interface ExperienceFormProps {
    initialData?: Experience;
}

export function ExperienceForm({ initialData }: ExperienceFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Experience>(
        initialData || {
            title: "",
            workTitle: "",
            years: "",
            description: "",
            image: "",
            urls: [],
            relatedPosts: [],
            relatedProjects: []
        }
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { saveExperienceWithRelations } = await import("@/app/actions");
            await saveExperienceWithRelations(formData);

            router.push("/experience");
            router.refresh();
        } catch (error) {
            console.error("Failed to save experience:", error);
            alert("Failed to save. Check console for details.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
            <div className="flex items-center justify-between">
                <Link href="/experience" className="text-sm text-gray-500 hover:text-gray-900 flex items-center">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to list
                </Link>
                <Button type="submit" disabled={loading}>
                    <Save className="mr-2 h-4 w-4" />
                    {loading ? "Saving..." : "Save Experience"}
                </Button>
            </div>

            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Company / Title</Label>
                        <Input
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder="e.g. Google"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="workTitle">Role / Work Title</Label>
                        <Input
                            id="workTitle"
                            name="workTitle"
                            value={formData.workTitle}
                            onChange={handleChange}
                            required
                            placeholder="e.g. Product Manager"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="years">Years / Period</Label>
                    <Input
                        id="years"
                        name="years"
                        value={formData.years}
                        onChange={handleChange}
                        required
                        placeholder="e.g. 2022 - Present"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="image">Image</Label>
                    <FileUpload
                        value={formData.image || ""}
                        onChange={(url) => setFormData((prev) => ({ ...prev, image: url }))}
                        label="Project/Company Logo"
                        accept="image/*"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Description (Markdown)</Label>
                    <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        placeholder="Describe your role..."
                        className="min-h-[200px] font-mono"
                    />
                </div>

                <div className="space-y-2">
                    <UrlEditor
                        value={formData.urls}
                        onChange={(urls) => setFormData(prev => ({ ...prev, urls }))}
                    />
                </div>
            </div>
        </form>
    );
}
