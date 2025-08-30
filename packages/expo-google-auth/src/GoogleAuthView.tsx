import { requireNativeView } from 'expo';
import * as React from 'react';

import { GoogleAuthViewProps } from './GoogleAuth.types';

const NativeView: React.ComponentType<GoogleAuthViewProps> =
  requireNativeView('GoogleAuth');

export default function GoogleAuthView(props: GoogleAuthViewProps) {
  return <NativeView {...props} />;
}
