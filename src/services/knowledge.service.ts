import fs from 'node:fs/promises';
import path from 'node:path';

type KnowledgeSource =
  | 'knowledge_graph'
  | 'ckeditor5'
  | 'fruit_basket'
  | 'skills'
  | 'eva_ai'
  | 'codelens_graph'
  | 'experience'
  | 'presmistique'
  | 'projects_overview';

export class KnowledgeService {
  readonly cache = new Map<string, string>();

  readonly fileMap: Record<KnowledgeSource, string> = {
    knowledge_graph: 'knowledge_graph.md',
    ckeditor5: 'project_ckeditor_deepdive.md',
    fruit_basket: 'project_fruit_basket_deepdive.md',
    presmistique: 'project_presmistique_deepdive.md',
    projects_overview: 'projects_overview.md',
    eva_ai: 'project_eva_ai_deepdive.md',
    codelens_graph: 'project_codelens_graph_deepdive.md',
    skills: 'skills.md',
    experience: 'experience.md'
  };

  private resolveFileName(source: string): string | undefined {
    if (!source || typeof source !== 'string') {
      return undefined;
    }

    if (source in this.fileMap) {
      return this.fileMap[source as KnowledgeSource];
    }

    if (Object.values(this.fileMap).includes(source)) {
      return source;
    }

    return undefined;
  }

  async getContent(
    source: string
  ): Promise<string> {
    const fileName = this.resolveFileName(source);
    if (!fileName) {
      console.error('Invalid knowledge source requested:', source);
      return `No knowledge content available for source: ${source}`;
    }

    if (this.cache.has(fileName)) {
      return this.cache.get(fileName)!;
    }

    const filePath = path.join(
      __dirname,
      '..',
      '..',
      'src',
      'knowledge',
      fileName
    );
    try {
      const content = await fs.readFile(filePath, 'utf8');
      this.cache.set(fileName, content);
      return content;
    } catch (error) {
      console.error('error fetching file', source, error);
      return `Could not load knowledge source: ${source}`;
    }
  }

  clearCache() {
    this.cache.clear();
  }
}

export const knowledgeService =
  new KnowledgeService();