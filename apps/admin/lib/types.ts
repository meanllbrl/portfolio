export interface RelatedItemStub {
    id: string;
    title: string;
    url: string;
    excerpt?: string;
    date?: string;
    smallImage?: string;
    coverImage?: string;
    type: 'project' | 'experience' | 'education' | 'post';
    featured?: number;
    sortOrder?: number;
}

export interface Link {
    title: string;
    url: string;
    icon?: string;
}

export interface Experience {
    id?: string;
    title: string;
    workTitle: string;
    description: string;
    years: string;
    image?: string;
    sortOrder?: number; // Added
    urls: Link[];
    relatedPosts: RelatedItemStub[];
    relatedProjects: RelatedItemStub[];
}

export interface Education {
    id?: string;
    title: string;
    department: string;
    years: string;
    gpa: string;
    sortOrder?: number; // Added
    urls: Link[];
    relatedPosts: RelatedItemStub[];
    relatedProjects: RelatedItemStub[];
}

export interface GalleryItem {
    id: string;
    type: 'image' | 'video';
    url: string;
}

export interface Project {
    id?: string;
    title: string;
    subtitle: string;
    description: string;
    tags: string[];
    image: string;
    smallImage?: string;
    gallery?: GalleryItem[]; // New field
    link: string;
    urls: Link[];
    githubUrl?: string;
    featured: number; // 0, 1, 2, 3
    sortOrder?: number; // Added for ordering
    status: string; // 'Ongoing', 'Closed', etc.
    changelog: { date: string; description: string }[];
    roadmap: { id: string; title: string; done: boolean }[];
    relatedPosts: RelatedItemStub[];
    relatedExperience: RelatedItemStub[];
    relatedEducation: RelatedItemStub[];
}

export interface Hero {
    id?: string;
    greeting: string;
    role: string;
    description: string;
    resumeUrl: string;
    imageUrl: string;
    // New fields for global profile
    fullName: string;
    logoText: string;
    tagline: string;
    socials: {
        github: string;
        linkedin: string;
        email: string;
    };
}

export interface Post {
    id?: string;
    title: string;
    slug: string;
    tags?: string[]; // Added
    excerpt: string;
    content: string; // Markdown
    date: string;
    coverImage: string;
    smallImage?: string;
    status: 'Draft' | 'Published';
    relatedProjects: RelatedItemStub[];
    relatedExperience: RelatedItemStub[];
    relatedEducation: RelatedItemStub[];
}

export interface Achievement {
    id?: string;
    title: string;
    description: string;
    icon: string;
    sortOrder?: number;
    date?: string;
}

