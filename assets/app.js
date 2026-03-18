// ─────────────────────────────────────────────
//  PCSP Assistant Pro | Marion County DMH
//  app.js v3.0 — High-Fidelity Revision
// ─────────────────────────────────────────────

const APP_NAME = "PCSP Assistant Pro";
const APP_VERSION = "3.0";
const DRAFT_LIMIT = 20;
const DRAFT_EXPIRY_DAYS = 30;
const SESSION_TIMEOUT_MINS = 30;

// ── DATA STRUCTURES ──
let legalReps = [];
let commChartRows = [];
let importantPeople = [];
let programServices = []; // Section 7: Program Services
let goalsData = []; // Section 9: Action Plan
let clinicalGoalsTasks = []; // Section 2: Goals/Tasks
let _coverPhotoData = null;

// ── All form field IDs (used for save/restore) ──
const FORM_FIELDS = [
  // Section 0 — Cover
  "coverLegalName",
  "clientNickname",
  "clientDOB",
  "coverDmhID",
  "coverFundingType",
  "coverMeetingDate",
  "coverImplDate",
  "coverHomeName",
  // Section 1 — Demographics
  "coordinator",
  "officeType",
  "maritalStatus",
  "voterStatus",
  "religion",
  "religionOther",
  "nativeLanguage",
  "otherLanguages",
  "commMethod",
  "comm-other",
  "insurance",
  "spenddownAmount",
  "privateInsuranceProvider",
  "insuranceSec",
  "spenddownAmountSec",
  "privateInsuranceProviderSec",
  "dentalInsurance",
  "dentalOther",
  "residencyType",
  "residenceNotes",
  "schoolName",
  "educationStatus",
  "employmentStatus",
  "employmentJob",
  // Section 2 - Preferences
  "likesActivities",
  "likesFoods",
  "likesPlaces",
  "likesOther",
  // Section 3 - Dislikes
  "dislikesActivities",
  "dislikesFoods",
  "dislikesOther",
  // Section 4 - Important People
  "relationshipsExplore",
  // Section 5 - Hopes & Dreams
  "aspirations",
  "concerns",
  // Section 6 - Communication
  "commPrimaryLanguage",
  "commEvalStatus",
  "commEvalType",
  "commEvalDate",
  "commMethodOther",
  "commMethodNotes",
  "commSeeAttached",
  "commChartNA",
  // Section 7 - Program or Other Services
  "hcbsEducatedOptions",
  "hcbsEducatedRange",
  "hcbsUpdateMethod",
  "hcbsAlternatives",
  "contributors",
  // Section 8 - Medical
  "diagnosis",
  "medicationDetails",
  "medHistory",
  "pcpName",
  // Section 9 - Community Support
  "communitySupport",
  // Section 10 - Ways to Support
  "waysToSupport",
  // Section 12 - Independence/Strengths
  "independenceStrengths",
  // Section 13 - Transition
  "transitionCategory",
  "retirementNotes",
  "under16Notes",
  "discoveryTools",
  "referralNotes",
  "transitionPlan",
  // Section 14 - Behavioral
  "behavioralStatus",
  "psychotropicProtocol",
  // Section 15 - Supervision
  "supervisionLevel",
  "riskLevel",
  "oshaPrecaution",
  "hcbsRule1",
  "hcbsRule2",
  "hcbsRule3",
  "homeLifeNotes",
  // Section 18 - Comments & Clinical Summary
  "lastAssessment",
  "lastLOC",
  "rasSisScore",
  "ponScore",
  "planComments",
  "locSelfCare",
  "locLearning",
  "locSelfDirection",
  "locIndependentLiving",
  "locLanguage",
  "locMobility",
  "locOtherDomains",
  "prevGoals",
  "supportNeeded",
  "strengths",
  "maasTools",
  "ritualsRoutines",
  "religiousSupports",
  "staffPreference",
  "otherSupport",
  "learningStyleNotes",
  "culturalDifferences",
  "waterTemp",
  // Section 6 - Health/Safety
  "personalOutcomes",
  "hrstStatus",
  "telehealth",
  "specialists",
  "preventionDiet",
  "selfAdmin",
  "healthRisks",
  "evacPlan",
  "dnrStatus",
  // Misc
  "ethnicityOther",
  "legalSpecify",
  "limitedGuardianshipDetails",
  "legalLicensesProbation",
];

function esc(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ── PHOTO HANDLING ──
function handlePhotoUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    _coverPhotoData = e.target.result;
    const img = document.getElementById("coverPhoto");
    img.src = _coverPhotoData;
    img.style.display = "block";
    document.getElementById("photoPlaceholder").style.display = "none";
    document.getElementById("removePhotoBtn").style.display = "block";
    updateUI();
  };
  reader.readAsDataURL(file);
}
function removePhoto() {
  _coverPhotoData = null;
  document.getElementById("coverPhoto").style.display = "none";
  document.getElementById("photoPlaceholder").style.display = "block";
  document.getElementById("removePhotoBtn").style.display = "none";
  updateUI();
}

// ── SECTION 2: GOALS/TASKS ──
function addGoalTask() {
  clinicalGoalsTasks.push({
    id: Date.now(),
    goal: "",
    task: "",
    progress: "",
    meaning: "",
    strengths: "",
    tech: "",
    relationships: "",
    resources: "",
  });
  renderGoalTasks();
  updateUI();
}
function removeGoalTask(id) {
  clinicalGoalsTasks = clinicalGoalsTasks.filter((g) => g.id !== id);
  renderGoalTasks();
  updateUI();
}
function updateGoalTaskField(id, field, val) {
  const g = clinicalGoalsTasks.find((x) => x.id === id);
  if (g) g[field] = val;
  updateUI();
}
function renderGoalTasks() {
  const container = document.getElementById("dynamicGoalsTasksContainer");
  if (!container) return;
  if (!clinicalGoalsTasks.length) {
    container.innerHTML =
      '<p style="font-size: 12px; color: var(--text-label); margin: 8px 0 12px">No goals/tasks added.</p>';
    return;
  }
  container.innerHTML = clinicalGoalsTasks
    .map(
      (g, idx) => `
    <div class="legal-rep-card" style="border-left: 3px solid var(--gold); margin-bottom:15px;">
      <div class="rep-header"><span class="rep-title">Goal/Task #${idx + 1}</span><button class="remove-rep-btn" onclick="removeGoalTask(${g.id})">×</button></div>
      <div class="form-grid">
        <div class="field-group"><label>Goal</label><input type="text" value="${esc(g.goal)}" oninput="updateGoalTaskField(${g.id},'goal',this.value)"></div>
        <div class="field-group"><label>Task</label><input type="text" value="${esc(g.task)}" oninput="updateGoalTaskField(${g.id},'task',this.value)"></div>
        <div class="field-group"><label>Progress</label><input type="text" value="${esc(g.progress)}" oninput="updateGoalTaskField(${g.id},'progress',this.value)"></div>
        <div class="field-group"><label>Meaning</label><input type="text" value="${esc(g.meaning)}" oninput="updateGoalTaskField(${g.id},'meaning',this.value)"></div>
        <div class="field-group"><label>Strengths/Assets</label><input type="text" value="${esc(g.strengths)}" oninput="updateGoalTaskField(${g.id},'strengths',this.value)"></div>
        <div class="field-group"><label>Tech</label><input type="text" value="${esc(g.tech)}" oninput="updateGoalTaskField(${g.id},'tech',this.value)"></div>
        <div class="field-group"><label>Relationships</label><input type="text" value="${esc(g.relationships)}" oninput="updateGoalTaskField(${g.id},'relationships',this.value)"></div>
        <div class="field-group"><label>Resources</label><input type="text" value="${esc(g.resources)}" oninput="updateGoalTaskField(${g.id},'resources',this.value)"></div>
      </div>
    </div>`,
    )
    .join("");
}

// ── SECTION 7: PROGRAM OR OTHER SERVICES ──
function addProgramService() {
  programServices.push({
    id: Date.now(),
    service: "",
    provider: "",
    frequency: "",
    funding: "",
    otherFunding: "",
  });
  renderProgramServices();
  updateUI();
}
function removeProgramService(id) {
  programServices = programServices.filter((p) => p.id !== id);
  renderProgramServices();
  updateUI();
}
function updateProgramServiceField(id, field, val) {
  const p = programServices.find((x) => x.id === id);
  if (p) {
    p[field] = val;
    if (field === 'funding') {
      renderProgramServices(); // Refresh for "Other" field
      checkAndApplyHCBSTemplate(val);
    }
  }
  updateUI();
}

function checkAndApplyHCBSTemplate(waiverName) {
  const triggers = [
    "Comprehensive Waiver",
    "Support Waiver",
    "Sarah Lopez Waiver (MOCDD)",
    "Partnership for Hope Waiver"
  ];
  
  if (!triggers.includes(waiverName)) return;

  const template = "Provider Choice Statement and Spreadsheet was signed on ________ by ________________ for ________________.";
  const fields = ["hcbsEducatedOptions", "hcbsEducatedRange", "hcbsUpdateMethod", "hcbsAlternatives"];
  
  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el && !el.value.trim()) {
      el.value = template;
    }
  });
}
function renderProgramServices() {
  const container = document.getElementById("programServicesContainer");
  if (!container) return;
  if (!programServices.length) {
    container.innerHTML =
      '<p style="font-size: 13px; color: var(--text-label); margin-bottom: 20px;">No waivers or services added.</p>';
    return;
  }
  container.innerHTML = programServices
    .map(
      (p, idx) => `
    <div class="legal-rep-card" style="border-left: 3px solid var(--marion-blue); margin-bottom:15px;">
      <div class="rep-header"><span class="rep-title">Waiver / Service #${idx + 1}</span><button class="remove-rep-btn" onclick="removeProgramService(${p.id})">×</button></div>
      <div class="form-grid">
        <div class="field-group"><label>Service Name</label><input type="text" value="${esc(p.service)}" oninput="updateProgramServiceField(${p.id},'service',this.value)"></div>
        <div class="field-group"><label>Provider</label><input type="text" value="${esc(p.provider)}" oninput="updateProgramServiceField(${p.id},'provider',this.value)"></div>
        <div class="field-group"><label>Frequency</label><input type="text" value="${esc(p.frequency)}" oninput="updateProgramServiceField(${p.id},'frequency',this.value)"></div>
        <div class="field-group half">
          <label>Funding Source</label>
          <select onchange="updateProgramServiceField(${p.id},'funding',this.value)">
            <option value="">Select Funding Source...</option>
            <option value="Comprehensive Waiver" ${p.funding === "Comprehensive Waiver" ? "selected" : ""}>Comprehensive Waiver</option>
            <option value="Support Waiver" ${p.funding === "Support Waiver" ? "selected" : ""}>Support Waiver</option>
            <option value="Grant Funding" ${p.funding === "Grant Funding" ? "selected" : ""}>Grant Funding</option>
            <option value="Sarah Lopez Waiver (MOCDD)" ${p.funding === "Sarah Lopez Waiver (MOCDD)" ? "selected" : ""}>Sarah Lopez (MOCDD)</option>
            <option value="PAC Funding" ${p.funding === "PAC Funding" ? "selected" : ""}>PAC Funding</option>
            <option value="NEAI Funding" ${p.funding === "NEAI Funding" ? "selected" : ""}>NEAI Funding</option>
            <option value="No Funding" ${p.funding === "No Funding" ? "selected" : ""}>No Funding</option>
            <option value="Partnership for Hope Waiver" ${p.funding === "Partnership for Hope Waiver" ? "selected" : ""}>Partnership for Hope Waiver</option>
            <option value="Other" ${p.funding === "Other" ? "selected" : ""}>Other</option>
          </select>
        </div>
        <div class="field-group half" style="display: ${p.funding === 'Other' ? 'block' : 'none'}">
          <label>Other Funding Source</label>
          <input type="text" value="${esc(p.otherFunding || '')}" placeholder="Specify funding..." oninput="updateProgramServiceField(${p.id},'otherFunding',this.value)">
        </div>
      </div>
    </div>`,
    )
    .join("");
}

// (Duplicate Section 7 removed - using the one below)

// ── SECTION 8: COMMUNICATION ──
function addCommEvalDate() {
  const container = document.getElementById("commEvalDatesContainer");
  const input = document.createElement("input");
  input.type = "date";
  input.className = "comm-eval-date";
  input.oninput = () => updateUI();
  input.style.marginBottom = "8px";
  container.appendChild(input);
}
function getCommEvalDates() {
  return (
    Array.from(document.querySelectorAll(".comm-eval-date"))
      .map((el) => el.value)
      .filter((v) => v)
      .join(", ") || "None Listed"
  );
}

// ── SECTION 9: ACTION PLAN ──
function addGoal() {
  goalsData.push({
    id: Date.now(),
    domain: "Health/Wellness",
    goal: "",
    task: "",
    responsible: [],
    frequency: [],
  });
  renderGoals();
  updateUI();
}
function removeGoal(id) {
  goalsData = goalsData.filter((g) => g.id !== id);
  renderGoals();
  updateUI();
}
function updateGoalField(id, field, val) {
  const g = goalsData.find((x) => x.id === id);
  if (g) g[field] = val;
  updateUI();
}
function toggleGoalArrayField(id, field, val) {
  const g = goalsData.find((x) => x.id === id);
  if (g) {
    if (!g[field]) g[field] = [];
    const idx = g[field].indexOf(val);
    if (idx > -1) g[field].splice(idx, 1);
    else g[field].push(val);
  }
  updateUI();
}
function renderGoals() {
  const container = document.getElementById("goalsContainer");
  if (!container) return;
  if (!goalsData.length) {
    container.innerHTML =
      '<p style="font-size: 13px; color: var(--text-label);">No action items added.</p>';
    return;
  }
  container.innerHTML = goalsData
    .map(
      (goal, idx) => `
    <div class="legal-rep-card" style="margin-bottom:15px;">
      <div class="rep-header"><span class="rep-title">Action Item #${idx + 1}</span><button class="remove-rep-btn" onclick="removeGoal(${goal.id})">×</button></div>
      <div class="form-grid">
        <div class="field-group"><label>Domain</label>
          <select onchange="updateGoalField(${goal.id},'domain',this.value)">
            <option value="Health/Wellness" ${goal.domain === "Health/Wellness" ? "selected" : ""}>Health/Wellness</option>
            <option value="Community" ${goal.domain === "Community" ? "selected" : ""}>Community</option>
            <option value="Social" ${goal.domain === "Social" ? "selected" : ""}>Social</option>
            <option value="Employment" ${goal.domain === "Employment" ? "selected" : ""}>Employment</option>
            <option value="Independence" ${goal.domain === "Independence" ? "selected" : ""}>Independence</option>
            <option value="Education" ${goal.domain === "Education" ? "selected" : ""}>Education</option>
            <option value="Other" ${goal.domain === "Other" ? "selected" : ""}>Other</option>
          </select>
        </div>
        <div class="field-group full"><label>Goal (Outcome)</label><textarea oninput="updateGoalField(${goal.id},'goal',this.value)">${esc(goal.goal)}</textarea></div>
        <div class="field-group full"><label>Task</label><input type="text" value="${esc(goal.task)}" oninput="updateGoalField(${goal.id},'task',this.value)"></div>
        <div class="field-group"><label>Responsible Person(s)</label>
          <div style="display:flex; flex-wrap:wrap; gap:5px;">
            ${["Individual", "Guardian", "SC", "Provider", "Family"]
              .map(
                (p) => `
              <label class="eth-check" style="font-size:10px;"><input type="checkbox" ${goal.responsible.includes(p) ? "checked" : ""} onchange="toggleGoalArrayField(${goal.id},'responsible','${p}')"> ${p}</label>
            `,
              )
              .join("")}
          </div>
        </div>
        <div class="field-group"><label>Frequency</label>
          <div style="display:flex; flex-wrap:wrap; gap:5px;">
            ${["Monthly", "Quarterly", "Annually", "As Needed", "Weekly"]
              .map(
                (f) => `
              <label class="eth-check" style="font-size:10px;"><input type="checkbox" ${goal.frequency.includes(f) ? "checked" : ""} onchange="toggleGoalArrayField(${goal.id},'frequency','${f}')"> ${f}</label>
            `,
              )
              .join("")}
          </div>
        </div>
      </div>
    </div>`,
    )
    .join("");
}

// ── THEME ──
(function applyTheme() {
  const saved = localStorage.getItem("pcsp_theme") || "light";
  document.documentElement.setAttribute("data-theme", saved);
})();
function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("pcsp_theme", next);
}

function toggleTransitionFields() {
  const cat = document.getElementById("transitionCategory").value;
  
  // 1. Under 16 Fields (Additive history)
  // We show it for and all subsequent stages (16+, 65+) to preserve the historical data context.
  const hasEverBeenUnder16 = (cat !== "" && cat !== "Standard"); 
  document.getElementById("under16Fields").style.display = hasEverBeenUnder16 ? "block" : "none";
  
  // 2. Standard Transition Tools (16+)
  const is16Plus = (cat === "Transition Age (16-24)" || cat === "Adult / Employment Age" || cat === "Retirement Age (65+)");
  const referralContainer = document.getElementById("referralGrid").closest('.field-group');
  const discoveryContainer = document.getElementById("discoveryTools").closest('.field-group');
  if (referralContainer) referralContainer.style.display = is16Plus ? "block" : "none";
  if (discoveryContainer) discoveryContainer.style.display = is16Plus ? "block" : "none";

  // 3. Retirement Fields (65+)
  document.getElementById("retirementFields").style.display = (cat === "Retirement Age (65+)") ? "block" : "none";
}

// ── UI UPDATE & NARRATIVE ──
function updateUI() {
  const isPrivacyOn = document.getElementById("privacyToggle").checked;
  const getVal = (id) => {
    const el = document.getElementById(id);
    return el ? el.value : "";
  };
  const name = getVal("coverLegalName"),
    nick = getVal("clientNickname"),
    dob = getVal("clientDOB"),
    dmhID = getVal("coverDmhID");

  document.getElementById("headerName").textContent = name
    ? nick
      ? `${name} ("${nick}")`
      : name
    : "No Individual Selected";
  document.getElementById("headerDOB").textContent = dob
    ? new Date(dob + "T00:00:00").toLocaleDateString()
    : "—";
  document.getElementById("headerDMH").textContent = dmhID || "—";

  // Executive Cover (Print)
  const printImg = document.getElementById("printPhotoImg");
  if (_coverPhotoData && !isPrivacyOn) {
    printImg.src = _coverPhotoData;
    printImg.style.display = "block";
    document.getElementById("printPhotoPlaceholder").style.display = "none";
  } else {
    printImg.style.display = "none";
    document.getElementById("printPhotoPlaceholder").style.display = "block";
  }

  const displayName = isPrivacyOn
    ? "[INDIVIDUAL]"
    : name
      ? nick
        ? `${name} ("${nick}")`
        : name
      : "[NAME]";
  const displayDMH = isPrivacyOn ? "[XXXXXXX]" : dmhID || "N/A";

  document.getElementById("printName").textContent = displayName.toUpperCase();
  document.getElementById("printDMH").textContent = displayDMH;
  document.getElementById("printFunding").textContent = (
    getVal("coverFundingType") ||
    getVal("waiverType") ||
    "Not Specified"
  ).toUpperCase();
  document.getElementById("printImplDate").textContent =
    getVal("coverImplDate") || "TBD";
  document.getElementById("printMeetingDate").textContent =
    getVal("coverMeetingDate") || "TBD";
  document.getElementById("printCaseManager").textContent = (
    getVal("coordinator") || "TBD"
  ).toUpperCase();
  document.getElementById("printHome").textContent = (
    getVal("coverHomeName") || "N/A"
  ).toUpperCase();

  // Narrative Build
  let t = "";
  const line = (s) => {
    t += s + "\n";
  };
  const head = (s) => {
    line(s);
    line("─".repeat(67));
    line("");
  };
  const field = (l, v) => line(`${l}: ${v || "N/A"}`);

  line("PERSON CENTERED SERVICE PLAN (PCSP) — COVER SHEET");
  line("Marion County Services for the Developmentally Disabled");
  line("═".repeat(67));
  line("");
  field("INDIVIDUAL NAME", displayName.toUpperCase());
  field("DMH ID #", displayDMH);
  field("FUNDING", getVal("coverFundingType").toUpperCase());
  line("\nMISSOURI PCSP OFFICIAL DOCUMENT\n" + "═".repeat(67) + "\n");

  head("1. DEMOGRAPHICS & LEGAL AUTHORITY");
  line("Legal Representatives:");
  line(getLegalRepsNarrative());
  line("");
  field("TCM Agency", getVal("coordinator"));
  field("Marital", getVal("maritalStatus"));
  field("Residency", getVal("residencyType"));
  field("Education", getVal("educationStatus"));
  field("School", getVal("schoolName"));
  field("Legal Specifics", getVal("legalSpecify"));
  field("Limited Details", getVal("limitedGuardianshipDetails"));
  field("Legal Licenses", getVal("legalLicensesProbation"));
  line("");

  head("2. PREFERENCES, LIKES AND SPECIAL INTERESTS");
  field("Likes Activities", getVal("likesActivities"));
  field("Likes Foods", getVal("likesFoods"));
  field("Likes Places", getVal("likesPlaces"));
  field("Other Likes", getVal("likesOther"));
  line("");

  head("3. DISLIKES");
  field("Dislikes Activities", getVal("dislikesActivities"));
  field("Dislikes Foods", getVal("dislikesFoods"));
  field("Other Dislikes", getVal("dislikesOther"));
  line("");

  head("4. IMPORTANT PEOPLE");
  line(
    importantPeople.map((p) => `  - ${p.name || "[Name]"} (${p.relationship || "Relationship"})${p.activities ? "\n    Activities/Frequency: " + p.activities : ""}`).join("\n") ||
      "  None Listed",
  );
  field("Exploratory Relationships", getVal("relationshipsExplore"));
  line("");

  head("5. HOPES, DREAMS, ASPIRATIONS AND CONCERNS");
  field("Aspirations", getVal("aspirations"));
  field("Concerns", getVal("concerns"));
  line("");

  head("6. HEALTH, SAFETY & RISK PLANNING");
  field("Diagnosis", getVal("diagnosis"));
  field("Personal Outcomes", getVal("personalOutcomes"));
  field("HRST Status", getVal("hrstStatus"));
  field("Medical History", getVal("medHistory"));
  field("PCP", getVal("pcpName"));
  field("Specialists", getVal("specialists"));
  field("Medications", getVal("medicationDetails"));
  
  const healthP = [];
  document.querySelectorAll('#healthParamsContainer input[type="checkbox"]:checked').forEach(cb => healthP.push(cb.value));
  field("Tracked Parameters", healthP.length ? healthP.join(", ") : "None Specified");

  field("Risk Level", getVal("riskLevel"));
  field("Supervision", getVal("supervisionLevel"));
  field("Behavioral Status", getVal("behavioralStatus"));
  field("Allergies", getVal("allergies"));
  line("");

  head("6.1 COMMUNICATION");
  field("Primary Language", getVal("commPrimaryLanguage"));
  field("Evaluation Status", getVal("commEvalStatus"));
  field("Evaluation Type", getVal("commEvalType"));
  field("Date of Evaluation", getVal("commEvalDate"));
  
  const commMethods = [];
  const methodCheckboxes = document.querySelectorAll('#commMethodGrid input[type="checkbox"]');
  methodCheckboxes.forEach(cb => {
    if (cb.checked && cb.value !== "Other Communication Method") {
      commMethods.push(cb.value);
    }
  });
  if (getVal("commMethodOther")) commMethods.push(`Other: ${getVal("commMethodOther")}`);
  field("Primary Methods", commMethods.length ? commMethods.join(", ") : "None Selected");
  
  field("Description/Notes", getVal("commMethodNotes"));
  
  if (document.getElementById("commSeeAttached")?.checked) {
    line("Communication Chart: SEE ATTACHED / ENCLOSED");
  } else {
    const chartNA = document.getElementById("commChartNA");
    if (chartNA && chartNA.checked) {
      line("Communication Chart: N/A");
    } else if (typeof commChartRows !== "undefined" && commChartRows.length > 0) {
      line("Communication Chart:");
      commChartRows.forEach((r, idx) => {
        line(`  Entry #${idx + 1}`);
        line(`    When... : ${r.situation || "—"}`);
        line(`    Meaning : ${r.meaning || "—"}`);
        line(`    Response: ${r.response || "—"}`);
      });
    }
  }
  line("");

  head("7. PROGRAM OR OTHER SERVICES");
  if (programServices.length > 0) {
    line("Current Programs & Waivers:");
    programServices.forEach((s, idx) => {
      const fundDisplay = s.funding === 'Other' ? (s.otherFunding || 'Other') : (s.funding || '—');
      line(`  [${idx + 1}] Service: ${s.service || "—"} | Provider: ${s.provider || "—"} | Freq: ${s.frequency || "—"} | Funding: ${fundDisplay}`);
    });
    line("");
  }
  line("HCBS Waiver Choice & Education:");
  field("1. Informed of options", getVal("hcbsEducatedOptions"));
  field("2. Informed of range", getVal("hcbsEducatedRange"));
  field("3. Update method", getVal("hcbsUpdateMethod"));
  field("4. Alternatives considered", getVal("hcbsAlternatives"));
  field("Plan Contributors", getVal("contributors"));
  line("");

  head("8. MEDICAL");
  field("Diagnosis", getVal("diagnosis"));
  field("Medications", getVal("medicationDetails"));
  field("Medical History", getVal("medHistory"));
  field("PCP", getVal("pcpName"));
  line("");

  head("9. COMMUNITY NATURAL AND NON-DIVISION SUPPORT");
  field("Support Notes", getVal("communitySupport"));
  line("");

  head("10. WAYS TO SUPPORT THE INDIVIDUAL");
  field("Aspirations (1-3 Years)", getVal("aspirations"));
  field("Former Goals & Progress", getVal("prevGoals"));
  field("Support Needed", getVal("supportNeeded"));
  field("Strengths & Assets", getVal("strengths"));
  field("Assessment Tools (MAAS)", getVal("maasTools"));
  field("Rituals & Routines", getVal("ritualsRoutines"));
  field("Religious supports", getVal("religiousSupports"));
  field("Staff Preference", getVal("staffPreference"));

  const learnS = [];
  document.querySelectorAll('#learningStyleContainer input[type="checkbox"]:checked').forEach(cb => learnS.push(cb.value));
  field("Learning Styles", learnS.length ? learnS.join(", ") : "None Selected");

  field("Learning Style Notes", getVal("learningStyleNotes"));
  field("Cultural Considerations", getVal("culturalDifferences"));
  field("Water Temp Req", getVal("waterTemp"));
  field("General Strategies", getVal("waysToSupport"));
  line("");

  line("11. [SECTION 11 NOT SPECIFIED]");
  line("");

  head("12. INDEPENDENCE PERSONAL STRENGTHS AND ASSETS");
  field("Strengths/Assets", getVal("independenceStrengths"));
  line("");

  head("13. TRANSITION YOUTH / ADULTS / COMMUNITY");
  const tCat = getVal("transitionCategory");
  if (tCat && tCat !== "Standard") line(`Life Stage: ${tCat}`);
  
  // Print historical and current notes cumulatively
  if (getVal("under16Notes")) field("Under 16 Dev Goals", getVal("under16Notes"));
  
  const isTransitionActive = (tCat === "Transition Age (16-24)" || tCat === "Adult / Employment Age" || tCat === "Retirement Age (65+)");
  if (isTransitionActive) {
    field("Discovery Tools", getVal("discoveryTools"));
    const referrals = [];
    document.querySelectorAll(".referral-cb").forEach(cb => { if (cb.checked) referrals.push(cb.value); });
    if (referrals.length) field("Community Referrals", referrals.join(", "));
    field("Referral Notes", getVal("referralNotes"));
  }
  
  if (getVal("retirementNotes")) field("Retirement Context", getVal("retirementNotes"));
  
  field("Transition Plan Summary", getVal("transitionPlan"));
  line("");

  head("14. BEHAVIORAL");
  field("Behavioral Status", getVal("behavioralStatus"));
  field("Psychotropic Protocol", getVal("psychotropicProtocol"));
  line("");

  head("15. SUPERVISION(HOUSING) (SAFETY AND SECURITY)");
  field("Supervision Level", getVal("supervisionLevel"));
  field("OSHA Precautions", getVal("oshaPrecaution"));
  field("Risk Level", getVal("riskLevel"));
  
  line("Home Life / HCBS Compliance:");
  line(`  - Rule #1 (Lease): ${document.getElementById("hcbsRule1")?.checked ? "YES" : "NO"}`);
  line(`  - Rule #2 (Privacy/Locks): ${document.getElementById("hcbsRule2")?.checked ? "YES" : "NO"}`);
  line(`  - Rule #3 (Freedom to Furnish): ${document.getElementById("hcbsRule3")?.checked ? "YES" : "NO"}`);
  field("Home Life Notes", getVal("homeLifeNotes"));
  line("");

  head("16. PREVIOUS GOALS");
  line(
    clinicalGoalsTasks
      .map(
        (g, i) =>
          `Goal Entry #${i + 1}: ${g.goal} | Task: ${g.task} | Progress: ${g.progress}`,
      )
      .join("\n"),
  );
  line("");

  head("17. ACTION PLAN");
  line(
    goalsData
      .map(
        (g) =>
          `[${g.domain}] Goal: ${g.goal} | Task: ${g.task} | Responsible: ${g.responsible.join(", ")}`,
      )
      .join("\n"),
  );
  line("");

  head("18. COMMENTS");
  field("Comments", getVal("planComments"));
  
  const locList = [];
  if (document.getElementById("locSelfCare")?.checked) locList.push("Self Care");
  if (document.getElementById("locLearning")?.checked) locList.push("Learning");
  if (document.getElementById("locSelfDirection")?.checked) locList.push("Self Direction");
  if (document.getElementById("locIndependentLiving")?.checked) locList.push("Independent Living");
  if (document.getElementById("locLanguage")?.checked) locList.push("Language");
  if (document.getElementById("locMobility")?.checked) locList.push("Mobility");
  const otherDomains = getVal("locOtherDomains");
  if (otherDomains) locList.push(`Other: ${otherDomains}`);
  
  field("LOC Limitations", locList.length ? locList.join(", ") : "None Selected");
  field("Last Assessment", getVal("lastAssessment"));
  field("Last LOC Date", getVal("lastLOC"));
  field("RAS Score", getVal("rasSisScore"));
  field("PON Score", getVal("ponScore"));

  line("\n" + "═".repeat(67));
  line(`PCSP FOR: ${displayName.toUpperCase()} | DMH ID: ${displayDMH}`);

  document.getElementById("narrativeDisplay").innerText = t;
}

// ── UTILS ──
function toggleMultiSelect(id) {
  document.getElementById(id).classList.toggle("active");
}
function updateHealthParams() {
  const container = document.getElementById("healthParamsContainer");
  const tags = document.getElementById("healthParamsTags");
  const checked = container.querySelectorAll('input[type="checkbox"]:checked');
  tags.innerHTML = "";
  if (checked.length === 0) {
    tags.innerHTML = '<span class="placeholder">Select Parameters...</span>';
  } else {
    checked.forEach((cb) => {
      const tag = document.createElement("span");
      tag.className = "tag";
      tag.textContent = cb.value;
      tags.appendChild(tag);
    });
  }
  updateUI();
}
function updateLearningStyles() {
  const container = document.getElementById("learningStyleContainer");
  const tags = document.getElementById("learningStyleTags");
  const checked = container.querySelectorAll('input[type="checkbox"]:checked');
  tags.innerHTML = "";
  if (checked.length === 0) {
    tags.innerHTML = '<span class="placeholder">Select Learning Styles...</span>';
  } else {
    checked.forEach((cb) => {
      const tag = document.createElement("span");
      tag.className = "tag";
      tag.textContent = cb.value;
      tags.appendChild(tag);
    });
  }
  updateUI();
}
function toggleSignLangType() {
  document.getElementById("signLangTypeGroup").style.display =
    document.getElementById("commUsesSignLang").value === "Yes" ? "" : "none";
}
function toggleSignLangTypeOther() {
  document.getElementById("signLangTypeOtherGroup").style.display =
    document.getElementById("commSignLangType").value === "Other" ? "" : "none";
}
function toggleCommEvalFields() {
  document.getElementById("commEvalBarriersGroup").style.display =
    document.getElementById("commEvalNeeded").value.includes("Yes") ||
    document.getElementById("commEvalNeeded").value.includes("No")
      ? ""
      : "none";
}
function toggleCommChartNA(cb) {
  document.getElementById("commChartContainer").style.opacity = cb.checked
    ? "0.3"
    : "1";
  updateUI();
}
function addCommChartRow() {
  commChartRows.push({ situation: "", meaning: "", response: "" });
  renderCommChart();
  updateUI();
}
function updateCommRow(i, field, value) {
  if (commChartRows[i]) {
    commChartRows[i][field] = value;
    updateUI();
  }
}
function removeCommChartRow(i) {
  commChartRows.splice(i, 1);
  renderCommChart();
  updateUI();
}
function renderCommChart() {
  const container = document.getElementById("commChartContainer");
  if (!container) return;
  if (commChartRows.length === 0) {
    container.innerHTML = `
      <p style="font-size: 12px; color: var(--text-label); margin: 8px 0 12px">
        No communication entries added. Click below to add one.
      </p>
      <textarea id="commChartAttached" placeholder="See Attached (Optional notes...)" oninput="updateUI()"></textarea>`;
    return;
  }
  container.innerHTML = commChartRows.map((r, i) => `
    <div style="background: var(--bg-light, #f8f9fa); border: 1px solid var(--border, #ddd); border-radius: 8px; padding: 12px 14px; margin-bottom: 10px; position: relative;">
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr auto; gap: 8px; align-items: start;">
        <div>
          <label style="font-size: 11px; font-weight: 600; color: var(--text-label, #666); text-transform: uppercase; letter-spacing: 0.4px; display: block; margin-bottom: 4px;">When / Situation</label>
          <input type="text" value="${esc(r.situation)}" placeholder="e.g. Becomes agitated" oninput="updateCommRow(${i},'situation',this.value)" style="width:100%;box-sizing:border-box;">
        </div>
        <div>
          <label style="font-size: 11px; font-weight: 600; color: var(--text-label, #666); text-transform: uppercase; letter-spacing: 0.4px; display: block; margin-bottom: 4px;">Meaning</label>
          <input type="text" value="${esc(r.meaning)}" placeholder="e.g. Wants a break" oninput="updateCommRow(${i},'meaning',this.value)" style="width:100%;box-sizing:border-box;">
        </div>
        <div>
          <label style="font-size: 11px; font-weight: 600; color: var(--text-label, #666); text-transform: uppercase; letter-spacing: 0.4px; display: block; margin-bottom: 4px;">How to Respond</label>
          <input type="text" value="${esc(r.response)}" placeholder="e.g. Offer 5-min break" oninput="updateCommRow(${i},'response',this.value)" style="width:100%;box-sizing:border-box;">
        </div>
        <button onclick="removeCommChartRow(${i})" class="btn btn-danger" style="padding: 6px 10px; font-size: 12px; align-self: end; white-space: nowrap;">✕ Remove</button>
      </div>
    </div>
  `).join("");
}
function toggleNAField(f, c) {
  const el = document.getElementById(f);
  const cb = document.getElementById(c);
  el.value = cb.checked ? "N/A" : "";
  el.disabled = cb.checked;
  updateUI();
}
function toggleEthnicityOther(cb) {
  document.getElementById("ethnicityOtherGroup").style.display = cb.checked
    ? ""
    : "none";
}
function toggleReligionOther() {
  document.getElementById("religionOtherGroup").style.display =
    document.getElementById("religion").value === "Other" ? "" : "none";
}
function toggleCommMethodOther(cb) {
  document.getElementById("commMethodOtherGroup").style.display = cb.checked
    ? ""
    : "none";
}
function toggleInsuranceFields() {
  document.getElementById("spenddownGroup").style.display = document
    .getElementById("insurance")
    .value.includes("Spend Down")
    ? ""
    : "none";
  document.getElementById("privateInsuranceGroup").style.display = document
    .getElementById("insurance")
    .value.includes("Private")
    ? ""
    : "none";
}
function toggleInsuranceFieldsSec() {
  document.getElementById("spenddownGroupSec").style.display = document
    .getElementById("insuranceSec")
    .value.includes("Spend Down")
    ? ""
    : "none";
  document.getElementById("privateInsuranceGroupSec").style.display = document
    .getElementById("insuranceSec")
    .value.includes("Private")
    ? ""
    : "none";
}
function toggleDentalOther() {
  document.getElementById("dentalOtherGroup").style.display =
    document.getElementById("dentalInsurance").value.includes("Other") ||
    document.getElementById("dentalInsurance").value.includes("Private")
      ? ""
      : "none";
}
function toggleDueProcess(cb) {
  document.getElementById("dueProcessFields").style.display = cb.checked
    ? "none"
    : "";
  updateUI();
}

// (Duplicate Funding removed - using the one below)

function restoreFundingVisuals() {
  const val = document.getElementById("coverFundingType").value || "";
  document.querySelectorAll(".funding-cb").forEach((cb) => {
    cb.checked = val.includes(cb.value);
  });
  const otherMatch = val.match(/Other:\s*([^,]+)/);
  const otherCb = document.getElementById("fundingOtherCb");
  if (otherMatch || val.includes("Other:")) {
    otherCb.checked = true;
    if (otherMatch) document.getElementById("fundingOtherText").value = otherMatch[1];
  } else {
    otherCb.checked = false;
    document.getElementById("fundingOtherText").value = "";
  }
  toggleFundingOther();
}

// (Duplicate Comm Chart removed - using the one below)

function addImportantPerson() {
  importantPeople.push({ name: "", relationship: "", activities: "" });
  renderImportantPeople();
  updateUI();
}
function removeImportantPerson(i) {
  importantPeople.splice(i, 1);
  renderImportantPeople();
  updateUI();
}
function updatePerson(i, f, v) {
  importantPeople[i][f] = v;
  updateUI();
}
function renderImportantPeople() {
  const c = document.getElementById("importantPeopleContainer");
  if (!c) return;
  c.innerHTML = importantPeople
    .map(
      (p, i) => `<div class="legal-rep-card" style="margin-bottom:15px;">
        <div class="rep-header">
          <span class="rep-title">Person #${i + 1}${p.name ? " — " + esc(p.name) : ""}</span>
          <button class="remove-rep-btn" onclick="removeImportantPerson(${i})">×</button>
        </div>
        <div class="form-grid">
          <div class="field-group">
            <label>Full Name</label>
            <input type="text" placeholder="Name" value="${esc(p.name)}" oninput="updatePerson(${i},'name',this.value)">
          </div>
          <div class="field-group">
            <label>Relationship</label>
            <input type="text" placeholder="Relationship" value="${esc(p.relationship)}" oninput="updatePerson(${i},'relationship',this.value)">
          </div>
          <div class="field-group full">
            <label>Activities & Frequency (What they like to do / How often)</label>
            <textarea placeholder="e.g. Going to the movies twice a month; Sunday dinners weekly..." oninput="updatePerson(${i},'activities',this.value)">${esc(p.activities)}</textarea>
          </div>
        </div>
      </div>`,
    )
    .join("");
}


function addLegalRep() {
  legalReps.push({ name: "", relationship: "", legalType: "Full Guardianship", livesWith: "Yes", phone: "", address: "" });
  renderLegalReps();
  updateUI();
}
function removeLegalRep(i) {
  legalReps.splice(i, 1);
  renderLegalReps();
  updateUI();
}
function updateRep(i, field, value) {
  legalReps[i][field] = value;
  // Scope to legalRepsContainer to avoid colliding with importantPeople .rep-title elements
  const container = document.getElementById("legalRepsContainer");
  if (container) {
    const titles = container.querySelectorAll(".rep-title");
    if (titles[i]) titles[i].textContent = `Representative #${i + 1}${legalReps[i].name ? " — " + legalReps[i].name : ""}`;
  }
  updateUI();
}
function renderLegalReps() {
  const container = document.getElementById("legalRepsContainer");
  if (!container) return;
  
  container.innerHTML = legalReps.map((r, i) => `
    <div class="legal-rep-card">
      <div class="rep-header">
        <span class="rep-title">Representative #${i + 1}${r.name ? " — " + esc(r.name) : ""}</span>
        <button class="remove-rep-btn" onclick="removeLegalRep(${i})" title="Remove">✕</button>
      </div>
      <div class="form-grid">
        <div class="field-group">
          <label>Full Name</label>
          <input type="text" value="${esc(r.name)}" placeholder="Jane Doe" oninput="updateRep(${i},'name',this.value)">
        </div>
        <div class="field-group">
          <label>Relationship</label>
          <input type="text" value="${esc(r.relationship)}" placeholder="e.g. Mother, Brother" oninput="updateRep(${i},'relationship',this.value)">
        </div>
        <div class="field-group">
          <label>Authority Type</label>
          <select onchange="updateRep(${i},'legalType',this.value)">
            <option value="Self / Full Rights" ${r.legalType === 'Self / Full Rights' ? 'selected' : ''}>Self / Full Rights</option>
            <option value="Full Guardianship" ${r.legalType === 'Full Guardianship' ? 'selected' : ''}>Full Guardianship</option>
            <option value="Limited Guardianship" ${r.legalType === 'Limited Guardianship' ? 'selected' : ''}>Limited Guardianship</option>
            <option value="Full Conservatorship" ${r.legalType === 'Full Conservatorship' ? 'selected' : ''}>Full Conservatorship</option>
            <option value="Limited Conservatorship" ${r.legalType === 'Limited Conservatorship' ? 'selected' : ''}>Limited Conservatorship</option>
            <option value="Power of Attorney" ${r.legalType === 'Power of Attorney' ? 'selected' : ''}>Power of Attorney</option>
            <option value="Representative Payee" ${r.legalType === 'Representative Payee' ? 'selected' : ''}>Representative Payee</option>
            <option value="Physical Custody" ${r.legalType === 'Physical Custody' ? 'selected' : ''}>Physical Custody</option>
            <option value="Legal Custody" ${r.legalType === 'Legal Custody' ? 'selected' : ''}>Legal Custody</option>
          </select>
        </div>
        <div class="field-group">
          <label>Lives with Individual?</label>
          <select onchange="updateRep(${i},'livesWith',this.value)">
            <option value="Yes" ${r.livesWith === 'Yes' ? 'selected' : ''}>Yes</option>
            <option value="No" ${r.livesWith === 'No' ? 'selected' : ''}>No</option>
          </select>
        </div>
        <div class="field-group">
          <label>Phone Number</label>
          <input type="text" value="${esc(r.phone)}" placeholder="(573) 555-0100" oninput="updateRep(${i},'phone',this.value)">
        </div>
        <div class="field-group">
          <label>Address / Contact Note</label>
          <input type="text" value="${esc(r.address)}" placeholder="Address if different" oninput="updateRep(${i},'address',this.value)">
        </div>
      </div>
    </div>
  `).join("");
}
function getLegalRepsNarrative() {
  if (!legalReps.length) return "  None on file.";
  return legalReps.map((rep, i) =>
    `  Rep #${i + 1}: ${rep.name || "[Name not provided]"} | ${rep.legalType} | Relationship: ${rep.relationship || "N/A"} | Lives with individual: ${rep.livesWith} | Phone: ${rep.phone || "N/A"}${rep.address && rep.livesWith !== "Yes" ? " | Address: " + rep.address : ""}`
  ).join("\n");
}
function captureLegalReps()   { return JSON.parse(JSON.stringify(legalReps)); }
function restoreLegalReps(d)  { legalReps = Array.isArray(d) ? d : []; renderLegalReps(); }

// ── PERSISTENCE ──
function captureFormData() {
  const fd = {
    _goalsData: goalsData,
    _clinicalGoalsTasks: clinicalGoalsTasks,
    _programServices: programServices,
    _legalReps: legalReps,
    _commChartRows: commChartRows,
    _importantPeople: importantPeople,
    _coverPhotoData: _coverPhotoData,
    _learningStyles: Array.from(document.querySelectorAll('#learningStyleContainer input[type="checkbox"]:checked')).map(cb => cb.value),
    _healthParams: Array.from(document.querySelectorAll('#healthParamsContainer input[type="checkbox"]:checked')).map(cb => cb.value),
    _communityReferrals: Array.from(document.querySelectorAll('.referral-cb:checked')).map(cb => cb.value),
  };
  FORM_FIELDS.forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      if (el.type === "checkbox") {
        fd[id] = el.checked;
      } else {
        fd[id] = el.value;
      }
    }
  });
  return fd;
}
function restoreFormData(fd) {
  if (!fd) return;
  FORM_FIELDS.forEach((id) => {
    const el = document.getElementById(id);
    if (el && fd[id] !== undefined) {
      if (el.type === "checkbox") {
        el.checked = !!fd[id];
      } else {
        el.value = fd[id];
      }
    }
  });
  goalsData = fd._goalsData || [];
  clinicalGoalsTasks = fd._clinicalGoalsTasks || [];
  programServices = fd._programServices || [];
  legalReps = fd._legalReps || [];
  commChartRows = fd._commChartRows || [];
  importantPeople = fd._importantPeople || [];
  _coverPhotoData = fd._coverPhotoData;
  if (_coverPhotoData) {
    document.getElementById("coverPhoto").src = _coverPhotoData;
    document.getElementById("coverPhoto").style.display = "block";
    document.getElementById("photoPlaceholder").style.display = "none";
  }
  restoreFundingVisuals();
  renderGoals();
  renderGoalTasks();
  renderProgramServices();
  renderLegalReps();
  renderCommChart();
  renderImportantPeople();

  // Restore checkboxes
  if (Array.isArray(fd._learningStyles)) {
    document.querySelectorAll('#learningStyleContainer input[type="checkbox"]').forEach(cb => {
      cb.checked = fd._learningStyles.includes(cb.value);
    });
    updateLearningStyles();
  }
  if (Array.isArray(fd._healthParams)) {
    document.querySelectorAll('#healthParamsContainer input[type="checkbox"]').forEach(cb => {
      cb.checked = fd._healthParams.includes(cb.value);
    });
    updateHealthParams();
  }
  if (Array.isArray(fd._communityReferrals)) {
    document.querySelectorAll('.referral-cb').forEach(cb => {
      cb.checked = fd._communityReferrals.includes(cb.value);
    });
  }

  updateUI();
  toggleTransitionFields(); // Ensure section 13 visibility is correct
}

function saveToHistory() {
  const drafts = JSON.parse(localStorage.getItem("pcsp_drafts") || "[]");
  const name =
    document.getElementById("coverLegalName").value || "Unnamed Plan";
  drafts.unshift({
    id: Date.now(),
    title: name,
    date: new Date().toLocaleDateString(),
    formData: captureFormData(),
  });
  localStorage.setItem("pcsp_drafts", JSON.stringify(drafts.slice(0, 20)));
  renderHistory();
}
function renderHistory() {
  const drafts = JSON.parse(localStorage.getItem("pcsp_drafts") || "[]");
  document.getElementById("historyList").innerHTML = drafts
    .map(
      (d) =>
        `<div class="history-item" onclick="viewDraft(${d.id})">${esc(d.title)} (${d.date})</div>`,
    )
    .join("");
}
function viewDraft(id) {
  const drafts = JSON.parse(localStorage.getItem("pcsp_drafts") || "[]");
  const d = drafts.find((x) => x.id === id);
  if (d && confirm("Load draft?")) restoreFormData(d.formData);
}

// ── PASSWORD
function checkPass() {
  const val = document.getElementById("passInput").value;
  const err = document.getElementById("errorMsg");
  if (val === "MCSDD22") {
    // Transition to Welcome/README screen instead of app immediately
    document.getElementById("lockScreen").classList.add("fade-out");
    setTimeout(() => {
      document.getElementById("lockScreen").style.display = "none";
      document.getElementById("welcomeScreen").style.display = "flex";
    }, 700);
  } else {
    err.textContent = "Invalid access code. Please try again.";
    document.getElementById("passInput").value = "";
    document.getElementById("passInput").focus();
  }
}

function launchApp() {
  const welcome = document.getElementById("welcomeScreen");
  welcome.style.opacity = "0";
  welcome.style.transition = "opacity 0.5s ease";
  setTimeout(() => {
    welcome.style.display = "none";
    document.getElementById("appContainer").style.display = "grid";
    init(); // Ensure UI is fresh
  }, 500);
}

document.getElementById("passInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") checkPass();
});

// ── EXPORT / IMPORT / PRINT / COPY ──
function showToast(msg, type = "success") {
  const t = document.getElementById("toast");
  if (!t) {
    alert(msg);
    return;
  }
  t.textContent = msg;
  t.className = `toast show ${type}`;
  setTimeout(() => {
    t.className = "toast";
  }, 3000);
}

function copyToClipboard() {
  const narrative = document.getElementById("narrativeDisplay").innerText;
  navigator.clipboard
    .writeText(narrative)
    .then(() => {
      showToast("Copied to clipboard!", "success");
    })
    .catch((err) => {
      alert("Failed to copy text. " + err);
    });
}

function printPlan() {
  window.print();
}

function exportPCSP() {
  const data = captureFormData();
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  const name = document.getElementById("coverLegalName")
    ? document.getElementById("coverLegalName").value.trim()
    : "";
  const filename = name
    ? `${name.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_plan.pcsp`
    : "draft_plan.pcsp";

  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showToast("Exported .pcsp successfully!", "success");
}

function importPCSP(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const data = JSON.parse(e.target.result);
      restoreFormData(data);
      showToast("Loaded .pcsp successfully!", "success");
    } catch (err) {
      showToast("Invalid .pcsp file. Could not parse data.", "error");
    }
    // reset input so same file can be loaded again if needed
    event.target.value = "";
  };
  reader.readAsText(file);
}

// ── DRAG AND DROP HANDLING ──
document.addEventListener("dragover", (e) => {
  e.preventDefault();
  e.stopPropagation();
});

document.addEventListener("drop", (e) => {
  e.preventDefault();
  e.stopPropagation();

  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
    const file = e.dataTransfer.files[0];
    if (file.name.endsWith(".pcsp") || file.name.endsWith(".json")) {
      const reader = new FileReader();
      reader.onload = function (evt) {
        try {
          const data = JSON.parse(evt.target.result);
          restoreFormData(data);
          showToast("Loaded .pcsp from drag-and-drop!", "success");
        } catch (err) {
          showToast("Invalid .pcsp file format.", "error");
        }
      };
      reader.readAsText(file);
    }
  }
});

// ── BOOT ──
function init() {
  renderHistory();
  renderGoalTasks();
  renderGoals();
  renderProgramServices();
  renderLegalReps();
  renderCommChart();
  renderImportantPeople();
  updateUI();
}
init();

// ── FUNDING CHECKBOX HELPERS ──
function syncFundingCheckboxes() {
  const checked = [...document.querySelectorAll(".funding-cb:checked")].map(cb => cb.value);
  const otherText = document.getElementById("fundingOtherText");
  if (checked.includes("Other") && otherText && otherText.value.trim()) {
    const idx = checked.indexOf("Other");
    checked[idx] = "Other: " + otherText.value.trim();
  }
  // Store combined value in hidden field for narrative / save
  const hidden = document.getElementById("coverFundingType");
  if (hidden) {
    hidden.value = checked.join(", ");
  }
}
function toggleFundingOther() {
  const cb = document.getElementById("fundingOtherCb");
  const group = document.getElementById("fundingOtherGroup");
  if (group) group.style.display = cb && cb.checked ? "" : "none";
}
function restoreFundingVisuals() {
  const hidden = document.getElementById("coverFundingType");
  if (!hidden || !hidden.value) return;
  const values = hidden.value.split(",").map(v => v.trim());
  document.querySelectorAll(".funding-cb").forEach(cb => {
    cb.checked = values.some(v => v === cb.value || (v.startsWith("Other:") && cb.value === "Other"));
  });
  const otherVal = values.find(v => v.startsWith("Other: "));
  if (otherVal) {
    const otherText = document.getElementById("fundingOtherText");
    if (otherText) {
      otherText.value = otherVal.replace("Other: ", "");
      const group = document.getElementById("fundingOtherGroup");
      if (group) group.style.display = "";
    }
  }
}

// ── AUTOSAVE (every 20 minutes) ──
setInterval(() => {
  saveToHistory();
  showToast("Auto-saved draft ✓", "success");
}, 20 * 60 * 1000);
