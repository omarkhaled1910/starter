"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Bash from "./Bash";
import Art from "./Art";
import Art3D from "./3DArt";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowBigLeft, Terminal, Palette, Box, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Custom from "./Custom";

export default function NFTGenerator() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("bash");

  return (
    <div className="min-h-screen container mx-auto">
      <header className="flex items-center justify-between gap-2 mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowBigLeft />
          </Button>
          <h1 className="text-2xl font-bold">NFT Generator</h1>
        </div>
        <div className="flex gap-2"></div>
      </header>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        orientation="vertical"
        className="w-full md:flex-row"
      >
        <div className="flex gap-6">
          <TabsList className="flex flex-col w-56 p-2 rounded-xl sticky top-4 h-fit">
            {/* <TabsTrigger
              value="custom"
              className="w-full justify-start gap-2 px-3 py-2 transition-all hover:translate-x-[2px]"
            >
              <Sparkles className="size-4" />
              Custom
            </TabsTrigger> */}
            <TabsTrigger
              value="bash"
              className="w-full justify-start gap-2 px-3 py-2 transition-all hover:translate-x-[2px]"
            >
              <Terminal className="size-4" />
              Bash
            </TabsTrigger>
            <TabsTrigger
              value="art"
              className="w-full justify-start gap-2 px-3 py-2 transition-all hover:translate-x-[2px]"
            >
              <Palette className="size-4" />
              Art
            </TabsTrigger>
            <TabsTrigger
              value="art-3d"
              className="w-full justify-start gap-2 px-3 py-2 transition-all hover:translate-x-[2px]"
            >
              <Box className="size-4" />
              3D Art
            </TabsTrigger>
          </TabsList>

          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="mt-2"
              >
                {/* {activeTab === "custom" && <Custom />} */}
                {activeTab === "bash" && <Bash />}
                {activeTab === "art" && <Art />}
                {activeTab === "art-3d" && <Art3D />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Tabs>
    </div>
  );
}
