/* eslint-disable react-refresh/only-export-components */
import ItemSelector from "./ui/ItemSelector";
import Select from "./ui/Select";
import TagInput from "./ui/TagInput";

// 🔥 Sensible starting checklist — the user can add to or remove from
// this via the TagInput once Step 2 loads.
export const DEFAULT_PREPARATION_ITEMS = ["Valid ID", "Signed Forms", "Resume", "Laptop"];

const ORIENTATION_TYPE_OPTIONS = [
    { item: "new hire orientation", value: "New Hire Orientation" },
    { item: "department orientation", value: "Department Orientation" },
    { item: "safety orientation", value: "Safety Orientation" },
    { item: "online orientation", value: "Online Orientation" }
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
    { item: "Company Uniform", value: "the company-provided uniform" }
];

/**
 * Turns the builder's answers into the final note text. This is the single
 * source of truth for what Step 3 previews — it's only ever called from
 * the explicit "Preview" click (see handleRegeneratePreview in AddEvent /
 * EditEvent), never as a side effect of typing here in Step 2.
 */
export function generateNoteFromBuilder(noteBuilder) {
    const parts = [];

    if (noteBuilder.orientationType) {
        parts.push(`This will be a ${noteBuilder.orientationType}.`);
    }

    if (noteBuilder.preparation.length > 0) {
        parts.push(
            `Please prepare the following: ${noteBuilder.preparation.join(", ")}.`
        );
    }

    if (noteBuilder.arrival) {
        parts.push(`Kindly ${noteBuilder.arrival}.`);
    }

    if (noteBuilder.attire) {
        parts.push(`Please dress in ${noteBuilder.attire}.`);
    }
    return parts.join(" ");
}

// 🔥 Gates the Step 2 -> Step 3 "Preview" click. Preparation and Reminder
// are optional extras; the rest shape the core sentence of the note.
export function isBuilderComplete(noteBuilder) {
    return Boolean(
        noteBuilder.orientationType &&
        noteBuilder.arrival &&
        noteBuilder.attire
    );
}

// 🔥 Step 2 — configuration only. No note/message text is shown or
// editable here; it only exists once generated in Step 3.
export default function OrientationMessageBuilder({ selectedItems, setSelectedItems, noteBuilder, handleBuilderChange }) {

    return (
        <div className="space-y-4">

            <ItemSelector
                label="Orientation Type"
                required
                items={ORIENTATION_TYPE_OPTIONS}
                itemSelected={selectedItems.orientationType}
                onChange={(item) => {
                    setSelectedItems(prev => ({ ...prev, orientationType: item.item }));
                    handleBuilderChange("orientationType", item.value);
                }}
            />

            <TagInput
                label="Preparation Required"
                value={noteBuilder.preparation}
                setValue={(items) => handleBuilderChange("preparation", items)}
                placeholder="Add an item and press Enter..."
            />

            <ItemSelector
                label="Arrival Instruction"
                required
                items={ARRIVAL_OPTIONS}
                itemSelected={selectedItems.arrival}
                onChange={(item) => {
                    setSelectedItems(prev => ({ ...prev, arrival: item.item }));
                    handleBuilderChange("arrival", item.value);
                }}
            />
            <ItemSelector
                label="Attire"
                required
                items={ATTIRE_OPTIONS}
                itemSelected={selectedItems.attire}
                onChange={(item) => {
                    setSelectedItems(prev => ({ ...prev, attire: item.item }));
                    handleBuilderChange("attire", item.value);
                }}

            />
        </div>
    );
}