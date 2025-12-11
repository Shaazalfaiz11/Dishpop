// src/components/ModelUploadModal.jsx

export default function ModelUploadModal({
  title,
  accept,
  uploading,
  uploadProgress,
  setFile,
  onUpload,
  onClose,
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-zinc-900 p-6 rounded shadow-lg w-80 border border-zinc-700">
        <h3 className="text-xl font-bold mb-4">{title}</h3>

        <input
          type="file"
          accept={accept}
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="mb-4"
          disabled={uploading}
        />

        {/* Progress bar */}
        {uploading && (
          <div className="mb-4">
            <div className="w-full bg-zinc-800 rounded h-2 overflow-hidden">
              <div
                className="h-2 bg-blue-500 transition-all duration-150"
                style={{ width: `${uploadProgress || 0}%` }}
              />
            </div>
            <p className="text-xs text-zinc-400 mt-1 text-right">
              {uploadProgress || 0}%
            </p>
          </div>
        )}

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-3 py-2 bg-red-600 rounded"
            disabled={uploading}
          >
            Cancel
          </button>

          <button
            onClick={onUpload}
            className="px-3 py-2 bg-blue-600 rounded"
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}
