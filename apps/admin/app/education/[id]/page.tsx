import { getEducation } from "@/app/actions";
import { EducationForm } from "@/components/EducationForm";
import { notFound } from "next/navigation";

export default async function EditEducationPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const education = await getEducation(id);

    if (!education) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Edit Education</h1>
            <EducationForm initialData={education} />
        </div>
    );
}
