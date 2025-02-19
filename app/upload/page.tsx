"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const UploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [startPage, setStartPage] = useState<number | null>(null);
  const [endPage, setEndPage] = useState<number | null>(null);
  const [previewText, setPreviewText] = useState<string | null>(null);
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
        } else {
          alert(result.error || "Failed to upload PDF");
        }
      } catch (error) {
        console.error("File upload error:", error);
        alert("An error occurred while uploading the file.");
      }
    }
  };

  const handlePreview = async () => {
    if (!file || startPage === null || endPage === null || startPage < 1 || endPage > (totalPages || 0) || startPage > endPage) {
      alert("Invalid page range. Please enter a valid start and end page.");
      return;
    }

    setIsLoading(true);
    try {
      const previewResponse = await fetch("https://thecodeworks.in/canned-notes-api/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, pages: [startPage, endPage] }),
      });

      const previewResult = await previewResponse.json();
      if (!previewResponse.ok) throw new Error(previewResult.error || "Failed to fetch preview");

      setPreviewText(previewResult.text);
    } catch (error) {
      console.error("Preview error:", error);
      alert(error instanceof Error ? `Error: ${error.message}` : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file || startPage === null || endPage === null) {
      alert("Please upload a PDF and select a valid page range.");
      return;
    }
    setIsLoading(true);

    try {
      const processResponse = await fetch("https://thecodeworks.in/canned-notes-api/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, pages: Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i) }),
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
            <h2 className="text-lg font-semibold">Select Page Range:</h2>
            <input
              type="number"
              placeholder="Start Page"
              min="1"
              max={totalPages}
              value={startPage || ""}
              onChange={(e) => setStartPage(Number(e.target.value))}
              className="border p-2 mr-2"
            />
            <input
              type="number"
              placeholder="End Page"
              min="1"
              max={totalPages}
              value={endPage || ""}
              onChange={(e) => setEndPage(Number(e.target.value))}
              className="border p-2"
            />
            <button type="button" onClick={handlePreview} className="ml-2 px-4 py-2 bg-gray-600 text-white rounded">
              {isLoading ? "Loading..." : "Preview"}
            </button>
          </div>
        )}

        {previewText && (
          <div className="border p-4 mt-4 bg-gray-100">
            <h3 className="text-lg font-semibold">Preview:</h3>
            <p className="whitespace-pre-wrap">{previewText}</p>
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
