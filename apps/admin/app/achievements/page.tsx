import { AchievementList } from "@/components/AchievementList";
import { getAchievements } from "@/app/actions";

export default async function AchievementsPage() {
    const achievements = await getAchievements();

    return (
        <div className="space-y-6">
            <AchievementList items={achievements} />
        </div>
    );
}
