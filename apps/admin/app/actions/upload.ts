"use server";

import { adminStorage } from "@/lib/admin";

export async function uploadFile(formData: FormData) {
    try {
        if (!adminStorage) {
            throw new Error("Admin Storage not initialized");
        }

        const file = formData.get("file") as File;
        if (!file) {
            throw new Error("No file uploaded");
        }

        const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
        if (!bucketName) {
            throw new Error("Storage bucket not configured (NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET missing)");
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const fileName = `uploads/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`; // Sanitize name
        
        const bucket = adminStorage.bucket(bucketName);
        const fileRef = bucket.file(fileName);

        // Uniform Bucket Level Access enabled: cannot use 'public: true' (Predefined ACL)
        // Instead, we just save the file. 
        // Access control should be managed by making the bucket public for reading 
        // OR by using signed URLs if private. 
        // However, typically for a portfolio, we want these public.
        // Firebase Storage usually allows public access via the 'download tokens' (the long URL with ?alt=media&token=...)
        // OR if we want standard public access, we must make the bucket readable by allUsers.
        
        // Since we can't change ACLs per object, we just save:
        await fileRef.save(buffer, {
            contentType: file.type,
            // public: true, // REMOVED: Causes error with Uniform Bucket Level Access
        });

        // 1. Generate a Signed URL (most robust for private buckets)
        // const [signedUrl] = await fileRef.getSignedUrl({
        //     action: 'read',
        //     expires: '03-01-2500', // Far future
        // });
        // return { success: true, url: signedUrl };

        // 2. Firebase "Download URL" approach (Persistent public URL)
        // This effectively makes it public without ACLs, using a token.
        // We need to generate a token and set it in metadata.
        const { v4: uuidv4 } = require('uuid');
        const token = uuidv4();
        
        await fileRef.setMetadata({
            metadata: {
                firebaseStorageDownloadTokens: token,
            }
        });

        const encodedPath = encodeURIComponent(fileName);
        const firebaseUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodedPath}?alt=media&token=${token}`;

        return { success: true, url: firebaseUrl };

    } catch (error) {
        console.error("Upload error:", error);
        return { success: false, error: String(error) };
    }
}
