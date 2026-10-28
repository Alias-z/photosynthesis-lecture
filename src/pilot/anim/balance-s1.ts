// Slide 10b animation "Balancing ATP and NADPH", staging s1. The story, the timing and the indicators: balance-common.ts.
import { makeBalance } from './balance-common';

export const STAGING = makeBalance({
  id: 's1',
  name: 'S1 · Beam balance',
  note: 'The whole chain; the routes balance ATP against NADPH on a beam balance: tipped toward NADPH, each route brings it level.',
});
