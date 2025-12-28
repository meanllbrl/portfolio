import { RecommendationList } from "@/components/RecommendationList";
import { getRecommendations } from "@/app/actions";

export default async function RecommendationsPage() {
    const recommendations = await getRecommendations();

    return (
        <div className="space-y-6">
            <RecommendationList items={recommendations} />
        </div>
    );
}

