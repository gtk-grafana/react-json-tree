import React from 'react';
import type { CircularCache, CommonInternalProps } from './types';
interface Props extends CommonInternalProps {
    data: unknown;
    nodeType: string;
    from: number;
    to: number;
    renderChildNodes: (props: Props, from: number, to: number) => React.ReactNode;
    circularCache: CircularCache;
    level: number;
}
export default function ItemRange(props: Props): import("react/jsx-runtime").JSX.Element;
export {};
