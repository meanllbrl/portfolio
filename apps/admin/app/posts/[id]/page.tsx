import { getPost } from "@/app/actions";
import { PostForm } from "@/components/PostForm";
import { notFound } from "next/navigation";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const post = await getPost(id);

    if (!post) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Edit Post</h1>
                <p className="text-muted-foreground">Edit your blog post</p>
            </div>
            <PostForm initialData={post} />
        </div>
    );
}
