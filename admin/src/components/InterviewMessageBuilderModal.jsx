import Select from "./ui/Select";
import {
    Modal,
    ModalBackground,
    ModalBody,
    ModalFooter,
    ModalHeader
} from "./ui/ui-modal";

export default function InterviewMessageBuilderModal({
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
                <ModalHeader
                    title="Build Interview Message"
                    subTitle="Generate a professional message"
                    onClose={onClose}
                />

                <ModalBody>

                    <Select
                        label="Interview Type"
                        placeholder="--"
                        value={noteBuilder.interviewType}
                        onChange={(e) =>
                            handleBuilderChange("interviewType", e.target.value)
                        }
                        options={[
                            { value: "technical interview", name: "Technical Interview" },
                            { value: "initial screening", name: "Initial Screening" },
                            { value: "final interview", name: "Final Interview" }
                        ]}
                    />

                    {/* PREPARATION */}
                    <div>
                        <p className="text-xs text-gray-500 mb-2">
                            Preparation Required
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {["Portfolio", "Valid ID", "Resume"].map((item) => {
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
                            { value: "arrive at least 10 minutes early", name: "Arrive 10 minutes early" },
                            { value: "be on time for your scheduled interview", name: "Be on time" }
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
                            { value: "professional or business attire", name: "Professional Attire" },
                            { value: "smart casual attire", name: "Smart Casual" }
                        ]}
                    />

                    <Select
                        label="Connection Requirement"
                        placeholder="--"
                        value={noteBuilder.connection}
                        onChange={(e) =>
                            handleBuilderChange("connection", e.target.value)
                        }
                        options={[
                            { value: "Ensure you have a stable internet connection.", name: "Stable Internet Required" },
                            { value: "", name: "None" }
                        ]}
                    />

                </ModalBody>

                <ModalFooter
                    submitLabel="Generate Message"
                    onSubmit={generateNotes}
                    onClose={onClose}
                />

            </Modal>
        </ModalBackground>
    );
}