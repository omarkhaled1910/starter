"use client";
import React, { useMemo, memo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPetsByStatus } from "@/app/actions/pets";

import PetCard from "@/components/custom/PetCard";
import Link from "next/link";
import { useSelectedPetStore } from "@/store/selectedPet";

const PetsWrapper = ({
  searchTerm,
  status,
}: {
  searchTerm: string;
  status: "available" | "pending" | "sold";
}) => {
  const { setClientStoredPet } = useSelectedPetStore();
  const {
    data = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["pets", status],
    queryFn: () => getPetsByStatus(status),
  });

  const filteredPets = useMemo(
    () =>
      Array.isArray(data)
        ? data?.filter((pet) =>
            pet?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase())
          )
        : [],
    [data, searchTerm]
  );
  return (
    <>
      <div className="max-w-7xl mx-auto">
        {/* Controls */}

        {filteredPets && filteredPets.length > 0 && (
          <div className="flex flex-col items-center justify-center">
            Showing {filteredPets?.length} {status} pets {searchTerm}
            <br />
            <span className="text-gray-500 text-xs">
              There is no pagination in the endpoint
            </span>
          </div>
        )}
        <br />
        {isLoading && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">Loading pets...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-700">Error loading pets: {error.message}</p>
          </div>
        )}

        {/* Pets Grid */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredPets?.length ? (
              filteredPets.map((pet, i) => (
                <Link
                  onClick={() => {
                    setClientStoredPet(pet);
                  }}
                  href={`/pet/${pet.id}`}
                  key={i}
                >
                  <PetCard key={i} pet={pet} />
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">
                  No pets found matching your criteria
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default memo(PetsWrapper);
