import * as React from 'react';

import { GoogleAuthViewProps } from './GoogleAuth.types';

export default function GoogleAuthView(props: GoogleAuthViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
