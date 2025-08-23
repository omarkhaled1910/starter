"use client";
import React, { useState, useDeferredValue } from "react";
import NFTsWrapper from "./NFTsWrapper";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueryState } from "nuqs";

const NFTDashboardPage = () => {
  const [searchTerm, setSearchTerm] = useQueryState("searchTerm", {
    defaultValue: "",
  });
  const [status, setStatus] = useQueryState("status", {
    defaultValue: "available",
  });

  const deferredQuery = useDeferredValue(searchTerm);

  return (
    <div className="min-h-screen container mx-auto">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-primary mb-2">NFT Dashboard</h1>
      </header>
      <div>
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search NFTs by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-48">
            <Select
              value={status}
              onValueChange={(value) =>
                setStatus(value as "available" | "pending" | "sold")
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <NFTsWrapper
          searchTerm={deferredQuery}
          status={status as "available" | "pending" | "sold"}
        />
      </div>
    </div>
  );
};

export default NFTDashboardPage;