export default function Pagination({ pagination, page, setPage }) {
    const totalPages = pagination?.totalPages || 1;
    const total = pagination?.total || 0;

    return (
        <div className="flex items-center justify-between flex-wrap gap-3">

            {/* LEFT: INFO */}
            <p className="text-sm text-gray-500">
                Page <span className="font-medium text-gray-900">{page}</span> of{" "}
                <span className="font-medium text-gray-900">{totalPages}</span>
                {total > 0 && (
                    <> • {total} total results</>
                )}
            </p>

            {/* RIGHT: CONTROLS */}
            <div className="flex items-center gap-2">

                <button
                    className="
                        px-3 py-1.5 text-sm
                        border border-gray-200 bg-white
                        rounded-lg
                        disabled:opacity-40 disabled:cursor-not-allowed
                    "
                    onClick={() => setPage((prev) => prev - 1)}
                    disabled={page === 1 || total === 0}
                >
                    Previous
                </button>


                <button
                    className="
                        px-3 py-1.5 text-sm
                        border border-gray-200 bg-white
                        rounded-lg
                        disabled:opacity-40 disabled:cursor-not-allowed
                    "
                    onClick={() => setPage((prev) => prev + 1)}
                    disabled={page === totalPages || total === 0}
                >
                    Next
                </button>
            </div>
        </div>
    );
}