"use client";

import { useState } from "react";
import { addRecommendation } from "@/lib/firestore";
import { Loader2, Handshake, Send, CheckCircle } from "lucide-react";

export function RecommendationForm() {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState("");
    const [thought, setThought] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await addRecommendation({ name, thought });
            setSuccess(true);
            setName("");
            setThought("");
            setTimeout(() => {
                setSuccess(false);
                setIsOpen(false);
            }, 5000);
        } catch (error) {
            console.error("Error submitting recommendation:", error);
            alert("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-2xl p-6 text-center animate-in fade-in zoom-in duration-300">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-heading font-bold text-lg mb-2">Thanks, {name || "Legend"}!</h3>
                <p className="text-muted-foreground text-sm">
                    If there are no bad words here, I'll approve it and you'll appear on the wall of fame shortly.
                </p>
                <button 
                    onClick={() => setSuccess(false)}
                    className="mt-4 text-xs font-bold uppercase hover:underline"
                >
                    Close
                </button>
            </div>
        );
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="group w-full max-w-md mx-auto flex items-center justify-center gap-3 p-4 bg-secondary text-ink font-heading font-bold uppercase tracking-wide border-3 border-ink rounded-full shadow-hard hover:shadow-hard-hover hover:-translate-y-1 transition-all duration-200"
            >
                <Handshake className="w-6 h-6 group-hover:scale-110 group-hover:rotate-3 transition-transform" />
                Did we work together? Leave your thoughts
            </button>
        );
    }

    return (
        <div className="w-full max-w-lg mx-auto bg-white dark:bg-card border-3 border-ink rounded-3xl p-6 md:p-8 shadow-hard relative animate-in slide-in-from-bottom-4 duration-300">
             <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-ink transition-colors"
            >
                ✕
            </button>
            
            <h3 className="font-heading font-black text-xl md:text-2xl uppercase mb-6 text-center">
                Drop a Recommendation
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label className="font-bold text-sm uppercase tracking-wide ml-1">Your Name</label>
                    <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full p-3 bg-gray-50 dark:bg-zinc-900 border-2 border-ink rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-medium"
                    />
                </div>

                <div className="space-y-2">
                    <label className="font-bold text-sm uppercase tracking-wide ml-1">Your Thoughts</label>
                    <textarea
                        required
                        rows={4}
                        value={thought}
                        onChange={(e) => setThought(e.target.value)}
                        placeholder="Working with him was..."
                        className="w-full p-3 bg-gray-50 dark:bg-zinc-900 border-2 border-ink rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-medium resize-none"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 p-4 mt-2 bg-primary text-white font-heading font-bold uppercase tracking-wide border-3 border-ink rounded-xl shadow-[4px_4px_0px_var(--ink-black)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_var(--ink-black)] active:translate-y-[4px] active:shadow-none transition-all duration-150 disabled:opacity-70 disabled:pointer-events-none"
                >
                    {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            Send it <Send className="w-4 h-4" />
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}

