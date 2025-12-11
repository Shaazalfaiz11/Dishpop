export default function Pagination({ pagination, onPageChange }) {
  if (!pagination.totalPages) return null;

  return (
    <div className="flex gap-2 mt-6">
      <button
        disabled={pagination.page <= 1}
        onClick={() => onPageChange(pagination.page - 1)}
        className="px-3 py-1 bg-zinc-800 rounded disabled:opacity-40"
      >
        Prev
      </button>

      <span className="px-3 py-1 bg-zinc-900 rounded">
        Page {pagination.page} / {pagination.totalPages}
      </span>

      <button
        disabled={pagination.page >= pagination.totalPages}
        onClick={() => onPageChange(pagination.page + 1)}
        className="px-3 py-1 bg-zinc-800 rounded disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}
