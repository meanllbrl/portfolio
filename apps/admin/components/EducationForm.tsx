"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Education, Link as LinkType } from "@/lib/types";
// Removed server actions
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface EducationFormProps {
    initialData?: Education;
}

export function EducationForm({ initialData }: EducationFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Education>(
        initialData || {
            title: "",
            department: "",
            years: "",
            gpa: "",
            urls: [],
            relatedPosts: [],
            relatedProjects: []
        }
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleLinkChange = (index: number, field: keyof LinkType, value: string) => {
        const newUrls = [...formData.urls];
        newUrls[index] = { ...newUrls[index], [field]: value };
        setFormData((prev) => ({ ...prev, urls: newUrls }));
    };

    const addLink = () => {
        setFormData((prev) => ({
            ...prev,
            urls: [...prev.urls, { title: "School Project", url: "" }],
        }));
    };

    const removeLink = (index: number) => {
        const newUrls = formData.urls.filter((_, i) => i !== index);
        setFormData((prev) => ({ ...prev, urls: newUrls }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { saveEducationWithRelations } = await import("@/app/actions");
            await saveEducationWithRelations(formData);

            router.push("/education");
            router.refresh();
        } catch (error) {
            console.error("Failed to save education:", error);
            alert("Failed to save. Check console for details.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
            <div className="flex items-center justify-between">
                <Link href="/education" className="text-sm text-gray-500 hover:text-gray-900 flex items-center">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to list
                </Link>
                <Button type="submit" disabled={loading}>
                    <Save className="mr-2 h-4 w-4" />
                    {loading ? "Saving..." : "Save Education"}
                </Button>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="title">School / University</Label>
                    <Input
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Stanford University"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="department">Department / Degree</Label>
                    <Input
                        id="department"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Computer Science"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="years">Years / Period</Label>
                        <Input
                            id="years"
                            name="years"
                            value={formData.years}
                            onChange={handleChange}
                            required
                            placeholder="e.g. 2016 - 2020"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="gpa">GPA</Label>
                        <Input
                            id="gpa"
                            name="gpa"
                            value={formData.gpa}
                            onChange={handleChange}
                            placeholder="e.g. 3.8/4.0"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label>Links / Projects</Label>
                        <Button type="button" variant="outline" size="sm" onClick={addLink}>
                            <Plus className="mr-2 h-4 w-4" /> Add Link
                        </Button>
                    </div>
                    {formData.urls.map((link, index) => (
                        <Card key={index} className="p-4">
                            <div className="flex items-end gap-2">
                                <div className="flex-1 space-y-2">
                                    <Label className="text-xs">Title</Label>
                                    <Input
                                        value={link.title}
                                        onChange={(e) => handleLinkChange(index, "title", e.target.value)}
                                        placeholder="Project Name"
                                    />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <Label className="text-xs">URL</Label>
                                    <Input
                                        value={link.url}
                                        onChange={(e) => handleLinkChange(index, "url", e.target.value)}
                                        placeholder="https://..."
                                    />
                                </div>
                                <Button type="button" variant="ghost" size="icon" onClick={() => removeLink(index)}>
                                    <Trash className="h-4 w-4 text-red-500" />
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </form>
    );
}
