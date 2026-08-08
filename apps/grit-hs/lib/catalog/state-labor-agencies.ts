/**
 * All 50 states + DC, each pointing to the state agency that actually sets
 * youth-employment hour limits, curfews, and work-permit rules.
 *
 * Deliberately does NOT hardcode per-state hour numbers. Two independent
 * things make that unsafe to type from memory: (1) the DOL's own official
 * comparison table is dated ("as of July 15, 2025") specifically because
 * states amend these regularly, and (2) this session tried to fetch that
 * table directly and DOL returned 403 to both an authenticated fetch tool
 * and a direct request — there was no live source to check a guess against.
 * A wrong hour limit shown to a minor deciding whether a shift is legal is a
 * worse failure than an honest "confirm with your state" link, so this
 * follows the same discipline the rest of the app already uses for
 * certification cutoffs and admissions numbers (see CLAUDE.md Round 10).
 *
 * Agency names and URLs are far more stable than specific figures and were
 * spot-checked (CA, TX, NY, FL, WY) against live search results before the
 * rest were compiled — still, a government site can restructure at any time,
 * so `officialUrl` may drift. The fallback is always "search '<state> child
 * labor law'".
 */
export interface StateLaborAgency {
  state: string;
  abbreviation: string;
  agency: string;
  officialUrl: string;
  /** A specific, high-confidence fact worth surfacing — omitted rather than guessed where unsure. */
  note?: string;
}

export const STATE_LABOR_AGENCIES: StateLaborAgency[] = [
  { state: "Alabama", abbreviation: "AL", agency: "Alabama Department of Labor", officialUrl: "https://labor.alabama.gov/child_labor.aspx" },
  { state: "Alaska", abbreviation: "AK", agency: "Alaska Department of Labor and Workforce Development", officialUrl: "https://labor.alaska.gov/lss/clw.htm" },
  { state: "Arizona", abbreviation: "AZ", agency: "Industrial Commission of Arizona", officialUrl: "https://www.azica.gov/labor-department" },
  { state: "Arkansas", abbreviation: "AR", agency: "Arkansas Department of Labor and Licensing", officialUrl: "https://labor.arkansas.gov/labor-standards/child-labor/" },
  {
    state: "California",
    abbreviation: "CA",
    agency: "Division of Labor Standards Enforcement (DLSE)",
    officialUrl: "https://www.dir.ca.gov/dlse/dlse-cl.htm",
    note: "Work permits are issued by the student's own school, not a state office.",
  },
  { state: "Colorado", abbreviation: "CO", agency: "Colorado Department of Labor and Employment", officialUrl: "https://cdle.colorado.gov/wage-and-hour-law/youth-employment" },
  { state: "Connecticut", abbreviation: "CT", agency: "Connecticut Department of Labor", officialUrl: "https://www.ctdol.state.ct.us/wgwkstnd/minorreg.htm" },
  { state: "Delaware", abbreviation: "DE", agency: "Delaware Department of Labor", officialUrl: "https://labor.delaware.gov/divisions/industrial-affairs/child-labor/" },
  { state: "District of Columbia", abbreviation: "DC", agency: "DC Department of Employment Services", officialUrl: "https://does.dc.gov/service/youth-employment" },
  {
    state: "Florida",
    abbreviation: "FL",
    agency: "Florida Department of Business and Professional Regulation",
    officialUrl: "https://www2.myfloridalicense.com/child-labor/",
    note: "Florida does not require a work permit — one of the few states that doesn't.",
  },
  { state: "Georgia", abbreviation: "GA", agency: "Georgia Department of Labor", officialUrl: "https://dol.georgia.gov/child-labor-laws" },
  { state: "Hawaii", abbreviation: "HI", agency: "Hawaii Department of Labor and Industrial Relations", officialUrl: "https://labor.hawaii.gov/wsd/child-labor/" },
  { state: "Idaho", abbreviation: "ID", agency: "Idaho Department of Labor", officialUrl: "https://www.labor.idaho.gov/dnn/Businesses/Child-Labor-Laws" },
  { state: "Illinois", abbreviation: "IL", agency: "Illinois Department of Labor", officialUrl: "https://labor.illinois.gov/laws-rules/clra.html" },
  { state: "Indiana", abbreviation: "IN", agency: "Indiana Department of Labor", officialUrl: "https://www.in.gov/dol/inspection/child-labor/" },
  { state: "Iowa", abbreviation: "IA", agency: "Iowa Division of Labor", officialUrl: "https://www.iowadivisionoflabor.gov/child-labor" },
  { state: "Kansas", abbreviation: "KS", agency: "Kansas Department of Labor", officialUrl: "https://www.dol.ks.gov/child-labor" },
  { state: "Kentucky", abbreviation: "KY", agency: "Kentucky Labor Cabinet", officialUrl: "https://labor.ky.gov/standard/Pages/Child-Labor.aspx" },
  { state: "Louisiana", abbreviation: "LA", agency: "Louisiana Workforce Commission", officialUrl: "https://www.laworks.net/WorkforceDev/OWD_ChildLaborLaw.asp" },
  { state: "Maine", abbreviation: "ME", agency: "Maine Department of Labor", officialUrl: "https://www.maine.gov/labor/labor_laws/publications/childlabor.html" },
  { state: "Maryland", abbreviation: "MD", agency: "Maryland Division of Labor and Industry", officialUrl: "https://www.dllr.state.md.us/labor/wagepay/minorlaws.shtml" },
  { state: "Massachusetts", abbreviation: "MA", agency: "Massachusetts Attorney General's Fair Labor Division", officialUrl: "https://www.mass.gov/info-details/massachusetts-law-about-employment-of-minors" },
  { state: "Michigan", abbreviation: "MI", agency: "Michigan Wage and Hour Division", officialUrl: "https://www.michigan.gov/leo/bureaus-agencies/ber/wage-and-hour/youth-employment" },
  { state: "Minnesota", abbreviation: "MN", agency: "Minnesota Department of Labor and Industry", officialUrl: "https://www.dli.mn.gov/business/employment-practices/minors-employment-child-labor" },
  { state: "Mississippi", abbreviation: "MS", agency: "Mississippi Department of Employment Security", officialUrl: "https://mdes.ms.gov/employers/child-labor-laws/" },
  { state: "Missouri", abbreviation: "MO", agency: "Missouri Department of Labor", officialUrl: "https://labor.mo.gov/DLS/ChildLabor" },
  { state: "Montana", abbreviation: "MT", agency: "Montana Department of Labor and Industry", officialUrl: "https://erd.dli.mt.gov/labor-standards/child-labor" },
  { state: "Nebraska", abbreviation: "NE", agency: "Nebraska Department of Labor", officialUrl: "https://dol.nebraska.gov/LaborStandards/ChildLabor" },
  { state: "Nevada", abbreviation: "NV", agency: "Nevada Office of the Labor Commissioner", officialUrl: "https://labor.nv.gov/Employees/ChildLabor/" },
  { state: "New Hampshire", abbreviation: "NH", agency: "New Hampshire Department of Labor", officialUrl: "https://www.nh.gov/labor/inspection/youth-employment.htm" },
  { state: "New Jersey", abbreviation: "NJ", agency: "New Jersey Department of Labor and Workforce Development", officialUrl: "https://www.nj.gov/labor/wageandhour/support-info/child-labor-laws.shtml" },
  { state: "New Mexico", abbreviation: "NM", agency: "New Mexico Department of Workforce Solutions", officialUrl: "https://www.dws.state.nm.us/en-us/Business/Labor-Relations/Child-Labor" },
  {
    state: "New York",
    abbreviation: "NY",
    agency: "New York Department of Labor",
    officialUrl: "https://dol.ny.gov/youth-ages-14-17",
    note: "New York is switching working papers to a fully digital system.",
  },
  { state: "North Carolina", abbreviation: "NC", agency: "North Carolina Department of Labor", officialUrl: "https://www.labor.nc.gov/workplace-rights/child-labor-provisions" },
  { state: "North Dakota", abbreviation: "ND", agency: "North Dakota Department of Labor and Human Rights", officialUrl: "https://www.labor.nd.gov/employment-practices/child-labor" },
  { state: "Ohio", abbreviation: "OH", agency: "Ohio Department of Commerce, Bureau of Wage and Hour Administration", officialUrl: "https://com.ohio.gov/divisions-and-programs/industrial-compliance/bureaus/wage-and-hour-administration/resources/minor-labor-laws" },
  { state: "Oklahoma", abbreviation: "OK", agency: "Oklahoma Department of Labor", officialUrl: "https://oklahoma.gov/labor/business/child-labor.html" },
  { state: "Oregon", abbreviation: "OR", agency: "Oregon Bureau of Labor and Industries", officialUrl: "https://www.oregon.gov/boli/workers/pages/minors-in-the-workplace.aspx" },
  { state: "Pennsylvania", abbreviation: "PA", agency: "Pennsylvania Department of Labor and Industry", officialUrl: "https://www.pa.gov/agencies/dli/programs-services/labor-management-relations/child-labor-law.html" },
  { state: "Rhode Island", abbreviation: "RI", agency: "Rhode Island Department of Labor and Training", officialUrl: "https://dlt.ri.gov/workers/child-labor" },
  { state: "South Carolina", abbreviation: "SC", agency: "South Carolina Department of Labor, Licensing and Regulation", officialUrl: "https://llr.sc.gov/lb/child_labor.aspx" },
  { state: "South Dakota", abbreviation: "SD", agency: "South Dakota Department of Labor and Regulation", officialUrl: "https://dlr.sd.gov/employment_laws/child_labor.aspx" },
  { state: "Tennessee", abbreviation: "TN", agency: "Tennessee Department of Labor and Workforce Development", officialUrl: "https://www.tn.gov/workforce/employees/child-labor.html" },
  {
    state: "Texas",
    abbreviation: "TX",
    agency: "Texas Workforce Commission",
    officialUrl: "https://www.twc.texas.gov/programs/wage-and-hour/texas-child-labor-law",
  },
  { state: "Utah", abbreviation: "UT", agency: "Utah Labor Commission", officialUrl: "https://laborcommission.utah.gov/divisions/antidiscrimination-labor/child-labor/" },
  { state: "Vermont", abbreviation: "VT", agency: "Vermont Department of Labor", officialUrl: "https://labor.vermont.gov/wage-and-hour/youth-employment" },
  { state: "Virginia", abbreviation: "VA", agency: "Virginia Department of Labor and Industry", officialUrl: "https://www.doli.virginia.gov/child-labor/" },
  { state: "Washington", abbreviation: "WA", agency: "Washington State Department of Labor and Industries", officialUrl: "https://lni.wa.gov/workers-rights/wages/minors-employment/" },
  { state: "West Virginia", abbreviation: "WV", agency: "West Virginia Division of Labor", officialUrl: "https://labor.wv.gov/Wage&Hour/Pages/ChildLaborLaw.aspx" },
  { state: "Wisconsin", abbreviation: "WI", agency: "Wisconsin Department of Workforce Development", officialUrl: "https://dwd.wisconsin.gov/er/laborstandards/childlabor.htm" },
  {
    state: "Wyoming",
    abbreviation: "WY",
    agency: "Wyoming Department of Workforce Services, Labor Standards",
    officialUrl: "https://dws.wyo.gov/dws-division/labor-standards/youth-and-parents/",
  },
];

export function findStateLaborAgency(abbreviation: string): StateLaborAgency | undefined {
  const target = abbreviation.trim().toUpperCase();
  return STATE_LABOR_AGENCIES.find((s) => s.abbreviation === target);
}
