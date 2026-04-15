// Auto-generated English translations for daily exam questions
// Used by DuoExamPlayer when lang === "en"

export interface TranslatedQuestion {
  text: string;
  options: string[];
  explanation: string;
  scenario?: string;
}

export const EXAM_TRANSLATIONS_EN: Record<string, TranslatedQuestion> = {
  c1q01: {
    text: "Who is a shipper in the freight transportation chain?",
    options: ["A company or person sending cargo", "A truck driver", "An intermediary between carrier and shipper", "A dispatcher managing routes"],
    explanation: "A shipper is the sender of freight: a factory, store, or any company that needs to move goods from point A to point B.",
  },
  c1q02: {
    text: "If the rate for a load is $2,400 and the distance is 800 miles \u2014 what is the RPM?",
    options: ["$2.50", "$3.00", "$1.80", "$2.00"],
    explanation: "RPM (Rate Per Mile) = total rate \u00f7 miles. $2,400 \u00f7 800 = $3.00 per mile.",
  },
  c1q03: {
    text: "What is the primary role of a broker in the freight system?",
    options: ["Physically transport freight", "Connect shippers and carriers, organizing transportation", "Issue licenses to drivers", "Manage a warehouse"],
    explanation: "A broker is an intermediary. They receive freight from shippers and find carriers for delivery, earning on the margin.",
  },
  c1q04: {
    text: "What are \"deadhead miles\"?",
    options: ["Miles with the heaviest load", "Miles driven empty (without cargo)", "Miles on highways", "Miles driven at night"],
    explanation: "Deadhead is driving without cargo. It costs money (fuel, wear) and generates no revenue. Always factor deadhead into rate calculations.",
  },
  c1q05: {
    text: "What does the abbreviation FTL stand for?",
    options: ["First Truck Lane", "Full Truckload", "Federal Transit License", "Freight Transfer Line"],
    explanation: "FTL (Full Truckload) \u2014 one shipper fills the entire trailer. Ideal for large shipments.",
  },
  c1q06: {
    text: "What is LTL?",
    options: ["Long Term Lease", "Less Than Truckload", "Last Truck Lane", "Licensed Transit Logistics"],
    explanation: "LTL (Less Than Truckload) \u2014 the freight doesn't fill the whole trailer. Multiple shippers share space in one truck.",
  },
  c1q07: {
    text: "Who is a carrier?",
    options: ["A company that owns a truck and physically transports freight", "The sender of freight", "A carrier's insurance company", "A platform for finding loads"],
    explanation: "A carrier is the transporter: a company or independent driver (owner-operator) who physically moves the freight.",
  },
  c1q08: {
    text: "What does OTR stand for?",
    options: ["On Time Receipt", "Over The Road", "Official Transport Route", "Order Transfer Record"],
    explanation: "OTR (Over The Road) \u2014 long-haul transportation across multiple states. OTR drivers may be away from home for weeks.",
  },
  c1q09: {
    text: "What is a \"lane\" in freight transportation?",
    options: ["A lane on a highway", "A route between two geographic points (origin\u2013destination)", "A type of trailer", "A transportation license"],
    explanation: "A lane is a specific route, e.g. Chicago\u2013Atlanta. Lanes can be \"hot\" (lots of freight, few trucks) or \"dead\" (the opposite).",
  },
  c1q10: {
    text: "What is the main function of a dispatcher?",
    options: ["Physically deliver freight", "Issue MC# and DOT# to drivers", "Find loads, negotiate with brokers, and manage driver-broker interactions", "Manage warehouse inventory"],
    explanation: "The dispatcher is the operational center: finds loads, negotiates rates, dispatches drivers, and solves problems on the road.",
  },
  c1q11: {
    text: "What are accessorial charges?",
    options: ["Monthly truck insurance payments", "Additional fees beyond the base rate (detention, liftgate, etc.)", "Fuel surcharges only", "Broker commission fees"],
    explanation: "Accessorials are extra charges for services beyond standard pickup and delivery: detention, liftgate, layover, hazmat, etc.",
  },
  c1q12: {
    text: "What does TONU mean?",
    options: ["Truck On New Update", "Truck Ordered Not Used", "Transport Operations Network Unit", "Total Order Not Uploaded"],
    explanation: "TONU (Truck Ordered Not Used) \u2014 when a carrier arrives at pickup but the load is cancelled. The carrier is entitled to compensation.",
  },
  c1q13: {
    text: "What is a load board?",
    options: ["A physical board at a warehouse showing available docks", "An online platform where brokers post available loads and carriers search for freight", "A DOT inspection report", "A type of freight insurance"],
    explanation: "A load board (DAT, Truckstop) is an online marketplace connecting brokers with available freight and carriers with available trucks.",
  },
  c1q14: {
    text: "What does MC# mean?",
    options: ["Motor Carrier number \u2014 a unique identifier for a transportation company issued by FMCSA", "Miles Counter \u2014 an odometer reading", "Maintenance Certificate \u2014 a vehicle inspection document", "Monthly Contract \u2014 a service agreement with a broker"],
    explanation: "MC# (Motor Carrier number) is issued by FMCSA and is required for interstate commercial freight transportation.",
  },
  c1q15: {
    text: "A driver is 3 hours from delivery. The broker calls asking for a location update. What should the dispatcher do?",
    options: ["Ignore \u2014 the broker can track via GPS", "Provide exact location, ETA, and any potential delays proactively", "Ask the driver to call the broker directly", "Say the driver is already at the delivery point"],
    explanation: "Professional dispatchers always provide proactive updates: current location, ETA, and any issues. This builds trust and prevents problems.",
    scenario: "Your driver is hauling a load from Dallas to Atlanta. 3 hours from delivery, the broker calls asking for a status update.",
  },
  c1q16: {
    text: "The shipper changed the pickup time from 8 AM to 2 PM. The driver is already en route. What do you do?",
    options: ["Tell the driver to wait at the pickup until 2 PM", "Contact the broker, confirm the new time, update the driver, and look for a short local load to fill the gap", "Cancel the load immediately", "Ignore the change \u2014 the driver will figure it out"],
    explanation: "A dispatcher adapts to changes: confirm with broker, update driver, and try to minimize downtime by finding fill-in work.",
    scenario: "Your driver was heading to an 8 AM pickup when the shipper suddenly rescheduled to 2 PM.",
  },
  c1q17: {
    text: "The rate con says 42,000 lbs but the actual load weighs 45,000 lbs. What should you do?",
    options: ["Load anyway \u2014 3,000 lbs difference doesn't matter", "Contact the broker immediately and request an updated rate con before the driver signs the BOL", "Refuse the load on the spot", "Tell the driver to remove some cargo"],
    explanation: "Any weight discrepancy must be resolved BEFORE the driver signs the BOL. Contact the broker, get an updated rate con with the correct weight.",
    scenario: "At pickup, your driver notices the actual weight is 45,000 lbs, but the rate confirmation shows 42,000 lbs.",
  },
  c1q18: {
    text: "A broker offers $1,800 for a 600-mile run. Your minimum acceptable RPM is $3.00. What do you do?",
    options: ["Accept \u2014 $1,800 is a good total amount", "Decline \u2014 at $3.00/mi the minimum is $1,800, so negotiate up to at least $1,850-1,900 for margin", "Counter at $2,500 \u2014 always ask for maximum", "Ignore the offer completely"],
    explanation: "$1,800 \u00f7 600 = $3.00 RPM exactly at your minimum. Always try to negotiate above the floor to account for unexpected costs.",
    scenario: "A broker posts a load: 600 miles for $1,800. Your minimum RPM target is $3.00/mile.",
  },
  c1q19: {
    text: "What is the first thing a dispatcher checks in the morning?",
    options: ["Social media for industry news", "Driver positions, HOS status, and any overnight messages or load updates", "Email from corporate headquarters", "Weather forecast for the week"],
    explanation: "Morning routine: check driver positions and HOS, review active loads, read overnight messages. Know your fleet status before making any calls.",
  },
  c1q20: {
    text: "What is a backhaul?",
    options: ["A type of truck suspension", "A return load that prevents the truck from deadheading back empty", "A penalty for late delivery", "A broker's internal tracking system"],
    explanation: "A backhaul is a load heading back toward the driver's home base or next pickup, preventing empty (deadhead) miles on the return trip.",
  },
  c2q01: {
    text: "How many time zones are there in the continental US?",
    options: ["3", "4", "5", "6"],
    explanation: "Continental US has 4 time zones: Eastern (ET), Central (CT), Mountain (MT), and Pacific (PT).",
  },
  c2q02: {
    text: "When it's 3:00 PM Eastern, what time is it Pacific?",
    options: ["12:00 PM", "1:00 PM", "2:00 PM", "5:00 PM"],
    explanation: "Pacific time is 3 hours behind Eastern. 3:00 PM ET = 12:00 PM PT.",
  },
  c2q03: {
    text: "What is a freight hotspot?",
    options: ["A place where trucks frequently break down", "A geographic area with high concentration of available loads", "A DOT inspection checkpoint", "A truck stop with Wi-Fi"],
    explanation: "A hotspot is a region with consistently high freight volume \u2014 like Chicago, Dallas, Atlanta. Sending a driver to a hotspot increases their chances of quickly finding a next load.",
  },
  c2q04: {
    text: "Which city is one of the largest freight hubs in the US?",
    options: ["Boise, Idaho", "Chicago, Illinois", "Burlington, Vermont", "Fargo, North Dakota"],
    explanation: "Chicago is a major freight hub \u2014 central location, multiple interstates, huge warehouse/distribution density. Great market for finding loads.",
  },
  c2q05: {
    text: "What is a dead zone in trucking?",
    options: ["A highway stretch with no gas stations", "A geographic area with very few outbound loads", "A zone where GPS doesn't work", "A restricted military area"],
    explanation: "A dead zone is an area with minimal outbound freight \u2014 like rural Montana or Wyoming. Drivers may have to deadhead long distances to find the next load.",
  },
  c2q06: {
    text: "When it's noon Central time, what time is it in Mountain zone?",
    options: ["11:00 AM", "1:00 PM", "10:00 AM", "2:00 PM"],
    explanation: "Mountain time is 1 hour behind Central. 12:00 PM CT = 11:00 AM MT.",
  },
  c2q07: {
    text: "Why are time zones critical for dispatchers?",
    options: ["They affect fuel prices", "Pickup/delivery appointments are in local time \u2014 a timezone mistake means missed appointments and penalties", "They determine truck speed limits", "They affect insurance rates"],
    explanation: "A pickup at 8 AM Central is NOT 8 AM Eastern. Timezone errors cause missed appointments, detention charges, and broken broker relationships.",
  },
  c2q08: {
    text: "Which states are considered dead zones for sprinter vans?",
    options: ["Texas and California", "Montana, Wyoming, Idaho, North Dakota", "Florida and Georgia", "New York and New Jersey"],
    explanation: "Montana, Wyoming, Idaho, North Dakota have very low freight volume \u2014 especially for sprinter vans. Avoid sending drivers there unless the rate justifies the deadhead out.",
  },
  c2q09: {
    text: "Texas spans how many time zones?",
    options: ["1 (Central only)", "2 (Central and Mountain)", "3", "Texas has its own timezone"],
    explanation: "Most of Texas is Central, but the western tip (El Paso area) is Mountain time. Always verify which zone the pickup/delivery is in.",
  },
  c2q10: {
    text: "Driver is in Phoenix, AZ. They need to be in Los Angeles by 10 AM Pacific. Phoenix is Mountain time but Arizona doesn't observe DST. How should you plan?",
    options: ["Phoenix is always 1 hour ahead of LA", "Check current offset \u2014 during standard time Phoenix=Mountain (1hr ahead of PT), during DST Phoenix=same as Pacific", "Phoenix is always the same as LA", "Ignore timezone \u2014 GPS will handle it"],
    explanation: "Arizona doesn't observe DST. In winter, Phoenix is 1hr ahead of LA (MST vs PST). In summer, Phoenix is the SAME time as LA (MST = PDT). Always verify current offset.",
  },
  c2q11: {
    text: "Your driver delivered in Atlanta and is empty. Which destination gives the best chance of finding a next load quickly?",
    options: ["Rural Alabama", "Charlotte, NC \u2014 a strong outbound market", "Small-town Mississippi", "Northern Maine"],
    explanation: "Charlotte is a strong freight market with high outbound volume. Sending a driver to a market hub minimizes empty time between loads.",
    scenario: "Your driver just delivered in Atlanta, GA and needs the next load.",
  },
  c2q12: {
    text: "Why is the I-95 corridor important for dispatchers?",
    options: ["It has the lowest toll rates", "It connects major East Coast freight hubs from Miami to Boston with consistent load availability", "It's the only highway that crosses all time zones", "It has unlimited truck parking"],
    explanation: "I-95 runs through Miami, Jacksonville, Savannah, Charlotte, Richmond, DC, Philadelphia, NYC, Boston \u2014 all major freight markets. High-volume corridor.",
  },
  c2q13: {
    text: "What is a relay in trucking?",
    options: ["A radio communication system", "A load exchange point where one driver hands off to another to extend delivery range without HOS violations", "A type of trailer coupling", "A DOT rest area"],
    explanation: "A relay allows a long-distance load to be covered by multiple drivers, each within their HOS limits, by exchanging the trailer at a midpoint.",
  },
  c2q14: {
    text: "You're booking a pickup in Denver (Mountain) and delivery in Chicago (Central). Pickup is 6 AM local. What time is that in Chicago?",
    options: ["5:00 AM", "7:00 AM", "6:00 AM", "8:00 AM"],
    explanation: "Central is 1 hour ahead of Mountain. 6:00 AM MT = 7:00 AM CT.",
  },
  c2q15: {
    text: "Your driver is in Miami heading to New York. The broker says the delivery appointment is Tuesday 8 AM. Both cities are Eastern time. What's the dispatcher's main concern?",
    options: ["Currency exchange rates", "Whether the driver has enough HOS hours for the ~1,280-mile drive \u2014 at ~500 miles/day, it takes ~2.5 driving days", "The color of the trailer", "Truck tire brand compatibility"],
    explanation: "Miami to NYC is ~1,280 miles. At legal HOS limits (~500 mi/day), that's about 2.5 days of driving. Factor in rest periods and verify HOS sufficiency.",
    scenario: "Load: Miami, FL to NYC. Delivery appointment: Tuesday 8 AM ET. Today is Saturday.",
  },
  c2q16: {
    text: "Which of these is the best market for sprinter vans?",
    options: ["Rural Wyoming", "Dallas, TX", "Northern Maine", "Central Idaho"],
    explanation: "Dallas is one of the strongest sprinter van markets \u2014 high volume of small/expedited loads, central location, many brokers. Great for finding next loads quickly.",
  },
  c2q17: {
    text: "What is the purpose of a freight lane analysis?",
    options: ["To count how many trucks are on a highway", "To evaluate which routes consistently offer good rates and load availability for planning driver moves", "To measure road surface quality", "To track fuel prices along a route"],
    explanation: "Lane analysis helps dispatchers identify profitable routes and avoid dead zones. Know which lanes pay well and have reliable volume.",
  },
  c2q18: {
    text: "Which factor makes a market 'strong' for dispatchers?",
    options: ["Low fuel prices", "High outbound freight volume relative to available trucks \u2014 creating rate competition among brokers", "Presence of a DOT office", "Proximity to the Canadian border"],
    explanation: "A strong market has more freight than trucks available. Brokers compete for capacity, pushing rates up. Chicago, LA, Dallas, Atlanta are consistently strong.",
  },
  c2q19: {
    text: "What determines whether sending a driver to a 'dead zone' is a good strategy?",
    options: ["It's never good to send a driver to a dead zone", "If the rate is high enough to cover the deadhead out of the dead zone and still leave profit", "Only if the driver lives there", "Only during holidays"],
    explanation: "Sending a driver into a dead zone can be profitable IF the inbound rate is high enough to compensate for the deadhead miles to get back to a strong market.",
  },
  c2q20: {
    text: "Your driver just delivered in Billings, Montana (dead zone). What is the best strategy?",
    options: ["Wait in Billings for a local load to appear", "Look for a high-RPM load heading toward a strong market like Denver, Salt Lake City, or Seattle even if it means driving more miles", "Have the driver come home empty immediately", "Post on social media asking for loads"],
    explanation: "In a dead zone, find a load heading TOWARD a strong market. Even a slightly lower RPM is better than deadheading 500+ miles to the nearest freight hub.",
    scenario: "Your driver just delivered in Billings, MT. The load board shows almost nothing outbound.",
  },
  c3q01: {
    text: "What is a dry van?",
    options: ["A truck without air conditioning", "An enclosed trailer for non-temperature-sensitive freight", "A refrigerated trailer", "A flatbed with a cover"],
    explanation: "A dry van is the most common trailer type \u2014 enclosed, no temperature control. Used for general freight, packaged goods, electronics, etc.",
  },
  c3q02: {
    text: "What is a reefer?",
    options: ["A truck driving in reverse", "A refrigerated trailer for temperature-sensitive freight", "A flatbed with side rails", "A type of fuel additive"],
    explanation: "Reefer (refrigerated trailer) maintains a set temperature for perishable goods \u2014 food, pharmaceuticals, flowers, etc.",
  },
  c3q03: {
    text: "What type of freight requires a flatbed?",
    options: ["Packaged consumer goods", "Oversized or heavy items that cannot fit through trailer doors (steel, lumber, machinery)", "Frozen food", "Documents and mail"],
    explanation: "Flatbeds haul oversized, heavy, or awkwardly shaped cargo \u2014 steel beams, lumber, construction equipment, machinery. Loaded from top or sides.",
  },
  c3q04: {
    text: "What is a sprinter van primarily used for?",
    options: ["Hauling 40,000+ lb loads across the country", "Small, time-sensitive, expedited deliveries \u2014 medical supplies, auto parts, documents, samples", "Moving household furniture", "Towing other vehicles"],
    explanation: "Sprinter vans handle small, urgent loads \u2014 typically under 5,000 lbs. They're faster, more flexible, and can navigate city streets that semis can't.",
  },
  c3q05: {
    text: "What is the typical maximum weight capacity of a sprinter van?",
    options: ["40,000 lbs", "3,000\u20135,000 lbs", "20,000 lbs", "80,000 lbs"],
    explanation: "Sprinter vans typically carry 3,000\u20135,000 lbs depending on the model. Much less than a semi (up to 44,000 lbs in trailer) but faster and more flexible.",
  },
  c3q06: {
    text: "What does a liftgate do?",
    options: ["Locks the trailer doors", "A hydraulic platform at the rear that raises/lowers freight \u2014 essential when there's no dock", "Increases fuel efficiency", "Provides extra security"],
    explanation: "A liftgate is a hydraulic lift at the trailer rear. Essential when delivering to locations without a loading dock (residential, small businesses).",
  },
  c3q07: {
    text: "What is a step deck trailer?",
    options: ["A trailer with stairs for driver access", "A flatbed with a lower deck section that allows taller cargo than a standard flatbed", "A temperature-controlled trailer", "A double-decker bus"],
    explanation: "A step deck (drop deck) has two levels \u2014 the front section is higher, the rear drops down. This allows taller cargo while staying under bridge height limits.",
  },
  c3q08: {
    text: "What is a tanker trailer used for?",
    options: ["Hauling military equipment", "Transporting liquids and gases \u2014 fuel, chemicals, milk, water", "Moving livestock", "Carrying oversized construction beams"],
    explanation: "Tankers transport liquid or gas cargo. They require special endorsements (HAZMAT for hazardous materials) and careful handling due to liquid surge.",
  },
  c3q09: {
    text: "What is the maximum legal weight for a loaded semi-truck in the US?",
    options: ["60,000 lbs", "80,000 lbs", "100,000 lbs", "50,000 lbs"],
    explanation: "The federal maximum gross vehicle weight is 80,000 lbs (truck + trailer + cargo). Exceeding this results in fines and potential DOT violations.",
  },
  c3q10: {
    text: "Which trailer type would you book for hauling frozen seafood from Boston to Atlanta?",
    options: ["Dry van", "Flatbed", "Reefer (refrigerated trailer)", "Open-top container"],
    explanation: "Frozen seafood requires temperature control. A reefer maintains the required temperature throughout the trip.",
  },
  c3q11: {
    text: "What is a conestoga trailer?",
    options: ["A trailer with a rolling tarp system that combines flatbed flexibility with enclosed protection", "A refrigerated dry van", "A trailer designed for livestock", "A military transport vehicle"],
    explanation: "A conestoga has a rolling tarp that can be pulled back like a flatbed for loading, then closed for weather protection. Versatile for freight that needs both.",
  },
  c3q12: {
    text: "A broker posts a load: 'Need reefer set to 34\u00b0F, 38 pallets, 41,000 lbs.' What equipment do you need?",
    options: ["Sprinter van", "Standard dry van", "A 53-ft refrigerated trailer with temperature control", "A flatbed"],
    explanation: "34\u00b0F, 38 pallets, 41K lbs = refrigerated full truckload. Only a 53-ft reefer can handle this volume and temperature requirement.",
    scenario: "A broker posts: Need reefer, set to 34\u00b0F, 38 pallets, 41,000 lbs. Jacksonville, FL to Chicago, IL.",
  },
  c3q13: {
    text: "What is a hotshot in trucking?",
    options: ["A speeding truck", "A small truck (typically pickup with flatbed/gooseneck) hauling expedited or partial loads", "A truck with emergency lights", "A type of engine"],
    explanation: "A hotshot is typically a heavy-duty pickup pulling a flatbed gooseneck trailer. Used for expedited, time-sensitive, or partial loads.",
  },
  c3q14: {
    text: "What trailer type is required for hauling 20-foot steel I-beams?",
    options: ["Dry van \u2014 just roll them in", "Flatbed \u2014 they need to be loaded from the top/side and secured with straps", "Reefer \u2014 steel needs temperature control", "Sprinter van \u2014 they'll fit if you angle them"],
    explanation: "Steel I-beams are loaded from above using a crane. Only a flatbed allows top/side loading. Securing with straps and chains is required.",
  },
  c3q15: {
    text: "What is a power-only arrangement?",
    options: ["When a driver brings only the tractor (no trailer) and hooks up to a pre-loaded trailer at the shipper", "When a truck runs on electric power", "When the broker provides fuel", "When two drivers share one truck"],
    explanation: "Power-only means the carrier provides just the truck (tractor). The shipper or broker has a trailer already loaded and waiting at the dock.",
  },
  c3q16: {
    text: "Your sprinter van driver gets a load offer: 6 pallets, 8,000 lbs. Should they take it?",
    options: ["Yes \u2014 6 pallets isn't that many", "No \u2014 8,000 lbs exceeds typical sprinter van capacity (3,000\u20135,000 lbs) and could be unsafe/illegal", "Only if the rate is good enough", "Yes \u2014 modern sprinters can handle 10,000 lbs"],
    explanation: "Most sprinter vans max out at 3,000\u20135,000 lbs. 8,000 lbs would exceed capacity, risking mechanical failure, fines, and safety hazards.",
    scenario: "A broker offers your sprinter van driver: 6 pallets, 8,000 lbs, $500 for 100 miles.",
  },
  c3q17: {
    text: "What is a bobtail?",
    options: ["A truck driving without a trailer attached", "A short-distance delivery route", "A type of cargo insurance", "A trailer with a curved roof"],
    explanation: "Bobtailing means driving the tractor without any trailer. This happens between drop-off and the next pickup, and is essentially deadheading.",
  },
  c3q18: {
    text: "What advantage does a sprinter van have over a semi-truck for urban deliveries?",
    options: ["Higher weight capacity", "Can navigate narrow city streets, park easily, and access locations where semis are restricted or can't fit", "Better fuel economy on highways", "Can carry more pallets"],
    explanation: "Sprinter vans excel in cities \u2014 they can park on streets, fit under low bridges, navigate tight loading docks, and don't need CDL drivers.",
  },
  c3q19: {
    text: "What is the GVWR?",
    options: ["Government Vehicle Weight Regulation", "Gross Vehicle Weight Rating \u2014 the maximum total weight a vehicle is designed to carry including itself, cargo, and passengers", "General Volume Weight Ratio", "Gross Volume Width Restriction"],
    explanation: "GVWR (Gross Vehicle Weight Rating) is the manufacturer's maximum allowable weight for the vehicle fully loaded. Exceeding it is illegal and unsafe.",
  },
  c3q20: {
    text: "A broker needs 'a 26-foot box truck with liftgate.' What type of vehicle is this?",
    options: ["A semi-truck with a 53-ft trailer", "A medium-duty straight truck \u2014 single unit with a 26-ft cargo box and hydraulic liftgate", "A sprinter van with extra storage", "A flatbed with a cover"],
    explanation: "A 26-ft box truck (straight truck) is a single unit \u2014 cab and cargo box are one vehicle. The liftgate helps load/unload at locations without docks.",
  },
  c4q01: {
    text: "What is a Rate Confirmation (Rate Con)?",
    options: ["A verbal agreement on the phone", "A binding written document confirming the agreed rate, route, and load details \u2014 signed by both parties before the truck moves", "A receipt issued after delivery", "A broker's internal price list"],
    explanation: "The Rate Con is the legal contract between carrier and broker. It specifies rate, route, appointment times, and load details. Never move without a signed rate con.",
  },
  c4q02: {
    text: "What is a BOL (Bill of Lading)?",
    options: ["A fuel purchase receipt", "A legal document issued at pickup describing the freight \u2014 weight, quantity, condition, origin, destination", "A driver's daily log", "A broker's marketing brochure"],
    explanation: "The BOL is created at pickup. It describes what's being shipped, the condition, weight, and piece count. It's a legal document and receipt for the freight.",
  },
  c4q03: {
    text: "What is a POD (Proof of Delivery)?",
    options: ["A GPS tracking confirmation", "The signed BOL or delivery receipt confirming the freight arrived at its destination in acceptable condition", "A pre-delivery inspection report", "A payment confirmation from the broker"],
    explanation: "The POD is typically the BOL signed by the consignee at delivery. It confirms receipt and is required to process payment.",
  },
  c4q04: {
    text: "Who signs the BOL at pickup?",
    options: ["Only the broker", "The shipper prepares and signs it; the driver verifies details and signs acknowledgment", "Only the dispatcher", "The consignee"],
    explanation: "The shipper creates the BOL. The driver checks it for accuracy (weight, piece count, condition) and signs to acknowledge receipt of the freight.",
  },
  c4q05: {
    text: "What should a dispatcher verify on the Rate Con BEFORE signing?",
    options: ["Only the total rate amount", "Rate, route, pickup/delivery addresses, appointment times, equipment type, weight, commodity, and any special instructions", "Just the broker's phone number", "Only the delivery date"],
    explanation: "Verify EVERYTHING: rate, addresses, times, equipment, weight, commodity, accessorials, cancellation policy. One error can cost hundreds in penalties.",
  },
  c4q06: {
    text: "What happens if the driver signs a BOL with incorrect weight?",
    options: ["Nothing \u2014 it's just a formality", "The carrier becomes liable for the discrepancy \u2014 could face fines at weigh stations and payment disputes", "The broker gets fined", "The shipper must pay extra"],
    explanation: "Signing a BOL means you accept the stated details. Wrong weight = potential DOT fines, liability in damage claims, and payment disputes.",
  },
  c4q07: {
    text: "When should the POD be sent to the broker?",
    options: ["Within 30 days of delivery", "Immediately after delivery \u2014 the driver photographs it and the dispatcher forwards it to the broker right away", "Only if the broker asks for it", "After the carrier receives payment"],
    explanation: "Send the POD immediately after delivery. Delayed PODs delay payment. Many brokers won't even start the payment process until they receive the POD.",
  },
  c4q08: {
    text: "What is a carrier packet?",
    options: ["A box of snacks for the driver", "A set of documents (MC#, insurance certificate, W-9, authority letter) that a carrier submits to set up with a new broker", "A GPS tracking device", "A type of cargo packaging"],
    explanation: "A carrier packet is the documentation package needed to establish a business relationship with a broker. Without it, they can't book you loads.",
  },
  c4q09: {
    text: "What is a lumper fee?",
    options: ["A fee for using a highway bridge", "A fee charged by warehouse workers to load or unload freight \u2014 usually at the consignee", "A tire replacement charge", "A broker's processing fee"],
    explanation: "A lumper fee is paid to warehouse laborers who physically unload the trailer. The broker or shipper should reimburse it, but always confirm beforehand.",
  },
  c4q10: {
    text: "Rate Con says 'appointment: 8 AM.' The driver arrives at 8:15 AM. What could happen?",
    options: ["Nothing \u2014 15 minutes is fine", "The facility may refuse the truck, reschedule to the next available slot (possibly next day), causing delays and potential penalties", "The driver gets a bonus for being early", "The broker will increase the rate"],
    explanation: "Many facilities have strict appointment windows. Even 15 minutes late can mean being turned away or rescheduled. Always arrive early.",
    scenario: "The Rate Confirmation says pickup appointment: 8:00 AM sharp. Your driver arrives at 8:15 AM.",
  },
  c4q11: {
    text: "What does 'quick pay' mean in trucking?",
    options: ["Paying the driver in cash daily", "A factoring or expedited payment service where the carrier gets paid in 1-5 days instead of the standard 30-45 day terms, usually for a small fee", "A speed limit for delivery trucks", "Paying tolls electronically"],
    explanation: "Quick pay means faster payment (1-5 days) instead of waiting 30-45 days. The broker or factoring company charges a fee (typically 2-5%) for this service.",
  },
  c4q12: {
    text: "A broker sends a Rate Con with a different delivery address than what was discussed on the phone. What do you do?",
    options: ["Sign it \u2014 it's probably fine", "STOP. Do NOT sign. Call the broker, clarify the discrepancy, and get a corrected Rate Con before proceeding", "Have the driver deliver to the original address anyway", "Ignore it \u2014 the driver knows the right address"],
    explanation: "Never sign a Rate Con with errors. Any discrepancy must be resolved and corrected in writing. The signed document is legally binding.",
    scenario: "You negotiated a load to Atlanta, GA. The Rate Con arrives and shows delivery to Augusta, GA instead.",
  },
  c4q13: {
    text: "What document does a dispatcher need to claim detention pay?",
    options: ["A selfie of the driver waiting", "Timestamped proof of arrival (check-in time) showing the driver waited beyond the free time window", "A letter from the shipper apologizing", "Nothing \u2014 detention pay is automatic"],
    explanation: "To claim detention, you need proof: check-in time, timestamp showing when free time expired, and documentation of when the truck was released. No proof = no pay.",
  },
  c4q14: {
    text: "What is a W-9 form used for in trucking?",
    options: ["Driver's medical certificate", "Tax identification form \u2014 provides the carrier's taxpayer ID so the broker can issue a 1099 for payments", "Vehicle registration document", "Insurance claim form"],
    explanation: "The W-9 provides the carrier's legal name and tax ID (EIN or SSN). Brokers need it for tax reporting \u2014 they'll issue a 1099 at year end.",
  },
  c4q15: {
    text: "What is the standard free time at pickup/delivery before detention applies?",
    options: ["30 minutes", "2 hours", "4 hours", "24 hours"],
    explanation: "Standard free time is 2 hours. After that, detention charges apply (typically $25-75/hour). Always document check-in time.",
  },
  c4q16: {
    text: "The consignee reports visible damage on the freight upon delivery. What should the driver do?",
    options: ["Leave immediately to avoid blame", "Note the damage on the BOL/POD before the consignee signs, take photos, and report to dispatcher immediately", "Refuse to deliver and return the freight", "Sign clean and deal with it later"],
    explanation: "Document ALL damage on the delivery receipt, take photos, and notify the dispatcher. This protects the carrier in any freight claim dispute.",
  },
  c4q17: {
    text: "What is a freight claim?",
    options: ["A claim for free freight", "A formal request for compensation when freight is lost, damaged, or delivered late", "A DOT violation notice", "A request for additional loads"],
    explanation: "A freight claim is filed when cargo is damaged, lost, or short. The shipper or consignee claims against the carrier's insurance for compensation.",
  },
  c4q18: {
    text: "Why is it important to save ALL load documentation?",
    options: ["For social media posts", "For protection in disputes \u2014 rate cons, BOLs, PODs, and communications prove what was agreed and what happened", "Because the government requires 10 years of storage", "It's not important \u2014 digital records are enough"],
    explanation: "Documentation is your defense in disputes. Rate con proves the agreed rate, BOL proves what was picked up, POD proves delivery. Save everything.",
  },
  c4q19: {
    text: "What is an invoice in the carrier-broker payment process?",
    options: ["The Rate Confirmation", "A payment request the carrier sends to the broker with the Rate Con and POD to initiate payment for the completed load", "A police report", "A maintenance receipt"],
    explanation: "After delivery, the carrier sends an invoice (with Rate Con + POD attached) to the broker requesting payment. This starts the payment clock (Net 30, Net 45, etc.).",
  },
  c4q20: {
    text: "The broker insists on a lower rate AFTER the driver has already picked up the freight. Is this legal?",
    options: ["Yes \u2014 the broker can change rates anytime", "No \u2014 the signed Rate Confirmation is a binding contract. The agreed rate stands. The dispatcher should firmly hold the rate", "Only if the market dropped significantly", "Only if the shipper approved the change"],
    explanation: "A signed Rate Con is legally binding. The broker cannot unilaterally reduce the rate after signing. Hold your rate firmly and reference the signed document.",
    scenario: "Your driver picked up the freight 2 hours ago. The broker calls saying they need to reduce the rate by $200 because 'the market changed.'",
  },
  c5q01: {
    text: "What is DAT in trucking?",
    options: ["Department of Automotive Transport", "The largest load board platform in the US where brokers post loads and carriers search for freight", "A type of trailer", "A driver assistance technology"],
    explanation: "DAT (originally Dial-A-Truck) is the biggest load board. It shows available loads, rate averages, lane data, and market trends.",
  },
  c5q02: {
    text: "What is the primary purpose of a load board?",
    options: ["To track driver locations", "To connect brokers who have freight with carriers who have available trucks", "To process payments", "To schedule vehicle maintenance"],
    explanation: "Load boards are a marketplace: brokers post loads they need moved, carriers and dispatchers search for loads that match their truck's location and specs.",
  },
  c5q03: {
    text: "What does 'rate per mile' (RPM) on a load board tell you?",
    options: ["The speed limit for the route", "The payment amount per mile driven \u2014 used to compare load profitability regardless of total distance", "The fuel cost per mile", "The toll cost per mile"],
    explanation: "RPM lets you compare loads of different distances on equal footing. A $2,000 load over 500 miles ($4.00/mi) is better than $3,000 over 1,200 miles ($2.50/mi).",
  },
  c5q04: {
    text: "When searching for loads on a board, what should you filter by FIRST?",
    options: ["The broker's company name", "Your truck's current location (origin radius), equipment type, and desired destination area", "The highest total dollar amount", "Only loads posted in the last hour"],
    explanation: "Start with location (where your truck IS), equipment type (what it CAN haul), and destination (where you WANT to go). Then evaluate rates.",
  },
  c5q05: {
    text: "What does a 'posted rate' on a load board represent?",
    options: ["The final non-negotiable price", "The broker's initial asking price \u2014 almost always negotiable, especially when the truck-to-load ratio is favorable", "The government-regulated rate for that lane", "The insurance cost for the load"],
    explanation: "Posted rates are starting points, not final prices. When trucks are scarce relative to loads, you can negotiate significantly above the posted rate.",
  },
  c5q06: {
    text: "What is the truck-to-load ratio and why does it matter?",
    options: ["The number of wheels on a truck vs cargo weight", "The ratio of available trucks to available loads in a market \u2014 lower ratio = higher rates (more loads than trucks)", "The driver-to-dispatcher ratio", "The fuel tank to cargo area ratio"],
    explanation: "When there are more loads than trucks (low truck-to-load ratio), carriers have leverage and rates go up. Track this ratio on DAT to time your negotiations.",
  },
  c5q07: {
    text: "You see a load posted 3 days ago that hasn't been booked. What does this tell you?",
    options: ["It's a premium load saving the best for last", "The rate is likely too low, the lane is undesirable, or there are issues \u2014 but it could also mean the broker is desperate and willing to negotiate up", "The broker forgot about it", "Load boards only show old loads"],
    explanation: "Stale loads often mean the rate is below market. But a desperate broker may pay more to finally get it covered. Call and negotiate \u2014 you have leverage.",
  },
  c5q08: {
    text: "What is Truckstop.com (now Truckstop)?",
    options: ["A truck parking reservation app", "A major load board platform \u2014 competitor to DAT \u2014 where brokers and carriers post and search for freight", "A fuel station chain", "A truck repair shop network"],
    explanation: "Truckstop is the second-largest load board. Some brokers post exclusively on Truckstop, so using both DAT and Truckstop maximizes your load options.",
  },
  c5q09: {
    text: "What should you check about a broker BEFORE booking a load?",
    options: ["Their social media followers", "Their credit score/days-to-pay on Carrier411 or FMCSA authority status \u2014 to ensure they'll actually pay", "The broker's office furniture", "Whether they have a website"],
    explanation: "Check the broker's credit rating (Carrier411, DAT broker reports), FMCSA authority, and days-to-pay average. Avoid brokers with bad credit or payment complaints.",
  },
  c5q10: {
    text: "What is 'double brokering' and why is it dangerous?",
    options: ["Using two load boards at once", "When a broker accepts a load as a carrier, then illegally re-brokers it to another carrier \u2014 the actual carrier may never get paid", "Booking two loads for the same truck", "Negotiating with two brokers simultaneously"],
    explanation: "Double brokering is illegal. The middle party disappears with the money. Watch for signs: unusually high rates, unknown brokers, pressure to move immediately.",
  },
  c5q11: {
    text: "Your driver is in Chicago with an empty sprinter van. You search DAT and see 47 loads outbound. What do you do first?",
    options: ["Book the first load you see", "Filter by destination market, compare RPMs, check broker credit, then call the top 2-3 options to negotiate", "Wait for more loads to appear", "Only look at loads over $5,000"],
    explanation: "47 loads = good supply. Filter for strong destinations, rank by RPM, verify broker quality, then call and negotiate. Never grab the first option without comparing.",
  },
  c5q12: {
    text: "What is a 'rate average' or 'market rate' on DAT?",
    options: ["The legally mandated minimum rate", "The average rate paid for that lane over a recent period \u2014 used as a benchmark for negotiation", "The maximum rate a broker can offer", "The rate only for new carriers"],
    explanation: "The rate average shows what loads on that lane have actually paid recently. Use it as a negotiation anchor: 'The market average for this lane is $X.'",
  },
  c5q13: {
    text: "When is the best time to search for loads on a load board?",
    options: ["Midnight \u2014 less competition", "Morning (7-10 AM local) when brokers are actively posting new freight for the day", "Friday afternoon \u2014 weekend loads pay more", "It doesn't matter \u2014 loads are posted 24/7"],
    explanation: "Most brokers post fresh loads in the morning (7-10 AM their local time). That's when selection is best. Late-day posts are often urgent and may pay more.",
  },
  c5q14: {
    text: "What does 'age' of a load post mean on DAT?",
    options: ["How old the freight is", "How long ago the load was posted \u2014 older posts may indicate difficulty finding a carrier (negotiation leverage)", "The age of the broker's company", "The age of the truck required"],
    explanation: "A load posted 4+ hours ago is 'aging.' The broker may be struggling to find a carrier. Use this as leverage: they need you more than you need them.",
  },
  c5q15: {
    text: "You find a perfect load but the broker has a 'D' credit rating. What should you do?",
    options: ["Book it \u2014 the load is perfect", "Proceed with extreme caution: request quick pay, verify their authority is active, and consider requiring a comcheck or prepayment", "Ignore credit ratings \u2014 they're unreliable", "Book it but add 50% to the rate"],
    explanation: "A 'D' rating means high risk of non-payment. If you proceed, protect yourself with quick pay, advance payment, or avoid entirely. Bad credit = bad business.",
  },
  c5q16: {
    text: "What is 'Carrier411' used for?",
    options: ["Tracking shipments in real-time", "Checking broker and carrier credit ratings, payment history, and complaints \u2014 essential due diligence before booking", "Planning routes and fuel stops", "Filing DOT complaints"],
    explanation: "Carrier411 provides credit reports on brokers: how fast they pay, any complaints filed, and overall reliability score. Check it before booking with an unknown broker.",
  },
  c5q17: {
    text: "A load board shows: Dallas\u2192Chicago, 920 mi, $3,200. Another: Dallas\u2192Houston, 240 mi, $960. Which has better RPM?",
    options: ["Dallas\u2192Chicago ($3.48/mi)", "Dallas\u2192Houston ($4.00/mi)", "They're the same", "Cannot determine without more info"],
    explanation: "$3,200\u00f7920=$3.48/mi vs $960\u00f7240=$4.00/mi. Houston has better RPM. But also consider: after Houston, can you find the next load? Dallas\u2192Chicago puts you in a stronger market.",
  },
  c5q18: {
    text: "What is 'rate confirmation' in the context of booking from a load board?",
    options: ["Confirming the rate average is correct", "The binding document the broker sends after you agree on price \u2014 you MUST receive and sign it before moving the truck", "A phone call confirming the rate", "An automatic email from the load board"],
    explanation: "After verbal agreement, the broker emails the Rate Confirmation. Review every detail, sign it, send it back. Never move a truck without a signed rate con.",
  },
  c5q19: {
    text: "Your dispatcher team uses both DAT and Truckstop. Why is this beneficial?",
    options: ["It doubles the subscription cost for no reason", "Different brokers use different platforms \u2014 having both gives access to more loads and better market coverage", "It's required by DOT", "It looks more professional"],
    explanation: "Some brokers only use DAT, others only Truckstop. Having both means you see more loads, get better rate comparisons, and miss fewer opportunities.",
  },
  c5q20: {
    text: "You notice a load from a broker you've worked with before. They always pay on time and have good rates. Should you still check the rate con details?",
    options: ["No \u2014 they're trusted, just sign and go", "Yes \u2014 always verify every rate con regardless of relationship. Mistakes happen, and the signed document is legally binding", "Only check the rate amount", "Only if the load is over $5,000"],
    explanation: "ALWAYS review the rate con \u2014 even with trusted brokers. Typos happen: wrong address, wrong date, wrong rate. The signed document is what matters legally.",
    scenario: "Your favorite broker sends a rate con for a load you just agreed to on the phone. You've done 50+ loads with them.",
  },

  // ════════════════════════════════════════════════════════════════════════════
  // CHAPTER 6 — Communication with Brokers
  // ════════════════════════════════════════════════════════════════════════════
  c6q01: {
    text: "How should you properly start rate negotiations with a broker?",
    options: ["Name the lowest rate right away", "Name a rate 10-15% above your target, leaving room for negotiation", "Agree to any broker rate", "Refuse to name a rate first"],
    explanation: "Golden rule of negotiation: name a rate above your target. The broker will negotiate down — you'll arrive at the number you need. If you name your minimum right away, there's nowhere to go.",
  },
  c6q02: {
    text: "What does 'All-in rate' mean?",
    options: ["The rate includes everything: base pay, fuel surcharge, and all accessorials", "Rate for base transportation only, excluding fuel", "The highest possible rate", "A rate for all equipment types"],
    explanation: "'All-in' means you'll receive this amount with no additional calculations. The opposite: 'base rate + FSC' — needs separate calculation. All-in is simpler for planning.",
  },
  c6q03: {
    text: "What should you say when a broker tells you: 'This is the best I can do'?",
    options: ["Agree immediately", "Calmly respond: 'I understand, but I need $X. Is there anything else you can add?'", "Hang up", "Lower your rate"],
    explanation: "'This is my best' is often a bluff. Professional response: don't panic, don't lower your rate first. Suggest alternatives: detention, fuel escalation, TONU. Sometimes the broker finds money.",
  },
  c6q04: {
    text: "What is a 'Fuel Escalation Clause' in a Rate Con?",
    options: ["A discount when fuel prices are low", "A provision for additional payment if fuel prices rise above a certain level", "A penalty for fuel overconsumption", "A mandatory fuel surcharge"],
    explanation: "Fuel Escalation protects the carrier from rising fuel prices. If diesel goes above $X, the carrier receives an additional payment. Useful for long-term contracts.",
  },
  c6q05: {
    text: "Why should you build long-term relationships with brokers?",
    options: ["To receive Christmas gifts", "Regular brokers give priority on loads, better rates, and trust you without extra checks", "To reduce paperwork", "Relationships don't matter — only the rate matters"],
    explanation: "A good broker contact is a strategic asset. A broker you helped in a tough situation will remember you when a 'hot' load with a great rate comes up.",
  },
  c6q06: {
    text: "When is the best time to call a broker for a good rate on a load picking up the day after tomorrow?",
    options: ["On the pickup day itself", "1-2 days before pickup: the broker is still looking for a truck, has less pressure, and more flexibility on rate", "A week before pickup", "Timing doesn't matter"],
    explanation: "1-2 days out is the sweet spot. The broker is already looking for a truck but isn't panicking. Fewer competitors, more room for negotiation. On pickup day — either too cheap (panic) or too expensive (urgency).",
  },
  c6q07: {
    text: "How should you respond when a broker says: 'Can you do it for $1.80 RPM?'",
    options: ["Agree immediately if you need work", "Counter-offer: 'According to market data, this lane runs $2.20-2.50. I can do $2.30.'", "Get offended and hang up", "Agree, but then ask for more later"],
    explanation: "Never silently accept the first offer. Always counter-offer using market data (DAT Lane Rate). A well-reasoned counter is perceived as professional.",
  },
  c6q08: {
    text: "The broker says: 'I have no more money on this load.' You know the market rate is higher. How do you continue negotiating?",
    options: ["Believe them and lower your rate", "Ask to add detention allowance or fuel escalation instead of raising the base rate", "End negotiations", "Demand proof"],
    explanation: "If the broker 'can't' raise the rate — switch to accessorials: detention $75/hr after 2 hours, TONU $200, fuel escalation. The total amount can increase without changing the 'base' rate.",
    scenario: "Load Chicago-Dallas, 920 miles. Market rate per DAT is $2.40 RPM. Broker offers $2.10 and says 'that's the ceiling, I have a tight margin on this shipper.'",
  },
  c6q09: {
    text: "The broker sent a Rate Con, but the rate is $200 less than what you discussed on the phone. What do you do?",
    options: ["Sign it — we'll sort it out later", "Contact the broker immediately: 'The Rate Con doesn't reflect our agreement. I need a corrected version.'", "Deduct $200 from the invoice yourself", "Refuse the load"],
    explanation: "Never sign an incorrect Rate Con. Call immediately: 'We agreed on $X, the document says $Y. Please correct it.' Signing an incorrect Rate Con means accepting its terms.",
    scenario: "You agreed on $2,200 over the phone. The broker sent a Rate Con showing $2,000. 'Probably a mistake,' you think. Pickup is in 1 hour.",
  },
  c6q10: {
    text: "The broker says: 'I have 3 trucks ready to take this load for $1.90.' How do you respond?",
    options: ["Lower your rate immediately", "Calmly: 'Great, they can take it. My rate of $2.30 is based on market data. If you change your mind — I'm here.'", "Accuse the broker of lying", "Offer $1.95 as a compromise"],
    explanation: "The bluff about '3 other trucks' is a classic tactic. Don't panic, don't lower your rate out of fear. If the broker truly needs your driver — they'll come back.",
    scenario: "You offered $2.30 RPM. The broker says: 'I already have 3 trucks ready for $1.90, why would I pay more?' You know this lane has few available trucks.",
  },
  c6q11: {
    text: "After lengthy negotiations, the broker agreed to your rate. What must you do immediately?",
    options: ["Send the driver right away", "Wait for a signed Rate Con and only then give the driver instructions", "Call the driver to congratulate them", "Post about it in the company chat"],
    explanation: "A verbal agreement is not a guarantee. The Rate Con is a legal document. Always: signed RC first, then the driver moves. Without an RC, the carrier is not protected.",
    scenario: "The broker said: 'Deal! $2,300 all-in. Send your driver, I'll send the RC in about an hour.' The driver is ready to go now, pickup is in 2 hours.",
  },
  c6q12: {
    text: "The broker calls after delivery and wants to deduct $300 'for damages.' The driver says the cargo was fine. How do you proceed?",
    options: ["Agree to the deduction", "Request documented proof: photos, OS&D report, BOL with damage notes — without documentation the deduction is unauthorized", "Argue with the broker", "Just submit the invoice for the full amount silently"],
    explanation: "Any claim must be backed by documentation: OS&D, photos, signed BOL with damage notation. No documentation means an unjustified deduction. Request evidence calmly and professionally.",
    scenario: "The trip is complete, the driver delivered the cargo without issues and received a signed POD. A day later the broker says: 'Shipper is complaining about damage. We're deducting $300 from payment.'",
  },
  c6q13: {
    text: "You call a broker about a load, and they say: 'Call back in an hour, I'll check with the shipper.' Two hours have passed. What do you do?",
    options: ["Wait for the call — they'll call back on their own", "Call again; simultaneously look at alternative loads so you don't waste time", "Leave an angry review", "Never work with this broker again"],
    explanation: "'Let me check with the shipper' is a standard pause. 2 hours with no answer: call again + keep alternatives in mind. The driver can't wait forever.",
    scenario: "A Chicago-Atlanta load looks interesting. The broker asked you to call back in an hour. Two hours have passed. The driver is waiting for a decision, pickup is theoretically today.",
  },
  c6q14: {
    text: "A broker offers a load 'urgently, pickup in 30 minutes.' The rate is good. What should you check BEFORE agreeing?",
    options: ["Nothing — urgency is more important than checks", "Make sure the driver can make it, verify the broker, and get a Rate Con at least via email", "Just ask for the pickup address", "Take the load verbally, documents later"],
    explanation: "Urgency is psychological pressure. Even in 30 minutes: verify the driver can realistically make it, request a Rate Con via email, confirm cargo details. Rushing doesn't cancel basic rules.",
    scenario: "An unfamiliar broker calls: 'Urgent! Pickup in 30 minutes, $3.50 RPM, dry van, Chicago. Are you in?' Great rate. Your driver is 15 minutes from the address.",
  },
  c6q15: {
    text: "What is 'broker margin' and why is it important for a dispatcher to know?",
    options: ["The broker's salary", "The difference between what the shipper pays the broker and what the broker pays the carrier", "The broker's insurance cost", "The load board's posting fee"],
    explanation: "Broker margin = the broker's income. If the shipper pays $3,000 and the carrier gets $2,400 — the margin is $600 (20%). Knowing this helps you understand whether the broker has room to negotiate.",
  },
  c6q16: {
    text: "How should you properly end negotiations when a broker refuses your desired rate?",
    options: ["Hang up rudely", "Politely: 'Thank you, if the situation changes — reach out.' Leave the door open", "Leave a bad review immediately", "Accept any rate just so you don't walk away empty-handed"],
    explanation: "Professionalism builds long-term relationships. A broker you politely turned down may call back in an hour with a better rate. 'Burning bridges' is counterproductive.",
  },
  c6q17: {
    text: "What does 'Covered' mean when a broker says it?",
    options: ["The load is insured", "The load is already booked with another carrier", "The load is covered with a tarp", "The broker refuses to negotiate"],
    explanation: "'Covered' means the load is taken. If you called late and hear 'already covered' — the load went to another carrier. Speed of response on good loads is critical.",
  },
  c6q18: {
    text: "Why should a dispatcher check the DAT Broker profile before working with a broker?",
    options: ["Out of curiosity", "To assess payment reliability, carrier reviews, and work history — protection against scams", "Brokers don't have profiles on DAT", "Just to find their phone number"],
    explanation: "The DAT Broker profile contains: credit score, carrier reviews, average payment time. This is your first line of defense against unreliable brokers.",
  },
  c6q19: {
    text: "What does 'Send your packet' mean?",
    options: ["Send a package to the client", "The broker is requesting the carrier packet: MC certificate, insurance, W-9, carrier agreement", "Send the Rate Con to the broker", "Hand documents to the driver"],
    explanation: "'Send your packet' is a carrier setup request. Required when working with a new broker for the first time. Prepare the packet in advance (MC cert, COI, W-9, CA) — this speeds up getting started.",
  },
  c6q20: {
    text: "The broker says: 'Willing to negotiate?' How do you respond professionally while holding your position?",
    options: ["Immediately lower your rate by $200", "'Yes, within reason. My rate of $2.30 reflects market conditions. What can you offer?'", "'No, my rate is final'", "Stay silent"],
    explanation: "'Willing to negotiate?' is an invitation to dialogue, not a signal to lower your price. Confirm your willingness to talk, but don't give up your position first. Let the broker name their number.",
    scenario: "You offered $2.30 RPM. The broker says: '$2.30 is a bit much. Willing to negotiate?' Your driver is ready, the load is suitable.",
  },

  // ════════════════════════════════════════════════════════════════════════════
  // CHAPTER 7 — Communication with Drivers
  // ════════════════════════════════════════════════════════════════════════════
  c7q01: {
    text: "What information must a dispatcher provide to a driver when dispatching them on a load?",
    options: ["Only the pickup address", "Pickup address, time, shipper contact, BOL/PO number, cargo instructions, broker contact", "Only the rate and distance", "The broker's phone number and that's it"],
    explanation: "A complete dispatch includes: address + pickup time, shipper contact, BOL/PO#, cargo type, instructions (no touch, team required, etc.), broker contact, Rate Con number.",
  },
  c7q02: {
    text: "After how many hours of waiting at pickup/delivery can you request detention?",
    options: ["After 30 minutes", "After 1 hour", "After 2 hours", "After 4 hours"],
    explanation: "Industry standard: 2 free hours at pickup and delivery. After 2 hours — detention at $50-75/hour. This should be reflected in the Rate Con.",
  },
  c7q03: {
    text: "What should a driver do in case of a breakdown en route?",
    options: ["Fix it themselves and not report it", "Immediately notify the dispatcher, pull over to a safe location, provide exact location", "Call the broker directly, bypassing the dispatcher", "Keep driving to the nearest city"],
    explanation: "During a breakdown: safety first, then call the dispatcher, then exact coordinates. The dispatcher notifies the broker and arranges repair. Silence about a breakdown = lost load and reputation.",
  },
  c7q04: {
    text: "What is 'HOS' and why is it important for a dispatcher?",
    options: ["Hours of Service — driver working hours; exceeding them is prohibited by law", "High Overhead Surcharge — a fuel surcharge", "Hub Operations System — a warehouse program", "Haul and Origin Statement — a shipping document"],
    explanation: "HOS (Hours of Service) — federal limits: 11 hours of driving, 14 hours on duty. A dispatcher must know the driver's remaining hours. Violating HOS = fines and CSA violations.",
  },
  c7q05: {
    text: "What is a '34-hour reset'?",
    options: ["Rebooting the ELD after a malfunction", "A 34-hour rest period after which the driver's weekly hours reset", "A speeding fine", "A 34-minute break between shifts"],
    explanation: "34-hour reset — the driver must rest for 34 continuous hours (typically including two nighttime periods 1:00-5:00 AM) to reset the 60/70-hour weekly limit.",
  },
  c7q06: {
    text: "How should you properly inform the broker about the driver's ETA?",
    options: ["Only when the driver has already arrived", "Proactively: the day before and 1-2 hours before arrival, with the exact time", "Only if the broker asks", "Send an email the day before pickup and don't bother again"],
    explanation: "Proactive communication = professionalism. The broker should receive confirmation the day before and an ETA 1-2 hours out. This builds trust and reduces 'where's the truck?' calls.",
  },
  c7q07: {
    text: "What is 'Drop and Hook'?",
    options: ["The driver drops the cargo on the highway", "The driver detaches an empty trailer and hooks up an already loaded one — no waiting for loading", "A type of cargo theft", "A forklift unloading technique"],
    explanation: "Drop & Hook = quick trailer swap. The driver doesn't wait for loading (live load), saving hours. Great for HOS and turnaround.",
  },
  c7q08: {
    text: "What should a dispatcher do if a driver hasn't answered calls for 2+ hours?",
    options: ["Wait longer", "Try other contacts (another number, SMS), notify the broker about the situation", "Cancel the load", "Assume everything is fine"],
    explanation: "Loss of contact with a driver is a serious situation. Actions: SMS, alternative number, contact through relatives (if critical), notify the broker. Don't stay silent.",
  },
  c7q09: {
    text: "The driver calls: 'I've been looking for the warehouse for an hour, there's no truck entrance anywhere.' What do you do?",
    options: ["Tell the driver to 'figure it out yourself'", "Contact the broker/shipper for clarification, relay the correct instructions to the driver", "Cancel the pickup", "Ask the driver to wait longer"],
    explanation: "A pickup problem is the dispatcher's job, not the driver's. Call the broker or shipper directly, get the correct instructions (gate, code, security contact) and immediately relay them to the driver.",
    scenario: "The driver arrived at the warehouse address at 08:00. He's been trying to find the entrance for an hour — no signs, gates closed, nobody answers. Pickup was supposed to start at 08:00.",
  },
  c7q10: {
    text: "The driver reports: 'ELD shows I have 3 hours left. Delivery is still 5 hours of driving away.' What does the dispatcher do?",
    options: ["Tell the driver to drive faster", "Notify the broker about the changed ETA, arrange an extension or relay", "Tell the driver to violate HOS — one time won't hurt", "Nothing, the driver will figure it out"],
    explanation: "HOS is the law. The driver cannot drive beyond the limit. The dispatcher must immediately: 1) notify the broker about the delay, 2) discuss a layover or relay, 3) document everything. Asking to violate HOS is a crime.",
    scenario: "The driver is en route, about 5 hours of driving to delivery in Cincinnati. ELD shows 3 hours remaining. Delivery time is today by 6:00 PM, it's now 12:00 PM.",
  },
  c7q11: {
    text: "The driver has been waiting at the pickup for 3 hours and hasn't been loaded. How should you handle this?",
    options: ["Wait as long as needed", "Record the arrival time, notify the broker, start the detention clock with timestamps", "Leave without the load", "Rush the warehouse workers"],
    explanation: "Detention: record the arrival (check-in) time and departure time. After 2 free hours — detention applies. Notify the broker immediately: 'Driver arrived 10:00, it's now 13:00, detention clock running.'",
    scenario: "The driver arrived at 10:00. It's now 13:00 — loading hasn't started. The broker didn't answer the first call. The load is urgent, delivery is tomorrow morning.",
  },
  c7q12: {
    text: "The driver reports an accident. They're not at fault, cargo is undamaged, truck is drivable. What are your actions?",
    options: ["Keep driving, don't report anything", "Ensure the driver's safety, notify the broker, contact insurance, document everything", "Cancel the entire load", "Call insurance and wait for their decision"],
    explanation: "Accident — safety is priority, then documentation. Steps: 1) Is the driver OK? 2) Call the broker: 'minor accident, driver safe, cargo intact, ETA may change' 3) Insurance + documentation.",
    scenario: "The driver had a minor accident on I-90. Another car clipped the mirror. Police were called, the driver is uninjured. The cargo in the trailer is fine. Delivery is still 200 miles away.",
  },
  c7q13: {
    text: "The driver says: 'I'm not unloading — this is touch freight, I'm not getting paid for that.' The consignee insists. What do you do?",
    options: ["Force the driver to unload", "Check the Rate Con: if it says 'no touch' — the driver is right. If not specified — discuss a lumper or extra pay.", "Ignore the driver", "Promise the driver extra pay without clearing it with the broker"],
    explanation: "The key is the Rate Con. 'No touch freight' in the document = driver doesn't load/unload. If there's no such clause — the standard isn't defined. Arrange a lumper or negotiate extra pay with the broker.",
    scenario: "The driver delivered 20 pallets. The consignee says: 'Bring them inside the warehouse.' The Rate Con says 'no touch freight, consignee to unload.' The driver and consignee are arguing.",
  },
  c7q14: {
    text: "The driver reports they've arrived at the delivery, but the warehouse is closed — it's Sunday. What do you do?",
    options: ["Tell the driver to wait until Monday without compensation", "Notify the broker, record the arrival time, request layover/detention", "The driver should have known the schedule", "Leave the cargo at the warehouse"],
    explanation: "Closed warehouse = layover situation. Immediately: photo of closed gates + time, notification to broker. The driver is entitled to layover pay ($150-250/day). This is the fault of an incorrectly specified delivery appointment.",
    scenario: "The Rate Con specifies delivery Sunday at 3:00 PM. The driver arrived on time, but the warehouse is closed, nobody is there. The consignee's phone is not answered. The next business day is Monday.",
  },
  c7q15: {
    text: "What is a 'Layover' and how much does it typically cost?",
    options: ["Transferring cargo to another truck; costs $0", "A forced overnight stay for the driver due to a closed warehouse or delay; typically $150-250 per day", "A planned rest stop; not compensated", "The driver arriving early at pickup"],
    explanation: "Layover — the driver is forced to wait overnight due to circumstances on the shipper/consignee side. Compensation: $150-250 per night. Requires coordination with the broker and documentation.",
  },
  c7q16: {
    text: "How should you properly give a 'pickup appointment' to a driver?",
    options: ["Give an approximate time", "Exact time in the local time zone + shipper contact + entry instructions", "Just the address, the driver will confirm the time on-site", "Send a message without confirmation"],
    explanation: "The appointment must be precise: 'Pickup appointment: Monday 08:00 CT (Central Time). Contact: John at (555) 123-4567. Use Gate 3, mention Load #12345.'",
  },
  c7q17: {
    text: "What is a 'Team Driver' and when is it needed?",
    options: ["Two drivers in one truck taking turns; used for urgent long-haul loads", "A driver with an unloading assistant", "A double warehouse crew", "A driver operating two trailers at once"],
    explanation: "Team Driver: two drivers alternate — one drives, the other sleeps. This allows the truck to move almost 24/7. Needed for urgent (team required) loads or long lanes (Chicago-LA).",
  },
  c7q18: {
    text: "What should a dispatcher do if a driver called the broker directly and changed delivery terms?",
    options: ["Praise the driver for taking initiative", "Explain to the driver: all broker contact goes through the dispatcher only; clarify the changes and restore order", "Fire the driver", "Accept whatever changes the driver made"],
    explanation: "The driver should NOT negotiate with the broker independently. This can create legal issues and confusion. The dispatcher is the sole official contact for the broker.",
  },
  c7q19: {
    text: "The driver says: 'The consignee wants me to go to the scales and pay $50 for weighing.' Is this legitimate?",
    options: ["The driver always pays out of pocket", "No: weighing is not an accessorial in the Rate Con — the driver shouldn't pay out of pocket; notify the broker", "Yes, this is standard procedure", "The driver pays and reimbursement is not available"],
    explanation: "Any unexpected fees at delivery require broker approval. The driver should not spend personal money without a guarantee of reimbursement. Contact the broker immediately for resolution.",
    scenario: "The driver arrived at delivery at an industrial facility. Security says: 'All trucks must go through the weigh station, $50 cash or card.'",
  },
  c7q20: {
    text: "Why should a dispatcher track the driver's position during a trip?",
    options: ["That's a violation of the driver's privacy", "For proactive management: updating ETAs, anticipating delays, coordinating with the broker", "Only for speed monitoring", "The dispatcher shouldn't monitor the driver"],
    explanation: "Tracking the driver enables: accurate ETAs for the broker, anticipating problems (traffic, weather), reacting to route changes. This isn't surveillance — it's management.",
  },

  // ════════════════════════════════════════════════════════════════════════════
  // CHAPTER 8 — Bidding & Deal Closing
  // ════════════════════════════════════════════════════════════════════════════
  c8q01: {
    text: "What is a 'Bid' in the context of a load board?",
    options: ["A price request from the shipper", "A rate offer from the carrier/dispatcher to the broker for a specific load", "A mandatory document for the Rate Con", "The minimum market rate"],
    explanation: "A bid is your price offer to the broker. 'I'd like to bid $2,300 on load #12345.' It's an invitation to negotiate, not the final price.",
  },
  c8q02: {
    text: "How should you correctly calculate the minimum rate before bidding?",
    options: ["Pick any number off the top of your head", "Costs (fuel + deadhead + fixed) + desired profit = minimum", "Copy the rate from a neighboring listing", "Name the average market rate"],
    explanation: "Minimum rate = all costs + profit. Knowing your 'floor' means you know the point below which you can't go. Without this calculation, you could be working at a loss.",
  },
  c8q03: {
    text: "What is 'Carrier Setup' and how long does it take?",
    options: ["Setting up GPS on the truck", "Initial carrier registration in the broker's system (documents + agreement); usually 1-24 hours", "Loading the truck at the warehouse", "Setting up the tachograph"],
    explanation: "Carrier Setup — the broker adds the carrier to their payment system. Requires the carrier packet. Takes from 30 minutes (fast brokers) to 24 hours. Start setup BEFORE the pickup.",
  },
  c8q04: {
    text: "What is DocuSign and why is it needed in trucking?",
    options: ["A document translation program", "An electronic signature platform; used for signing Rate Con and Carrier Agreements online", "A load database", "A document tracking program"],
    explanation: "DocuSign is the standard for electronic signatures in the US. Most Rate Cons and Carrier Agreements are signed through DocuSign or similar platforms. An electronic signature is legally equivalent to a handwritten one.",
  },
  c8q05: {
    text: "What is 'Factoring' in trucking?",
    options: ["A special type of insurance", "A financial service: the factoring company pays the carrier 90-97% of the invoice immediately, gaining the right to collect from the broker", "A loyalty discount system", "A broker service for finding loads"],
    explanation: "Factoring solves the problem of waiting 30-45 days for payment. The carrier gets money right away (minus 2-5% fee). Popular with owner-operators for stable cash flow.",
  },
  c8q06: {
    text: "When should you start the Carrier Setup process with a new broker?",
    options: ["After delivering the load", "As soon as the decision to work with this broker is made — at least several hours before pickup", "A week before the first load", "At the moment of signing the Rate Con"],
    explanation: "Carrier Setup is not a quick process. Start immediately after verbal agreement: 'While you prepare the RC, I'll start setup.' Otherwise you risk missing the pickup due to incomplete registration.",
  },
  c8q07: {
    text: "What are 'Payment Terms' in a Rate Con?",
    options: ["The method of fuel payment", "The conditions and timeline for carrier payment: usually 'Net 30' (30 days) or Quick Pay", "The amount of surcharges for delays", "The method of calculating broker commission"],
    explanation: "Payment Terms determine when the carrier gets paid. 'Net 30' = up to 30 days after receipt of Invoice + POD. 'Quick Pay 3%' = within 1-3 days minus 3% fee.",
  },
  c8q08: {
    text: "What is a 'Load Tender' (Tender Acceptance)?",
    options: ["A formal offer of a load to a carrier", "A gentle way of communicating with a driver", "Soft cargo packaging", "A type of rate surcharge"],
    explanation: "Load Tender — a formal offer of a load from a shipper or broker to a carrier. Accepting the tender = commitment to pick up and deliver the load. Important for contract lanes.",
  },
  c8q09: {
    text: "A broker sends a 15-page Carrier Agreement. Which sections must you check?",
    options: ["Only the signature page", "Payment terms, liability limits, double-brokering clause, indemnification, termination", "Only the broker's name", "The document is standard — no need to read it"],
    explanation: "A Carrier Agreement is a long-term legal contract. You must check: payment terms, liability (who is responsible for cargo), double-brokering prohibition, termination conditions.",
    scenario: "A new large broker sent a Carrier Agreement. Colleagues say 'they're all the same, just sign it.' You're seeing the contract for the first time.",
  },
  c8q10: {
    text: "A hot load appears on the load board: $4.00 RPM. Five carriers are already calling the broker. How do you win the bid?",
    options: ["Offer the lowest rate to guarantee selection", "Call immediately, name a competitive rate, add value: 'Driver is 20 minutes away, ready immediately'", "Send an email", "Wait for competition to die down"],
    explanation: "In a competitive situation, speed + reliability outweigh price. 'Driver is 20 minutes away, EDI tracking available, carrier setup is done — we can move now.' This often outweighs an extra $0.10 RPM.",
    scenario: "Hot load: Chicago-New York, $4.00 RPM (market average $2.50). Pickup today in 3 hours. The broker says several carriers are already calling.",
  },
  c8q11: {
    text: "You just received a Rate Con. The rate is correct, but the 'commodity' line says 'electronics' instead of 'auto parts.' What do you do?",
    options: ["Sign it — what difference does it make what's written", "Ask for a correction: the commodity type affects insurance coverage and handling procedures", "Correct it yourself by hand", "Ignore it — it's a minor detail"],
    explanation: "Commodity affects insurance coverage and transport requirements. Shipping 'electronics' vs 'auto parts' involves different insurance terms. An incorrect entry could void coverage during a claim.",
    scenario: "The Rate Con arrived quickly, the rate is correct, the addresses are right. But the 'Commodity' field says 'electronics.' You're actually hauling auto parts. Pickup is in one hour.",
  },
  c8q12: {
    text: "The broker wants to deduct a $50 'admin fee' from the payment that wasn't in the Rate Con. What are your actions?",
    options: ["Agree — it's a small amount", "Decline: any deductions must be in the Rate Con. 'We agreed on $X, any changes require written confirmation.'", "Deduct an equivalent amount from the next trip", "Pay it and don't argue"],
    explanation: "An admin fee outside the Rate Con is an unauthorized deduction. The Rate Con is a contract. Any additional deductions must be reflected in it. Demand full payment per the RC.",
    scenario: "You delivered the load and invoiced $2,300 per the Rate Con. The broker pays $2,250 with a note: 'Minus $50 admin processing fee.'",
  },
  c8q13: {
    text: "A carrier refuses to sign the Rate Con electronically — only on paper. The broker insists on DocuSign. How do you resolve this?",
    options: ["The carrier is always right — the broker should send paper", "Explain to the carrier that DocuSign is legally equivalent. If they still refuse — this is the carrier's problem that needs resolution", "Skip the signature entirely", "Sign on behalf of the carrier"],
    explanation: "DocuSign has the same legal force. Explain to the carrier: refusing to sign the RC delays work. Most brokers don't work 'on paper.' This is a 21st century requirement.",
    scenario: "A new carrier-driver (owner-operator) says: 'I don't trust the internet, bring a paper Rate Con.' The broker only works through DocuSign.",
  },
  c8q14: {
    text: "What is a 'Quick Claim' situation with a broker?",
    options: ["A fast payment procedure without documents", "A cargo claim processed on an expedited basis due to obvious damage", "An urgent load with no rate negotiation", "Refusing a load 30 minutes before pickup"],
    explanation: "Quick Claim — expedited review of a cargo damage/loss claim. Requires immediate documentation (photos, BOL with notes) and notification of the carrier's insurance.",
  },
  c8q15: {
    text: "What is a 'Broker Credit Score' on DAT and how do you use it?",
    options: ["A broker's reputation score; a high score = reliable payment and professional work", "The credit rating of the broker's personal bank account", "The number of loads the broker handles per month", "The speed of email response"],
    explanation: "Broker Credit Score on DAT reflects payment reliability. Score 90+ = excellent broker. Score below 70 = proceed with caution, read reviews. Never ignore a low score.",
  },
  c8q16: {
    text: "What is a 'Remit Address' on an Invoice?",
    options: ["The cargo delivery address", "The address where the broker should send payment (bank details or check address)", "The company's legal registration address", "The carrier's warehouse address"],
    explanation: "Remit Address on an Invoice — where to send the money. It must match the carrier's payment details. An error in the Remit Address = payment delay.",
  },
  c8q17: {
    text: "A broker offers you a load at $2.00 RPM, but you already have a better offer at $2.40. How do you decline professionally?",
    options: ["Decline rudely", "'Thanks for the offer, but I currently have $2.40 RPM on this lane. If you find $2.30+ — call me back.'", "Lie that the truck is unavailable", "Accept $2.00 out of politeness"],
    explanation: "A professional decline opens doors: the broker will remember you, your rate, and may come back. 'Call me when you have $X' sets an anchor for future negotiations.",
    scenario: "You already found a load for $2.40 RPM. Another broker calls offering the same lane for $2.00. You need to decline without damaging the relationship.",
  },
  c8q18: {
    text: "What is 'Carrier Liability' in the context of cargo?",
    options: ["The carrier's salary", "The carrier's financial responsibility for damage or loss of cargo during transport", "A fine for being late", "The carrier's tax obligations"],
    explanation: "The carrier is responsible for the cargo from the moment of loading until the POD is signed. Standard liability: $0.10-$0.50/lb per the Carmack Amendment. Cargo insurance covers amounts above this.",
  },
  c8q19: {
    text: "What is a 'Spot Quote' from a broker?",
    options: ["A quick verbal rate estimate without commitment; a starting point for negotiations", "A fixed rate for a contract lane", "A rate only for urgent loads", "A guaranteed rate for the entire week"],
    explanation: "Spot Quote — a preliminary estimate. 'Something around $2.00-2.20 on this lane.' This is NOT a Rate Con. After rate agreement: Rate Con, signature, then work.",
  },
  c8q20: {
    text: "A potential shipper offers direct work without a broker. What's important to verify before agreeing?",
    options: ["Only the rate", "MC#, insurance, compliance requirements, payment terms — direct shippers often require more documentation", "Only the address", "The color and type of the truck"],
    explanation: "Direct work with a shipper is more profitable (no broker margin), but requires more: direct contract, possibly Electronic Data Interchange (EDI), strict insurance requirements ($1M+ liability).",
    scenario: "A large manufacturer wants to work directly with you, bypassing brokers. They promise steady lanes at good rates. You've never worked with them before.",
  },

  // ════════════════════════════════════════════════════════════════════════════
  // CHAPTER 9 — Recovery & Problem Solving
  // ════════════════════════════════════════════════════════════════════════════
  c9q01: {
    text: "What does TONU mean?",
    options: ["Truck Only No Unloading", "Truck Order Not Used — compensation to the carrier when a load is canceled after the truck has been dispatched", "Time Of Normal Unloading", "Total Operating Net Usage"],
    explanation: "TONU (Truck Order Not Used) — if the broker/shipper cancels a load after the truck has been dispatched, the carrier receives compensation. Standard: $100-200, but you can negotiate $200-300.",
  },
  c9q02: {
    text: "How should you properly document a TONU situation?",
    options: ["Just call the broker and ask for money", "Record the dispatch time, cancellation time, deadhead distance + confirm TONU in the Rate Con or in writing", "Don't document — it's a verbal agreement", "File a lawsuit"],
    explanation: "TONU requires: 1) dispatch time, 2) cancellation time, 3) deadhead miles driven. Written confirmation from the broker (email/text) or a TONU clause in the Rate Con.",
  },
  c9q03: {
    text: "What should a dispatcher do if a broker refuses to pay detention?",
    options: ["Accept the refusal and forget about it", "Provide documentation: arrival/departure time, shipper signature, photos — if you have it, demand payment", "Go straight to court", "Threaten the broker with a bad review"],
    explanation: "A detention refusal without grounds violates the Rate Con (if detention is specified). Documents solve everything: check-in stamp, gate with time, shipper signature. With documentation, disputing the refusal is realistic.",
  },
  c9q04: {
    text: "What is a 'Recovery Load'?",
    options: ["A load for recovering damaged goods", "A load found to get the driver out of a dead zone after a previous trip fell through", "An insurance payout for damaged cargo", "A load to replace a broken truck"],
    explanation: "Recovery Load — a strategic load: not necessarily a great rate, but the main goal is to get out of the dead zone. Sometimes it's better to take $1.50 RPM out of Florida than to sit for 2 more days.",
  },
  c9q05: {
    text: "What is a 'Relay' in the context of solving HOS problems?",
    options: ["Relaying cargo information", "Transferring the load to another carrier/driver when the first one runs out of hours — a way to complete urgent deliveries", "A repeat trip on the same route", "Reloading onto different equipment"],
    explanation: "Relay (driver relay) — one driver takes the load to a meeting point, another picks it up. This allows HOS compliance while completing expedited deliveries. Requires coordination of two drivers.",
  },
  c9q06: {
    text: "How should you respond if a broker 'disappears' (stops answering) when a problem arises?",
    options: ["Wait until they reappear", "Contact a supervisor or use other channels (email, office phone); document all contact attempts", "Abandon the load and leave", "Let the driver handle it themselves"],
    explanation: "Broker 'vanished' — not uncommon in a crisis. Actions: 1) email with confirmation (creates a paper trail), 2) office phone, 3) LinkedIn/website, 4) document all attempts. This is protection during claims.",
  },
  c9q07: {
    text: "What is 'Double Brokering' and why is it dangerous?",
    options: ["Working with two brokers simultaneously — a legal practice", "A fraudulent re-brokering scheme: a carrier resells the load as if they were a broker; the actual carrier may never get paid", "Using two Rate Cons for one load", "Hauling two loads at once"],
    explanation: "Double Brokering is a fraud scheme. A 'carrier' takes a load, resells it to a real carrier, pockets the money, and disappears. The real carrier hauls the load but never gets paid.",
  },
  c9q08: {
    text: "How do you prevent fraud related to cargo theft?",
    options: ["Nothing can be done", "Verify MC# and DOT# on FMCSA, cross-check driver data with the Rate Con, track the load via GPS", "Trust everyone who calls", "Use only cash payments"],
    explanation: "Cargo theft is a real threat. Scammers create fake carriers with similar names. Verify: MC# on fmcsa.dot.gov, driver's CDL photo/copy, GPS tracking. 'Verify before you dispatch.'",
  },
  c9q09: {
    text: "The broker calls 30 minutes before pickup: 'We're canceling the load.' The driver already left, with 45 miles of deadhead behind him. What are your actions?",
    options: ["Accept the cancellation without objection", "Demand TONU per the Rate Con; document the dispatch time and deadhead miles", "Accuse the broker of lying", "Ask the driver to return and forget about it"],
    explanation: "Driver already dispatched = TONU is mandatory. Amount = per Rate Con (or minimum $150-200 + extra miles if not specified). Document: dispatch time, cancellation time, DH miles.",
    scenario: "Rate Con is signed, driver left at 06:00. At 07:30 (30 minutes before pickup) the broker writes: 'Shipper cancelled the load. Sorry.' The driver drove 45 miles deadhead.",
  },
  c9q10: {
    text: "The driver is caught in a heavy snowstorm. The road is closed, traffic is stopped. Delivery is 200 miles away, deadline is in 6 hours. What does the dispatcher do?",
    options: ["Demand the driver keep going despite the closed road", "Immediately notify the broker about force majeure, tell the driver to wait in a safe place, update the ETA", "Do nothing — it will sort itself out", "Cancel the load"],
    explanation: "Weather is force majeure (Act of God). Notify the broker immediately, don't wait. 'Driver is safe, road is closed due to weather, ETA updated.' Honest communication = no late penalties.",
    scenario: "Winter, I-80 is closed due to a blizzard in Wyoming. The driver has been in a line of trucks for 2 hours. The broker expects the load by 6:00 PM.",
  },
  c9q11: {
    text: "After delivery, the broker says the cargo was damaged and demands $5,000. The driver claims they delivered in perfect condition. The BOL was signed without notes. What do you do?",
    options: ["Pay $5,000 immediately", "Request: photos of damage with timestamp, OS&D report, signed BOL. A clean BOL is the carrier's defense.", "Ignore the demand", "Fire the driver"],
    explanation: "A BOL signed without damage notes = cargo was accepted in good condition. This is the carrier's main argument. Demand damage documentation. Engage the carrier's cargo insurance.",
    scenario: "The trip was completed 2 days ago. POD was signed without remarks. Today the broker sent a letter: 'Shipper reports cargo damaged. We will deduct $5,000 from your payment.'",
  },
  c9q12: {
    text: "The driver calls: 'My front axle broke, I'm stuck on I-95 in Delaware. Pickup is in 4 hours in New York.' What do you do?",
    options: ["Nothing — let them fix it themselves", "Immediately notify the broker, arrange towing/repair, look for a relay driver to save the pickup", "Cancel the load without notifying anyone", "Ask the driver to take a bus"],
    explanation: "A critical breakdown requires parallel actions: 1) broker notified, 2) tow truck called, 3) search for a relay driver in Delaware. The faster you act, the better the chance of saving the pickup.",
    scenario: "The driver was heading deadhead to a pickup in New York. At 12:00 PM they reported a breakdown on I-95 in Delaware. Pickup is at 4:00 PM, distance from breakdown to NY is 130 miles.",
  },
  c9q13: {
    text: "The driver calls at 2:00 AM: 'Police stopped me, they say I'm overweight.' What does the dispatcher do?",
    options: ["Tell the driver to handle it themselves", "Ask for the exact weight from the weigh ticket, contact the broker, help the driver get an overweight permit if possible", "Advise the driver to deny everything", "Call a lawyer immediately"],
    explanation: "Overweight stop: the weigh ticket is key (what does it actually weigh). If the load was taken per Rate Con (weight was stated), this is the shipper/broker's problem. If the weight wasn't verified — it's the dispatcher's mistake.",
    scenario: "The driver is hauling steel. At 2:00 AM they were weighed at a stationary scale. Reading: 86,000 lbs with a limit of 80,000. Police are issuing an $800 fine.",
  },
  c9q14: {
    text: "The load was delivered, POD received. The broker hasn't paid in 45 days. Payment Terms in the Rate Con are Net 30. What do you do?",
    options: ["Keep waiting", "Send a demand letter, file a claim with FMCSA, contact a factoring company or collections", "Lower the next rate because of this 'problematic' broker", "Never work with this broker again — and that's it"],
    explanation: "Net 30 has expired — this is an official default. Steps: 1) demand letter with date and amount, 2) FMCSA complaint (damages the broker's reputation), 3) collections agency, 4) small claims court up to $10K. Silence = lost money.",
    scenario: "The trip was completed 45 days ago. Invoice and POD were sent the day after delivery. Rate Con: Payment Net 30. The broker isn't responding to emails or calls.",
  },
  c9q15: {
    text: "What is the 'Claims' process in trucking?",
    options: ["A claim for cargo damage or loss, filed by the carrier or shipper", "An application for a license", "A monthly income report", "A complaint about road quality"],
    explanation: "A cargo claim is an official claim for cargo damage/loss. Filed in writing with documentation: BOL, photos, cargo value. The filing deadline is usually 9 months under the Carmack Amendment.",
  },
  c9q16: {
    text: "How do you properly get out of a 'dead zone'?",
    options: ["Wait for a good rate for as long as it takes", "Take a recovery load at or below market rate to relocate to a more profitable region", "Ask a broker to bring a load to the dead zone", "Send the driver home"],
    explanation: "Getting out of a dead zone requires strategy. Sometimes it's better to take $1.80 RPM heading toward Zone 9 (Great Lakes) than to sit 2-3 days waiting for $2.50. Downtime also costs money.",
  },
  c9q17: {
    text: "What is 'Force Majeure' in the context of trucking?",
    options: ["Speeding", "Unforeseeable circumstances (weather, natural disasters) that release parties from liability for delays", "A demand for expedited delivery", "A special type of insurance"],
    explanation: "Force Majeure — events beyond the parties' control: hurricane, flood, road closures. During force majeure, the carrier is released from late delivery penalties but must notify the broker.",
  },
  c9q18: {
    text: "What is a 'CSA Score' and how does it affect a carrier?",
    options: ["A customer service rating", "Compliance, Safety, Accountability Score — a federal carrier safety rating; a high score = inspections and risk of losing MC#", "A credit rating for banks", "A cargo quality score"],
    explanation: "CSA Score from FMCSA. HOS violations, overweight, equipment issues — raise the score. High CSA = more inspections, risk of intervention, and in extreme cases — revocation of operating authority.",
  },
  c9q19: {
    text: "The shipper says that $50,000 worth of cargo never arrived. The driver says they delivered it. The POD exists, but the signature is unclear. What do you do?",
    options: ["Pay $50,000 without investigation", "Provide the POD, request delivery confirmation from the consignee, involve insurance — an unclear signature does not mean non-delivery", "Fire the driver", "Accuse the shipper of fraud"],
    explanation: "A POD with a signature is proof of delivery, even if the signature is unclear. Additionally: GPS tracking (location at time of delivery), ELD timestamp. Engage cargo insurance.",
    scenario: "Expensive cargo — medical equipment. The shipper says: 'Cargo not received.' The driver insists they delivered. The POD exists, signature is illegible. The shipper is threatening a lawsuit.",
  },
  c9q20: {
    text: "How should you properly handle an aggressive or dishonest driver?",
    options: ["Give in to avoid conflict", "Clearly and calmly state the terms, document the conversation in writing, terminate the partnership if necessary", "Let the driver do whatever they want", "Ignore the problem"],
    explanation: "Conflict management: facts over emotions. Document all agreements in writing. If a driver systematically violates terms — ending the partnership is cheaper than losing your reputation with brokers.",
  },
};
