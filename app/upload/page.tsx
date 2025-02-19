"use client"; // ✅ Make it a client component

import { useState } from "react";
import { useRouter } from "next/navigation"; // ✅ Correct import

const UploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileId, setFileId] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
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

  const handlePageSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const page = Number(event.target.value);
    setSelectedPages((prev) =>
      event.target.checked ? [...prev, page] : prev.filter((p) => p !== page)
    );
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file || selectedPages.length === 0) {
      alert("Please upload a PDF and select at least one page.");
      return;
    }
    setIsLoading(true);

    try {
      const processBody = fileId
        ? { file_id: fileId, pages: selectedPages }
        : { filename: file.name, pages: selectedPages };

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
            <h2 className="text-lg font-semibold">Select Pages to Process:</h2>
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <label key={page} className="flex items-center space-x-2">
                  <input type="checkbox" value={page} onChange={handlePageSelection} />
                  <span>Page {page}</span>
                </label>
              ))}
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
