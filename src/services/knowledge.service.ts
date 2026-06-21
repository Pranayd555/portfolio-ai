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

  async getContent(
    source: KnowledgeSource
  ): Promise<string> {
    if (this.cache.has(source)) {
      return this.cache.get(source)!;
    }
    console.log('source', source)
    // DYNAMIC PATH RESOLUTION
    const filePath = path.join(
      __dirname,
      '..',
      '..',
      'src',
      'knowledge',
      this.fileMap[source]
    );
    try {
      const content =
        await fs.readFile(filePath, 'utf8');
  
      this.cache.set(source, content);
  
      return content;

    } catch {
      console.error('error fetching file', source);
      return 'No Such file found in the knowledgebase.'
    }
  }

  clearCache() {
    this.cache.clear();
  }
}

export const knowledgeService =
  new KnowledgeService();