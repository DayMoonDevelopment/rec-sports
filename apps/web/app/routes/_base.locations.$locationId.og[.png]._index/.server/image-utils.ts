import sharp from "sharp";

// Helper function to fetch image as buffer
export async function fetchImageBuffer(url: string): Promise<Buffer> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

// Interface for composite image items
export interface CompositeImageItem {
  input: Buffer;
  left: number;
  top: number;
}

// Helper function to create final composite image
export async function createCompositeImage(
  baseImageBuffer: Buffer,
  compositeItems: CompositeImageItem[]
): Promise<Buffer> {
  let finalImage = sharp(baseImageBuffer).clone();
  
  if (compositeItems.length > 0) {
    finalImage = finalImage.composite(compositeItems);
  }
  
  return await finalImage.png().toBuffer();
}