
export function StatCard({
    label,
    value,
    suffix = "",
    accent = false,
    icon: Icon = null,
    trend = null,
}) {
    return (
        <div
            className={`
                relative overflow-hidden
                rounded-lg border
                bg-white p-5
                ${accent
                    ? "border-emerald-500 ring-1 ring-emerald-100"
                    : "border-gray-300"
                }
            `}
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">
                        {label}
                    </p>

                    <div className="mt-2 flex items-baseline gap-1">
                        <p className="text-3xl font-bold tracking-tight text-gray-900">
                            {value}
                        </p>

                        {suffix && (
                            <span className="text-sm font-medium text-gray-500">
                                {suffix}
                            </span>
                        )}
                    </div>

                    {trend && (
                        <div
                            className={`
                                mt-2 flex items-center gap-1
                                text-xs font-medium
                                ${trend.type === "up"
                                    ? "text-emerald-600"
                                    : "text-red-500"
                                }
                            `}
                        >
                            <TrendingUp size={14} />
                            {trend.value}
                        </div>
                    )}
                </div>

                {Icon && (
                    <div
                        className={`
                            flex h-8 w-8 items-center justify-center
                            rounded-lg
                            ${accent
                                ? "bg-emerald-50 text-emerald-600"
                                : "bg-gray-100 text-gray-600"
                            }
                        `}
                    >
                        <Icon size={16} strokeWidth={2} />
                    </div>
                )}
            </div>
        </div>
    );
}


export function Panel({
    title,
    subtitle,
    children,
    right = null,
}) {
    return (
        <section
            className="
                rounded-lg
                border border-gray-300
                bg-white
                p-6
            "
        >
            <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h3 className="text-base font-semibold text-gray-900">
                        {title}
                    </h3>

                    {subtitle && (
                        <p className="mt-1 text-sm text-gray-500">
                            {subtitle}
                        </p>
                    )}
                </div>

                {right && (
                    <div>
                        {right}
                    </div>
                )}
            </div>

            {children}
        </section>
    );
}


export function EmptyState({
    label = "No data available",
    description = "There is no information to display for this period.",
    icon = null,
}) {
    return (
        <div
            className="
                flex h-64
                flex-col items-center justify-center
                text-center
            "
        >
            {icon && (
                <div
                    className="
                        mb-3 flex h-10 w-10
                        items-center justify-center
                        rounded-lg
                        bg-gray-100
                        text-gray-400
                    "
                >
                    {icon}
                </div>
            )}

            <p className="text-sm font-medium text-gray-600">
                {label}
            </p>

            <p className="mt-1 max-w-sm text-xs text-gray-400">
                {description}
            </p>
        </div>
    );
}