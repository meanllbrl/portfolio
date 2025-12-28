import { collection, getDocs, query, orderBy, limit, doc, getDoc, where, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import { sortProjectsByDate, parseDateRange } from "@/lib/utils";

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string | string[];
  image?: string;
  urls?: { title: string; url: string; icon?: string }[];
  sortOrder?: number;
  relatedProjects?: { id: string; title: string; url: string; smallImage?: string; featured?: number; sortOrder?: number }[];
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  period: string;
  logo?: string;
  gpa?: string;
  urls?: { title: string; url: string; icon?: string }[];
  sortOrder?: number;
  relatedProjects?: { id: string; title: string; url: string; smallImage?: string; featured?: number; sortOrder?: number }[];
}

// ... PersonalData (lines 21-32 left as is, but we are replacing the block before it) ...

export interface PersonalData {
  greeting: string;
  role: string;
  description: string;
  imageUrl?: string;
  resumeUrl?: string;
  fullName?: string;
  logoText?: string;
  tagline?: string;
  socials: {
    github: string;
    linkedin: string;
    email: string;
  };
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  image: string;
  link: string;
  githubUrl?: string; // Added
  featured: number;
  sortOrder?: number; // Added
  date?: string;
  urls?: { title: string; url: string; icon?: string }[];
  gallery?: { id: string; type: 'image' | 'video'; url: string }[];
  roadmap?: { id: string; title: string; done: boolean }[];
  slug?: string;
  smallImage?: string; // Added to match usage in WorkExperience
  relatedPosts?: { id: string; title: string; url: string; smallImage?: string; featured?: number; sortOrder?: number }[];
  relatedExperience?: { id: string; title: string; url: string; smallImage?: string; featured?: number; sortOrder?: number }[];
  relatedEducation?: { id: string; title: string; url: string; smallImage?: string; featured?: number; sortOrder?: number }[];
}

export interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  coverImage?: string;
  slug: string;
  tags?: string[];
  readTime?: string;
  smallImage?: string;
}

export interface Recommendation {
  id: string;
  name: string;
  thought: string;
  status: 'draft' | 'published';
  createdAt: string | any; // ISO string or Timestamp
  photoUrl?: string;
  linkedinUrl?: string;
  title?: string;
  subtitle?: string;
}

export async function getExperiences(): Promise<Experience[]> {
  try {
    let querySnapshot;
    try {
      const q = query(collection(db, "experiences"), orderBy("years", "desc"));
      querySnapshot = await getDocs(q);
    } catch (orderError: any) {
      if (orderError.code === 'failed-precondition') {
        console.warn("Firestore index missing for 'years', fetching without order");
        querySnapshot = await getDocs(collection(db, "experiences"));
      } else {
        throw orderError;
      }
    }

    const experiences = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        company: data.title || "",
        role: data.workTitle || "",
        period: data.years || "",
        description: data.description || [],
        image: data.image,
        urls: data.urls || [],
        relatedProjects: data.relatedProjects || [],
        sortOrder: data.sortOrder // Ensure sortOrder is passed
      } as Experience;
    });

    experiences.sort((a, b) => {
      if (typeof a.sortOrder === 'number' && typeof b.sortOrder === 'number') return a.sortOrder - b.sortOrder;
      if (typeof a.sortOrder === 'number') return -1;
      if (typeof b.sortOrder === 'number') return 1;

      // Fallback to original date sort
      const dateA = parseDateRange(a.period);
      const dateB = parseDateRange(b.period);
      return dateB - dateA;
    });

    console.log(`Fetched ${experiences.length} experiences from Firestore`);
    return experiences;
  } catch (error) {
    console.error("Error fetching experiences:", error);
    return [];
  }
}

export async function getEducations(): Promise<Education[]> {
  try {
    let querySnapshot;
    try {
      const q = query(collection(db, "educations"), orderBy("years", "desc"));
      querySnapshot = await getDocs(q);
    } catch (orderError: any) {
      if (orderError.code === 'failed-precondition') {
        console.warn("Firestore index missing for 'years', fetching without order");
        querySnapshot = await getDocs(collection(db, "educations"));
      } else {
        throw orderError;
      }
    }

    const educations = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        school: data.title || "",
        degree: data.department || "",
        period: data.years || "",
        logo: data.logo,
        gpa: data.gpa,
        urls: data.urls || [],
        relatedProjects: data.relatedProjects || [],
        sortOrder: data.sortOrder // Ensure sortOrder is passed
      } as Education;
    });

    educations.sort((a, b) => {
      if (typeof a.sortOrder === 'number' && typeof b.sortOrder === 'number') return a.sortOrder - b.sortOrder;
      if (typeof a.sortOrder === 'number') return -1;
      if (typeof b.sortOrder === 'number') return 1;

      const dateA = parseDateRange(a.period);
      const dateB = parseDateRange(b.period);
      return dateB - dateA;
    });

    console.log(`Fetched ${educations.length} educations from Firestore`);
    return educations;
  } catch (error) {
    console.error("Error fetching educations:", error);
    return [];
  }
}

// NOTE: Changed document path from "settings/personal" to "settings/hero" to match Admin Panel
export async function getPersonalData(): Promise<PersonalData | null> {
  try {
    const docRef = doc(db, "settings", "hero");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        greeting: data.greeting || "",
        role: data.role || "",
        description: data.description || "",
        imageUrl: data.imageUrl || undefined,
        resumeUrl: data.resumeUrl || undefined,
        fullName: data.fullName || "",
        logoText: data.logoText || "MN.",
        tagline: data.tagline || "",
        socials: data.socials || { github: "", linkedin: "", email: "" }
      } as PersonalData;
    }
    return null;
  } catch (error) {
    console.error("Error fetching personal data:", error);
    return null;
  }
}

export async function getProjects(): Promise<Project[]> {
  try {
    // Try ordering by 'featured' then 'title', fallback to simple query
    let querySnapshot;
    try {
      const q = query(collection(db, "projects"));
      querySnapshot = await getDocs(q);
    } catch (error) {
      console.warn("Error fetching projects with order:", error);
      querySnapshot = await getDocs(collection(db, "projects"));
    }

    const projects = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Project[];

    // Sort by sortOrder (asc) first, then date (desc)
    projects.sort((a, b) => {
      // If both have sortOrder, use it
      if (typeof a.sortOrder === 'number' && typeof b.sortOrder === 'number') {
        return a.sortOrder - b.sortOrder;
      }
      // If only one has sortOrder, it comes first (or last depending on preference, usually defined ones first)
      if (typeof a.sortOrder === 'number') return -1;
      if (typeof b.sortOrder === 'number') return 1;

      // Fallback to date sorting
      const dateA = parseDateRange(a.date);
      const dateB = parseDateRange(b.date);
      return dateB - dateA;
    });

    const sortedProjects = projects;

    console.log(`Fetched ${sortedProjects.length} projects from Firestore`);
    return sortedProjects;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const projects = await getProjects();
    const project = projects.find(p => p.slug === slug || p.id === slug);
    return project || null;

    // Note: For a larger database, we'd use a 'where' query:
    // const q = query(collection(db, "projects"), where("slug", "==", slug));
    // But since we already have logic to sort/fetch all, filtering client-side for < 100 items is fine and robust.
  } catch (error) {
    console.error("Error fetching project by slug:", error);
    return null;
  }
}

export async function getAchievements() {
  try {
    const querySnapshot = await getDocs(collection(db, "achievements"));
    const items = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as any[]; // Type isn't imported here but usually matches Achievement

    items.sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999));
    return items;
  } catch (error) {
    console.error("Error fetching achievements:", error);
    return [];
  }
}

// NEW: Fetch blog posts
export async function getPosts(): Promise<Post[]> {
  try {
    let querySnapshot;
    try {
      const q = query(collection(db, "posts"), orderBy("date", "desc"));
      querySnapshot = await getDocs(q);
    } catch (orderError: any) {
      if (orderError.code === 'failed-precondition') {
        querySnapshot = await getDocs(collection(db, "posts"));
      } else {
        throw orderError;
      }
    }

    const posts = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Post[];

    // Sort by date descending if not already
    posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    console.log(`Fetched ${posts.length} posts from Firestore`);
    return posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const posts = await getPosts();
    const post = posts.find(p => p.slug === slug || p.id === slug);
    return post || null;
  } catch (error) {
    console.error("Error fetching post by slug:", error);
    return null;
  }
}

export async function getTags(): Promise<string[]> {
  try {
    const docRef = doc(db, "settings", "tags");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return (docSnap.data().values || []) as string[];
    }

    // Fallback: Aggregate from posts if settings/tags doesn't exist yet
    const posts = await getPosts();
    const tags = new Set<string>();
    posts.forEach(post => {
      post.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  } catch (error) {
    console.error("Error fetching tags:", error);
    return [];
  }
}

export async function getRecommendations(): Promise<Recommendation[]> {
  try {
    const q = query(
      collection(db, "recommendations"),
      where("status", "==", "published")
      // orderBy("createdAt", "desc") // May require composite index
    );
    const querySnapshot = await getDocs(q);
    const items = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Recommendation[];
    
    // Sort in memory if index is missing
    items.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
    });
    
    return items;
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return [];
  }
}

export async function addRecommendation(data: { name: string; thought: string }) {
  try {
    const docRef = await addDoc(collection(db, "recommendations"), {
      name: data.name,
      thought: data.thought,
      status: "draft",
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding recommendation:", error);
    throw error;
  }
}
