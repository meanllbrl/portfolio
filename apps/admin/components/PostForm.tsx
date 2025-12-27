"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Save, ArrowLeft } from "lucide-react";
import { Post } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileUpload } from "@/components/FileUpload";
import { NativeSelect } from "@/components/ui/select";
import { savePostWithRelations } from "@/app/actions";
import { RelationSelector } from "@/components/RelationSelector";

interface PostFormProps {
    initialData?: Post;
}

export function PostForm({ initialData }: PostFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Post>(
        initialData || {
            title: "",
            tags: [], // Added
            excerpt: "",
            content: "",
            date: new Date().toISOString().split('T')[0],
            coverImage: "",
            smallImage: "",
            slug: "",
            status: "Draft",
            relatedProjects: [],
            relatedExperience: [],
            relatedEducation: []
        }
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Auto-generate slug from title if empty
    const handleTitleBlur = () => {
        if (!formData.slug && formData.title) {
            const slug = formData.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '');
            setFormData(prev => ({ ...prev, slug }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await savePostWithRelations(formData);
            if (result.success) {
                router.push("/posts");
                router.refresh();
            } else {
                const errorMessage = 'error' in result ? result.error : 'Unknown error';
                alert("Failed to save post: " + errorMessage);
            }
        } catch (error) {
            console.error("Failed to save post:", error);
            alert("Failed to save post. Check console for details.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
            <div className="flex items-center justify-between">
                <Link href="/posts" className="text-sm text-muted-foreground hover:text-foreground flex items-center">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to list
                </Link>
                <Button type="submit" disabled={loading}>
                    <Save className="mr-2 h-4 w-4" />
                    {loading ? "Saving..." : "Save Post"}
                </Button>
            </div>

            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            onBlur={handleTitleBlur}
                            required
                            placeholder="Post Title"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="slug">Slug (URL)</Label>
                        <Input
                            id="slug"
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            required
                            placeholder="post-title-url"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea
                        id="excerpt"
                        name="excerpt"
                        value={formData.excerpt}
                        onChange={handleChange}
                        required
                        placeholder="Brief summary for list view..."
                        className="h-20"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <Input
                            id="date"
                            name="date"
                            type="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Status</Label>
                        <NativeSelect
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            options={[
                                { label: "Draft", value: "Draft" },
                                { label: "Published", value: "Published" },
                            ]}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="coverImage">Cover Image</Label>
                        <FileUpload
                            value={formData.coverImage || ""}
                            onChange={(url) => setFormData((prev) => ({ ...prev, coverImage: url }))}
                            label="Cover Image"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="smallImage">Small Image</Label>
                        <FileUpload
                            value={formData.smallImage || ""}
                            onChange={(url) => setFormData((prev) => ({ ...prev, smallImage: url }))}
                            label="Thumbnail"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="content">Content (Markdown)</Label>
                    <Textarea
                        id="content"
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        required
                        placeholder="# Content here..."
                        className="min-h-[300px] font-mono"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {(formData.tags || []).map(tag => (
                            <span key={tag} className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm flex items-center gap-1">
                                {tag}
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, tags: prev.tags?.filter(t => t !== tag) }))}
                                    className="hover:text-destructive"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <Input
                            id="tags"
                            placeholder="Add a tag..."
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    const val = e.currentTarget.value.trim();
                                    if (val && !formData.tags?.includes(val)) {
                                        setFormData(prev => ({ ...prev, tags: [...(prev.tags || []), val] }));
                                        e.currentTarget.value = "";
                                    }
                                }
                            }}
                        />
                        <p className="text-xs text-muted-foreground self-center">Press Enter to add</p>
                    </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-semibold">Relationships</h3>

                    <RelationSelector
                        collectionName="projects"
                        label="Related Projects"
                        value={formData.relatedProjects || []}
                        onChange={(items) => setFormData(prev => ({ ...prev, relatedProjects: items }))}
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
            </div>
        </form>
    );
}
