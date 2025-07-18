"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type LecturerFormProps = {
  lecturer?: {
    id?: string;
    name: string;
    photo: string;
    position: string;
    credentials: string;
    bio: string;
    specialization: string;
    category: string;
    subjects: string;
  };
  isEditing?: boolean;
};

export default function LecturerForm({
  lecturer = {
    name: "",
    photo: "",
    position: "",
    credentials: "",
    bio: "",
    specialization: "",
    category: "criminology",
    subjects: "",
  },
  isEditing = false,
}: LecturerFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState(lecturer);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const endpoint = isEditing
        ? `/api/lecturers/${lecturer.id}`
        : "/api/lecturers";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Something went wrong");
      }

      router.push("/admin/lecturers");
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="photo"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Photo URL
          </label>
          <input
            type="text"
            id="photo"
            name="photo"
            value={formData.photo}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="position"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Position
          </label>
          <input
            type="text"
            id="position"
            name="position"
            value={formData.position}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="credentials"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Credentials
          </label>
          <input
            type="text"
            id="credentials"
            name="credentials"
            value={formData.credentials}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="specialization"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Specialization
          </label>
          <input
            type="text"
            id="specialization"
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="criminology">Criminology</option>
            <option value="nursing">Nursing</option>
            <option value="cpd">CPD</option>
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor="subjects"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Subjects (comma separated)
        </label>
        <input
          type="text"
          id="subjects"
          name="subjects"
          value={formData.subjects}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label
          htmlFor="bio"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Biography
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={5}
          value={formData.bio}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        ></textarea>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors"
        >
          {isSubmitting
            ? "Saving..."
            : isEditing
            ? "Update Lecturer"
            : "Add Lecturer"}
        </button>
      </div>
    </form>
  );
}