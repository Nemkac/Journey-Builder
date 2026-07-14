import type { PrefillOption, PrefillSourceGroup } from "@/prefill/data-sources/types";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface DataSourceGroupProps {
    group: PrefillSourceGroup;
    forceOpen: boolean;
    onSelectOption: (option: PrefillOption) => void;
}

export function DataSourceGroup({ group, forceOpen, onSelectOption }: DataSourceGroupProps) {
    const [open, setOpen] = useState(false);
    const isOpen = forceOpen || open;

    return (
        <Collapsible open={isOpen} onOpenChange={setOpen}>
            <CollapsibleTrigger
                className="flex w-full items-center gap-1 rounded-md px-2 py-1.5 text-sm font-medium hover:bg-accent"
            >
                <ChevronRight className={cn("size-4 transition-transform", isOpen && "rotate-90")} />
                {group.label}
            </CollapsibleTrigger>
            <CollapsibleContent>
                <ul className="ml-5 flex flex-col border-l pl-2">
                    {group.options.map((option) => (
                        <li key={option.id}>
                            <button
                                type="button"
                                onClick={() => onSelectOption(option)}
                                className="w-full rounded-md px-2 py-1.5 text-left text-sm hover:bg-accent"
                            >
                                {option.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </CollapsibleContent>
        </Collapsible>
    )
}