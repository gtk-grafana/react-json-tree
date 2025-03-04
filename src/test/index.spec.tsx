import {cleanup, render, screen} from '@testing-library/react'
import {afterEach, describe, it} from 'vitest'
import {JSONTree} from '../main.ts';

const BASIC_DATA = { a: 1, b: 'c' };

describe('JSONTree', () => {
  afterEach(cleanup)

  it('should render', () => {
    render(<JSONTree data={BASIC_DATA} />);
  })

  it('should render basic tree', () => {
    render(<JSONTree data={BASIC_DATA} />);

    expect(screen.getByRole('group')).toBeInTheDocument()

    // expect(result.props.children.type.name).toBe(JSONNode.name);
  });
});

