"use client";

import { useSearchParams } from "next/navigation";

export default function ThankYou() {
  const searchParams = useSearchParams();
  const notionUrl = searchParams.get("notionUrl");

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Thank You!</h1>
      <p>Your Notion page has been created successfully.</p>
      {notionUrl && (
        <a
          href={notionUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'blue', textDecoration: 'underline' }}
        >
          Open Notion Page
        </a>
      )}
    </div>
  );
}
