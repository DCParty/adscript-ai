import { notion } from '@/lib/notion-script';
import ScriptManager from '@/components/ScriptManager';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ c?: string }>;
}

async function getProject(id: string) {
  try {
    const page = await notion.pages.retrieve({ page_id: id });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const p = (page as any).properties;
    return {
      id: page.id,
      name: p.name?.title?.[0]?.plain_text || '未命名專案',
      clientName: p.client_name?.rich_text?.[0]?.plain_text || '',
      clientToken: p.client_token?.rich_text?.[0]?.plain_text || '',
      platform: p.platform?.select?.name || '',
      format: p.format?.select?.name || '',
      duration: p.duration?.number ?? 15,
      videoType: p.video_type?.rich_text?.[0]?.plain_text || '',
      status: p.status?.select?.name || '草稿中',
      notes: p.notes?.rich_text?.[0]?.plain_text || '',
    };
  } catch {
    return null;
  }
}

export default async function ScriptEditorPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { c } = await searchParams;
  const project = await getProject(id);

  if (!project) notFound();

  // Token provided but doesn't match → deny access
  if (c && project.clientToken && c !== project.clientToken) notFound();

  const initialRole = c ? 'client' : 'internal';

  return <ScriptManager projectId={id} projectData={project} initialRole={initialRole} />;
}
