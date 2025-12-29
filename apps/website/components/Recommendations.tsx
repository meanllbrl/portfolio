import { getRecommendations } from "@/lib/firestore";
import { RecommendationForm } from "./RecommendationForm";
import { RecommendationCard } from "./RecommendationCard";

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
                <div className="flex gap-6 w-max pt-2">
                    {recommendations.map((item) => (
                        <RecommendationCard key={item.id} item={item} />
                    ))}
                </div>
            </div>

            <div className="pt-4">
                <RecommendationForm />
            </div>
        </section>
    );
}
