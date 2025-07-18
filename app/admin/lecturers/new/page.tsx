import LecturerForm from "@/components/admin/LecturerForm";

export default function NewLecturerPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Lecturer</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <LecturerForm />
      </div>
    </div>
  );
}