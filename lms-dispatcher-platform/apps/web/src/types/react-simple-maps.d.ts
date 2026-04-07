declare module 'react-simple-maps' {
  import * as React from 'react';
  interface GeographiesChildrenProps {
    geographies: any[];
    [key: string]: any;
  }
  export const ComposableMap: React.FC<any>;
  export const Geographies: React.FC<{
    geography: string;
    children: (props: GeographiesChildrenProps) => React.ReactNode;
    [key: string]: any;
  }>;
  export const Geography: React.FC<any>;
  export const Marker: React.FC<any>;
}
