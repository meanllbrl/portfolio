"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { deleteProjectWithRelations, deletePostWithRelations } from "@/app/actions";

interface SafeDeleteButtonProps {
    id: string;
    type: 'project' | 'post';
}

export function SafeDeleteButton({ id, type }: SafeDeleteButtonProps) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this item? This action is irreversible and will remove relations from other content.")) {
            return;
        }

        startTransition(async () => {
            try {
                if (type === 'project') {
                    await deleteProjectWithRelations(id);
                } else {
                    await deletePostWithRelations(id);
                }
            } catch (error) {
                console.error("Delete failed:", error);
                alert("Failed to delete item.");
            }
        });
    };

    return (
        <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isPending}
        >
            <Trash2 className="h-4 w-4 mr-2" />
            {isPending ? "Deleting..." : "Delete"}
        </Button>
    );
}
