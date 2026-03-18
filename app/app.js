// ─────────────────────────────────────────────
//  PCSP Assistant Pro | Marion County DMH
//  app.js v3.0 — High-Fidelity Revision
// ─────────────────────────────────────────────

const APP_NAME    = "PCSP Assistant Pro";
const APP_VERSION = "3.0";
const DRAFT_LIMIT = 20;
const DRAFT_EXPIRY_DAYS = 30;
const SESSION_TIMEOUT_MINS = 30;

// ── DATA STRUCTURES ──
let legalReps = [];
let commChartRows = [];
let importantPeople = [];
let goalsData = []; // Section 9: Action Plan
let clinicalGoalsTasks = []; // Section 2: Goals/Tasks
let _coverPhotoData = null;

// ── All form field IDs (used for save/restore) ──
const FORM_FIELDS = [
  // Section 0 — Cover
  "coverLegalName","clientNickname","clientDOB","coverDmhID","coverFundingType","coverMeetingDate","coverImplDate","coverHomeName",
  // Section 1 — Demographics
  "coordinator","officeType","maritalStatus","voterStatus","religion","religionOther",
  "nativeLanguage","otherLanguages","commMethod",
  "insurance","spenddownAmount","privateInsuranceProvider","dentalInsurance","dentalOther",
  "residencyType","residenceNotes",
  "schoolName","educationStatus",
  "employmentStatus","employmentJob",
  "lastAssessment","lastLOC","rasSisScore",
  // Section 2 — Goals/Tasks & Admin
  "planEffectiveDate","planReviewDate","waiverType","contributors","participation","scFrequency","payeeInfo","burialInfo",
  // Section 3 — Likes/Dislikes
  "likesActivities","likesFoods","likesPlaces","likesOther",
  "dislikesActivities","dislikesFoods","dislikesOther",
  // Section 4
  "relationshipsExplore",
  // Section 5
  "aspirations","concerns",
  // Section 6 — Health
  "diagnosis","personalOutcomes","hrstStatus","telehealth","medHistory",
  "pcpName","specialists","preventionDiet",
  "medicationDetails","psychotropicProtocol","selfAdmin",
  "healthRisks","evacPlan","dnrStatus","riskLevel","supervisionLevel",
  "behavioralStatus","oshaPrecaution","allergies",
  // Section 7 — Legal
  "legalSpecify","limitedGuardianshipDetails","legalLicensesProbation",
  "rightsBrochure","consents","serviceSatisfaction","conflictInfo",
  "dpInvitation","dpDescription","dpLessIntrusive","dpHistorical",
  "dpTeaching","dpLiftingCriteria","dpMonitoring",
  // Section 8 — Communication
  "commPrimaryLanguage","commUsesSignLang","commSignLangType","commSignLangTypeOther",
  "commMethodOther","commMethodNotes",
  "commEvalNeeded","commEvalBarriers","commChartAttached","commSeeAttached",
  // Misc
  "ethnicityOther"
];

function esc(str) {
  return String(str || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

// ── PHOTO HANDLING ──
function handlePhotoUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    _coverPhotoData = e.target.result;
    const img = document.getElementById("coverPhoto");
    img.src = _coverPhotoData; img.style.display = "block";
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
  clinicalGoalsTasks.push({ id: Date.now(), goal:"", task:"", progress:"", meaning:"", strengths:"", tech:"", relationships:"", resources:"" });
  renderGoalTasks();
  updateUI();
}
function removeGoalTask(id) { clinicalGoalsTasks = clinicalGoalsTasks.filter(g => g.id !== id); renderGoalTasks(); updateUI(); }
function updateGoalTaskField(id, field, val) { const g = clinicalGoalsTasks.find(x => x.id === id); if (g) g[field] = val; updateUI(); }
function renderGoalTasks() {
  const container = document.getElementById("dynamicGoalsTasksContainer");
  if (!container) return;
  if (!clinicalGoalsTasks.length) { container.innerHTML = '<p style="font-size: 12px; color: var(--text-label); margin: 8px 0 12px">No goals/tasks added.</p>'; return; }
  container.innerHTML = clinicalGoalsTasks.map((g, idx) => `
    <div class="legal-rep-card" style="border-left: 3px solid var(--gold); margin-bottom:15px;">
      <div class="rep-header"><span class="rep-title">Goal/Task #${idx+1}</span><button class="remove-rep-btn" onclick="removeGoalTask(${g.id})">×</button></div>
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
    </div>`).join("");
}

// ── SECTION 8: COMMUNICATION ──
function addCommEvalDate() {
  const container = document.getElementById("commEvalDatesContainer");
  const input = document.createElement("input");
  input.type = "date"; input.className = "comm-eval-date";
  input.oninput = () => updateUI(); input.style.marginBottom = "8px";
  container.appendChild(input);
}
function getCommEvalDates() {
  return Array.from(document.querySelectorAll(".comm-eval-date")).map(el => el.value).filter(v => v).join(", ") || "None Listed";
}

// ── SECTION 9: ACTION PLAN ──
function addGoal() {
  goalsData.push({ id: Date.now(), domain: "Health/Wellness", goal: "", task: "", responsible: [], frequency: [] });
  renderGoals();
  updateUI();
}
function removeGoal(id) { goalsData = goalsData.filter(g => g.id !== id); renderGoals(); updateUI(); }
function updateGoalField(id, field, val) { const g = goalsData.find(x => x.id === id); if (g) g[field] = val; updateUI(); }
function toggleGoalArrayField(id, field, val) {
  const g = goalsData.find(x => x.id === id);
  if (g) {
    if (!g[field]) g[field] = [];
    const idx = g[field].indexOf(val);
    if (idx > -1) g[field].splice(idx, 1); else g[field].push(val);
  }
  updateUI();
}
function renderGoals() {
  const container = document.getElementById("goalsContainer");
  if (!container) return;
  if (!goalsData.length) { container.innerHTML = '<p style="font-size: 13px; color: var(--text-label);">No action items added.</p>'; return; }
  container.innerHTML = goalsData.map((goal, idx) => `
    <div class="legal-rep-card" style="margin-bottom:15px;">
      <div class="rep-header"><span class="rep-title">Action Item #${idx+1}</span><button class="remove-rep-btn" onclick="removeGoal(${goal.id})">×</button></div>
      <div class="form-grid">
        <div class="field-group"><label>Domain</label>
          <select onchange="updateGoalField(${goal.id},'domain',this.value)">
            <option value="Health/Wellness" ${goal.domain==="Health/Wellness"?"selected":""}>Health/Wellness</option>
            <option value="Community" ${goal.domain==="Community"?"selected":""}>Community</option>
            <option value="Social" ${goal.domain==="Social"?"selected":""}>Social</option>
            <option value="Employment" ${goal.domain==="Employment"?"selected":""}>Employment</option>
            <option value="Independence" ${goal.domain==="Independence"?"selected":""}>Independence</option>
            <option value="Education" ${goal.domain==="Education"?"selected":""}>Education</option>
            <option value="Other" ${goal.domain==="Other"?"selected":""}>Other</option>
          </select>
        </div>
        <div class="field-group full"><label>Goal (Outcome)</label><textarea oninput="updateGoalField(${goal.id},'goal',this.value)">${esc(goal.goal)}</textarea></div>
        <div class="field-group full"><label>Task</label><input type="text" value="${esc(goal.task)}" oninput="updateGoalField(${goal.id},'task',this.value)"></div>
        <div class="field-group"><label>Responsible Person(s)</label>
          <div style="display:flex; flex-wrap:wrap; gap:5px;">
            ${["Individual", "Guardian", "SC", "Provider", "Family"].map(p => `
              <label class="eth-check" style="font-size:10px;"><input type="checkbox" ${goal.responsible.includes(p)?"checked":""} onchange="toggleGoalArrayField(${goal.id},'responsible','${p}')"> ${p}</label>
            `).join("")}
          </div>
        </div>
        <div class="field-group"><label>Frequency</label>
          <div style="display:flex; flex-wrap:wrap; gap:5px;">
            ${["Monthly", "Quarterly", "Annually", "As Needed", "Weekly"].map(f => `
              <label class="eth-check" style="font-size:10px;"><input type="checkbox" ${goal.frequency.includes(f)?"checked":""} onchange="toggleGoalArrayField(${goal.id},'frequency','${f}')"> ${f}</label>
            `).join("")}
          </div>
        </div>
      </div>
    </div>`).join("");
}

// ── THEME ──
(function applyTheme() { const saved = localStorage.getItem("pcsp_theme") || "light"; document.documentElement.setAttribute("data-theme", saved); })();
function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("pcsp_theme", next);
}

// ── UI UPDATE & NARRATIVE ──
function updateUI() {
  const isPrivacyOn = document.getElementById("privacyToggle").checked;
  const getVal = (id) => { const el = document.getElementById(id); return el ? el.value : ""; };
  const name = getVal("coverLegalName"), nick = getVal("clientNickname"), dob = getVal("clientDOB"), dmhID = getVal("coverDmhID");

  document.getElementById("headerName").textContent = name ? (nick ? `${name} ("${nick}")` : name) : "No Individual Selected";
  document.getElementById("headerDOB").textContent = dob ? new Date(dob + "T00:00:00").toLocaleDateString() : "—";
  document.getElementById("headerDMH").textContent = dmhID || "—";

  // Executive Cover (Print)
  const printImg = document.getElementById("printPhotoImg");
  if (_coverPhotoData && !isPrivacyOn) { printImg.src = _coverPhotoData; printImg.style.display = "block"; document.getElementById("printPhotoPlaceholder").style.display = "none"; }
  else { printImg.style.display = "none"; document.getElementById("printPhotoPlaceholder").style.display = "block"; }

  const displayName = isPrivacyOn ? "[INDIVIDUAL]" : (name ? (nick ? `${name} ("${nick}")` : name) : "[NAME]");
  const displayDMH = isPrivacyOn ? "[XXXXXXX]" : (dmhID || "N/A");

  document.getElementById("printName").textContent = displayName.toUpperCase();
  document.getElementById("printDMH").textContent = displayDMH;
  document.getElementById("printFunding").textContent = (getVal("coverFundingType") || getVal("waiverType") || "Not Specified").toUpperCase();
  document.getElementById("printImplDate").textContent = getVal("coverImplDate") || "TBD";
  document.getElementById("printMeetingDate").textContent = getVal("coverMeetingDate") || "TBD";
  document.getElementById("printCaseManager").textContent = (getVal("coordinator") || "TBD").toUpperCase();
  document.getElementById("printHome").textContent = (getVal("coverHomeName") || "N/A").toUpperCase();

  // Narrative Build
  let t = "";
  const line = (s) => { t += s + "\n"; };
  const head = (s) => { line(s); line("─".repeat(67)); line(""); };
  const field = (l, v) => line(`${l}: ${v || "N/A"}`);

  line("PERSON CENTERED SERVICE PLAN (PCSP) — COVER SHEET");
  line("Marion County Services for the Developmentally Disabled");
  line("═".repeat(67)); line("");
  field("INDIVIDUAL NAME", displayName.toUpperCase());
  field("DMH ID #", displayDMH);
  field("FUNDING", getVal("coverFundingType").toUpperCase());
  line("\nMISSOURI PCSP OFFICIAL DOCUMENT\n" + "═".repeat(67) + "\n");

  head("1. DEMOGRAPHICS");
  field("TCM Agency", getVal("coordinator"));
  field("Marital", getVal("maritalStatus"));
  field("Residency", getVal("residencyType"));
  line("");

  head("2. GOALS / TASKS");
  line(clinicalGoalsTasks.map((g,i) => `Entry #${i+1}: Goal: ${g.goal} | Task: ${g.task} | Progress: ${g.progress}`).join("\n"));
  line("");
  field("Effective Date", getVal("planEffectiveDate"));
  field("Review Date", getVal("planReviewDate"));
  line("");

  head("4. IMPORTANT PEOPLE");
  line(importantPeople.map(p => `  ${p.name} (${p.relationship})`).join("\n") || "  None Listed");
  field("Exploratory Relationships", getVal("relationshipsExplore"));
  line("");

  head("5. HOPES, DREAMS, WANTS AND CONCERNS");
  field("Aspirations", getVal("aspirations"));
  field("Concerns", getVal("concerns"));
  line("");

  head("8. COMMUNICATION");
  field("Primary Language", getVal("commPrimaryLanguage"));
  field("Evaluations Filed", getCommEvalDates());
  if (document.getElementById("commSeeAttached").checked) line("[SEE ATTACHED CLINICAL CHART]");
  line("");

  head("9. ACTION PLAN");
  line(goalsData.map(g => `[${g.domain}] Goal: ${g.goal} | Task: ${g.task} | Responsible: ${g.responsible.join(", ")}`).join("\n"));

  line("\n" + "═".repeat(67));
  line(`PCSP FOR: ${displayName.toUpperCase()} | DMH ID: ${displayDMH}`);

  document.getElementById("narrativeDisplay").innerText = t;
}

// ── UTILS ──
function toggleMultiSelect(id) { document.getElementById(id).classList.toggle("active"); }
function toggleSignLangType() { document.getElementById("signLangTypeGroup").style.display = document.getElementById("commUsesSignLang").value === "Yes" ? "" : "none"; }
function toggleSignLangTypeOther() { document.getElementById("signLangTypeOtherGroup").style.display = document.getElementById("commSignLangType").value === "Other" ? "" : "none"; }
function toggleCommEvalFields() { document.getElementById("commEvalBarriersGroup").style.display = (document.getElementById("commEvalNeeded").value.includes("Yes") || document.getElementById("commEvalNeeded").value.includes("No")) ? "" : "none"; }
function toggleCommChartNA(cb) { document.getElementById("commChartContainer").style.opacity = cb.checked ? "0.3" : "1"; }
function toggleNAField(f,c) { const el=document.getElementById(f); const cb=document.getElementById(c); el.value=cb.checked?"N/A":""; el.disabled=cb.checked; updateUI(); }
function toggleEthnicityOther(cb) { document.getElementById("ethnicityOtherGroup").style.display = cb.checked ? "" : "none"; }
function toggleReligionOther() { document.getElementById("religionOtherGroup").style.display = document.getElementById("religion").value === "Other" ? "" : "none"; }
function toggleInsuranceFields() { 
  document.getElementById("spenddownGroup").style.display = document.getElementById("insurance").value.includes("Spend Down") ? "" : "none";
  document.getElementById("privateInsuranceGroup").style.display = document.getElementById("insurance").value.includes("Private") ? "" : "none";
}
function toggleDentalOther() { document.getElementById("dentalOtherGroup").style.display = document.getElementById("dentalInsurance").value.includes("Other") || document.getElementById("dentalInsurance").value.includes("Private") ? "" : "none"; }
function toggleDueProcess(cb) { document.getElementById("dueProcessFields").style.display = cb.checked ? "none" : ""; updateUI(); }

function addCommChartRow() { commChartRows.push({situation:"",meaning:"",response:""}); renderCommChart(); }
function removeCommChartRow(i) { commChartRows.splice(i,1); renderCommChart(); updateUI(); }
function updateCommRow(i,f,v) { commChartRows[i][f]=v; updateUI(); }
function renderCommChart() {
  const c = document.getElementById("commChartContainer");
  if (!commChartRows.length) { c.innerHTML = '<div class="field-group full"><label class="eth-check"><input type="checkbox" id="commSeeAttached" onchange="updateUI()"> <strong>SEE ATTACHED</strong></label></div>'; return; }
  c.innerHTML = commChartRows.map((r,i) => `<div style="display:grid;grid-template-columns:1fr 1fr 1fr auto;gap:5px;margin-bottom:5px;">
    <textarea placeholder="When..." oninput="updateCommRow(${i},'situation',this.value)">${esc(r.situation)}</textarea>
    <textarea placeholder="Meaning..." oninput="updateCommRow(${i},'meaning',this.value)">${esc(r.meaning)}</textarea>
    <textarea placeholder="Response..." oninput="updateCommRow(${i},'response',this.value)">${esc(r.response)}</textarea>
    <button onclick="removeCommChartRow(${i})">×</button></div>`).join("");
}

function addImportantPerson() { importantPeople.push({name:"",relationship:""}); renderImportantPeople(); updateUI(); }
function removeImportantPerson(i) { importantPeople.splice(i,1); renderImportantPeople(); updateUI(); }
function updatePerson(i,f,v) { importantPeople[i][f]=v; updateUI(); }
function renderImportantPeople() {
  const c = document.getElementById("importantPeopleContainer");
  c.innerHTML = importantPeople.map((p,i) => `<div class="form-grid" style="margin-bottom:10px;">
    <input type="text" placeholder="Name" value="${esc(p.name)}" oninput="updatePerson(${i},'name',this.value)">
    <input type="text" placeholder="Relationship" value="${esc(p.relationship)}" oninput="updatePerson(${i},'relationship',this.value)">
    <button class="remove-rep-btn" onclick="removeImportantPerson(${i})">×</button></div>`).join("");
}

function addLegalRep() { legalReps.push({name:"",relationship:"",legalType:"Full Guardianship"}); renderLegalReps(); updateUI(); }
function removeLegalRep(i) { legalReps.splice(i,1); renderLegalReps(); updateUI(); }
function updateRep(i,f,v) { legalReps[i][f]=v; updateUI(); }
function renderLegalReps() {
  const c = document.getElementById("legalRepsContainer");
  c.innerHTML = legalReps.map((r,i) => `<div class="legal-rep-card"><div class="rep-header"><span>Rep #${i+1}</span><button onclick="removeLegalRep(${i})">×</button></div>
    <div class="form-grid"><input type="text" placeholder="Name" value="${esc(r.name)}" oninput="updateRep(${i},'name',this.value)">
    <input type="text" placeholder="Relation" value="${esc(r.relationship)}" oninput="updateRep(${i},'relationship',this.value)"></div></div>`).join("");
}

// ── PERSISTENCE ──
function captureFormData() {
  const fd = { _goalsData: goalsData, _clinicalGoalsTasks: clinicalGoalsTasks, _legalReps: legalReps, _commChartRows: commChartRows, _importantPeople: importantPeople, _coverPhotoData: _coverPhotoData };
  FORM_FIELDS.forEach(id => { const el = document.getElementById(id); if (el) fd[id] = el.value; });
  return fd;
}
function restoreFormData(fd) {
  if (!fd) return;
  FORM_FIELDS.forEach(id => { const el = document.getElementById(id); if (el && fd[id]!==undefined) el.value = fd[id]; });
  goalsData = fd._goalsData || [];
  clinicalGoalsTasks = fd._clinicalGoalsTasks || [];
  legalReps = fd._legalReps || [];
  commChartRows = fd._commChartRows || [];
  importantPeople = fd._importantPeople || [];
  _coverPhotoData = fd._coverPhotoData;
  if (_coverPhotoData) { document.getElementById("coverPhoto").src = _coverPhotoData; document.getElementById("coverPhoto").style.display="block"; document.getElementById("photoPlaceholder").style.display="none"; }
  renderGoals(); renderGoalTasks(); renderLegalReps(); renderCommChart(); renderImportantPeople(); updateUI();
}

function saveToHistory() {
  const drafts = JSON.parse(localStorage.getItem("pcsp_drafts") || "[]");
  const name = document.getElementById("coverLegalName").value || "Unnamed Plan";
  drafts.unshift({ id: Date.now(), title: name, date: new Date().toLocaleDateString(), formData: captureFormData() });
  localStorage.setItem("pcsp_drafts", JSON.stringify(drafts.slice(0,20)));
  renderHistory();
}
function renderHistory() {
  const drafts = JSON.parse(localStorage.getItem("pcsp_drafts") || "[]");
  document.getElementById("historyList").innerHTML = drafts.map(d => `<div class="history-item" onclick="viewDraft(${d.id})">${esc(d.title)} (${d.date})</div>`).join("");
}
function viewDraft(id) { const drafts = JSON.parse(localStorage.getItem("pcsp_drafts") || "[]"); const d = drafts.find(x => x.id === id); if (d && confirm("Load draft?")) restoreFormData(d.formData); }

// ── BOOT ──
function init() {
  renderHistory(); renderGoalTasks(); renderGoals(); renderLegalReps(); renderCommChart(); renderImportantPeople();
  updateUI();
}
init();
