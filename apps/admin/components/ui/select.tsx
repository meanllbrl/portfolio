"use client"

import * as React from "react"
import { cn } from "@/components/ui/button"

// Simplified Select using native <select> but exposing parts to match Radix API structure roughly
// Actually, to make it work with the ProjectForm code I wrote, it's easier to implement a customized version
// OR update ProjectForm to use a simpler NativeSelect component. 
// Let's implement the components to match the imports in ProjectForm to minimize refactoring there.

interface SelectProps {
    value?: string
    onValueChange?: (value: string) => void
    children: React.ReactNode
}

const SelectContext = React.createContext<SelectProps | null>(null)

export const Select = ({ value, onValueChange, children }: SelectProps) => {
    return (
        <SelectContext.Provider value={{ value, onValueChange, children }}>
            <div className="relative">{children}</div>
        </SelectContext.Provider>
    )
}

export const SelectTrigger = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    return <div className={cn("flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", className)}>{children}</div>
}

export const SelectValue = ({ placeholder }: { placeholder?: string }) => {
    const context = React.useContext(SelectContext)
    // This is tricky without state syncing or deeply nested matching.
    // For a quick fix, we might need to fallback to a simpler Native Select approach if we don't use Radix.
    // BUT the user expects "Premium" quality? No, that's for the Portfolio. The Admin panel is internal.
    //
    // Let's USE Native Select implementation pretending to be these components? 
    // No, that will break the composition.
    //
    // Let's rewrite ProjectForm to use a simple <NativeSelect> for stability.
    return <span>{context?.value || placeholder}</span>
}


// ACTUALLY, implementing a full custom Select from scratch without Radix is error prone (click outside, positioning).
// I will create a `NativeSelect` in this file and EXPORT it, then update ProjectForm to use it.
// It's robust and accessible.

export interface NativeSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    options: { label: string; value: string }[]
}

export const NativeSelect = React.forwardRef<HTMLSelectElement, NativeSelectProps>(
    ({ className, options, ...props }, ref) => {
        return (
            <div className="relative">
                <select
                    className={cn(
                        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none",
                        className
                    )}
                    ref={ref}
                    {...props}
                >
                    {options.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="absolute right-3 top-3 h-4 w-4 opacity-50 pointer-events-none"
                >
                    <path d="m6 9 6 6 6-6" />
                </svg>
            </div>
        )
    }
)
NativeSelect.displayName = "NativeSelect"
