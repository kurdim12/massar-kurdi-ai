import { tenders } from '@/data/mock';
import { TenderDetailClient } from './TenderDetailClient';

export function generateStaticParams() {
  return tenders.map((tender) => ({ id: tender.id }));
}

export default function TenderDetailPage({ params }: { params: { id: string } }) {
  const tender = tenders.find((item) => item.id === params.id) ?? tenders[0];
  return <TenderDetailClient tender={tender} />;
}
