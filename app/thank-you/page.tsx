import { useRouter } from 'next/router';

export default function ThankYou() {
  const router = useRouter();
  const { notionUrl } = router.query;

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Thank You!</h1>
      <p>Your Notion page has been created successfully.</p>
      {notionUrl && (
        <a
          href={notionUrl as string}
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
