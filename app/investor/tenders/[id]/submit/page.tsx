import { tenders } from '@/data/mock';
import { TenderSubmitClient } from './TenderSubmitClient';

export function generateStaticParams() {
  return tenders.map((tender) => ({ id: tender.id }));
}

export default function TenderSubmitPage({ params }: { params: { id: string } }) {
  const tender = tenders.find((item) => item.id === params.id) ?? tenders[0];
  return <TenderSubmitClient tender={tender} />;
}
