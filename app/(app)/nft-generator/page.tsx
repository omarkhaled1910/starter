"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Bash from "./Bash";
import Art from "./Art";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowBigLeft } from "lucide-react";

export default function NFTGenerator() {
  const router = useRouter();
  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="flex items-center justify-between gap-2 mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowBigLeft />
          </Button>
          <h1 className="text-2xl font-bold">NFT Generator</h1>
        </div>
        <div className="flex gap-2"></div>
      </header>
      <Tabs defaultValue="bash" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="bash">Bash</TabsTrigger>
          <TabsTrigger value="art">Art</TabsTrigger>
        </TabsList>
        <TabsContent value="bash" className="mt-6">
          <Bash />
        </TabsContent>
        <TabsContent value="art" className="mt-6">
          <Art />
        </TabsContent>
      </Tabs>
    </div>
  );
}
