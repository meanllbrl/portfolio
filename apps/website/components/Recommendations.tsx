import { getRecommendations } from "@/lib/firestore";
import { RecommendationForm } from "./RecommendationForm";
import { Quote, Linkedin } from "lucide-react";

export async function Recommendations() {
    const recommendations = await getRecommendations();

    if (recommendations.length === 0) {
        return null;
    }

    return (
        <section id="recommendations" className="scroll-mt-24 space-y-12">
            <div className="flex items-center justify-between mb-8 px-5 md:px-0">
                <h2 className="font-heading font-black text-3xl md:text-4xl lowercase text-ink">
                    kind words
                </h2>
            </div>

            {/* Horizontal Scroll Container */}
            <div className="relative w-full overflow-x-auto pb-8 -mx-5 px-5 md:mx-0 md:px-0 snap-x snap-mandatory">
                <div className="flex gap-6 w-max">
                    {recommendations.map((item) => (
                        <div 
                            key={item.id} 
                            className="snap-center w-[300px] md:w-[450px] bg-white dark:bg-card border-3 border-ink rounded-[2rem] p-8 shadow-hard hover:-translate-y-1 hover:shadow-hard-hover transition-all duration-300 flex flex-col justify-between"
                        >
                            {/* Quote Icon */}
                            <div className="mb-6">
                                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center border-2 border-ink shadow-sm">
                                    <Quote className="w-5 h-5 rotate-180" />
                                </div>
                            </div>
                            
                            {/* Thought */}
                            <div className="flex-grow mb-8">
                                <p className="font-medium text-lg leading-relaxed italic line-clamp-6">
                                    "{item.thought}"
                                </p>
                            </div>

                            {/* Author Info */}
                            <div className="flex items-center gap-4 pt-6 border-t-2 border-dashed border-gray-100 dark:border-gray-800">
                                {item.photoUrl ? (
                                    <img 
                                        src={item.photoUrl} 
                                        alt={item.name} 
                                        className="w-14 h-14 rounded-xl border-2 border-ink object-cover bg-gray-100 flex-shrink-0"
                                    />
                                ) : (
                                    <div className="w-14 h-14 rounded-xl border-2 border-ink bg-secondary flex items-center justify-center font-black text-xl uppercase flex-shrink-0">
                                        {item.name.charAt(0)}
                                    </div>
                                )}
                                
                                <div className="min-w-0">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-heading font-black text-lg truncate">
                                                {item.name}
                                            </h4>
                                            {item.linkedinUrl && (
                                                <a 
                                                    href={item.linkedinUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 bg-[#0077b5]/10 hover:bg-[#0077b5]/20 text-[#0077b5] px-2 py-0.5 rounded-full transition-colors text-[10px] font-bold uppercase tracking-wider"
                                                    title="View LinkedIn Profile"
                                                >
                                                    <Linkedin className="w-3 h-3 fill-current" />
                                                    <span>LinkedIn</span>
                                                </a>
                                            )}
                                        </div>
                                    
                                        {item.title && (
                                            <p className="font-bold text-xs uppercase tracking-wider text-primary truncate">
                                                {item.title}
                                            </p>
                                        )}
                                        
                                        {item.subtitle && (
                                            <p className="text-xs text-muted-foreground truncate">
                                                {item.subtitle}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="pt-4">
                <RecommendationForm />
            </div>
        </section>
    );
}
