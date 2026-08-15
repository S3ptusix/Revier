import React from "react";

const PhilippinePhoneInput = ({
    value = "",
    onChange,
    name = "phone",
    id = "phone",
    label = "Phone Number",
    required = false,
    disabled = false,
}) => {


    return (
        <div className="w-full">
            {label && <p className="input-label mb-1">{label} {required && <span className="text-red-500">*</span>}</p>}

            <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center border-r border-gray-300 px-3 text-sm text-gray-600">
                    🇵🇭 +63
                </div>

                <input
                    type="tel"
                    id={id}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder="09XX XXX XXXX"
                    maxLength={11}
                    required={required}
                    disabled={disabled}
                    className="w-full rounded-xl py-2.5 pl-20 pr- bg-gray-100 disabled:pointer-events-non focus:outline-2 outline-emerald-500"
                />
            </div>

        </div>
    );
};

export default PhilippinePhoneInput;