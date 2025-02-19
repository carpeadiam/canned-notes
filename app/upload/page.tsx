"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [selectedPages, setSelectedPages] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Handle file upload
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);

      // Upload the file to the Flask API and get the total number of pages
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

  // Handle page selection
  const handlePageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPages(event.target.value);
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!file || !selectedPages) {
      alert("Please upload a PDF and select pages.");
      return;
    }

    setIsLoading(true);

    try {
      // Step 1: Process the selected pages
      const processResponse = await fetch("https://thecodeworks.in/canned-notes-api/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filename: file.name,
          pages: selectedPages,
        }),
      });

      const processResult = await processResponse.json();
      console.log("Process API Response:", processResult);

      if (!processResponse.ok) {
        throw new Error(processResult.error || "Failed to process PDF");
      }

      // Step 2: Create a Notion page
      const notionResponse = await fetch("https://thecodeworks.in/canned-notes-api/create-notion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          markdown: processResult.summary,
        }),
      });

      const notionResult = await notionResponse.json();
      console.log("Notion API Response:", notionResult);

      if (!notionResponse.ok) {
        throw new Error(notionResult.error || "Failed to create Notion page");
      }

      // Redirect to the Thank You page with the Notion URL
      router.push(`/thank-you?notionUrl=${encodeURIComponent(notionResult.notion_url)}`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error details:", error);
        alert(`Error: ${error.message}`);
      } else {
        console.error("An unknown error occurred:", error);
        alert("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Upload PDF and Select Pages</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Upload PDF:
            <input type="file" accept="application/pdf" onChange={handleFileChange} required />
          </label>
        </div>

        {totalPages && (
          <div>
            <label>
              Select Pages (e.g., 1, 3-5):
              <input
                type="text"
                value={selectedPages}
                onChange={handlePageChange}
                placeholder="e.g., 1, 3-5"
                required
              />
            </label>
            <p>Total Pages: {totalPages}</p>
          </div>
        )}

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Processing..." : "Upload and Process"}
        </button>
      </form>
    </div>
  );
}
