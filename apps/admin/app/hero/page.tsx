import { getHero } from "@/app/actions";
import { HeroForm } from "@/components/HeroForm";

export const dynamic = 'force-dynamic';

export default async function HeroPage() {
    const heroData = await getHero();

    return (
        <div className="max-w-2xl space-y-8 pb-10">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Hero & Resume</h1>
            </div>

            <HeroForm initialData={heroData} />
        </div>
    );
}
