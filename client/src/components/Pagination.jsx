export default function Pagination({ pagination, page, setPage }) {

    return (
        <div className="flex justify-end gap-2">
            <button
                className="btn"
                onClick={() => setPage((prev) => prev - 1)}
                disabled={page === 1 || pagination?.total === 0}
            >
                Previous
            </button>
            <button
                className="btn"
                onClick={() => setPage((prev) => prev + 1)}
                disabled={page === pagination?.totalPages || pagination?.total === 0}
            >
                Next
            </button>
        </div>
    );
}