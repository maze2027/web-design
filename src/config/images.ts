/** Unsplash stock photography (free license). Swap for real photos of the school, car and team. */
const u = (id: string) => `https://images.unsplash.com/${id}`;

export const IMG = {
  hero: u("photo-1630406144797-821be1f35d75"),
  road: u("photo-1506664958676-205b41a88d0d"),
  hands: u("photo-1722011868850-5e9184fdb6d3"),
  inCar: u("photo-1537211790624-e6f568af4b13"),
  instructor: u("photo-1667020854803-0305af085242"),
  nervous: u("photo-1678899091039-9950e7f248b5"),
  confident: u("photo-1527593167147-e9c94a5883e6"),
  adult: u("photo-1612709060421-596380268eaf"),
  teen: u("photo-1516862523118-a3724eb136d7"),
  everyday: u("photo-1596649714492-a8f90ecb3776"),
  trafficLight: u("photo-1557404763-69708cd8b9ce"),
  crossing: u("photo-1758208974037-76046490a568"),
  keys: u("photo-1761014586544-53fe5e1f1e25"),
  speedometer: u("photo-1498887960847-2a5e46312788"),
  parking: u("photo-1506521781263-d8422e82f27a"),
  highway: u("photo-1773871614094-ddd11df362ed"),
  scenic: u("photo-1761237423404-48dc99d06863"),
  city: u("photo-1785788684002-f500e756047d"),
} as const;

export type ImgKey = keyof typeof IMG;
