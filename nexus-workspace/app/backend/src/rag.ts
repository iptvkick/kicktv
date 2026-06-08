import * as lancedb from '@lancedb/lancedb';
import path from 'path';

// Utilizando o embeddings nativo ou alguma lib local, por hora usaremos um dummy para buildar.
// No setup final, injetaríamos Xenova/transformers ou API key de OpenAI.

const dbDir = path.resolve(__dirname, '../../data/vectordb');

export async function initVectorDB() {
  const db = await lancedb.connect(dbDir);
  return db;
}

export async function createOrGetTable(db: lancedb.Connection, tableName: string) {
  const tableNames = await db.tableNames();
  if (tableNames.includes(tableName)) {
    return await db.openTable(tableName);
  }
  
  // Dummy schema pra RAG de Markdown
  return await db.createTable(tableName, [
    { vector: Array(384).fill(0), content: 'dummy', metadata: { source: 'init' } }
  ]);
}
