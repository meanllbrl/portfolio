import { AchievementForm } from "@/components/AchievementForm";
import { getAchievement } from "@/app/actions";
import { notFound } from "next/navigation";

interface Props {
    params: Promise<{ id: string }>;
}

export default async function EditAchievementPage({ params }: Props) {
    const { id } = await params;
    const achievement = await getAchievement(id);

    if (!achievement) {
        notFound();
    }

    return <AchievementForm initialData={achievement} />;
}
