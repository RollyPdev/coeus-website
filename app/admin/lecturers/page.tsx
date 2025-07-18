import Link from "next/link";

// Sample data
const lecturers = [
  {
    id: "1",
    name: "Dr. James Wilson",
    photo: "/crim-lecturer1.jpg",
    position: "Criminal Law Expert",
    category: "criminology",
    specialization: "Criminal Law"
  },
  {
    id: "2",
    name: "Atty. Maria Santos",
    photo: "/crim-lecturer2.jpg",
    position: "Legal Expert",
    category: "criminology",
    specialization: "Criminal Jurisprudence"
  },
  {
    id: "3",
    name: "Dr. Elena Cruz",
    photo: "/nursing-lecturer1.jpg",
    position: "Medical-Surgical Nursing Specialist",
    category: "nursing",
    specialization: "Medical-Surgical Nursing"
  }
];

export default function LecturersPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Lecturers</h1>
        <Link
          href="/admin/lecturers/new"
          className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition-colors"
        >
          Add New Lecturer
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Specialization
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {lecturers.map((lecturer) => (
                <tr key={lecturer.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={lecturer.photo}
                          alt={lecturer.name}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {lecturer.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {lecturer.position}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        lecturer.category === "criminology"
                          ? "bg-red-100 text-red-800"
                          : lecturer.category === "nursing"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {lecturer.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {lecturer.specialization}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/admin/lecturers/${lecturer.id}`}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/admin/lecturers/${lecturer.id}/delete`}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}