import Link from "next/link";
import { Post } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Plus, Edit, Trash2 } from "lucide-react";
import { getPosts } from "@/app/actions";
import { SafeDeleteButton } from "@/components/SafeDeleteButton";

export const dynamic = 'force-dynamic';

export default async function PostsPage() {
    const posts = await getPosts();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Blog Posts</h1>
                    <p className="text-muted-foreground">Manage your blog content.</p>
                </div>
                <Link href="/posts/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Post
                    </Button>
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                    <Card key={post.id} className="flex flex-col">
                        <CardHeader>
                            <CardTitle className="line-clamp-1">{post.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1">
                            {post.coverImage && (
                                <img
                                    src={post.coverImage}
                                    alt={post.title}
                                    className="w-full h-48 object-cover rounded-md mb-4"
                                />
                            )}
                            <p className="text-xs text-muted-foreground mb-2">{post.date}</p>
                            <p className="text-sm text-muted-foreground line-clamp-3">
                                {post.excerpt}
                            </p>
                        </CardContent>
                        <CardFooter className="flex justify-between mt-auto">
                            <Link href={`/posts/${post.id}`}>
                                <Button variant="outline" size="sm">
                                    <Edit className="h-4 w-4 mr-2" /> Edit
                                </Button>
                            </Link>

                            <SafeDeleteButton id={post.id!} type="post" />
                        </CardFooter>
                    </Card>
                ))}
                {posts.length === 0 && (
                    <p className="text-muted-foreground col-span-full text-center py-10">No posts found.</p>
                )}
            </div>
        </div>
    );
}
