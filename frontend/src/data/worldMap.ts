export interface WorldMapLocation {
  id: string;
  name: string;
  clanAffiliation: string;
  loreDescription: string;
  notableLandmark: string;
  glowColor: string;
  position: { x: string; y: string };
}

export const worldMapLocations: WorldMapLocation[] = [
  {
    id: 'frozen-tides',
    name: 'Frozen Tides',
    clanAffiliation: 'Moon Clan',
    loreDescription:
      'An icy mountain realm shrouded in perpetual moonlight, where glaciers sing ancient lullabies and the aurora dances across the sky each night. The Moon Clan has guarded these frozen peaks for millennia, drawing power from the celestial tides that govern the ice. Their warriors move like shadows across the snow, silent and inevitable as the turning of the moon.',
    notableLandmark: 'The Crescent Citadel',
    glowColor: '#4fc3f7',
    position: { x: '20%', y: '22%' },
  },
  {
    id: 'cinderhead-sands',
    name: 'Cinderhead Sands',
    clanAffiliation: 'Sun Clan',
    loreDescription:
      'A vast golden desert ruled by blazing solar energy, where the dunes shift like living creatures under the relentless gaze of the sun. The Sun Clan thrives in this scorching expanse, harnessing the raw power of solar fire to forge weapons and illuminate the darkest corners of the world. Ancient solar temples rise from the sand, their golden spires visible for hundreds of miles.',
    notableLandmark: 'The Solar Obelisk',
    glowColor: '#ff9800',
    position: { x: '75%', y: '20%' },
  },
  {
    id: 'ashen-peaks',
    name: 'Ashen Peaks',
    clanAffiliation: 'Fire Clan',
    loreDescription:
      'A volcanic highland forged by ancient eruptions, where rivers of molten rock carve through obsidian cliffs and the air shimmers with heat. The Fire Clan was born from the first great eruption, their bloodline forever bound to the primal fury of the earth\'s core. Every warrior carries a shard of volcanic glass as a mark of their covenant with the flame.',
    notableLandmark: 'The Ember Throne',
    glowColor: '#ef5350',
    position: { x: '24%', y: '52%' },
  },
  {
    id: 'stormlands',
    name: 'Stormlands',
    clanAffiliation: 'Lightning Clan',
    loreDescription:
      'Tempest-scarred central highlands crackling with perpetual storm energy, where lightning strikes the same peaks thousands of times each day. The Lightning Clan channels this raw electrical power through ancient conduit stones embedded in their skin, becoming living conductors of the sky\'s wrath. The air here smells of ozone and possibility, charged with the potential for sudden, devastating change.',
    notableLandmark: 'The Thunder Spire',
    glowColor: '#7c4dff',
    position: { x: '50%', y: '42%' },
  },
  {
    id: 'emerald-vale',
    name: 'Emerald Vale',
    clanAffiliation: 'Earth Clan',
    loreDescription:
      'A lush forested valley of deep roots and ancient spirits, where trees older than memory whisper secrets to those who know how to listen. The Earth Clan tends this sacred land with reverence, their shamans communing with the spirits of stone and root to maintain the balance of all living things. The valley floor is carpeted with bioluminescent moss that glows softly in the dark.',
    notableLandmark: 'The Grove of Elders',
    glowColor: '#66bb6a',
    position: { x: '50%', y: '70%' },
  },
  {
    id: 'azure-isles',
    name: 'Azure Isles',
    clanAffiliation: 'Water Clan',
    loreDescription:
      'An island archipelago surrounded by mystical tidal currents that shift with the moods of the deep ocean. The Water Clan navigates these treacherous waters with supernatural ease, their bodies partially attuned to the flow of currents and the pull of the tides. Beneath the crystal-clear shallows lie submerged ruins of a civilization that predates all known history.',
    notableLandmark: 'The Tide Sanctum',
    glowColor: '#26c6da',
    position: { x: '80%', y: '57%' },
  },
  {
    id: 'whispering-sea',
    name: 'Whispering Sea',
    clanAffiliation: 'Neutral',
    loreDescription:
      'The mythic ocean said to carry the voices of fallen ancestors across its surface, where sailors report hearing the names of the dead called out by the waves. No clan claims dominion over these waters, for the sea belongs to all and none — a sacred boundary between the world of the living and whatever lies beyond. Those who listen carefully on moonless nights claim to hear prophecies in the rhythm of the waves.',
    notableLandmark: "The Siren's Echo",
    glowColor: '#90a4ae',
    position: { x: '55%', y: '88%' },
  },
];
