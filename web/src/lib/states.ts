export interface StateInfo {
  code: string;
  name: string;
  fips: string;
  /** Regularly scheduled offices on the 2026 ballot (Senate class 2 + specials, governors). */
  senate2026: boolean;
  governor2026: boolean;
}

// prettier-ignore
const RAW: [string, string, string, number, number][] = [
  ["AL","Alabama","01",1,1],["AK","Alaska","02",1,1],["AZ","Arizona","04",0,1],["AR","Arkansas","05",1,1],
  ["CA","California","06",0,1],["CO","Colorado","08",1,1],["CT","Connecticut","09",0,1],["DE","Delaware","10",1,0],
  ["FL","Florida","12",1,1],["GA","Georgia","13",1,1],["HI","Hawaii","15",0,1],["ID","Idaho","16",1,1],
  ["IL","Illinois","17",1,1],["IN","Indiana","18",0,0],["IA","Iowa","19",1,1],["KS","Kansas","20",1,1],
  ["KY","Kentucky","21",1,0],["LA","Louisiana","22",1,0],["ME","Maine","23",1,1],["MD","Maryland","24",0,1],
  ["MA","Massachusetts","25",1,1],["MI","Michigan","26",1,1],["MN","Minnesota","27",1,1],["MS","Mississippi","28",1,0],
  ["MO","Missouri","29",0,0],["MT","Montana","30",1,0],["NE","Nebraska","31",1,1],["NV","Nevada","32",0,1],
  ["NH","New Hampshire","33",1,1],["NJ","New Jersey","34",1,0],["NM","New Mexico","35",1,1],["NY","New York","36",0,1],
  ["NC","North Carolina","37",1,0],["ND","North Dakota","38",0,0],["OH","Ohio","39",1,1],["OK","Oklahoma","40",1,1],
  ["OR","Oregon","41",1,1],["PA","Pennsylvania","42",0,1],["RI","Rhode Island","44",1,1],["SC","South Carolina","45",1,1],
  ["SD","South Dakota","46",1,1],["TN","Tennessee","47",1,1],["TX","Texas","48",1,1],["UT","Utah","49",0,0],
  ["VT","Vermont","50",0,1],["VA","Virginia","51",1,0],["WA","Washington","53",0,0],["WV","West Virginia","54",1,0],
  ["WI","Wisconsin","55",0,1],["WY","Wyoming","56",1,1],
];

export const STATES: StateInfo[] = RAW.map(([code, name, fips, s, g]) => ({
  code, name, fips, senate2026: !!s, governor2026: !!g,
}));

export const STATE_BY_CODE = new Map(STATES.map((s) => [s.code, s]));
export const STATE_BY_FIPS = new Map(STATES.map((s) => [s.fips, s]));
