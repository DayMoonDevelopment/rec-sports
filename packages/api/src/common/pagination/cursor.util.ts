export class CursorUtil {
  static encodeCursor(data: string): string {
    return Buffer.from(data).toString('base64');
  }

  static decodeCursor(cursor: string): string {
    return Buffer.from(cursor, 'base64').toString('ascii');
  }

  static createCursor(id: string, createdAt?: Date): string {
    const data = createdAt ? `${id}_${createdAt.getTime()}` : id;
    return this.encodeCursor(data);
  }

  static parseCursor(cursor: string): { id: string; timestamp?: number } {
    const decoded = this.decodeCursor(cursor);
    const parts = decoded.split('_');
    
    if (parts.length === 2) {
      return { id: parts[0], timestamp: parseInt(parts[1]) };
    }
    
    return { id: decoded };
  }
}