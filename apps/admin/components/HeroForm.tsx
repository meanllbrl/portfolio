"use client";

import { useState } from "react";
import { Hero } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileUpload } from "@/components/FileUpload";
import { Save, Loader2, Github, Linkedin, Mail } from "lucide-react";
import { saveHero } from "@/app/actions";

interface HeroFormProps {
    initialData: Hero | null;
}

export function HeroForm({ initialData }: HeroFormProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Hero>(
        initialData || {
            greeting: "",
            role: "",
            description: "",
            resumeUrl: "",
            imageUrl: "",
            fullName: "",
            logoText: "",
            tagline: "",
            socials: {
                github: "",
                linkedin: "",
                email: ""
            }
        }
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            socials: {
                ...prev.socials,
                [name]: value
            }
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await saveHero(formData);
            
            if (result.success) {
                alert("Hero section updated!");
            } else {
                alert("Failed to save: " + (result.error || "Unknown error"));
            }
        } catch (error: any) {
            console.error("Failed to save hero:", error);
            alert("Failed to save: " + (error.message || "Check console for details."));
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Hero Section */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold border-b pb-2">Main Content</h2>

                {/* Image First */}
                <div className="space-y-2">
                    <Label>Profile Image</Label>
                    <div className="flex items-center gap-4">
                        <div className="w-24 h-24 rounded-full overflow-hidden border">
                            {formData.imageUrl ? (
                                <img src={formData.imageUrl} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-muted flex items-center justify-center text-xs text-muted-foreground">No Img</div>
                            )}
                        </div>
                        <FileUpload
                            value={formData.imageUrl}
                            onChange={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
                            label="Upload Profile Image"
                            accept="image/*"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="John Doe"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="logoText">Logo Text</Label>
                    <Input
                        id="logoText"
                        name="logoText"
                        value={formData.logoText}
                        onChange={handleChange}
                        placeholder="JD."
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="tagline">Tagline (Footer)</Label>
                    <Input
                        id="tagline"
                        name="tagline"
                        value={formData.tagline}
                        onChange={handleChange}
                        placeholder="Building cool things..."
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="greeting">Greeting</Label>
                    <Input
                        id="greeting"
                        name="greeting"
                        value={formData.greeting}
                        onChange={handleChange}
                        placeholder="hi [name] here. 👋"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="role">Role / Headline</Label>
                    <Input
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        placeholder="28 yo technical product manager..."
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Description (Bio)</Label>
                    <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Building at the intersection of..."
                        className="min-h-[100px]"
                    />
                </div>

                <div className="space-y-2">
                    <Label>Resume (PDF)</Label>
                    <FileUpload
                        value={formData.resumeUrl}
                        onChange={(url) => setFormData(prev => ({ ...prev, resumeUrl: url }))}
                        label="Upload Resume (PDF)"
                        accept="application/pdf"
                    />
                </div>
            </div>

            {/* Socials Section */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold border-b pb-2">Social Links</h2>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="github" className="flex items-center gap-2"><Github className="w-4 h-4" /> GitHub URL</Label>
                        <Input
                            id="github"
                            name="github"
                            value={formData.socials.github}
                            onChange={handleSocialChange}
                            placeholder="https://github.com/..."
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="linkedin" className="flex items-center gap-2"><Linkedin className="w-4 h-4" /> LinkedIn URL</Label>
                        <Input
                            id="linkedin"
                            name="linkedin"
                            value={formData.socials.linkedin}
                            onChange={handleSocialChange}
                            placeholder="https://linkedin.com/in/..."
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-2"><Mail className="w-4 h-4" /> Email Address</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.socials.email}
                            onChange={handleSocialChange}
                            placeholder="your-email@example.com"
                        />
                    </div>
                </div>
            </div>

            <div className="sticky bottom-0 bg-background py-4 border-t">
                <Button type="submit" disabled={loading} className="w-full">
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save All Changes
                </Button>
            </div>
        </form>
    );
}

