import RedirectPageClient from "./RedirectPageClient";

interface PageProps {
  params: { shortCode: string };
}

export default function Page({ params }: PageProps) {
  return <RedirectPageClient shortCode={params.shortCode} />;
}
