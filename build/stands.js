/* =====================================================================
   GETTYSBURG FIELD COMPANION — DATA
   GPS-aware staff-ride stands. Coordinates are real (WGS84).
===================================================================== */
const FC = {};
FC.map = { key:"field_base", w:1500, h:2500 };

/* Control points: real [lon,lat] <-> contour-map pixel [x,y].
   Used to fit a lon/lat -> map-pixel affine in-app (place GPS dot + stands). */
FC.ctrl = [
  {ll:[-77.2311,39.8309], px:[895,600]},   // town center
  {ll:[-77.2300,39.8221], px:[875,985]},   // Cemetery Hill
  {ll:[-77.2206,39.8156], px:[1015,1010]}, // Culp's Hill
  {ll:[-77.2369,39.7919], px:[612,2175]},  // Little Round Top
  {ll:[-77.2383,39.7875], px:[588,2330]},  // Big Round Top
  {ll:[-77.2456,39.8160], px:[470,1300]},  // Seminary Ridge (mid)
  {ll:[-77.2520,39.8369], px:[430,360]},   // McPherson Ridge
  {ll:[-77.2497,39.7969], px:[525,1775]},  // Peach Orchard
  {ll:[-77.2389,39.8417], px:[760,150]},   // Oak Hill
];

/* Compact personalities (portraits embedded by key) */
FC.people = {
  lee:{name:"Gen. Robert E. Lee",side:"conf",role:"Cmdr, Army of Northern Virginia"},
  longstreet:{name:"Lt. Gen. James Longstreet",side:"conf",role:"I Corps"},
  ewell:{name:"Lt. Gen. Richard S. Ewell",side:"conf",role:"II Corps"},
  hill:{name:"Lt. Gen. A.P. Hill",side:"conf",role:"III Corps"},
  stuart:{name:"Maj. Gen. J.E.B. Stuart",side:"conf",role:"Cavalry"},
  pickett:{name:"Maj. Gen. George Pickett",side:"conf",role:"Division, I Corps"},
  armistead:{name:"Brig. Gen. Lewis Armistead",side:"conf",role:"Brigade, Pickett's Div"},
  hood:{name:"Maj. Gen. John Bell Hood",side:"conf",role:"Division, I Corps"},
  early:{name:"Maj. Gen. Jubal Early",side:"conf",role:"Division, II Corps"},
  meade:{name:"Maj. Gen. George G. Meade",side:"union",role:"Cmdr, Army of the Potomac"},
  reynolds:{name:"Maj. Gen. John F. Reynolds",side:"union",role:"I Corps / left wing"},
  buford:{name:"Brig. Gen. John Buford",side:"union",role:"Cavalry Division"},
  hancock:{name:"Maj. Gen. Winfield S. Hancock",side:"union",role:"II Corps"},
  warren:{name:"Maj. Gen. Gouverneur K. Warren",side:"union",role:"Chief Engineer"},
  chamberlain:{name:"Col. Joshua L. Chamberlain",side:"union",role:"20th Maine, V Corps"},
  sickles:{name:"Maj. Gen. Daniel Sickles",side:"union",role:"III Corps"},
  howard:{name:"Maj. Gen. Oliver O. Howard",side:"union",role:"XI Corps"},
  hunt:{name:"Brig. Gen. Henry J. Hunt",side:"union",role:"Chief of Artillery"},
};

/* Staff-ride STANDS — real coordinates; radius in meters for GPS trigger */
FC.stands = [
  {
    id:"mcpherson", name:"McPherson Ridge", day:"Day 1 · morning",
    lat:39.83699, lon:-77.25200, r:220, photo:"field_reynolds_fell",
    people:["buford","reynolds","hill"],
    what:"Heth's Confederate division advanced east on the Chambersburg Pike toward town. Buford's dismounted cavalry fought a delaying action across these ridges; Reynolds rushed up I Corps and the Iron Brigade — and was killed in the first hour, committing the army to fight here.",
    decision:{ who:"Brig. Gen. Buford", q:"Make a dismounted stand on the ridges, or fall back and save the cavalry?",
      history:"Buford fought from the ridges, trading ground for time until the infantry arrived — the textbook delay that saved the high ground south of town.",
      teach:"Economy of force & terrain: a delay buys time and protects decisive ground with minimum force. Reading the ground (KOCOA) shaped the whole battle." },
    discuss:["Was committing to a meeting engagement here consistent with Lee's strategic aim?",
      "How did Buford's read of the ground south of town determine everything that followed?"]
  },
  {
    id:"oakhill", name:"Oak Hill", day:"Day 1 · afternoon",
    lat:39.84170, lon:-77.23890, r:200, photo:"dead_first_day",
    people:["ewell","early","howard"],
    what:"Ewell's corps arrived from the north. Rodes attacked from Oak Hill (Iverson's brigade was slaughtered in the open fields below) and Early shattered the XI Corps. Both Union corps were driven back through the streets to Cemetery Hill.",
    decision:null,
    discuss:["How did the arrival of Ewell from the north convert a Union tactical success into a rout?",
      "What does Iverson's destruction teach about reconnaissance and control of an attack?"]
  },
  {
    id:"barlow", name:"Barlow's Knoll", day:"Day 1 · ~3:00 p.m.",
    lat:39.84190, lon:-77.22470, r:170, photo:null,
    people:["early","howard"],
    what:"Gen. Barlow advanced his XI Corps division to this rise, creating a salient that Early's Confederates crushed, collapsing the Union right north of town.",
    decision:null,
    discuss:["Barlow advanced to higher ground and was flanked. Compare with Sickles on Day 2 — when does seizing forward high ground help, and when does it break the line?"]
  },
  {
    id:"cemhill", name:"Cemetery Hill", day:"Day 1 · evening",
    lat:39.82210, lon:-77.23000, r:200, photo:"cemetery_gatehouse",
    people:["ewell","howard","hancock"],
    what:"The broken Union corps rallied on this commanding hill — the ground Howard had wisely held in reserve. Hancock, sent by Meade, ruled it could be held. Lee ordered Ewell to take it 'if practicable.'",
    decision:{ who:"Lt. Gen. Ewell", q:"Storm Cemetery Hill at dusk 'if practicable,' or consolidate and wait for morning?",
      history:"Ewell judged an assault impracticable and did not press. Whether the hill could have been taken is the battle's most enduring 'what-if.'",
      teach:"Mission command & discretionary orders: 'if practicable' delegates judgment but transfers risk to a subordinate who may lack the senior's intent and audacity." },
    discuss:["Was Ewell's decision a failure of the man, or of the order? How would you have written Lee's order?",
      "How does this stand illustrate the difference between intent and instruction?"]
  },
  {
    id:"culps", name:"Culp's Hill", day:"Day 2–3",
    lat:39.81560, lon:-77.22060, r:200, photo:null,
    people:["ewell"],
    what:"The wooded barb of the Union fishhook, anchoring the right and dominating the Baltimore Pike supply line. Greene's lone brigade held entrenchments here on Day 2; a seven-hour fight on Day 3 morning cleared the Confederates off.",
    decision:null,
    discuss:["Why was this unglamorous wooded hill arguably the most important ground on the field?",
      "What did Union field fortifications (Greene's works) buy the defenders here?"]
  },
  {
    id:"virginia", name:"Virginia Memorial — Confederate Line (Seminary Ridge)", day:"Day 2–3",
    lat:39.81130, lon:-77.24830, r:200, photo:null,
    people:["lee","longstreet","pickett"],
    what:"Lee's vantage on Seminary Ridge. From here he planned the Day 2 echelon assault on the Union left and, on Day 3, watched Pickett's Charge step off across nearly a mile of open ground toward the copse of trees.",
    decision:{ who:"Gen. Lee", q:"Day 2: attack the fishhook now, or adopt Longstreet's move around the Union left to fight on the defensive?",
      history:"Lee chose the offensive: 'The enemy is there, and I am going to attack him there.' Longstreet executed the assault he had argued against.",
      teach:"The offensive-defensive & the initiative: Lee valued moral initiative and his army's offensive spirit; Longstreet valued the tactical defensive's lethality. The friction degraded synchronization all day." },
    discuss:["Stand where Lee stood and look across to the Union center. Was the Day 3 assault ever feasible?",
      "Had the army reached its culminating point? What indicators would tell a commander he had?"]
  },
  {
    id:"peachorchard", name:"The Peach Orchard", day:"Day 2 · ~3:00 p.m.",
    lat:39.79690, lon:-77.24970, r:180, photo:null,
    people:["sickles","longstreet","hood"],
    what:"Without orders, Sickles advanced III Corps three-quarters of a mile forward to this higher ground, creating an exposed salient with both flanks in the air — just as Longstreet's assault landed.",
    decision:{ who:"Maj. Gen. Sickles", q:"Hold the assigned line on Cemetery Ridge, or advance to the higher ground here?",
      history:"Sickles advanced without authorization. His corps was wrecked (he lost a leg), but the unexpected salient disrupted Longstreet's timing.",
      teach:"Commander's intent & discipline: a subordinate who substitutes his own scheme for the higher plan endangers the whole — even when local terrain logic seems sound." },
    discuss:["Why do we damn Sickles' initiative but praise Warren's at Little Round Top the same afternoon?",
      "Integrity of the line vs. local advantage — which wins, and why?"]
  },
  {
    id:"wheatfield", name:"The Wheatfield", day:"Day 2 · afternoon",
    lat:39.79750, lon:-77.24300, r:150, photo:null,
    people:["hood"],
    what:"This 19-acre field changed hands six times in the bloodiest fighting of Day 2 — a vortex that drew in and chewed up brigades from both sides.",
    decision:null,
    discuss:["What is the cost, in command terms, of feeding units piecemeal into a fight like this?"]
  },
  {
    id:"devilsden", name:"Devil's Den", day:"Day 2 · ~4:30 p.m.",
    lat:39.79060, lon:-77.24250, r:150, photo:"rebel_sharpshooter",
    people:["hood"],
    what:"Hood's Texans and Georgians took this boulder-strewn position at the foot of Little Round Top, then used it as a sharpshooters' nest against the Union line above.",
    decision:null,
    discuss:["How does the micro-terrain here shape what infantry and sharpshooters could do?"]
  },
  {
    id:"lrt", name:"Little Round Top", day:"Day 2 · ~4:30 p.m.",
    lat:39.79190, lon:-77.23690, r:160, photo:"little_round_top",
    people:["warren","chamberlain","hood"],
    what:"The undefended hill anchoring the whole Union left. Chief engineer Warren rushed brigades here minutes before Hood's men arrived. On the extreme flank, Chamberlain's 20th Maine, out of ammunition, broke the assault with a downhill bayonet charge.",
    decision:{ who:"Col. Chamberlain", q:"Out of ammunition with your flank about to be turned — charge, withdraw, or stand?",
      history:"Chamberlain ordered 'Bayonet!' — a wheeling downhill charge that shattered the assault and saved the flank.",
      teach:"Initiative at the decisive point & the human dimension: Warren (foresight), Vincent (rapid commitment), Chamberlain (audacity) each acted on their own initiative inside the commander's intent." },
    discuss:["What command climate makes that kind of junior-leader initiative possible?",
      "Stand on the summit: why does this hill command the entire Union line?"]
  },
  {
    id:"pamemorial", name:"Pennsylvania Memorial — Cemetery Ridge", day:"Day 2–3",
    lat:39.80500, lon:-77.23590, r:200, photo:null,
    people:["meade","hancock","hunt"],
    what:"The Union main line and Meade's interior position. From the fishhook, Meade shifted reserves faster than Lee could shift around its exterior — the decisive geometry of the battle.",
    decision:{ who:"Maj. Gen. Meade", q:"Day 1 night: stand and fight on this ground, or fall back to the prepared Pipe Creek line?",
      history:"Meade concentrated the army here and ratified it in a council of war — choosing to fight on the fishhook.",
      teach:"Interior lines & decision under uncertainty: the fishhook gave Meade shorter reinforcement distances than Lee's exterior line. Recognizing and keeping good ground is its own art." },
    discuss:["Walk the interior line. How does the fishhook's geometry win the battle for Meade?"]
  },
  {
    id:"angle", name:"The Angle — High-Water Mark", day:"Day 3 · ~3:00 p.m.",
    lat:39.81330, lon:-77.23580, r:150, photo:"high_water_mark",
    people:["hancock","armistead","pickett","hunt"],
    what:"The target of Pickett's Charge. About 12,500 Confederates crossed three-quarters of a mile of open ground into converging fire; a few hundred under Armistead breached the wall here and were killed or captured. The Confederacy's high-water mark.",
    decision:{ who:"Gen. Lee", q:"Day 3: renew the assault on the center, maneuver around the flank, or withdraw to Virginia?",
      history:"Lee ordered the charge. It failed at over 50% losses. 'It is all my fault,' he told the survivors.",
      teach:"Culmination & the sunk-cost trap: an army at its culminating point cannot generate decisive offensive results. The hardest decision is to STOP — prior investment does not justify the next, costlier attack." },
    discuss:["Stand at the wall and look back across the field the Confederates crossed. What does it tell you?",
      "How does the sunk-cost trap operate on commanders after two days of near-misses?"]
  },
  {
    id:"cemetery", name:"Soldiers' National Cemetery", day:"Aftermath · 19 Nov 1863",
    lat:39.82050, lon:-77.23060, r:200, photo:null,
    people:["meade","lee"],
    what:"~51,000 casualties made Gettysburg the bloodiest battle in North American history. Here, four months later, Lincoln's two-minute address redefined the war's purpose — 'a new birth of freedom.' Coupled with Vicksburg (4 July), the campaign marked the strategic turning point.",
    decision:null,
    discuss:["Coupled with Vicksburg, was Gettysburg 'the turning point' — or does that flatten a war with two more years to run?",
      "Distinguish Lee's tactical defeat from the strategic effect of the campaign.",
      "Map the campaign's lessons onto a contemporary operating problem your seminar is studying."]
  },
];
window.FC = FC;
