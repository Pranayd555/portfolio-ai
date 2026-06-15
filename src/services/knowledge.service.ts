import fs from 'fs/promises';
import path from 'path';

type KnowledgeSource =
  | 'ckeditor5'
  | 'ngrx'
  | 'skills'
  | 'experience'
  | 'presmistique'
  | 'projects_overview';

export class KnowledgeService {
  private cache = new Map<string, string>();

  private fileMap: Record<KnowledgeSource, string> = {
    ckeditor5: 'project_ckeditor_deepdive.md',
    ngrx: 'project_ngrx_deepdive.md',
    presmistique: 'project_presmistique_deepdive.md',
    projects_overview: 'projects_overview.md',
    skills: 'skills.md',
    experience: 'experience.md'
  };

  async getContent(
    source: KnowledgeSource
  ): Promise<string> {
    if (this.cache.has(source)) {
      return this.cache.get(source)!;
    }

    const filePath = path.join(
      process.cwd(),
      'src',
      'knowledge',
      this.fileMap[source]
    );

    const content =
      await fs.readFile(filePath, 'utf8');

    this.cache.set(source, content);

    return content;
  }

  clearCache() {
    this.cache.clear();
  }
}

export const knowledgeService =
  new KnowledgeService();