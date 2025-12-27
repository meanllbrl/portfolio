import { getExperience } from "@/app/actions";
import { ExperienceForm } from "@/components/ExperienceForm";
import { notFound } from "next/navigation";

export default async function EditExperiencePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const experience = await getExperience(id);

    if (!experience) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Edit Experience</h1>
            <ExperienceForm initialData={experience} />
        </div>
    );
}
