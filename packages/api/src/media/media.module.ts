import { Module } from '@nestjs/common';

import { ImageModule } from './image/image.module';
import { MediaResolver } from './media.resolver';

@Module({
  imports: [ImageModule],
  providers: [MediaResolver],
  exports: [ImageModule],
})
export class MediaModule {}
