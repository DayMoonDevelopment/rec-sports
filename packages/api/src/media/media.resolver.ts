import { Resolver } from '@nestjs/graphql';

import { Media } from './models/media.interface';

@Resolver(() => Media)
export class MediaResolver {
  __resolveType(value: Media): string {
    // Check if the object has properties specific to Image
    if ('blurHash' in value || 'height' in value || 'width' in value) {
      return 'Image';
    }

    // Default to Image for now since it's the only implementation
    return 'Image';
  }
}
