"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";

interface DeleteButtonProps {
    id: string;
    collection: string;
}

export function DeleteButton({ id, collection }: DeleteButtonProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this item?")) return;

        setLoading(true);
        try {
            // Import all delete functions from server actions
            const { 
                deleteAchievement, 
                deleteProjectWithRelations, 
                deletePostWithRelations,
                deleteExperience,
                deleteEducation
            } = await import("@/app/actions");

            let result;
            switch (collection) {
                case "achievements":
                    result = await deleteAchievement(id);
                    break;
                case "projects":
                    result = await deleteProjectWithRelations(id);
                    break;
                case "posts":
                    result = await deletePostWithRelations(id);
                    break;
                case "experiences":
                    result = await deleteExperience(id);
                    break;
                case "educations":
                    result = await deleteEducation(id);
                    break;
                default:
                    throw new Error(`Unknown collection: ${collection}`);
            }

            if (result.success) {
                router.refresh();
            } else {
                const errorMsg = 'error' in result ? result.error : "Unknown error";
                alert("Failed to delete: " + errorMsg);
            }
        } catch (error) {
            console.error("Delete failed:", error);
            const errorMessage = error instanceof Error ? error.message : "Check console for details.";
            alert("Failed to delete: " + errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={loading}
        >
            <Trash className="mr-2 h-4 w-4" />
            {loading ? "Deleting..." : "Delete"}
        </Button>
    );
}
