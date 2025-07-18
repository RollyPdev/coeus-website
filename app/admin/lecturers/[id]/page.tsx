import prisma from "@/lib/prisma";
import LecturerForm from "@/components/admin/LecturerForm";
import { notFound } from "next/navigation";

export default async function EditLecturerPage({
  params,
}: {
  params: { id: string };
}) {
  const lecturer = await prisma.lecturer.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!lecturer) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Lecturer</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <LecturerForm lecturer={lecturer} isEditing={true} />
      </div>
    </div>
  );
}