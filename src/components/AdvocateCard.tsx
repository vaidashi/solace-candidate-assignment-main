import { Advocate } from "@/types/advocate";

interface AdvocateCardProps {
    advocate: Advocate;
}

export default function AdvocateCard({ advocate }: AdvocateCardProps) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-200">
            {/* Header with name */}
            <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                    {advocate.firstName} {advocate.lastName}
                </h3>
                <p className="text-sm text-gray-500">{advocate.degree}</p>
            </div>

            {/* Location and experience */}
            <div className="mb-4 space-y-2">
                <div className="flex items-center text-sm">
                    <span className="font-medium text-gray-700 w-24">Location:</span>
                    <span className="text-gray-600">{advocate.city}</span>
                </div>
                <div className="flex items-center text-sm">
                    <span className="font-medium text-gray-700 w-24">Experience:</span>
                    <span className="text-gray-600">{advocate.yearsOfExperience} years</span>
                </div>
                <div className="flex items-center text-sm">
                    <span className="font-medium text-gray-700 w-24">Phone:</span>
                    <span className="text-gray-600">{advocate.phoneNumber}</span>
                </div>
            </div>

            {/* Specialties */}
            <div>
                <p className="font-medium text-gray-700 text-sm mb-2">Specialties:</p>
                <div className="flex flex-wrap gap-2">
                    {advocate.specialties.map((specialty, index) => (
                        <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                        >
                            {specialty}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
