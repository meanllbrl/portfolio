/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { adminDb } from "@/lib/admin"; // Import Admin SDK
import { Education, Experience, Hero, Project, Post, Achievement } from "@/lib/types";
import fs from "fs/promises";
import path from "path";

// Helper to ensure Admin SDK is initialized
function getAdminDb() {
    if (!adminDb) {
        throw new Error("Firebase Admin SDK not initialized. Check FIREBASE_ADMIN_SDK_KEY.");
    }
    return adminDb;
}

// --- Experiences ---

export async function getExperiences(): Promise<Experience[]> {
    const db = getAdminDb();
    const snapshot = await db.collection("experiences").get();
    const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Experience));

    items.sort((a, b) => {
        if (typeof a.sortOrder === 'number' && typeof b.sortOrder === 'number') return a.sortOrder - b.sortOrder;
        if (typeof a.sortOrder === 'number') return -1;
        if (typeof b.sortOrder === 'number') return 1;
        return 0;
    });
    return items;
}

export async function getExperience(id: string): Promise<Experience | null> {
    const db = getAdminDb();
    const docSnap = await db.collection("experiences").doc(id).get();
    if (docSnap.exists) {
        return { id: docSnap.id, ...docSnap.data() } as Experience;
    }
    return null;
}

// --- Education ---

export async function getEducations(): Promise<Education[]> {
    const db = getAdminDb();
    const snapshot = await db.collection("educations").get();
    const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Education));

    items.sort((a, b) => {
        if (typeof a.sortOrder === 'number' && typeof b.sortOrder === 'number') return a.sortOrder - b.sortOrder;
        if (typeof a.sortOrder === 'number') return -1;
        if (typeof b.sortOrder === 'number') return 1;
        return 0;
    });
    return items;
}

export async function getEducation(id: string): Promise<Education | null> {
    const db = getAdminDb();
    const docSnap = await db.collection("educations").doc(id).get();
    if (docSnap.exists) {
        return { id: docSnap.id, ...docSnap.data() } as Education;
    }
    return null;
}

// --- Projects ---

export async function getProjects(): Promise<Project[]> {
    const db = getAdminDb();
    const snapshot = await db.collection("projects").get();
    const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));

    // Sort by sortOrder (asc) first
    projects.sort((a, b) => {
        if (typeof a.sortOrder === 'number' && typeof b.sortOrder === 'number') {
            return a.sortOrder - b.sortOrder;
        }
        if (typeof a.sortOrder === 'number') return -1;
        if (typeof b.sortOrder === 'number') return 1;
        return 0;
    });

    return projects;
}

export async function getProject(id: string): Promise<Project | null> {
    const db = getAdminDb();
    const docSnap = await db.collection("projects").doc(id).get();
    if (docSnap.exists) {
        return { id: docSnap.id, ...docSnap.data() } as Project;
    }
    return null;
}

// --- Posts ---

export async function getPosts(): Promise<Post[]> {
    const db = getAdminDb();
    const snapshot = await db.collection("posts").get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
}

export async function getPost(id: string): Promise<Post | null> {
    const db = getAdminDb();
    const docSnap = await db.collection("posts").doc(id).get();
    if (docSnap.exists) {
        return { id: docSnap.id, ...docSnap.data() } as Post;
    }
    return null;
}

// --- Hero ---

export async function getHero(): Promise<Hero | null> {
    const db = getAdminDb();
    const docSnap = await db.collection("settings").doc("hero").get();
    if (docSnap.exists) {
        return docSnap.data() as Hero;
    }
    return null;
}

// --- Sync ---

function formatExperience(experiences: Experience[]) {
    return JSON.stringify(experiences.map(e => ({
        id: e.id,
        company: e.title,
        role: e.workTitle,
        period: e.years,
        description: [e.description], // Keeping as array to match legacy data structure
        image: e.image,
        urls: e.urls
    })), null, 2);
}

function formatEducation(educations: Education[]) {
    return JSON.stringify(educations.map(e => ({
        id: e.id,
        school: e.title,
        degree: e.department,
        period: e.years,
        gpa: e.gpa,
        urls: e.urls
    })), null, 2);
}

function formatProjects(projects: Project[]) {
    return JSON.stringify(projects, null, 2);
}

function formatPosts(posts: Post[]) {
    return JSON.stringify(posts, null, 2);
}

export async function syncData() {
    const experiences = await getExperiences();
    const educations = await getEducations();
    const projects = await getProjects();
    const posts = await getPosts();
    const hero = await getHero();

    // Relative path to the file (from portfolio_admin to portfolio)
    const filePath = path.resolve(process.cwd(), "..", "portfolio", "lib", "data.ts");

    try {
        let content = await fs.readFile(filePath, "utf-8");

        if (hero) {
            content = content.replace(/label: "Resume",\s*href: ".*?"/, `label: "Resume",\n      href: "${hero.resumeUrl}"`);

            if (hero.socials) {
                if (hero.socials.github) {
                    content = content.replace(/label: "GitHub",\s*href: ".*?"/, `label: "GitHub",\n      href: "${hero.socials.github}"`);
                }
                if (hero.socials.linkedin) {
                    content = content.replace(/label: "LinkedIn",\s*href: ".*?"/, `label: "LinkedIn",\n      href: "${hero.socials.linkedin}"`);
                }
                if (hero.socials.email) {
                    const emailHref = hero.socials.email.startsWith("mailto:") ? hero.socials.email : `mailto:${hero.socials.email}`;
                    content = content.replace(/label: "Email",\s*href: ".*?"/, `label: "Email",\n      href: "${emailHref}"`);
                }
            }
        }

        // 2. Sync Projects
        const projectsStr = formatProjects(projects);
        const projRegex = /export const projectsData = \[\s*([\s\S]*?)\];/;
        if (content.match(projRegex)) {
            content = content.replace(projRegex, `export const projectsData = ${projectsStr};`);
        }

        // 3. Sync Experiences
        const expStr = formatExperience(experiences);
        const expRegex = /export const workExperienceData = \[\s*([\s\S]*?)\];/;
        if (content.match(expRegex)) {
            content = content.replace(expRegex, `export const workExperienceData = ${expStr};`);
        }

        // 4. Sync Education
        const eduStr = formatEducation(educations);
        const eduRegex = /export const educationData = \[\s*([\s\S]*?)\];/;
        if (content.match(eduRegex)) {
            content = content.replace(eduRegex, `export const educationData = ${eduStr};`);
        }

        // 5. Sync Posts (New)
        const postsStr = formatPosts(posts);
        const postsRegex = /export const postsData = \[\s*([\s\S]*?)\];/;
        if (content.match(postsRegex)) {
            content = content.replace(postsRegex, `export const postsData = ${postsStr};`);
        } else {
            content += `\n\nexport const postsData = ${postsStr};`;
        }

        await fs.writeFile(filePath, content, "utf-8");
        return { success: true };
    } catch (error) {
        console.error("Sync failed:", error);
        return { success: false, error: String(error) };
    }
}

// --- Sync Logic ---

// Helper to create the Post Stub
function createPostStub(post: Post): import("@/lib/types").RelatedItemStub {
    return {
        id: post.id!,
        title: post.title,
        url: `/posts/${post.slug}`, // Assuming internal URL structure
        excerpt: post.excerpt,
        date: post.date,
        smallImage: post.smallImage || post.coverImage,
        coverImage: post.coverImage,
        type: 'post',
        sortOrder: 0 // Posts usually don't have sortOrder, defaulting to 0 or we should add it to Post schema?
    };
}

export async function savePostWithRelations(postData: Post) {
    try {
        const db = getAdminDb(); // Use Admin DB

        // 1. Prepare Data
        const isNew = !postData.id;
        let finalId = postData.id;
        const collectionRef = db.collection("posts");
        
        if (isNew) {
            // Admin SDK doesn't have 'doc()' to generate ID automatically in the same way for refs,
            // but collection.doc() generates a new ref with auto ID.
            const newDocRef = collectionRef.doc();
            finalId = newDocRef.id;
            postData.id = finalId;
        }
        
        const postRef = collectionRef.doc(finalId!);

        // 2. Fetch Old Data (if exists) for Diffing
        let oldPost: Post | null = null;
        if (!isNew) {
            const oldSnap = await postRef.get();
            if (oldSnap.exists) {
                oldPost = { id: oldSnap.id, ...oldSnap.data() } as Post;
            }
        }

        // 3. Save the Post
        await postRef.set(postData);

    // 3.5 Sync Master Tag List
    if (postData.tags && postData.tags.length > 0) {
        const tagRef = db.collection("settings").doc("tags");
        const tagSnap = await tagRef.get();
        let currentTags = [];
        if (tagSnap.exists) {
            currentTags = tagSnap.data()?.values || [];
        }
        const newTags = Array.from(new Set([...currentTags, ...postData.tags]));
        if (newTags.length > currentTags.length) {
            await tagRef.set({ values: newTags }, { merge: true });
        }
    }

    // 4. Sync Relations
    const relations = [
        ...(postData.relatedProjects || []),
        ...(postData.relatedExperience || []),
        ...(postData.relatedEducation || [])
    ];

    const oldRelations = oldPost ? [
        ...(oldPost.relatedProjects || []),
        ...(oldPost.relatedExperience || []),
        ...(oldPost.relatedEducation || [])
    ] : [];

    const postStub = createPostStub(postData);

    // Handle NEW/UPDATED relations
    for (const rel of relations) {
        const collectionName = rel.type === 'project' ? 'projects' : rel.type === 'experience' ? 'experiences' : 'educations';
        const docRef = db.collection(collectionName).doc(rel.id);
        const docSnap = await docRef.get();

        if (docSnap.exists) {
            const data = docSnap.data();
            const relatedPosts = (data?.relatedPosts || []) as import("@/lib/types").RelatedItemStub[];

            // Preserve Index Logic
            const existingIndex = relatedPosts.findIndex(p => p.id === finalId);
            if (existingIndex !== -1) {
                relatedPosts[existingIndex] = postStub;
            } else {
                relatedPosts.push(postStub);
            }

            await docRef.update({ relatedPosts });
        }
    }

    // Handle REMOVED relations
    // Find items in oldRelations that are NOT in new relations
    const removedStats = oldRelations.filter(old => !relations.find(n => n.id === old.id));

    for (const old of removedStats) {
        const collectionName = old.type === 'project' ? 'projects' : old.type === 'experience' ? 'experiences' : 'educations';
        const docRef = db.collection(collectionName).doc(old.id);
        const docSnap = await docRef.get();

        if (docSnap.exists) {
            const data = docSnap.data();
            const relatedPosts = (data?.relatedPosts || []) as import("@/lib/types").RelatedItemStub[];

            // Remove the stub
            const filtered = relatedPosts.filter(p => p.id !== finalId);
            await docRef.update({ relatedPosts: filtered });
        }
    }

        const { revalidatePath } = await import("next/cache");
        revalidatePath("/posts");
        return { success: true, id: finalId };
    } catch (error) {
        console.error("Error saving post:", error);
        return { success: false, error: String(error) };
    }
}

// Helper to assign proper sortOrder for new items
async function assignSortOrder(collectionName: string) {
    const db = getAdminDb();
    const snapshot = await db.collection(collectionName).get();
    
    if (snapshot.empty) return 0;

    let maxOrder = -1;
    snapshot.forEach(doc => {
        const data = doc.data();
        if (typeof data.sortOrder === 'number') {
            if (data.sortOrder > maxOrder) maxOrder = data.sortOrder;
        }
    });

    return maxOrder + 1;
}

// Helper to create the Project Stub
function createProjectStub(project: Project): import("@/lib/types").RelatedItemStub {
    return {
        id: project.id!,
        title: project.title,
        url: project.link,
        excerpt: project.description.substring(0, 100),
        date: "",
        smallImage: project.smallImage || project.image,
        coverImage: project.image,
        type: 'project',
        featured: project.featured,
        sortOrder: typeof project.sortOrder === 'number' ? project.sortOrder : 999
    };
}

// Helper to create the Experience Stub
function createExperienceStub(experience: Experience): import("@/lib/types").RelatedItemStub {
    return {
        id: experience.id!,
        title: experience.title,
        url: `/experience`,
        excerpt: experience.workTitle,
        type: 'experience',
        featured: 0,
        sortOrder: typeof experience.sortOrder === 'number' ? experience.sortOrder : 999
    };
}

// Helper to create the Education Stub
function createEducationStub(education: Education): import("@/lib/types").RelatedItemStub {
    return {
        id: education.id!,
        title: education.title,
        url: `/education`,
        excerpt: education.department,
        type: 'education',
        featured: 0,
        sortOrder: typeof education.sortOrder === 'number' ? education.sortOrder : 999
    };
}

export async function saveProjectWithRelations(projectData: Project) {
    const db = getAdminDb();

    // 1. Prepare Data
    const isNew = !projectData.id;
    let finalId = projectData.id;

    // Helper to generate slug from title
    const slugify = (text: string) => {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')        // Replace spaces with -
            .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
            .replace(/\-\-+/g, '-');     // Replace multiple - with single -
    };

    // Helper to generate unique ID
    const generateUniqueProjectId = async (title: string) => {
        const baseSlug = slugify(title);
        let candidate = baseSlug;
        let counter = 2;

        while (true) {
            const docRef = db.collection("projects").doc(candidate);
            const docSnap = await docRef.get();
            if (!docSnap.exists) {
                return candidate;
            }
            candidate = `${baseSlug}-${counter}`;
            counter++;
        }
    };

    if (isNew) {
        // Generate ID from title if new
        finalId = await generateUniqueProjectId(projectData.title);
        projectData.id = finalId;
        // Auto-assign sortOrder
        if (typeof projectData.sortOrder !== 'number') {
            projectData.sortOrder = await assignSortOrder("projects");
        }
    }

    const projectRef = db.collection("projects").doc(finalId!);

    // 2. Fetch Old Data (if exists) for Diffing
    let oldProject: Project | null = null;
    if (!isNew) {
        const oldSnap = await projectRef.get();
        if (oldSnap.exists) {
            oldProject = { id: oldSnap.id, ...oldSnap.data() } as Project;
            // Preserve existing sortOrder if not updated
            if (typeof projectData.sortOrder !== 'number') {
                if (typeof oldProject.sortOrder === 'number') {
                    projectData.sortOrder = oldProject.sortOrder;
                } else {
                    // Backfill if missing in old data
                    projectData.sortOrder = await assignSortOrder("projects");
                }
            }
        }
    } else {
        // If not new but old data fetch failed (unlikely), assign
        if (typeof projectData.sortOrder !== 'number') {
            projectData.sortOrder = await assignSortOrder("projects");
        }
    }

    // 3. Save the Project
    await projectRef.set(projectData);

    // 4. Sync Relations
    const relations = [
        ...(projectData.relatedPosts || []),
        ...(projectData.relatedExperience || []),
        ...(projectData.relatedEducation || [])
    ];

    const oldRelations = oldProject ? [
        ...(oldProject.relatedPosts || []),
        ...(oldProject.relatedExperience || []),
        ...(oldProject.relatedEducation || [])
    ] : [];

    const projectStub = createProjectStub(projectData);

    // Handle NEW/UPDATED relations
    for (const rel of relations) {
        const collectionName = rel.type === 'post' ? 'posts' : rel.type === 'experience' ? 'experiences' : 'educations';
        const docRef = db.collection(collectionName).doc(rel.id);
        const docSnap = await docRef.get();

        if (docSnap.exists) {
            const data = docSnap.data();
            const relatedProjects = (data?.relatedProjects || []) as import("@/lib/types").RelatedItemStub[];

            // Preserve Index Logic
            const existingIndex = relatedProjects.findIndex(p => p.id === finalId);
            if (existingIndex !== -1) {
                relatedProjects[existingIndex] = projectStub;
            } else {
                relatedProjects.push(projectStub);
            }

            await docRef.update({ relatedProjects });
        }
    }

    // Handle REMOVED relations
    const removedStats = oldRelations.filter(old => !relations.find(n => n.id === old.id));

    for (const old of removedStats) {
        const collectionName = old.type === 'post' ? 'posts' : old.type === 'experience' ? 'experiences' : 'educations';
        const docRef = db.collection(collectionName).doc(old.id);
        const docSnap = await docRef.get();

        if (docSnap.exists) {
            const data = docSnap.data();
            const relatedProjects = (data?.relatedProjects || []) as import("@/lib/types").RelatedItemStub[];

            // Remove the stub
            const filtered = relatedProjects.filter(p => p.id !== finalId);
            await docRef.update({ relatedProjects: filtered });
        }
    }

    const { revalidatePath } = await import("next/cache");
    revalidatePath("/projects");
    revalidatePath("/experience");
    revalidatePath("/education");
}


export async function saveExperienceWithRelations(experienceData: Experience) {
    const db = getAdminDb();

    // 1. Prepare Data
    const isNew = !experienceData.id;
    let finalId = experienceData.id;

    if (isNew) {
        // Auto-assign sortOrder
        if (typeof experienceData.sortOrder !== 'number') {
            experienceData.sortOrder = await assignSortOrder("experiences");
        }
        // Let Firestore generate ID
        if (!finalId) {
            const ref = db.collection("experiences").doc();
            finalId = ref.id;
            experienceData.id = finalId;
        }
    }

    const expRef = db.collection("experiences").doc(finalId!);

    // 2. Fetch Old Data
    let oldExperience: Experience | null = null;
    if (!isNew) {
        const oldSnap = await expRef.get();
        if (oldSnap.exists) {
            oldExperience = { id: oldSnap.id, ...oldSnap.data() } as Experience;
            if (typeof experienceData.sortOrder !== 'number') {
                if (typeof oldExperience.sortOrder === 'number') {
                    experienceData.sortOrder = oldExperience.sortOrder;
                } else {
                    experienceData.sortOrder = await assignSortOrder("experiences");
                }
            }
        }
    } else {
        if (typeof experienceData.sortOrder !== 'number') {
            experienceData.sortOrder = await assignSortOrder("experiences");
        }
    }

    // 3. Save
    await expRef.set(experienceData);

    // 4. Sync Relations (Experience only relates to Projects and Posts usually)
    const relations = [
        ...(experienceData.relatedPosts || []),
        ...(experienceData.relatedProjects || [])
    ];

    const oldRelations = oldExperience ? [
        ...(oldExperience.relatedPosts || []),
        ...(oldExperience.relatedProjects || [])
    ] : [];

    const expStub = createExperienceStub(experienceData);

    for (const rel of relations) {
        const collectionName = rel.type === 'post' ? 'posts' : 'projects';

        const docRef = db.collection(collectionName).doc(rel.id);
        const docSnap = await docRef.get();

        if (docSnap.exists) {
            const data = docSnap.data();
            const relatedList = (data?.relatedExperience || []) as import("@/lib/types").RelatedItemStub[];

            const existingIndex = relatedList.findIndex(p => p.id === finalId);
            if (existingIndex !== -1) {
                relatedList[existingIndex] = expStub;
            } else {
                relatedList.push(expStub);
            }
            await docRef.update({ relatedExperience: relatedList });
        }
    }

    // Handle Removed
    const removedStats = oldRelations.filter(old => !relations.find(n => n.id === old.id));
    for (const old of removedStats) {
        const collectionName = old.type === 'post' ? 'posts' : 'projects';
        const docRef = db.collection(collectionName).doc(old.id);
        const docSnap = await docRef.get();
        if (docSnap.exists) {
            const data = docSnap.data();
            const relatedList = (data?.relatedExperience || []) as import("@/lib/types").RelatedItemStub[];
            const filtered = relatedList.filter(p => p.id !== finalId);
            await docRef.update({ relatedExperience: filtered });
        }
    }

    const { revalidatePath } = await import("next/cache");
    revalidatePath("/experience");
    revalidatePath("/projects");
}

export async function saveEducationWithRelations(educationData: Education) {
    const db = getAdminDb();

    // 1. Prepare Data
    const isNew = !educationData.id;
    let finalId = educationData.id;

    if (isNew) {
        if (typeof educationData.sortOrder !== 'number') {
            educationData.sortOrder = await assignSortOrder("educations");
        }
        if (!finalId) {
            const ref = db.collection("educations").doc();
            finalId = ref.id;
            educationData.id = finalId;
        }
    }

    const eduRef = db.collection("educations").doc(finalId!);

    // 2. Fetch Old Data
    let oldEducation: Education | null = null;
    if (!isNew) {
        const oldSnap = await eduRef.get();
        if (oldSnap.exists) {
            oldEducation = { id: oldSnap.id, ...oldSnap.data() } as Education;
            if (typeof educationData.sortOrder !== 'number') {
                if (typeof oldEducation.sortOrder === 'number') {
                    educationData.sortOrder = oldEducation.sortOrder;
                } else {
                    educationData.sortOrder = await assignSortOrder("educations");
                }
            }
        }
    } else {
        if (typeof educationData.sortOrder !== 'number') {
            educationData.sortOrder = await assignSortOrder("educations");
        }
    }

    // 3. Save
    await eduRef.set(educationData);

    // 4. Sync Relations
    const relations = [
        ...(educationData.relatedPosts || []),
        ...(educationData.relatedProjects || [])
    ];

    const oldRelations = oldEducation ? [
        ...(oldEducation.relatedPosts || []),
        ...(oldEducation.relatedProjects || [])
    ] : [];

    const eduStub = createEducationStub(educationData);

    for (const rel of relations) {
        const collectionName = rel.type === 'post' ? 'posts' : 'projects';
        const docRef = db.collection(collectionName).doc(rel.id);
        const docSnap = await docRef.get();
        if (docSnap.exists) {
            const data = docSnap.data();
            const relatedList = (data?.relatedEducation || []) as import("@/lib/types").RelatedItemStub[];
            const existingIndex = relatedList.findIndex(p => p.id === finalId);
            if (existingIndex !== -1) {
                relatedList[existingIndex] = eduStub;
            } else {
                relatedList.push(eduStub);
            }
            await docRef.update({ relatedEducation: relatedList });
        }
    }

    const removedStats = oldRelations.filter(old => !relations.find(n => n.id === old.id));
    for (const old of removedStats) {
        const collectionName = old.type === 'post' ? 'posts' : 'projects';
        const docRef = db.collection(collectionName).doc(old.id);
        const docSnap = await docRef.get();
        if (docSnap.exists) {
            const data = docSnap.data();
            const relatedList = (data?.relatedEducation || []) as import("@/lib/types").RelatedItemStub[];
            const filtered = relatedList.filter(p => p.id !== finalId);
            await docRef.update({ relatedEducation: filtered });
        }
    }

    const { revalidatePath } = await import("next/cache");
    revalidatePath("/education");
    revalidatePath("/projects");
}

// --- Deletion Handlers ---

export async function deleteProjectWithRelations(projectId: string) {
    const db = getAdminDb();
    const { revalidatePath } = await import("next/cache");

    const projectRef = db.collection("projects").doc(projectId);
    const projectSnap = await projectRef.get();

    if (!projectSnap.exists) {
        return { success: false, error: "Project not found" };
    }

    const projectData = projectSnap.data() as Project;

    // Cleanup Relations
    const relations = [
        ...(projectData.relatedPosts || []),
        ...(projectData.relatedExperience || []),
        ...(projectData.relatedEducation || [])
    ];

    for (const rel of relations) {
        const collectionName = rel.type === 'post' ? 'posts' : rel.type === 'experience' ? 'experiences' : 'educations';
        const docRef = db.collection(collectionName).doc(rel.id);
        const docSnap = await docRef.get();

        if (docSnap.exists) {
            const data = docSnap.data();
            const relatedProjects = (data?.relatedProjects || []) as import("@/lib/types").RelatedItemStub[];

            // Remove the stub of this project
            const filtered = relatedProjects.filter(p => p.id !== projectId);
            await docRef.update({ relatedProjects: filtered });
        }
    }

    await projectRef.delete();
    revalidatePath("/projects");
    return { success: true };
}

export async function deletePostWithRelations(postId: string) {
    const db = getAdminDb();
    const { revalidatePath } = await import("next/cache");

    const postRef = db.collection("posts").doc(postId);
    const postSnap = await postRef.get();

    if (!postSnap.exists) {
        return { success: false, error: "Post not found" };
    }

    const postData = postSnap.data() as Post;

    // Cleanup Relations
    const relations = [
        ...(postData.relatedProjects || []),
        ...(postData.relatedExperience || []),
        ...(postData.relatedEducation || [])
    ];

    for (const rel of relations) {
        const collectionName = rel.type === 'project' ? 'projects' : rel.type === 'experience' ? 'experiences' : 'educations';
        const docRef = db.collection(collectionName).doc(rel.id);
        const docSnap = await docRef.get();

        if (docSnap.exists) {
            const data = docSnap.data();
            const relatedPosts = (data?.relatedPosts || []) as import("@/lib/types").RelatedItemStub[];

            // Remove the stub of this post
            const filtered = relatedPosts.filter(p => p.id !== postId);
            await docRef.update({ relatedPosts: filtered });
        }
    }

    await postRef.delete();
    revalidatePath("/posts");
    return { success: true };
}

// --- Achievements ---

export async function getAchievements(): Promise<Achievement[]> {
    const db = getAdminDb();
    const snapshot = await db.collection("achievements").get();
    const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Achievement));

    // Sort by sortOrder
    items.sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999));

    return items;
}

export async function getAchievement(id: string): Promise<Achievement | null> {
    const db = getAdminDb();
    const docSnap = await db.collection("achievements").doc(id).get();
    if (docSnap.exists) {
        return { id: docSnap.id, ...docSnap.data() } as Achievement;
    }
    return null;
}

export async function saveAchievement(achievement: Achievement) {
    try {
        const db = getAdminDb();

        const isNew = !achievement.id;
        let id: string;
        
        if (isNew) {
            // Create new document reference to get auto-generated ID
            const newDocRef = db.collection("achievements").doc();
            id = newDocRef.id;
            achievement.id = id;
        } else {
            // Use existing ID for editing
            id = achievement.id!;
        }

        // Auto-assign sortOrder if new or missing
        if (typeof achievement.sortOrder !== 'number') {
            achievement.sortOrder = await assignSortOrder("achievements");
        }

        // Don't save the id field in the document data (it's the document ID)
        const { id: _, ...dataToSave } = achievement;

        await db.collection("achievements").doc(id).set(dataToSave);

        const { revalidatePath } = await import("next/cache");
        revalidatePath('/achievements');
        return { success: true, id };
    } catch (error) {
        console.error("Error saving achievement:", error);
        return { success: false, error: String(error) };
    }
}



export async function deleteAchievement(id: string) {
    const db = getAdminDb();
    const { revalidatePath } = await import("next/cache");

    await db.collection("achievements").doc(id).delete();
    revalidatePath('/achievements');
    return { success: true };
}

// Delete operations for all collections
export async function deleteExperience(id: string) {
    const db = getAdminDb();
    const { revalidatePath } = await import("next/cache");

    const expRef = db.collection("experiences").doc(id);
    const expSnap = await expRef.get();

    if (!expSnap.exists) {
        return { success: false, error: "Experience not found" };
    }

    const expData = expSnap.data() as Experience;

    // Cleanup Relations
    const relations = [
        ...(expData.relatedPosts || []),
        ...(expData.relatedProjects || [])
    ];

    for (const rel of relations) {
        const collectionName = rel.type === 'post' ? 'posts' : 'projects';
        const docRef = db.collection(collectionName).doc(rel.id);
        const docSnap = await docRef.get();

        if (docSnap.exists) {
            const data = docSnap.data();
            const relatedList = (data?.relatedExperience || []) as import("@/lib/types").RelatedItemStub[];
            const filtered = relatedList.filter(p => p.id !== id);
            await docRef.update({ relatedExperience: filtered });
        }
    }

    await expRef.delete();
    revalidatePath("/experience");
    revalidatePath("/projects");
    return { success: true };
}

export async function deleteEducation(id: string) {
    const db = getAdminDb();
    const { revalidatePath } = await import("next/cache");

    const eduRef = db.collection("educations").doc(id);
    const eduSnap = await eduRef.get();

    if (!eduSnap.exists) {
        return { success: false, error: "Education not found" };
    }

    const eduData = eduSnap.data() as Education;

    // Cleanup Relations
    const relations = [
        ...(eduData.relatedPosts || []),
        ...(eduData.relatedProjects || [])
    ];

    for (const rel of relations) {
        const collectionName = rel.type === 'post' ? 'posts' : 'projects';
        const docRef = db.collection(collectionName).doc(rel.id);
        const docSnap = await docRef.get();

        if (docSnap.exists) {
            const data = docSnap.data();
            const relatedList = (data?.relatedEducation || []) as import("@/lib/types").RelatedItemStub[];
            const filtered = relatedList.filter(p => p.id !== id);
            await docRef.update({ relatedEducation: filtered });
        }
    }

    await eduRef.delete();
    revalidatePath("/education");
    revalidatePath("/projects");
    return { success: true };
}

// Hero save operation
export async function saveHero(heroData: Hero) {
    try {
        const db = getAdminDb();
        const { revalidatePath } = await import("next/cache");

        await db.collection("settings").doc("hero").set(heroData);
        revalidatePath("/hero");
        return { success: true };
    } catch (error) {
        console.error("Error saving hero:", error);
        return { success: false, error: String(error) };
    }
}
