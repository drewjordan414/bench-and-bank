// Hand-written data: waters, hatch calendars, and per-pattern notes.
// Tying steps and photos live in patterns.json (generated from the SWTU booklet).

export const REGIONS = [
  { id: 'driftless', at: [43.6, -90.9], zoom: 8, name: 'the Driftless', where: 'Spring creeks of southwest Wisconsin, southeast Minnesota and northeast Iowa.',
    source: 'Mayflies, caddis and stoneflies follow the SWTU “Major Wisconsin Hatch Charts” (booklet p. 26), which run March to September. Rows marked * are general knowledge, not from that chart.' },
  { id: 'michigan', at: [44.6, -85.0], zoom: 8, name: 'Michigan', where: 'Au Sable, Manistee, Pere Marquette and the rivers like them.',
    source: 'Starter calendar from general knowledge. It has not been checked against a local chart — read a fly-shop report before a trip.' },
  { id: 'rockies', at: [42.0, -108.0], zoom: 5, name: 'the Rockies', where: 'Freestones and tailwaters of Colorado, Wyoming and Montana.',
    source: 'Starter calendar from general knowledge. Timing swings weeks with elevation and runoff — read a fly-shop report before a trip.' },
  { id: 'whiteriver', at: [36.3, -92.5], zoom: 10, name: 'the White River', where: 'Bull Shoals and Norfork tailwaters, Arkansas.',
    source: 'Months follow the Ozark Fly Flinger White River Hatch Chart (Scott Branyan, revised 2015). That chart gives no hook sizes; sizes come from Flylords and Big Y Fly Co web charts.' },
  { id: 'idaho', at: [43.6, -112.6], zoom: 7, name: 'Idaho', where: 'South Fork of the Snake, Silver Creek and the Big Wood.',
    source: 'South Fork rows follow the Hover Camp hatch chart; Silver Creek and Big Wood rows follow the Orvis guide excerpt and Silver Creek Outfitters’ web charts. Nothing here covers the Henry’s Fork.' },
];

const mo = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const ALL = mo(1, 12);
// h(region, months, bug, hook sizes, pattern ids, note, general-knowledge flag)
const h = (r, m, bug, hook, flies, note = '', g = 0) => ({ r, m, bug, hook, flies, note, g });

export const HATCHES = [
  // ── Driftless: from the SWTU chart ──
  h('driftless', mo(3, 9), 'Blue-winged olive', '#16–24', ['bwo-sparkle-dun', 'parachute-blue-winged-olive', 'pheasant-tail-nymph', 'rs2', 'barr-emerger', 'wd-40', 'parachute-adams'], 'Heaviest March to mid-May and again from late August. Overcast afternoons.'),
  h('driftless', [10], 'Blue-winged olive, late', '#18–24', ['bwo-sparkle-dun', 'parachute-blue-winged-olive', 'pheasant-tail-nymph', 'rs2', 'barr-emerger', 'wd-40', 'parachute-adams'], 'The autumn flight usually carries on past the end of the chart.', 1),
  h('driftless', [3, 4], 'Early black stonefly', '#15–20', ['pheasant-tail-nymph', 'gold-ribbed-hares-ear', 'copper-john', 'prince-nymph'], 'Tie the nymphs dark.'),
  h('driftless', [4, 5], 'Hendrickson', '#14', ['adams', 'rusty-spinner', 'pheasant-tail-nymph', 'gold-ribbed-hares-ear', 'parachute-adams', 'quigley-cripple'], 'Late April through May. The Rusty Spinner is its spinner fall.'),
  h('driftless', mo(3, 6), 'Little black caddis', '#16–18', ['elk-hair-caddis', 'x-caddis', 'partridge-orange', 'cdc-and-elk', 'sparkle-caddis-pupa'], 'Dark body, dark wing.'),
  h('driftless', mo(4, 6), 'American grannom', '#16–18', ['elk-hair-caddis', 'x-caddis', 'partridge-orange', 'cdc-and-elk', 'sparkle-caddis-pupa']),
  h('driftless', mo(4, 9), 'Tan caddis', '#16', ['elk-hair-caddis', 'x-caddis', 'cdc-and-elk', 'sparkle-caddis-pupa'], 'The long one: late April into September.'),
  h('driftless', [5, 6], 'Sulphur', '#16–20', ['pmd-hair-wing-dun', 'bwo-sparkle-dun', 'rusty-spinner', 'pheasant-tail-nymph', 'quigley-cripple', 'barr-emerger'], 'Tie the Sparkle Dun in pale yellow. Evenings; spinners at dusk.'),
  h('driftless', [5, 6], 'March brown', '#10–12', ['gold-ribbed-hares-ear', 'adams', 'parachute-adams', 'quigley-cripple']),
  h('driftless', [5, 6], 'Gray drake', '#12', ['adams', 'rusty-spinner', 'parachute-adams', 'quigley-cripple'], 'The spinner fall is the event. Tie the spinner grey.'),
  h('driftless', [6], 'Brown drake', '#10', [], 'A short window in early June.'),
  h('driftless', [6, 7], 'Hexagenia', '#4–8', ['hex-comparadun'], 'After dark, over silt.'),
  h('driftless', [6, 7], 'Light cahill', '#12–14', ['bwo-sparkle-dun', 'gold-ribbed-hares-ear'], 'Tie the Sparkle Dun in cream.'),
  h('driftless', mo(6, 9), 'Green caddis', '#16–20', ['elk-hair-caddis', 'x-caddis', 'cdc-and-elk', 'sparkle-caddis-pupa'], 'Olive body. Peaks in August.'),
  h('driftless', mo(6, 9), 'Yellow sally', '#14', ['elk-hair-caddis', 'stimulator'], 'A yellow-bodied Elk Hair Caddis stands in for the stonefly.'),
  h('driftless', mo(7, 9), 'Trico', '#20–24', ['trico-spinner', 'rusty-spinner', 'griffiths-gnat'], 'Mornings. Tie the spinner black with a white wing.'),
  h('driftless', [8, 9], 'White mayfly', '#12–14', ['bwo-sparkle-dun'], 'Dusk. Tie the Sparkle Dun in white.'),
  h('driftless', [8, 9], 'White miller', '#14', ['elk-hair-caddis', 'cdc-and-elk', 'sparkle-caddis-pupa'], 'Cream body, pale wing.'),
  // ── Driftless: general knowledge ──
  h('driftless', mo(7, 10), 'Hoppers and beetles', '#10–14', ['letort-hopper', 'foam-beetle', 'bc-hopper', 'parachute-ant', 'chernobyl-ant', 'icu-cricket'], 'Meadow water, windy afternoons, until the first hard frost.', 1),
  h('driftless', ALL, 'Midges', '#18–24', ['zebra-midge', 'griffiths-gnat', 'brassie', 'rs2', 'wd-40', 'rainbow-warrior'], 'The only hatch from November to February.', 1),
  h('driftless', ALL, 'Scuds', '#12–16', ['tan-scud', 'pink-squirrel'], 'Year-round food in weedy spring creeks.', 1),
  h('driftless', ALL, 'Nothing showing', '#8–12', ['woolly-bugger', 'pass-lake', 'gold-ribbed-hares-ear', 'prince-nymph', 'copper-john', 'muddler-minnow'], 'Searching patterns for when no one is rising.', 1),

  // ── Michigan ──
  h('michigan', [3, 4], 'Little black stonefly', '#14–18', ['pheasant-tail-nymph', 'gold-ribbed-hares-ear', 'copper-john', 'prince-nymph']),
  h('michigan', [4, 5, 9, 10], 'Blue-winged olive', '#16–20', ['bwo-sparkle-dun', 'parachute-blue-winged-olive', 'pheasant-tail-nymph', 'rs2', 'barr-emerger', 'wd-40', 'parachute-adams']),
  h('michigan', [4, 5], 'Hendrickson', '#12–14', ['adams', 'rusty-spinner', 'pheasant-tail-nymph', 'gold-ribbed-hares-ear', 'parachute-adams', 'quigley-cripple'], 'Late April to mid-May. The season opener.'),
  h('michigan', [4, 5], 'Grannom and little black caddis', '#14–16', ['elk-hair-caddis', 'x-caddis', 'partridge-orange', 'cdc-and-elk', 'sparkle-caddis-pupa']),
  h('michigan', [5, 6], 'Sulphur', '#16–18', ['pmd-hair-wing-dun', 'bwo-sparkle-dun', 'rusty-spinner', 'pheasant-tail-nymph', 'quigley-cripple', 'barr-emerger'], 'Tie the Sparkle Dun in pale yellow.'),
  h('michigan', [5, 6], 'March brown and gray drake', '#10–12', ['adams', 'gold-ribbed-hares-ear', 'rusty-spinner', 'parachute-adams', 'quigley-cripple']),
  h('michigan', [6], 'Brown drake', '#8–10', []),
  h('michigan', [6, 7], 'Hexagenia', '#4–8', ['hex-comparadun'], 'Late June to mid-July, after dark.'),
  h('michigan', mo(6, 9), 'Isonychia', '#10–12', ['adams', 'pheasant-tail-nymph', 'parachute-adams', 'quigley-cripple'], 'Tie the Adams dark; swing the nymph.'),
  h('michigan', mo(5, 9), 'Tan and olive caddis', '#14–18', ['elk-hair-caddis', 'x-caddis', 'cdc-and-elk', 'sparkle-caddis-pupa']),
  h('michigan', mo(7, 9), 'Trico', '#20–24', ['trico-spinner', 'rusty-spinner', 'griffiths-gnat'], 'Mornings. Tie the spinner black.'),
  h('michigan', mo(7, 9), 'Hoppers and beetles', '#10–14', ['letort-hopper', 'foam-beetle', 'bc-hopper', 'parachute-ant', 'chernobyl-ant', 'icu-cricket']),
  h('michigan', [11, 12, 1, 2, 3], 'Midges', '#18–24', ['zebra-midge', 'griffiths-gnat', 'brassie', 'rs2', 'wd-40', 'rainbow-warrior']),
  h('michigan', ALL, 'Nothing showing', '#6–12', ['woolly-bugger', 'pass-lake', 'gold-ribbed-hares-ear', 'prince-nymph', 'copper-john', 'muddler-minnow'], 'Streamers earn their place from September on.'),

  // ── Rockies ──
  h('rockies', [3, 4, 5, 9, 10], 'Blue-winged olive', '#18–22', ['bwo-sparkle-dun', 'parachute-blue-winged-olive', 'pheasant-tail-nymph', 'rs2', 'barr-emerger', 'wd-40', 'parachute-adams']),
  h('rockies', [4, 5], 'Mother’s Day caddis', '#14–16', ['elk-hair-caddis', 'x-caddis', 'partridge-orange', 'cdc-and-elk', 'sparkle-caddis-pupa'], 'Before runoff.'),
  h('rockies', mo(5, 7), 'Salmonfly', '#4–8', ['rogue-stone', 'kaufmanns-stone', 'chubby-chernobyl'], 'Moves upstream as the water warms.'),
  h('rockies', [6, 7], 'Golden stonefly', '#6–10', ['cdc-golden-stone', 'stimulator', 'chubby-chernobyl']),
  h('rockies', [6, 7], 'Green drake', '#10–12', ['green-drake-cripple']),
  h('rockies', mo(6, 8), 'Pale morning dun', '#14–18', ['pmd-hair-wing-dun', 'bwo-sparkle-dun', 'rusty-spinner', 'pheasant-tail-nymph', 'quigley-cripple', 'barr-emerger'], 'Tie the Sparkle Dun in pale yellow.'),
  h('rockies', mo(6, 8), 'Yellow sally', '#14–16', ['elk-hair-caddis', 'stimulator'], 'Yellow body.'),
  h('rockies', mo(6, 9), 'Summer caddis', '#14–18', ['elk-hair-caddis', 'x-caddis', 'cdc-and-elk', 'sparkle-caddis-pupa']),
  h('rockies', mo(7, 9), 'Trico', '#20–24', ['trico-spinner', 'rusty-spinner', 'griffiths-gnat'], 'Tie the spinner black.'),
  h('rockies', mo(7, 9), 'Hoppers and beetles', '#8–14', ['letort-hopper', 'foam-beetle', 'bc-hopper', 'parachute-ant', 'chernobyl-ant', 'icu-cricket']),
  h('rockies', ALL, 'Midges', '#18–24', ['zebra-midge', 'griffiths-gnat', 'brassie', 'rs2', 'wd-40', 'rainbow-warrior'], 'Tailwaters, all year. Most of the menu from November to March.'),
  h('rockies', ALL, 'Scuds', '#12–18', ['tan-scud'], 'Tailwaters.'),
  h('rockies', ALL, 'Nothing showing', '#6–12', ['woolly-bugger', 'gold-ribbed-hares-ear', 'pheasant-tail-nymph', 'prince-nymph', 'copper-john', 'perdigon', 'royal-wulff', 'humpy', 'muddler-minnow']),

  // ── White River, Arkansas: months from the Ozark Fly Flinger chart ──
  h('whiteriver', [1, 2, 11, 12], 'Tiny blue-winged olive', '#18–22', ['bwo-sparkle-dun', 'parachute-blue-winged-olive', 'pheasant-tail-nymph', 'rs2', 'barr-emerger', 'wd-40', 'parachute-adams'], 'Calm afternoons, in patches.'),
  h('whiteriver', [2, 3, 8], 'Threadfin shad', '#4–6', ['woolly-bugger', 'leftys-deceiver', 'clouser-minnow', 'zonker'], 'Dying shad come through the dams on heavy generation. Tie the Woolly Bugger white.'),
  h('whiteriver', [2, 3], 'Winter stoneflies', '#6–10', ['copper-john', 'prince-nymph'], 'Rare; near feeder streams.'),
  h('whiteriver', [3, 4], 'Grannom caddis', '#14–18', ['elk-hair-caddis', 'x-caddis', 'partridge-orange', 'cdc-and-elk', 'sparkle-caddis-pupa'], 'Peaks around the first of April. A #14.'),
  h('whiteriver', [4], 'Spotted and assorted caddis', '#14–18', ['elk-hair-caddis', 'x-caddis', 'cdc-and-elk', 'sparkle-caddis-pupa'], 'The second half of April.'),
  h('whiteriver', [4, 5], 'March brown', '#12–16', ['gold-ribbed-hares-ear', 'adams', 'parachute-adams', 'quigley-cripple']),
  h('whiteriver', [4, 5], 'Sulphur', '#16–18', ['pmd-hair-wing-dun', 'bwo-sparkle-dun', 'rusty-spinner', 'pheasant-tail-nymph', 'quigley-cripple', 'barr-emerger'], 'Early May is the heart of it. Afternoons; mornings when cloudy. Tie the Sparkle Dun in pale yellow.'),
  h('whiteriver', [5, 6], 'Light cahill', '#14–18', ['bwo-sparkle-dun', 'gold-ribbed-hares-ear'], 'Follows the sulphurs. Tie the Sparkle Dun in cream.'),
  h('whiteriver', [4, 5, 6], 'Spring and giant stoneflies', '#6–10', ['kaufmanns-stone', 'prince-nymph'], 'Sporadic, downriver on Bull Shoals. The nymph matters more than the adult.'),
  h('whiteriver', mo(4, 10), 'Microcaddis', '#18–22', ['elk-hair-caddis', 'x-caddis', 'cdc-and-elk', 'sparkle-caddis-pupa'], 'Starts as the big caddis finish and runs into autumn.'),
  h('whiteriver', mo(3, 10), 'Cranefly', '#8–10', ['barrs-cranefly-larva', 'mr-jones-cranefly']),
  h('whiteriver', mo(3, 10), 'Crayfish', '#6–10', ['basic-cray', 'woolly-bugger']),
  h('whiteriver', mo(6, 10), 'Terrestrials', '#6–12', ['foam-beetle', 'letort-hopper', 'bc-hopper', 'parachute-ant', 'chernobyl-ant', 'icu-cricket'], 'Beetles and ants in early summer, hoppers from August.'),
  h('whiteriver', [8, 9], 'White mayfly', '#10–16', ['bwo-sparkle-dun'], 'Tie the Sparkle Dun in white.'),
  h('whiteriver', ALL, 'Midges', '#18–24', ['zebra-midge', 'griffiths-gnat', 'brassie', 'rs2', 'wd-40', 'rainbow-warrior'], 'The only reliable hatch from October to December. Ruby and root beer are the local colours.'),
  h('whiteriver', ALL, 'Sowbugs', '#12–18', ['soft-hackle-sowbug', 'tan-scud'], 'The staple food of these tailwaters.'),
  h('whiteriver', ALL, 'Scuds', '#14–18', ['tan-scud']),
  h('whiteriver', [10, 11, 12, 1, 2], 'Eggs', '#12–16', ['nuke-egg'], 'Brown trout spawn through the winter. Hook size is a guess; the sources give none.'),
  h('whiteriver', ALL, 'Worms and junk', '#10–14', ['san-juan-worm', 'mop-fly', 'walts-worm'], 'After a rise in the water. Hook size is a guess; the sources give none.'),
  h('whiteriver', ALL, 'Sculpin', '#4–8', ['woolhead-sculpin', 'woolly-bugger', 'muddler-minnow', 'zonker'], 'Always there. Streamers for browns from September to November.'),

  // ── Idaho: South Fork of the Snake, Silver Creek, Big Wood ──
  h('idaho', [4], 'Skwala', '#10–14', ['skwala-stone'], 'South Fork.'),
  h('idaho', mo(5, 7), 'Salmonfly', '#4–8', ['rogue-stone', 'kaufmanns-stone', 'chubby-chernobyl'], 'South Fork.'),
  h('idaho', mo(6, 8), 'Golden stonefly', '#6–8', ['cdc-golden-stone', 'stimulator', 'chubby-chernobyl'], 'South Fork.'),
  h('idaho', [6], 'Brown drake', '#10', [], 'Silver Creek, the first ten days of June, at dusk.'),
  h('idaho', [6, 7], 'Green drake', '#12', ['green-drake-cripple'], 'Silver Creek and the Big Wood.'),
  h('idaho', [4, 5, 6, 9, 10, 11], 'Blue-winged olive', '#16–22', ['bwo-sparkle-dun', 'parachute-blue-winged-olive', 'pheasant-tail-nymph', 'rs2', 'barr-emerger', 'wd-40', 'parachute-adams'], 'Spring and autumn flights on the South Fork; afternoons on Silver Creek from late September.'),
  h('idaho', mo(5, 9), 'Pale morning dun', '#14–18', ['pmd-hair-wing-dun', 'bwo-sparkle-dun', 'rusty-spinner', 'pheasant-tail-nymph', 'quigley-cripple', 'barr-emerger'], 'Silver Creek peaks the first week of August. Tie the Sparkle Dun in pale yellow.'),
  h('idaho', mo(6, 8), 'Yellow sally', '#10–16', ['elk-hair-caddis', 'stimulator'], 'Yellow body.'),
  h('idaho', mo(6, 10), 'Caddis', '#8–18', ['elk-hair-caddis', 'x-caddis', 'cdc-and-elk', 'sparkle-caddis-pupa']),
  h('idaho', mo(6, 9), 'Callibaetis', '#16–18', ['callibaetis-spinner', 'adams', 'pheasant-tail-nymph', 'parachute-adams'], 'Silver Creek, late morning. The Adams is a stand-in.'),
  h('idaho', mo(7, 9), 'Trico', '#20–24', ['trico-spinner', 'rusty-spinner', 'griffiths-gnat'], 'Silver Creek: heavy morning spinner falls from late July. Tie the spinner black.'),
  h('idaho', [9, 10], 'Mahogany dun', '#12–16', ['rusty-spinner', 'pheasant-tail-nymph']),
  h('idaho', mo(7, 10), 'Hoppers', '#4–14', ['letort-hopper', 'bc-hopper', 'fat-albert', 'madam-x']),
  h('idaho', mo(6, 9), 'Ants and beetles', '#10–18', ['parachute-ant', 'foam-beetle', 'amys-ant', 'chernobyl-ant']),
  h('idaho', mo(6, 8), 'Damselfly', '#10–12', ['ditch-damsel'], 'Silver Creek.'),
  h('idaho', ALL, 'Midges', '#18–24', ['zebra-midge', 'griffiths-gnat', 'brassie', 'rs2', 'wd-40', 'rainbow-warrior'], 'February to November on the South Fork; the winter hatch on Silver Creek.'),
  h('idaho', ALL, 'Sculpin and baitfish', '#2–12', ['woolhead-sculpin', 'woolly-bugger', 'muddler-minnow', 'zonker'], 'South Fork streamer water.'),
  h('idaho', mo(6, 9), 'Nothing showing', '#10–14', ['royal-wulff', 'humpy', 'stimulator', 'chubby-chernobyl', 'prince-nymph'], 'Attractor dries for cutthroat water. General knowledge, not from a chart.'),
];

// What each pattern imitates and the sizes worth fishing it in.
// (The booklet ties everything at #10–14 so a beginner can see the work.)
export const NOTES = {
  'woolly-bugger': ['Leeches, sculpins, crayfish, big nymphs.', '#6–12'],
  'tan-scud': ['Freshwater scuds, the year-round food of weedy spring creeks and tailwaters.', '#12–18'],
  'partridge-orange': ['Emerging caddis and mayflies, swung just under the surface.', '#12–16'],
  'pass-lake': ['Nothing in particular. A Wisconsin attractor, swung as a wet fly or stripped as a small streamer.', '#8–14'],
  'zebra-midge': ['Midge pupae.', '#16–22'],
  'x-caddis': ['A caddis stuck halfway out of its shuck.', '#14–18'],
  'bwo-sparkle-dun': ['A mayfly dun trailing its shuck. Change the dubbing and the hook and it covers most mayflies: olive for BWOs, pale yellow for sulphurs and PMDs, cream for cahills.', '#12–22'],
  'rusty-spinner': ['Spent mayfly spinners. Rusty for Hendricksons and sulphurs, black and tiny for tricos.', '#12–24'],
  'pink-squirrel': ['A scud, more or less. John Bethke’s Driftless staple.', '#12–16'],
  'gold-ribbed-hares-ear': ['Mayfly nymphs, caddis pupae, small stoneflies. The generalist.', '#10–18'],
  'foam-beetle': ['Beetles.', '#12–16'],
  'pheasant-tail-nymph': ['Slim mayfly nymphs, Baetis above all, and small dark stoneflies.', '#12–20'],
  'griffiths-gnat': ['A cluster of midges. Passes for a trico when you have nothing smaller.', '#16–22'],
  'adams': ['No insect in particular and most grey-brown mayflies in general. First tied in Michigan in 1922.', '#10–18'],
  'elk-hair-caddis': ['Adult caddis. With a yellow body, a passable yellow sally.', '#12–18'],
  'letort-hopper': ['Grasshoppers.', '#8–12'],
  'parachute-blue-winged-olive': ['BWO duns, riding low in the film.', '#14–22'],
};

// What to tie for a water and month: the hatches on, and patterns ranked by how many of them each covers.
export function recommend(region, month) {
  const hatches = HATCHES.filter(x => x.r === region && x.m.includes(month));
  const uses = new Map();
  for (const x of hatches) for (const id of x.flies) uses.set(id, [...(uses.get(id) || []), x]);
  const flies = [...uses].map(([id, u]) => ({ id, for: u })).sort((a, b) => b.for.length - a.for.length);
  return { hatches, flies };
}
