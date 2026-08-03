import Select from "./ui/Select";
import {
    Modal,
    ModalBackground,
    ModalFooter,
    ModalHeader
} from "./ui/ui-modal";

export default function OrientationMessageBuilderModal({
    open,
    onClose,
    noteBuilder,
    handleBuilderChange,
    togglePreparation,
    generateNotes
}) {
    if (!open) return null;

    return (
        <ModalBackground>
            <Modal>

                {/* HEADER */}
                <div className="mb-6">
                    <ModalHeader
                        title="Build Orientation Message"
                        subTitle="Generate a professional note"
                        onClose={onClose}
                    />
                </div>

                {/* BODY */}
                <div className="space-y-4">

                    <Select
                        label="Orientation Type"
                        placeholder="--"
                        value={noteBuilder.orientationType}
                        onChange={(e) =>
                            handleBuilderChange("orientationType", e.target.value)
                        }
                        options={[
                            { value: "new hire orientation", name: "New Hire Orientation" },
                            { value: "department orientation", name: "Department Orientation" },
                            { value: "safety orientation", name: "Safety Orientation" },
                            { value: "online orientation", name: "Online Orientation" }
                        ]}
                    />

                    {/* PREPARATION */}
                    <div>
                        <p className="text-xs text-gray-500 mb-2">
                            Preparation Required
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {["Valid ID", "Signed Forms", "Resume", "Laptop"].map((item) => {
                                const active = noteBuilder.preparation.includes(item);

                                return (
                                    <button
                                        key={item}
                                        type="button"
                                        onClick={() => togglePreparation(item)}
                                        className={`px-3 py-1 text-xs rounded-full border
                                            ${active
                                                ? "bg-emerald-500 text-white"
                                                : "border-gray-300 hover:bg-gray-100"
                                            }`}
                                    >
                                        {item}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <Select
                        label="Arrival Instruction"
                        placeholder="--"
                        value={noteBuilder.arrival}
                        onChange={(e) =>
                            handleBuilderChange("arrival", e.target.value)
                        }
                        options={[
                            { value: "arrive at least 15 minutes early", name: "Arrive 15 minutes early" },
                            { value: "be on time for your scheduled orientation", name: "Be on time" }
                        ]}
                    />

                    <Select
                        label="Attire"
                        placeholder="--"
                        value={noteBuilder.attire}
                        onChange={(e) =>
                            handleBuilderChange("attire", e.target.value)
                        }
                        options={[
                            { value: "business casual attire", name: "Business Casual" },
                            { value: "smart casual attire", name: "Smart Casual" },
                            { value: "the company-provided uniform", name: "Company Uniform" }
                        ]}
                    />

                    <Select
                        label="Reminder"
                        placeholder="--"
                        value={noteBuilder.reminder}
                        onChange={(e) =>
                            handleBuilderChange("reminder", e.target.value)
                        }
                        options={[
                            { value: "Please bring a valid ID and any required documents.", name: "Bring ID & Documents" },
                            { value: "Parking is available in the visitor lot at the front entrance.", name: "Parking Instructions" },
                            { value: "Ensure you have a stable internet connection and a working camera/microphone before joining.", name: "Stable Internet Required" },
                            { value: "", name: "None" }
                        ]}
                    />

                </div>

                {/* FOOTER */}
                <div className="mt-6">
                    <ModalFooter
                        submitLabel="Generate Message"
                        onSubmit={generateNotes}
                        onClose={onClose}
                    />
                </div>

            </Modal>
        </ModalBackground>
    );
}