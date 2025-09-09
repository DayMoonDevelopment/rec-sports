import { Module } from '@nestjs/common';

import { AddressResolver } from './resolvers/address.resolver';

@Module({
  providers: [AddressResolver],
  exports: [],
})
export class AddressModule {}
