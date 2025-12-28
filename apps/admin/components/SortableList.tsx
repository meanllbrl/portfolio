"use client";

import React from "react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    rectSortingStrategy
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableListProps<T extends { id: string }> {
    items: T[];
    onReorder: (items: T[]) => void;
    renderItem: (item: T, dragListeners?: any) => React.ReactNode;
    className?: string; // Container className
    itemClassName?: string; // Item className
    strategy?: 'vertical' | 'grid'; // Strategy type
}

export function SortableList<T extends { id: string }>({
    items,
    onReorder,
    renderItem,
    className,
    itemClassName,
    strategy = 'vertical'
}: SortableListProps<T>) {
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    );

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = items.findIndex(item => item.id === active.id);
            const newIndex = items.findIndex(item => item.id === over.id);

            onReorder(arrayMove(items, oldIndex, newIndex));
        }
    }

    const sortingStrategy = strategy === 'grid' ? rectSortingStrategy : verticalListSortingStrategy;

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={items.map(item => item.id)}
                strategy={sortingStrategy}
            >
                <div className={className}>
                    {items.map(item => {
                        // Create a wrapper component to pass drag listeners to renderItem
                        const ItemWrapper = ({ item }: { item: T }) => {
                            const {
                                attributes,
                                listeners,
                                setNodeRef,
                                transform,
                                transition,
                                isDragging
                            } = useSortable({ id: item.id });

                            const style = {
                                transform: CSS.Transform.toString(transform),
                                transition,
                                opacity: isDragging ? 0.5 : 1
                            };

                            return (
                                <div 
                                    ref={setNodeRef} 
                                    style={style} 
                                    {...attributes}
                                    className={itemClassName}
                                >
                                    {renderItem(item, listeners)}
                                </div>
                            );
                        };

                        return <ItemWrapper key={item.id} item={item} />;
                    })}
                </div>
            </SortableContext>
        </DndContext>
    );
}
