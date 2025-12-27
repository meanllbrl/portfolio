"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Project } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileUpload } from "@/components/FileUpload";
import { Save, ArrowLeft, Plus, X } from "lucide-react";
import Link from "next/link";
import { UrlEditor } from "@/components/UrlEditor";
import { ChangelogEditor } from "@/components/ChangelogEditor";
import { RoadmapEditor } from "@/components/RoadmapEditor";
import { NativeSelect } from "./ui/select";
import { GalleryEditor } from "@/components/GalleryEditor";
import { Checkbox } from "@/components/ui/checkbox"; // We might need to create this or use simple input
import { saveProjectWithRelations } from "@/app/actions";
import { RelationSelector } from "@/components/RelationSelector";

interface ProjectFormProps {
    initialData?: Project;
}

export function ProjectForm({ initialData }: ProjectFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [tagInput, setTagInput] = useState("");
    const [formData, setFormData] = useState<Project>(
        initialData ? {
            ...initialData,
            tags: initialData.tags || [], // Ensure tags is always an array
            gallery: initialData.gallery || [], // Ensure gallery is always an array
            changelog: initialData.changelog || [],
            roadmap: initialData.roadmap || [],
            urls: initialData.urls || [],
            relatedPosts: initialData.relatedPosts || [],
            relatedExperience: initialData.relatedExperience || [],
            relatedEducation: initialData.relatedEducation || [],
            featured: initialData.featured ?? 0, // Ensure featured is set using nullish coalescing
            githubUrl: initialData.githubUrl || ""
        } : {
            title: "",
            subtitle: "",
            description: "",
            tags: [],
            image: "",
            smallImage: "",
            gallery: [],
            link: "",
            featured: 0,
            urls: [],
            githubUrl: "",
            status: "Ongoing",
            changelog: [],
            roadmap: [],
            relatedPosts: [],
            relatedExperience: [],
            relatedEducation: []
        }
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };


    const addTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            setFormData((prev) => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
            setTagInput("");
        }
    };

    const removeTag = (tagToRemove: string) => {
        setFormData((prev) => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await saveProjectWithRelations(formData);

            alert("Project saved successfully!");
            router.push("/projects");
            router.refresh();
        } catch (error) {
            console.error("Failed to save project:", error);
            alert("Failed to save.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
            <div className="flex items-center justify-between">
                <Link href="/projects" className="text-sm text-muted-foreground hover:text-foreground flex items-center">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to list
                </Link>
                <Button type="submit" disabled={loading}>
                    <Save className="mr-2 h-4 w-4" />
                    {loading ? "Saving..." : "Save Project"}
                </Button>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        placeholder="Project Name"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="subtitle">Subtitle</Label>
                    <Input
                        id="subtitle"
                        name="subtitle"
                        value={formData.subtitle}
                        onChange={handleChange}
                        required
                        placeholder="Brief slogan or stack summary"
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
                        placeholder="Detailed description..."
                        className="min-h-[100px]"
                    />
                </div>

                <div className="space-y-2">
                    <Label>Tags</Label>
                    <div className="flex gap-2">
                        <Input
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            placeholder="Add a tag (e.g. React)"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    addTag();
                                }
                            }}
                        />
                        <Button type="button" onClick={addTag} variant="outline">Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {formData.tags.map(tag => (
                            <div key={tag} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm flex items-center gap-1">
                                {tag}
                                <button type="button" onClick={() => removeTag(tag)} className="hover:text-destructive">
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Cover Image</Label>
                        <FileUpload
                            value={formData.image}
                            onChange={(url) => setFormData(prev => ({ ...prev, image: url }))}
                            label="Project Cover"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Small Image (Icon)</Label>
                        <FileUpload
                            value={formData.smallImage || ""}
                            onChange={(url) => setFormData(prev => ({ ...prev, smallImage: url }))}
                            label="Project Icon"
                        />
                    </div>
                </div>

                <GalleryEditor
                    value={formData.gallery || []}
                    onChange={(gallery) => setFormData(prev => ({ ...prev, gallery }))}
                />

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="link">Project Link</Label>
                        <Input
                            id="link"
                            name="link"
                            value={formData.link}
                            onChange={handleChange}
                            placeholder="/projects/mysite or https://..."
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="githubUrl">GitHub URL</Label>
                        <Input
                            id="githubUrl"
                            name="githubUrl"
                            value={formData.githubUrl || ""}
                            onChange={handleChange}
                            placeholder="https://github.com/..."
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Status</Label>
                        <NativeSelect
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            options={[
                                { label: "Ongoing", value: "Ongoing" },
                                { label: "Maintained", value: "Maintained" },
                                { label: "Closed", value: "Closed" },
                                { label: "Published", value: "Published" },
                            ]}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Featured Level</Label>
                        <NativeSelect
                            name="featured"
                            value={String(formData.featured)}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData(prev => ({ ...prev, featured: Number(e.target.value) }))}
                            options={[
                                { label: "Hidden (0)", value: "0" },
                                { label: "Standard (1)", value: "1" },
                                { label: "Featured (2)", value: "2" },
                                { label: "Priority (3)", value: "3" },
                            ]}
                        />
                    </div>
                </div>

                <UrlEditor
                    value={formData.urls || []}
                    onChange={(urls) => setFormData(prev => ({ ...prev, urls }))}
                />



                <RoadmapEditor
                    value={formData.roadmap || []}
                    onChange={(roadmap) => setFormData(prev => ({ ...prev, roadmap }))}
                />

                <ChangelogEditor
                    value={formData.changelog || []}
                    onChange={(logs) => setFormData(prev => ({ ...prev, changelog: logs }))}
                />
            </div>

            <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-semibold">Relationships</h3>

                <RelationSelector
                    collectionName="posts"
                    label="Related Posts"
                    value={formData.relatedPosts || []}
                    onChange={(items) => setFormData(prev => ({ ...prev, relatedPosts: items }))}
                />

                <RelationSelector
                    collectionName="experiences"
                    label="Related Experiences"
                    value={formData.relatedExperience || []}
                    onChange={(items) => setFormData(prev => ({ ...prev, relatedExperience: items }))}
                />

                <RelationSelector
                    collectionName="educations"
                    label="Related Education"
                    value={formData.relatedEducation || []}
                    onChange={(items) => setFormData(prev => ({ ...prev, relatedEducation: items }))}
                />
            </div>
        </form>
    );
}
