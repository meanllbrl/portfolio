"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, FileText, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { uploadFile } from "@/app/actions/upload";

interface FileUploadProps {
    value: string;
    onChange: (url: string) => void;
    label?: string;
    disabled?: boolean;
    accept?: string; // "image/*" or "application/pdf" or both
    maxSizeMB?: number;
    compact?: boolean; // For small inline uploads (like icons)
}

export function FileUpload({
    value,
    onChange,
    label = "Upload File",
    disabled,
    accept = "image/*",
    maxSizeMB = 5,
    compact = false
}: FileUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > maxSizeMB * 1024 * 1024) {
            setError(`File too large (max ${maxSizeMB}MB)`);
            return;
        }

        setUploading(true);
        setError("");

        try {
            const formData = new FormData();
            formData.append("file", file);

            const result = await uploadFile(formData);

            if (result.success && result.url) {
                onChange(result.url);
            } else {
                throw new Error(result.error || "Upload failed");
            }
        } catch (err) {
            console.error("Upload failed", err);
            setError("Upload failed. Try again.");
        } finally {
            setUploading(false);
            e.target.value = "";
        }
    };

    const handleRemove = () => {
        onChange("");
    };

    const isImage = value.match(/\.(jpg|jpeg|png|gif|webp)$/i) || (value.includes("firebasestorage") && !value.includes(".pdf") && !value.includes("alt=media&token=")); 
    // Note: The previous check was a bit loose. If it's a PDF, we don't show preview.

    const showPreview = (accept.startsWith("image") || isImage) && !value.toLowerCase().includes(".pdf");

    // Compact mode - just a small upload button
    if (compact) {
        return (
            <label className="block cursor-pointer">
                <span className="text-xs text-blue-500 hover:underline">
                    {uploading ? "..." : value ? "Change" : "Upload"}
                </span>
                <input
                    type="file"
                    className="hidden"
                    onChange={handleUpload}
                    accept={accept}
                    disabled={disabled || uploading}
                />
            </label>
        );
    }

    return (
        <div className="space-y-4 w-full">
            {label && <Label>{label}</Label>}

            {value ? (
                <div className="relative w-full max-w-xs overflow-hidden rounded-lg border bg-secondary">
                    {showPreview ? (
                        <div className="relative aspect-video">
                            <Image
                                src={value}
                                alt="Uploaded file"
                                fill
                                className="object-cover"
                            />
                        </div>
                    ) : (
                        <div className="flex items-center justify-center p-8">
                            <FileText className="h-10 w-10 text-muted-foreground mr-2" />
                            <Link href={value} target="_blank" className="text-sm underline text-blue-500 truncate max-w-[150px]">
                                View File
                            </Link>
                        </div>
                    )}

                    <Button
                        type="button"
                        onClick={handleRemove}
                        variant="destructive"
                        size="icon"
                        className="absolute right-2 top-2 h-6 w-6 z-10"
                        disabled={disabled}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            ) : (
                <div className="flex w-full items-center justify-center">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            {uploading ? (
                                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                            ) : (
                                <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                            )}
                            <p className="mb-2 text-sm text-muted-foreground">
                                {uploading ? "Uploading..." : `Click to upload (${accept === "image/*" ? "Image" : "File"})`}
                            </p>
                        </div>
                        <input
                            type="file"
                            className="hidden"
                            onChange={handleUpload}
                            accept={accept}
                            disabled={disabled || uploading}
                        />
                    </label>
                </div>
            )}
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
}
