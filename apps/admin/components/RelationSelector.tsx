"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Plus, X, Search, GripVertical } from "lucide-react";
import { RelatedItemStub } from "@/lib/types";
import { SortableList } from "@/components/SortableList";

interface RelationSelectorProps {
    collectionName: 'projects' | 'experiences' | 'educations' | 'posts';
    label: string;
    value: RelatedItemStub[];
    onChange: (items: RelatedItemStub[]) => void;
}

export function RelationSelector({ collectionName, label, value, onChange }: RelationSelectorProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [loading, setLoading] = useState(false);

    // Debounced search
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchTerm.length > 1) {
                setLoading(true);
                try {
                    // Dynamic import for client-side usage if possible, or fetch via API? 
                    // Using direct Firestore client SDK for search is easiest here.
                    const { collection, getDocs, getFirestore, query, where } = await import("firebase/firestore");
                    const { app } = await import("@/lib/firebase");
                    const db = getFirestore(app);

                    // Simple search by fetching all (small dataset) or querying.
                    // Ideally we'd have a server action or dedicated search index.
                    // For portfolio size, fetching collection and filtering client side is OK.
                    const querySnapshot = await getDocs(collection(db, collectionName));
                    const allItems = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                    const filtered = allItems.filter((item: any) =>
                        item.title?.toLowerCase().includes(searchTerm.toLowerCase())
                    );
                    setSearchResults(filtered);
                    setShowResults(true);
                } catch (error) {
                    console.error("Search failed", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setSearchResults([]);
                setShowResults(false);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, collectionName]);

    const addItem = (item: any) => {
        // Construct the stub
        const typeMap: Record<string, RelatedItemStub['type']> = {
            'projects': 'project',
            'experiences': 'experience',
            'educations': 'education',
            'posts': 'post'
        };

        const stub: RelatedItemStub = {
            id: item.id,
            title: item.title,
            url: item.link || item.urls?.[0]?.url || (item.slug ? `/posts/${item.slug}` : ""), // Fallback logic
            excerpt: item.description?.substring(0, 100) || item.excerpt || "",
            date: item.period || item.years || item.date || "",
            smallImage: item.image || item.smallImage || item.coverImage || "",
            coverImage: item.image || item.coverImage || "",
            type: typeMap[collectionName] || 'project'
        };

        // Prevent duplicates
        if (!value.find(v => v.id === stub.id)) {
            onChange([...value, stub]);
        }
        setSearchTerm("");
        setShowResults(false);
    };

    const removeItem = (id: string) => {
        onChange(value.filter(v => v.id !== id));
    };

    return (
        <div className="space-y-2 relative">
            <Label>{label}</Label>
            <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                />
            </div>

            {showResults && (
                <div className="absolute z-10 w-full bg-popover text-popover-foreground border opacity-100 shadow-md rounded-md mt-1 max-h-60 overflow-auto">
                    {loading && <div className="p-2 text-sm">Loading...</div>}
                    {!loading && searchResults.length === 0 && <div className="p-2 text-sm">No results found.</div>}
                    {searchResults.map(item => (
                        <div
                            key={item.id}
                            className="p-2 hover:bg-accent cursor-pointer flex items-center justify-between"
                            onClick={() => addItem(item)}
                        >
                            <span className="text-sm font-medium">{item.title}</span>
                            <Plus className="h-4 w-4" />
                        </div>
                    ))}
                </div>
            )}

            <div className="space-y-2 mt-2">
                <SortableList
                    items={value}
                    onReorder={onChange}
                    renderItem={(item) => (
                        <Card className="p-2 flex items-center justify-between group relative">
                            <div className="flex items-center gap-2">
                                <div className="cursor-grab active:cursor-grabbing text-muted-foreground mr-1">
                                    <GripVertical className="h-4 w-4" />
                                </div>
                                {item.smallImage && <img src={item.smallImage} alt="" className="h-8 w-8 rounded object-cover" />}
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium">{item.title}</span>
                                    <span className="text-xs text-muted-foreground capitalize">{item.type}</span>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                                <X className="h-4 w-4 text-destructive" />
                            </Button>
                        </Card>
                    )}
                />
            </div>
        </div>
    );
}
