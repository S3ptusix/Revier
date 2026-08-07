/* eslint-disable react-refresh/only-export-components */

import ItemSelector from "./ui/ItemSelector";
import TagInput from "./ui/TagInput";
import Textarea from "./ui/Textarea";

export const DEFAULT_PREPARATION_ITEMS = [
    "Updated Resume",
    "Valid Government-issued ID",
];

const INTERVIEW_TYPE_OPTIONS = [
    { item: "Technical Interview", value: "technical interview" },
    { item: "Behavioral Interview", value: "behavioral interview" },
    { item: "Panel Interview", value: "panel interview" },
    { item: "HR / Screening Interview", value: "HR screening interview" },
];

const ARRIVAL_OPTIONS = [
    { item: "On time", value: "arrive on scheduled time" },
    { item: "10 mins early", value: "arrive at least 10 minutes before the scheduled time" },
    { item: "15 mins early", value: "arrive at least 15 minutes before the scheduled time" },
    { item: "30 mins early", value: "arrive at least 30 minutes before the scheduled time" },
];

const ATTIRE_OPTIONS = [
    { item: "Business Formal", value: "business formal attire" },
    { item: "Business Casual", value: "business casual attire" },
    { item: "Smart Casual", value: "smart casual attire" },
];

/**
 * 🔥 Guided Note Builder
 * Step 2 of the wizard: ask the user a few quick questions about the
 * interview. The parent watches these values and, once the required ones
 * are filled in, auto-generates and reveals the Notes field — the user
 * never has to face a blank textarea first.
 *
 * This is now a dedicated wizard page, so it no longer renders its own
 * step number/title or a bordered card — the ModalHeader + StepProgress
 * one level up already communicate "you're on step 2".
 */
export default function InterviewMessageBuilder({ selectedItems, setSelectedItems, noteBuilder, handleBuilderChange }) {

    return (
        <div className="space-y-4">
            <ItemSelector
                label="Interview Type"
                required
                items={INTERVIEW_TYPE_OPTIONS}
                itemSelected={selectedItems.interviewType}
                onChange={(item) => {
                    setSelectedItems(prev => ({ ...prev, interviewType: item.item }))
                    handleBuilderChange("interviewType", item.value);
                }}
            />

            <TagInput
                label="Preparation Checklist"
                value={noteBuilder.preparation}
                setValue={(next) => handleBuilderChange("preparation", next)}
                placeholder="Add another item and press Enter..."
            />
            <p className="mt-1 text-xs text-gray-400">
                We've pre-filled the usual documents — remove or add to fit this role.
            </p>

            <ItemSelector
                label="Arrival Instructions"
                required
                items={ARRIVAL_OPTIONS}
                itemSelected={selectedItems.arrival}
                onChange={(item) => {
                    setSelectedItems(prev => ({ ...prev, arrival: item.item }))
                    handleBuilderChange("arrival", item.value);
                }}
            />

            <ItemSelector
                label="Attire"
                required
                items={ATTIRE_OPTIONS}
                itemSelected={selectedItems.attire}
                onChange={(item) => {
                    setSelectedItems(prev => ({ ...prev, attire: item.item }))
                    handleBuilderChange("attire", item.value);
                }}
            />
        </div>
    );
}

/**
 * Shared generation logic — kept here so ForInterview and
 * RescheduleInterview stay in sync on exactly how a note is worded.
 */
export function generateNoteFromBuilder(noteBuilder) {
    const parts = [];

    if (noteBuilder.interviewType) {
        parts.push(`This will be a ${noteBuilder.interviewType}.`);
    }
    if (noteBuilder.preparation.length > 0) {
        parts.push(`Please prepare the following: ${noteBuilder.preparation.join(", ")}.`);
    }
    if (noteBuilder.arrival) {
        parts.push(`Kindly ${noteBuilder.arrival}.`);
    }
    if (noteBuilder.attire) {
        parts.push(`Please dress in ${noteBuilder.attire}.`);
    }

    return parts.join(" ");
}

export function isBuilderComplete(noteBuilder) {
    return Boolean(
        noteBuilder.interviewType && noteBuilder.arrival && noteBuilder.attire
    );
}