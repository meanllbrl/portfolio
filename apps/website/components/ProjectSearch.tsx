"use client";

import { useState, useMemo } from 'react';
import { Project } from '@/lib/firestore';
import { ProjectCard } from './ProjectCard';
import { Search, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ProjectSearchProps {
    initialProjects: any[]; // using any temporarily to match existing pattern, ideally Project[]
    allTags: string[];
}

export function ProjectSearch({ initialProjects, allTags }: ProjectSearchProps) {
    const t = useTranslations('nav'); // Using nav for shared terms, or could add strict project ones
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [tagSearchTerm, setTagSearchTerm] = useState("");

    const filteredProjects = useMemo(() => {
        return initialProjects.filter(project => {
            const matchesSearch = (project.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
                (project.description?.toLowerCase() || "").includes(searchTerm.toLowerCase());
            const matchesTag = selectedTag ? (project.tags || []).includes(selectedTag) : true;
            return matchesSearch && matchesTag;
        });
    }, [initialProjects, searchTerm, selectedTag]);

    const filteredTags = useMemo(() => {
        return allTags.filter(tag => tag.toLowerCase().includes(tagSearchTerm.toLowerCase()));
    }, [allTags, tagSearchTerm]);

    return (
        <div className="space-y-12">
            {/* Unified Filter Bar - "Polished Authenticity" Style */}
            <div className="relative w-full max-w-2xl mx-auto z-30">
                <div
                    className={`flex items-center bg-white dark:bg-black border-[3px] border-[#121212] dark:border-white rounded-full 
                               shadow-[6px_6px_0px_#121212] dark:shadow-[6px_6px_0px_#ffffff] 
                               transition-all focus-within:shadow-[8px_8px_0px_#121212] dark:focus-within:shadow-[8px_8px_0px_#ffffff]
                               focus-within:translate-x-[-2px] focus-within:translate-y-[-2px]`}
                >
                    {/* Main Search Input */}
                    <div className="flex-grow flex items-center pl-6">
                        <Search className="text-gray-500 w-5 h-5 mr-3" />
                        <input
                            type="text"
                            placeholder="SEARCH PROJECTS..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full py-4 bg-transparent border-none focus:ring-0 font-bold text-sm uppercase tracking-wide placeholder:text-gray-400 outline-none"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm("")}
                                className="mr-3 text-gray-400 hover:text-destructive transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Integrated Divider */}
                    <div className="w-[3px] h-8 bg-[#121212] dark:bg-white mx-2" />

                    {/* Filter Dropdown Trigger */}
                    <div className="relative h-full">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className={`flex items-center gap-2 px-6 py-4 h-full font-black uppercase text-sm tracking-wide
                                       bg-[#FFD700] dark:bg-[#FFD700] text-black hover:bg-[#ffe033] rounded-r-full
                                       transition-colors`}
                            style={{ height: '100%', minHeight: '100%' }}
                        >
                            <span className="truncate max-w-[100px] md:max-w-none block">{selectedTag || "ALL TOPICS"}</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                            >
                                <path d="m6 9 6 6 6-6" />
                            </svg>
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="absolute top-full right-0 mt-4 w-72 bg-white dark:bg-[#121212] border-[3px] border-[#121212] dark:border-white rounded-2xl shadow-[6px_6px_0px_#121212] dark:shadow-[6px_6px_0px_#ffffff] overflow-hidden z-50">
                                {/* Tag Search Input */}
                                <div className="p-3 border-b-2 border-gray-100 dark:border-gray-800 sticky top-0 bg-white dark:bg-[#121212]">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3 h-3" />
                                        <input
                                            type="text"
                                            placeholder="Find a tag..."
                                            value={tagSearchTerm}
                                            onChange={(e) => setTagSearchTerm(e.target.value)}
                                            autoFocus
                                            className="w-full pl-8 pr-3 py-2 text-xs font-bold uppercase border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-primary bg-transparent text-gray-900 dark:text-gray-100"
                                        />
                                    </div>
                                </div>
                                <div className="max-h-60 overflow-y-auto p-2">
                                    <button
                                        onClick={() => { setSelectedTag(null); setIsDropdownOpen(false); }}
                                        className={`w-full text-left px-4 py-2.5 rounded-xl font-bold uppercase text-xs mb-1 transition-colors
                                                ${!selectedTag
                                                ? 'bg-black text-white dark:bg-white dark:text-black'
                                                : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-muted-foreground hover:text-foreground'}`}
                                    >
                                        All Topics
                                    </button>
                                    {filteredTags.length > 0 ? (
                                        filteredTags.map(tag => (
                                            <button
                                                key={tag}
                                                onClick={() => { setSelectedTag(tag); setIsDropdownOpen(false); }}
                                                className={`w-full text-left px-4 py-2.5 rounded-xl font-bold uppercase text-xs mb-1 transition-colors
                                                        ${selectedTag === tag
                                                        ? 'bg-primary text-white'
                                                        : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-muted-foreground hover:text-foreground'}`}
                                            >
                                                {tag}
                                            </button>
                                        ))
                                    ) : (
                                        <div className="px-4 py-3 text-xs text-muted-foreground text-center font-bold">No tags found</div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Results Grid */}
            <div className="min-h-[400px]">
                {filteredProjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {filteredProjects.map((project) => (
                            <ProjectCard
                                key={project.id}
                                title={project.title}
                                subtitle={project.subtitle}
                                description={project.description}
                                tags={project.tags}
                                slug={project.slug || project.id}
                                image={project.image}
                                link={project.link}
                                githubUrl={project.githubUrl}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center text-center py-20 px-4 border-[3px] border-dashed border-gray-300 dark:border-gray-700 rounded-3xl">
                        <div className="text-6xl mb-4">🚀</div>
                        <h3 className="text-2xl font-black font-heading mb-2">NO PROJECTS FOUND</h3>
                        <p className="text-muted-foreground font-medium mb-6">Try adjusting your search or filters.</p>
                        <button
                            onClick={() => { setSearchTerm(""); setSelectedTag(null) }}
                            className="bg-primary text-white px-6 py-2 rounded-full font-bold uppercase border-2 border-black shadow-[4px_4px_0px_black] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[6px_6px_0px_black] transition-all"
                        >
                            Reset Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
