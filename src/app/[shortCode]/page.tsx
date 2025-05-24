import RedirectPage from "./RedirectPageClient";

interface PageProps {
  params: Promise<{ shortCode: string }>; // params is a Promise
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params; // <-- await here
  return <RedirectPage shortCode={resolvedParams.shortCode} />;
}
