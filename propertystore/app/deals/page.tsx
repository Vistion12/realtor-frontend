'use client';
import { DealKanban } from '../components/DealKanban';

export default function DealsPage() {
  // ID воронки "Продажа недвижимости" который мы тестировали
  const salesPipelineId = "d7f300ba-bb60-4f99-9a9d-027e184279ee";

  return (
    <div>
      <DealKanban pipelineId={salesPipelineId} />
    </div>
  );
}