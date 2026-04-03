import { NextRequest, NextResponse } from 'next/server';
import { notion } from '@/lib/notion-script';

// PATCH /api/projects/[id] — update status or notes
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { field, value } = await req.json();

    const map: Record<string, Record<string, unknown>> = {
      status: { status: { select: { name: value } } },
      notes:  { notes:  { rich_text: [{ text: { content: String(value).slice(0, 2000) } }] } },
    };

    const props = map[field];
    if (!props) return NextResponse.json({ error: 'Unknown field' }, { status: 400 });

    await notion.pages.update({ page_id: id, properties: props as any });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[projects PATCH]', err);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

// DELETE /api/projects/[id] — archive project
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await notion.pages.update({ page_id: id, archived: true });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[projects DELETE]', err);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
