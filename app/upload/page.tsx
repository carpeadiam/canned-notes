"use client"; // ✅ Make it a client component

import { useState } from "react";
import { useRouter } from "next/navigation"; // ✅ Correct import

const UploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileId, setFileId] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [startPage, setStartPage] = useState<number | "">("");
  const [endPage, setEndPage] = useState<number | "">("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);

      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        const response = await fetch("https://thecodeworks.in/canned-notes-api/upload", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();
        if (response.ok) {
          setTotalPages(result.total_pages);
          if (result.file_id) setFileId(result.file_id);
        } else {
          alert(result.error || "Failed to upload PDF");
        }
      } catch (error) {
        console.error("File upload error:", error);
        alert("An error occurred while uploading the file.");
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file || !startPage || !endPage || startPage > endPage || startPage < 1 || endPage > (totalPages || 1)) {
      alert("Please upload a valid PDF and enter a correct page range.");
      return;
    }
    setIsLoading(true);

    try {
      const processBody = fileId
        ? { file_id: fileId, pages: Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i) }
        : { filename: file.name, pages: Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i) };

      const processResponse = await fetch("https://thecodeworks.in/canned-notes-api/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(processBody),
      });

      const processResult = await processResponse.json();
      if (!processResponse.ok) throw new Error(processResult.error || "Failed to process PDF");

      const notionResponse = await fetch("https://thecodeworks.in/canned-notes-api/create-notion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markdown: processResult.summary }),
      });

      const notionResult = await notionResponse.json();
      if (!notionResponse.ok) throw new Error(notionResult.error || "Failed to create Notion page");

      router.push(`/thank-you?notionUrl=${encodeURIComponent(notionResult.notion_url)}`);
    } catch (error) {
      console.error("Error details:", error);
      alert(error instanceof Error ? `Error: ${error.message}` : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Upload and Process PDF</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="file" accept="application/pdf" onChange={handleFileChange} className="block" />

        {totalPages && (
          <div>
            <h2 className="text-lg font-semibold">Total Pages: {totalPages}</h2>
            <div className="flex space-x-4">
              <input
                type="number"
                placeholder="Start Page"
                value={startPage}
                onChange={(e) => setStartPage(Number(e.target.value))}
                min={1}
                max={totalPages}
                className="border p-2"
              />
              <input
                type="number"
                placeholder="End Page"
                value={endPage}
                onChange={(e) => setEndPage(Number(e.target.value))}
                min={1}
                max={totalPages}
                className="border p-2"
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          className={`px-4 py-2 bg-blue-600 text-white rounded ${isLoading ? "opacity-50" : ""}`}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default UploadPage;
