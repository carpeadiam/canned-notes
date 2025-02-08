"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-3xl font-bold">Convert Your PDF to Notion Notes</h1>
      <p className="mt-4 text-gray-600">
        Upload a PDF, select pages, and get structured notes on Notion.
      </p>
      <Button className="mt-6" onClick={() => router.push("/upload")}>
        Get Started
      </Button>
    </main>
  );
}
