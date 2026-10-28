// Reference boards on their own page (refs.html): the index of all boards, one board with ?board=<id>, and the same
// picks and notes as in the pilot, saved to research/figure-briefs/picks.json through /__picks.
import { installPapers } from './papers';
import { pickStore } from './picks';
import { refsView } from './refsView';

installPapers(document.documentElement);
const status = document.createElement('span');
status.className = 'rf-status';
status.setAttribute('aria-live', 'polite');
document.body.append(status);

const store = pickStore(status, () => view.sync());
// Each move to another board or to the index gets its own address, so Back returns to where the reader was.
const view = refsView(document.getElementById('refs') as HTMLElement, store, {
  overlay: false,
  onShow: id => history.pushState(null, '', id === null ? location.pathname : `?board=${encodeURIComponent(id)}`),
});
const fromAddress = (): void => view.show(new URLSearchParams(location.search).get('board'));
addEventListener('popstate', fromAddress);
fromAddress();
