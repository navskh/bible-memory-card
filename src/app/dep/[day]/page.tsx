import BibleMemorySeries from '@/components/template/bible-memory-series';

export default async function BibleMemorySeriesPage({
  params,
}: {
  params?: Promise<{ day: string }>;
}) {
  const { day } = (await params) ?? { day: '1' };
  return <BibleMemorySeries day={day} />;
}
