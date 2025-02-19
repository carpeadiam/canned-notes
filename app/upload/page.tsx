import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handlePageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPages = Array.from(event.target.selectedOptions, (option) =>
      parseInt(option.value)
    );
    setPages(selectedPages);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file || pages.length === 0) {
      alert('Please upload a PDF and select at least one page.');
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Step 1: Upload the PDF
      const uploadResponse = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });
      const uploadResult = await uploadResponse.json();

      if (!uploadResponse.ok) {
        throw new Error(uploadResult.error || 'Failed to upload PDF');
      }

      // Step 2: Process the selected pages
      const processResponse = await fetch('http://localhost:5000/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filepath: uploadResult.filepath,
          pages: pages,
        }),
      });
      const processResult = await processResponse.json();

      if (!processResponse.ok) {
        throw new Error(processResult.error || 'Failed to process PDF');
      }

      // Redirect to the Thank You page with the Notion URL
      router.push({
        pathname: '/thank-you',
        query: { notionUrl: processResult.notion_page_url },
      });
    } catch (error) {
      console.error(error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Upload PDF and Select Pages</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Upload PDF:
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Select Pages:
            <select multiple onChange={handlePageChange} required>
              {Array.from({ length: 10 }, (_, i) => (
                <option key={i + 1} value={i}>
                  Page {i + 1}
                </option>
              ))}
            </select>
          </label>
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Processing...' : 'Upload and Process'}
        </button>
      </form>
    </div>
  );
}
