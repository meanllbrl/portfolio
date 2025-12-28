import { RecommendationForm } from "@/components/RecommendationForm";
import { getRecommendation } from "@/app/actions";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditRecommendationPage({ params }: PageProps) {
    const { id } = await params;
    const recommendation = await getRecommendation(id);

    if (!recommendation) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <RecommendationForm initialData={recommendation} />
        </div>
    );
}

