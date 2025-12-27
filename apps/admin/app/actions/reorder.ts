"use server";

import { adminDb } from "@/lib/admin";
import { revalidatePath } from "next/cache";

// Helper to ensure Admin SDK is initialized
function getAdminDb() {
    if (!adminDb) {
        throw new Error("Firebase Admin SDK not initialized. Check FIREBASE_ADMIN_SDK_KEY.");
    }
    return adminDb;
}

export async function updateCollectionOrder(
    collectionName: string,
    items: { id: string; sortOrder: number }[]
) {
    try {
        const db = getAdminDb();
        const batch = db.batch();

        items.forEach((item) => {
            const docRef = db.collection(collectionName).doc(item.id);
            batch.update(docRef, { sortOrder: item.sortOrder });
        });

        // Create a map of ID -> New SortOrder for O(1) lookup
        const orderMap = new Map(items.map(i => [i.id, i.sortOrder]));

        // --- Rollup Sync Logic ---
        // Define which collections and fields need to be updated when a specific collection is reordered
        const syncConfig: Record<string, { targets: string[], field: string }> = {
            "projects": {
                targets: ["experiences", "educations", "posts"],
                field: "relatedProjects"
            },
            "experiences": {
                targets: ["projects", "posts"],
                field: "relatedExperience"
            },
            "educations": {
                targets: ["projects", "posts"],
                field: "relatedEducation"
            }
        };

        const config = syncConfig[collectionName];
        if (config) {
            for (const targetCol of config.targets) {
                const targetSnapshot = await db.collection(targetCol).get();

                targetSnapshot.forEach(targetDoc => {
                    const data = targetDoc.data();
                    const list = data[config.field] as any[]; // e.g. relatedProjects array

                    if (Array.isArray(list) && list.length > 0) {
                        let hasChanges = false;
                        const newList = list.map(item => {
                            if (orderMap.has(item.id)) {
                                const newOrder = orderMap.get(item.id);
                                if (item.sortOrder !== newOrder) {
                                    hasChanges = true;
                                    return { ...item, sortOrder: newOrder };
                                }
                            }
                            return item;
                        });

                        if (hasChanges) {
                            // Sort the rollup list as well? 
                            // The user said "update sortOrder", implying the global order should probably be reflected or at least the value updated.
                            // If we just update the value, the list order stays same until next fetch/sort.
                            // But usually related lists might be sorted by this order. 
                            // Let's just update the value for now as requested.
                            batch.update(targetDoc.ref, { [config.field]: newList });
                        }
                    }
                });
            }
        }

        await batch.commit();

        // Revalidate relevant paths
        if (collectionName === "projects") revalidatePath("/projects");
        else if (collectionName === "experiences") revalidatePath("/experience");
        else if (collectionName === "educations") revalidatePath("/education");
        else revalidatePath(`/${collectionName}`); // fallback

        revalidatePath("/"); // Homepage might show these

        return { success: true };
    } catch (error) {
        console.error(`Failed to update ${collectionName} order:`, error);
        return { success: false, error: String(error) };
    }
}
