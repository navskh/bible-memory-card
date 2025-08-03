import BibleMemorySeries from '@/components/template/bible-memory-series';

export default async function BibleMemorySeriesPage({
  params,
}: {
  params: Promise<{ day: string }>;
}) {
  const { day } = await params;
  return <BibleMemorySeries day={day} />;
}
