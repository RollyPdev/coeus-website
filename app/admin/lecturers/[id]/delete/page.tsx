"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DeleteLecturerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const [lecturerId, setLecturerId] = useState<string>("");

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setLecturerId(resolvedParams.id);
    };
    getParams();
  }, [params]);

  const handleDelete = async () => {
    if (!lecturerId) return;
    
    setIsDeleting(true);
    setError("");

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setError('Authentication required. Please log in again.');
        setIsDeleting(false);
        return;
      }

      const response = await fetch(`/api/lecturers/${lecturerId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete lecturer");
      }

      router.push("/admin/lecturers");
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Delete Lecturer</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        <p className="text-gray-700 mb-6">
          Are you sure you want to delete this lecturer? This action cannot be
          undone.
        </p>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            {isDeleting ? "Deleting..." : "Delete Lecturer"}
          </button>
        </div>
      </div>
    </div>
  );
}