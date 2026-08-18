// ─────────────────────────────────────────────
//  PCSP Assistant Pro | Marion County DMH
//  app.js v3.0 — High-Fidelity Revision
//  © 2024-2026 DTE Solutions. All Rights Reserved.
//  Trade Secret & Intellectual Property of Drew.
// ─────────────────────────────────────────────

const APP_NAME = "PCSP Assistant Pro";
const APP_VERSION = "3.0";
const DRAFT_LIMIT = 20;
const DRAFT_EXPIRY_DAYS = 30;
const SESSION_TIMEOUT_MINS = 30;

// ── DATA STRUCTURES ──
let employmentEntries = []; 
let legalReps = [];
let commChartRows = [];
let importantPeople = [];
let programServices = []; // Section 7: Program Services
let currentSupports = []; // Section 9: Current Services
let linkingSupports = []; // Section 9: Linking Services
let goalsData = []; // Section 9: Action Plan
let clinicalGoalsTasks = []; // Section 2: Goals/Tasks
let dueProcessItems = []; // Section 15: Due Process
let meetingAttendees = []; // Section 18: Meeting Attendees
let _coverPhotoData = null;

// ── SECURITY STATE ──
let _sessionKey = null;
let _vaultConfig = null; // { salt: base64, challenge: base64 }

const Security = {
  ITERATIONS: 100000,
  ALGO: "AES-GCM",
  KEY_LEN: 256,

  // 1. Derive a 256-bit key from password + salt
  async deriveKey(password, salt) {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      encoder.encode(password),
      "PBKDF2",
      false,
      ["deriveBits", "deriveKey"]
    );
    return crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: salt,
        iterations: this.ITERATIONS,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: this.ALGO, length: this.KEY_LEN },
      false,
      ["encrypt", "decrypt"]
    );
  },

  // 2. Encrypt JSON data returning base64 string
  async encrypt(data, password) {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await this.deriveKey(password, salt);
    
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(JSON.stringify(data));
    
    const ciphertext = await crypto.subtle.encrypt(
      { name: this.ALGO, iv: iv },
      key,
      encodedData
    );

    // Combine: [salt (16)] + [iv (12)] + [ciphertext]
    const combined = new Uint8Array(salt.length + iv.length + ciphertext.byteLength);
    combined.set(salt, 0);
    combined.set(iv, salt.length);
    combined.set(new Uint8Array(ciphertext), salt.length + iv.length);
    
    return "PCSPv3:" + btoa(String.fromCharCode(...combined));
  },

  // 3. Decrypt base64 string returning JSON object
  async decrypt(encryptedString, password) {
    if (!encryptedString.startsWith("PCSPv3:")) throw new Error("Invalid encryption signature");
    
    const combined = new Uint8Array(
      atob(encryptedString.replace("PCSPv3:", ""))
        .split("")
        .map((c) => c.charCodeAt(0))
    );

    const salt = combined.slice(0, 16);
    const iv = combined.slice(16, 28);
    const ciphertext = combined.slice(28);

    const key = await this.deriveKey(password, salt);
    
    try {
      const decrypted = await crypto.subtle.decrypt(
        { name: this.ALGO, iv: iv },
        key,
        ciphertext
      );
      return JSON.parse(new TextDecoder().decode(decrypted));
    } catch (e) {
      throw new Error("Decryption failed. Check password integrity.");
    }
  },

  // 4. UX Strength Logic
  getStrength(pass) {
    if (!pass) return { label: "", color: "" };
    let score = 0;
    if (pass.length > 8) score++;
    if (pass.length > 12) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score < 3) return { label: "Weak", color: "#ff4d4d" };
    if (score < 5) return { label: "Medium", color: "#ffd700" };
    return { label: "Strong", color: "#00ff9d" };
  }
};

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
  "communityInvolvement",
  "communityBarriers",
  // Section 7 - Global Identifiers
  "stateMedicaidId",
  "dddCaseNumber",
  "regionalOfficeCode",
  "caseManagerName",
  "caseManagerEmail",
  "caseManagerNPI",
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
  "contributors",
  // Section 8 - Medical
  "diagnosis",
  "medicationDetails",
  "medHistory",
  "pcpName",
  // Section 9 - Community Support
  "nonDivisionalWaiverStatus",
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
  "behavioralNotes",
  // Section 15 - Supervision
  "alteredSupervision",
  "sup_chemicals", "risk_chemicals",
  "sup_cooking", "risk_cooking",
  "sup_911", "risk_911",
  "sup_emerg_procedures", "risk_emerg_procedures",
  "sup_stranger", "risk_stranger",
  "sup_emerg_safety", "risk_emerg_safety",
  "sup_choking_risk", "risk_choking_risk",
  "sup_mobility_falls", "risk_mobility_falls",
  "sup_probation", "risk_probation",
  "sup_criminal_behavior", "risk_criminal_behavior",
  "oshaPrecaution",
  "backupPlan",
  "staffSupportNeeds",
  "needsEmergencyAssistance",
  "emergencyAssistanceDetails",
  "leaseDateRenew",
  "leaseLocation",
  "hcbsRule1Choice",
  "hcbsRule2Privacy",
  "hcbsRule3Support",
  "homeLifeNotes",
  // Section 18 - Comments & Clinical Summary
  "lastAssessment",
  "lastLOC",
  "hasChoices",
  "choicesDescription",
  "tcsmSatisfactionSurvey",
  "sdsAwareness",
  "sdsInterest",
  "dissentingOpinions",
  "attachmentsIncluded",
  "attachmentsDetails",
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
  "evalVineland",
  "evalVinelandDate",
  "evalAbas",
  "evalAbasDate",
  "evalMocabi",
  "evalMocabiDate",
  "evalMaas",
  "evalMaasDate",
  "evalOther",
  "evalOtherText",
  "evalOtherDate",
  "burialPlanBurial",
  "burialPlanCremation",
  "burialFinancialAllocations",
  "burialSavingsPlan",
  "clientDidNotAttend",
  "clientDidNotAttendReason",
  "meetingFormat",
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

// ── SECTION 2 / 16: GOALS/TASKS ──
function addGoalTask() {
  clinicalGoalsTasks.push({
    id: Date.now(),
    goal: "",
    task: "",
    progress: "",
    continued: "",
    continuedWhy: "",
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
        <div class="field-group"><label>Continued Status</label>
          <select onchange="updateGoalTaskField(${g.id},'continued',this.value)">
            <option value="">Select...</option>
            <option value="Continued" ${g.continued === 'Continued' ? 'selected' : ''}>Continued</option>
            <option value="Not Continued" ${g.continued === 'Not Continued' ? 'selected' : ''}>Not Continued</option>
          </select>
        </div>
        <div class="field-group half"><label>Why (Reasoning)</label><input type="text" value="${esc(g.continuedWhy)}" oninput="updateGoalTaskField(${g.id},'continuedWhy',this.value)"></div>
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
    justification: "",
    hcbs1: "",
    hcbs2: "",
    hcbs3: "",
    hcbs4: "",
  });
  renderProgramServices();
  updateUI();
}
function removeProgramService(id) {
  programServices = programServices.filter((p) => p.id !== id);
  renderProgramServices();
  updateUI();
}

// ── SECTION 9: COMMUNITY NATURAL AND NON-DIVISION SUPPORT ──
function addSupport(type) {
  const list = type === 'current' ? currentSupports : linkingSupports;
  list.push({
    id: Date.now(),
    type: "Community",
    description: "",
    purpose: "",
    frequency: "",
    enrollmentInfo: ""
  });
  renderSupports(type);
  updateUI();
}

function updateSupportField(id, type, field, val) {
  const list = type === 'current' ? currentSupports : linkingSupports;
  const s = list.find(x => x.id === id);
  if (s) {
    s[field] = val;
    if (field === 'type') renderSupports(type);
  }
  updateUI();
}

function removeSupport(id, type) {
  if (type === 'current') {
    currentSupports = currentSupports.filter(x => x.id !== id);
  } else {
    linkingSupports = linkingSupports.filter(x => x.id !== id);
  }
  renderSupports(type);
  updateUI();
}

function renderSupports(type) {
  const containerId = type === 'current' ? 'currentSupportsContainer' : 'linkingSupportsContainer';
  const container = document.getElementById(containerId);
  const list = type === 'current' ? currentSupports : linkingSupports;
  if (!container) return;
  
  if (!list.length) {
    container.innerHTML = `<p style="font-size: 13px; color: var(--text-label); margin-bottom: 20px;">No ${type} services added.</p>`;
    return;
  }

  container.innerHTML = list.map((s, idx) => `
    <div class="legal-rep-card" style="border-left: 3px solid var(--marion-blue); margin-bottom:15px;">
      <div class="rep-header">
        <span class="rep-title">${type === 'current' ? 'Current' : 'Linking'} Support #${idx + 1}</span>
        <button class="remove-rep-btn" onclick="removeSupport(${s.id}, '${type}')">×</button>
      </div>
      <div class="form-grid">
        <div class="field-group">
          <label>Support Type</label>
          <select onchange="updateSupportField(${s.id}, '${type}', 'type', this.value)">
            <option value="Community" ${s.type === 'Community' ? 'selected' : ''}>Community (pantries, churches, clubs, gym)</option>
            <option value="State plan services" ${s.type === 'State plan services' ? 'selected' : ''}>State plan services</option>
            <option value="Relationship based" ${s.type === 'Relationship based' ? 'selected' : ''}>Relationship based</option>
            <option value="Insurances" ${s.type === 'Insurances' ? 'selected' : ''}>Insurances</option>
            <option value="DMH Services" ${s.type === 'DMH Services' ? 'selected' : ''}>DMH Services</option>
            <option value="Technology" ${s.type === 'Technology' ? 'selected' : ''}>Technology</option>
            <option value="Other" ${s.type === 'Other' ? 'selected' : ''}>Other</option>
          </select>
        </div>
        <div class="field-group"><label>Define Support</label><input type="text" value="${esc(s.description)}" oninput="updateSupportField(${s.id}, '${type}', 'description', this.value)"></div>
        <div class="field-group"><label>Purpose</label><input type="text" value="${esc(s.purpose)}" oninput="updateSupportField(${s.id}, '${type}', 'purpose', this.value)"></div>
        <div class="field-group"><label>Frequency</label><input type="text" value="${esc(s.frequency)}" oninput="updateSupportField(${s.id}, '${type}', 'frequency', this.value)"></div>
        <div class="field-group full">
          <label>Enrollment Info / "Not Currently Utilizing"</label>
          <input type="text" value="${esc(s.enrollmentInfo)}" placeholder="How to enroll or status note" oninput="updateSupportField(${s.id}, '${type}', 'enrollmentInfo', this.value)">
        </div>
      </div>
    </div>
  `).join("");
}
function updateProgramServiceField(id, field, val) {
  const p = programServices.find((x) => x.id === id);
  if (p) {
    p[field] = val;
    if (field === "payerSource" || field === "waiverType") {
      renderProgramServices(); // Refresh for HCBS grouping
      if (field === "waiverType") {
        checkAndApplyHCBSTemplateToService(p, val);
      }
    }
  }
  updateUI();
}

function checkAndApplyHCBSTemplateToService(p, waiverName) {
  const triggers = [
    "Comprehensive Waiver",
    "Support Waiver",
    "Sarah Lopez Waiver (MOCDD)",
    "Partnership for Hope Waiver",
  ];

  if (!triggers.includes(waiverName)) return;

  const template =
    "Provider Choice Statement and Spreadsheet was signed on ________ by ________________ for ________________.";

  if (!p.hcbs1) p.hcbs1 = template;
  if (!p.hcbs2) p.hcbs2 = template;
  if (!p.hcbs3) p.hcbs3 = template;
  // hcbs4 remains blank for custom input as requested

  renderProgramServices();
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
    .map((p, idx) => {
      const isWaiver = /waiver/i.test(p.waiverType) || /waiver/i.test(p.funding) || /waiver/i.test(p.payerSource);
      return `
    <div class="legal-rep-card" style="border-left: 3px solid var(--marion-blue); margin-bottom:15px; padding: 15px;">
      <div class="rep-header"><span class="rep-title">Authorized Service / Program #${idx + 1}</span><button class="remove-rep-btn" onclick="removeProgramService(${p.id})">×</button></div>
      
      <div style="font-weight: 700; color: var(--text-base); margin-bottom: 8px; border-bottom: 1px solid var(--border); padding-bottom: 4px;">Program Definition & Payer Source</div>
      <div class="form-grid" style="grid-template-columns: 1fr 1fr;">
        <div class="field-group">
          <label>Payer Source / Program Type</label>
          <select onchange="updateProgramServiceField(${p.id},'payerSource',this.value)">
            <option value="">Select Funding Source...</option>
            <option value="Comprehensive Waiver" ${p.payerSource === "Comprehensive Waiver" ? "selected" : ""}>Comprehensive Waiver</option>
            <option value="Support Waiver" ${p.payerSource === "Support Waiver" ? "selected" : ""}>Support Waiver</option>
            <option value="Partnership for Hope Waiver" ${p.payerSource === "Partnership for Hope Waiver" ? "selected" : ""}>Partnership for Hope Waiver</option>
            <option value="Sarah Lopez Waiver (MOCDD)" ${p.payerSource === "Sarah Lopez Waiver (MOCDD)" ? "selected" : ""}>Sarah Lopez Waiver (MOCDD)</option>
            <option value="State Plan Medicaid" ${p.payerSource === "State Plan Medicaid" ? "selected" : ""}>State Plan Medicaid</option>
            <option value="State General Revenue" ${p.payerSource === "State General Revenue" ? "selected" : ""}>State General Revenue</option>
            <option value="Private / MCO Insurance" ${p.payerSource === "Private / MCO Insurance" ? "selected" : ""}>Private / MCO Insurance</option>
            <option value="Grant Funding" ${p.payerSource === "Grant Funding" ? "selected" : ""}>Grant Funding</option>
            <option value="PAC Funding" ${p.payerSource === "PAC Funding" ? "selected" : ""}>PAC Funding</option>
            <option value="NEAI Funding" ${p.payerSource === "NEAI Funding" ? "selected" : ""}>NEAI Funding</option>
            <option value="Other" ${p.payerSource === "Other" ? "selected" : ""}>Other</option>
          </select>
        </div>
        <div class="field-group">
          <label>Managed Care Org (MCO) / Plan Network ID</label>
          <input type="text" placeholder="e.g. UnitedHealthcare Community Plan" value="${esc(p.mco)}" oninput="updateProgramServiceField(${p.id},'mco',this.value)">
        </div>
      </div>

      <div style="font-weight: 700; color: var(--text-base); margin-top: 15px; margin-bottom: 8px; border-bottom: 1px solid var(--border); padding-bottom: 4px;">Effective Date Windows</div>
      <div class="form-grid" style="grid-template-columns: 1fr 1fr 1fr 1fr;">
        <div class="field-group">
          <label>Authorization Start</label>
          <input type="date" value="${esc(p.startDate)}" oninput="updateProgramServiceField(${p.id},'startDate',this.value)">
        </div>
        <div class="field-group">
          <label>Authorization End</label>
          <input type="date" value="${esc(p.endDate)}" oninput="updateProgramServiceField(${p.id},'endDate',this.value)">
        </div>
        <div class="field-group">
          <label>Is this an Amendment?</label>
          <select onchange="updateProgramServiceField(${p.id},'isAmendment',this.value)">
            <option value="No" ${p.isAmendment === "No" ? "selected" : ""}>No</option>
            <option value="Yes" ${p.isAmendment === "Yes" ? "selected" : ""}>Yes</option>
          </select>
        </div>
        <div class="field-group">
          <label>Amendment Effective Date</label>
          <input type="date" value="${esc(p.amendDate)}" oninput="updateProgramServiceField(${p.id},'amendDate',this.value)">
        </div>
      </div>

      <div style="font-weight: 700; color: var(--text-base); margin-top: 15px; margin-bottom: 8px; border-bottom: 1px solid var(--border); padding-bottom: 4px;">Authorized Service Arrays (The Core Matrix)</div>
      <div class="form-grid" style="grid-template-columns: 1fr 1fr;">
        <div class="field-group">
          <label>HCPCS / Billing Code & Modifier</label>
          <input type="text" placeholder="e.g. T2017" value="${esc(p.billingCode)}" oninput="updateProgramServiceField(${p.id},'billingCode',this.value)">
        </div>
        <div class="field-group">
          <label>Unit of Measure</label>
          <input type="text" placeholder="e.g. 15-minute increments, hourly" value="${esc(p.unitMeasure)}" oninput="updateProgramServiceField(${p.id},'unitMeasure',this.value)">
        </div>
        <div class="field-group">
          <label>Frequency and Quantity Caps</label>
          <input type="text" placeholder="e.g. 40 units per week" value="${esc(p.frequencyCaps)}" oninput="updateProgramServiceField(${p.id},'frequencyCaps',this.value)">
        </div>
        <div class="field-group">
          <label>Total Allocation Tracking ($)</label>
          <input type="text" placeholder="e.g. $12,000" value="${esc(p.totalAllocation)}" oninput="updateProgramServiceField(${p.id},'totalAllocation',this.value)">
        </div>
      </div>

      <div class="form-grid" style="margin-top: 10px;">
        <div class="field-group full">
          <label>Justification / Provider Selection</label>
          <textarea style="min-height: 40px;" placeholder="Explain the need for this service and designated provider..." oninput="updateProgramServiceField(${p.id},'justification',this.value)">${esc(p.justification)}</textarea>
        </div>
      </div>

        ${
          isWaiver
            ? `
        <div class="field-group full" style="margin-top: 15px; padding-top: 15px; border-top: 1px dashed var(--border);">
          <div style="font-weight: 800; color: var(--gold); margin-bottom: 10px; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">HCBS Waiver Choice & Education</div>
          
          <div style="margin-bottom: 15px;">
            <label style="font-size: 11px; margin-bottom: 5px; display: block;">1. How was the individual educated and informed of the options listed in the Medicaid waiver, provider and services choice statement?</label>
            <textarea style="width: 100%; min-height: 60px;" oninput="updateProgramServiceField(${p.id},'hcbs1',this.value)">${esc(p.hcbs1)}</textarea>
          </div>
          
          <div style="margin-bottom: 15px;">
            <label style="font-size: 11px; margin-bottom: 5px; display: block;">2. How was the individual educated and informed of the full range of HCBS available to support achievement of personally identified goals?</label>
            <textarea style="width: 100%; min-height: 60px;" oninput="updateProgramServiceField(${p.id},'hcbs2',this.value)">${esc(p.hcbs2)}</textarea>
          </div>
          
          <div style="margin-bottom: 15px;">
            <label style="font-size: 11px; margin-bottom: 5px; display: block;">3. Conflict-Free Resolution: Include a method for the individual to request updates to the plan as needed.</label>
            <textarea style="width: 100%; min-height: 60px;" oninput="updateProgramServiceField(${p.id},'hcbs3',this.value)">${esc(p.hcbs3)}</textarea>
          </div>
          
          <div>
            <label style="font-size: 11px; margin-bottom: 5px; display: block;">4. Discuss the alternative home and community based settings that were considered by the individual.</label>
            <textarea style="width: 100%; min-height: 60px;" placeholder="Custom input for alternatives considered..." oninput="updateProgramServiceField(${p.id},'hcbs4',this.value)">${esc(p.hcbs4)}</textarea>
          </div>
        </div>
        `
            : ""
        }
      </div>
    </div>`;
    })
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
  
  // Progressive Reveal Logic
  const showUnder16 = (cat === "School Age (Under 16)" || cat === "Adult / Employment Age" || cat === "Retirement Age (65+)");
  const showAdult = (cat === "Adult / Employment Age" || cat === "Retirement Age (65+)");
  const showRetirement = (cat === "Retirement Age (65+)");

  const u16 = document.getElementById("under16Container");
  const adult = document.getElementById("adultTransitionContainer");
  const retirement = document.getElementById("retirementContainer");

  if (u16) u16.style.display = showUnder16 ? "block" : "none";
  if (adult) adult.style.display = showAdult ? "block" : "none";
  if (retirement) retirement.style.display = showRetirement ? "block" : "none";
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
  
  if (employmentEntries.length > 0) {
    line("Employment History / Current Jobs:");
    employmentEntries.forEach((e, idx) => {
      const supportedStr = e.isSupported ? " [Supported Employment/Job Coach]" : "";
      line(`  Job #${idx + 1}: ${e.status} | ${e.jobTitle || "No Title/Employer Provided"}${supportedStr}`);
    });
  } else {
    field("Employment Status", "No jobs listed");
  }

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
  line("Program Eligibility & Administrative Identifiers:");
  field("State Medicaid ID (DCN)", getVal("stateMedicaidId"));
  field("DDD Case Number", getVal("dddCaseNumber"));
  field("Regional Office Code", getVal("regionalOfficeCode"));
  
  line("");
  line("Case Management & Oversight Authority:");
  field("Case Manager / SC", getVal("caseManagerName"));
  field("Secure Email", getVal("caseManagerEmail"));
  field("Agency NPI", getVal("caseManagerNPI"));
  line("");

  if (programServices.length > 0) {
    line("Authorized Services & Waivers Matrix:");
    programServices.forEach((s, idx) => {
      line(`  [${idx + 1}] PROGRAM DEFINITION:`);
      line(`      Payer Source/Type: ${s.payerSource || "—"}`);
      line(`      MCO / Plan       : ${s.mco || "—"}`);
      line(`      Amend Status     : ${s.isAmendment === "Yes" ? `Yes (Date: ${s.amendDate || "—"})` : "No"}`);
      line(`      Auth Window      : ${s.startDate || "—"} to ${s.endDate || "—"}`);
      line(`      Justification    : ${s.justification || "—"}`);
      
      line(`      SERVICE ARRAY:`);
      line(`        HCPCS Code: ${s.billingCode || "—"}`);
      line(`        Unit Meas : ${s.unitMeasure || "—"}`);
      line(`        Freq Caps : ${s.frequencyCaps || "—"}`);
      line(`        Total $   : ${s.totalAllocation || "—"}`);
      
      const isWaiver = /waiver/i.test(s.payerSource);
      if (isWaiver) {
        line(`      HCBS Waiver Choice & Education:`);
        line(`        1. Informed of options: ${s.hcbs1 || "—"}`);
        line(`        2. Informed of range: ${s.hcbs2 || "—"}`);
        line(`        3. Update method: ${s.hcbs3 || "—"}`);
        line(`        4. Alternatives considered: ${s.hcbs4 || "—"}`);
      }
      line("");
    });
  } else {
    line("Authorized Services: None documented.");
    line("");
  }
  
  field("Individualized Backup Plan", getVal("backupPlan"));
  line("");

  head("8. MEDICAL");
  field("Diagnosis", getVal("diagnosis"));
  field("Medications", getVal("medicationDetails"));
  field("Medical History", getVal("medHistory"));
  field("PCP", getVal("pcpName"));
  line("");

  head("9. COMMUNITY NATURAL AND NON-DIVISION SUPPORT");
  field("Non-Divisional Waiver Status", getVal("nonDivisionalWaiverStatus"));
  line("");
  
  if (currentSupports.length > 0) {
    line("Current Services:");
    currentSupports.forEach((s, idx) => {
      line(`  [${idx + 1}] Support: ${s.description || "—"} (${s.type})`);
      line(`      Purpose: ${s.purpose || "—"}`);
      line(`      Freq: ${s.frequency || "—"}`);
      if (s.enrollmentInfo) line(`      Enrollment/Note: ${s.enrollmentInfo}`);
    });
    line("");
  }

  if (linkingSupports.length > 0) {
    line("Linking Services:");
    linkingSupports.forEach((s, idx) => {
      line(`  [${idx + 1}] Support: ${s.description || "—"} (${s.type})`);
      line(`      Purpose: ${s.purpose || "—"}`);
      line(`      Freq: ${s.frequency || "—"}`);
      if (s.enrollmentInfo) line(`      Enrollment/Note: ${s.enrollmentInfo}`);
    });
    line("");
  }
  
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
  
  // Print historical and current notes cumulatively based on visible containers
  const showUnder16 = (tCat === "School Age (Under 16)" || tCat === "Adult / Employment Age" || tCat === "Retirement Age (65+)");
  const showAdult = (tCat === "Adult / Employment Age" || tCat === "Retirement Age (65+)");
  const showRetirement = (tCat === "Retirement Age (65+)");

  if (showUnder16 && getVal("under16Notes")) field("Youth Transition Goals", getVal("under16Notes"));
  
  if (showAdult) {
    field("Discovery Tools", getVal("discoveryTools"));
    const referrals = [];
    document.querySelectorAll(".referral-cb").forEach(cb => { if (cb.checked) referrals.push(cb.value); });
    if (referrals.length) field("Community Referrals", referrals.join(", "));
    field("Referral Notes", getVal("referralNotes"));
  }
  
  if (showRetirement && getVal("retirementNotes")) field("Retirement Context", getVal("retirementNotes"));
  
  field("Transition Plan Summary", getVal("transitionPlan"));
  line("");

  head("14. BEHAVIORAL");
  field("Behavioral Status", getVal("behavioralStatus"));
  field("Psychotropic Protocol", getVal("psychotropicProtocol"));
  field("Behavioral Notes", getVal("behavioralNotes"));
  line("");

  head("15. SUPERVISION(HOUSING) (SAFETY AND SECURITY)");
  if (document.getElementById("alteredSupervision")?.checked) {
    line("  * Altered Levels of Supervision applied *");
  }
  line("Supervision & Risk Domains (Covers Housing & Community):");
  const domains = [
    { label: "Chemicals", id: "chemicals" },
    { label: "Cooking", id: "cooking" },
    { label: "911", id: "911" },
    { label: "Support for emergency procedures", id: "emerg_procedures" },
    { label: "Stranger awareness", id: "stranger" },
    { label: "Emergency safety / home dangers", id: "emerg_safety" },
    { label: "Choking risk / aspiration supports needed", id: "choking_risk" },
    { label: "Mobility support needs / falls", id: "mobility_falls" },
    { label: "Probation / parole", id: "probation" },
    { label: "Criminal and other behavior that places person or others at risk", id: "criminal_behavior" }
  ];
  domains.forEach(d => {
    line(`  - ${d.label}: Supervision (${getVal(`sup_${d.id}`)}) | Risk (${getVal(`risk_${d.id}`)})`);
  });
  
  field("Staff Precautions", getVal("oshaPrecaution"));
  field("Staff Support Needs", getVal("staffSupportNeeds"));

  if (document.getElementById("needsEmergencyAssistance")?.checked) {
    line("Emergency Safety / Home Dangers Assistance:");
    field("  - Additional Info", getVal("emergencyAssistanceDetails"));
  }

  line("Lease / Agreement Info:");
  field("  - Last date of lease / renewed", getVal("leaseDateRenew"));
  field("  - Document location", getVal("leaseLocation"));

  line("Home Life / HCBS Compliance:");
  field("  - Rule #1 (Choice)", getVal("hcbsRule1Choice"));
  field("  - Rule #2 (Privacy)", getVal("hcbsRule2Privacy"));
  field("  - Rule #3 (Support)", getVal("hcbsRule3Support"));
  field("  - Home Life Notes", getVal("homeLifeNotes"));
  
  line("");
  head("15B. RIGHTS LIMITATIONS & DUE PROCESS");
  if (document.getElementById("dueProcessNA")?.checked) {
    line("  - No active limitations.");
  } else if (document.getElementById("dueProcessAttached")?.checked) {
    line("  - See Attached.");
  } else if (dueProcessItems.length === 0) {
    line("  - No limitations documented.");
  } else {
    dueProcessItems.forEach((dp, idx) => {
      line(`Limitation #${idx + 1}:`);
      line(`  - Meeting Invitation: ${dp.invitation}`);
      line(`  - Description: ${dp.description}`);
      line(`  - Less Intrusive Methods: ${dp.lessIntrusive}`);
      line(`  - Historical Pattern: ${dp.historical}`);
      line(`  - Teaching & Support: ${dp.teaching}`);
      line(`  - Lifting Criteria: ${dp.liftingCriteria}`);
      line(`  - Monitoring: ${dp.monitoring}`);
    });
  }
  line("");
  const fName = getVal("firstName") || "the individual";
  line(`* Contains information regarding right to appeal. "If ${fName} wishes to file a complaint, ${fName} will be referred to the Office of Constituent Services."`);
  line("");

  head("16. PREVIOUS AND CURRENT GOALS AND TASKS");
  line(
    clinicalGoalsTasks
      .map((g, i) => {
        let entry = `Goal Entry #${i + 1}: ${g.goal} | Task: ${g.task} | Progress: ${g.progress}`;
        if (g.continued) {
          entry += `\n  - Status: ${g.continued}`;
          if (g.continuedWhy) {
            entry += ` (Reason: ${g.continuedWhy})`;
          }
        }
        return entry;
      })
      .join("\n\n"),
  );
  line("");

  head("17. ACTION PLAN");
  line(
    goalsData
      .map(
        (g) =>
          `[${g.domain}] Goal: ${g.goal} | Task: ${g.task} | Responsible: ${g.responsible.join(", ")} | Frequency: ${g.frequency.join(", ")}`,
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
  
  let evals = [];
  if (document.getElementById("evalVineland")?.checked) evals.push(`Vineland (${getVal("evalVinelandDate") || "No Date"})`);
  if (document.getElementById("evalAbas")?.checked) evals.push(`ABAS-3 (${getVal("evalAbasDate") || "No Date"})`);
  if (document.getElementById("evalMocabi")?.checked) evals.push(`MOCABI (${getVal("evalMocabiDate") || "No Date"})`);
  if (document.getElementById("evalMaas")?.checked) evals.push(`MAAS (${getVal("evalMaasDate") || "No Date"})`);
  if (document.getElementById("evalOther")?.checked) evals.push(`Other: ${getVal("evalOtherText")} (${getVal("evalOtherDate") || "No Date"})`);
  
  if (evals.length > 0) {
    field("Assessments Completed", evals.join(" | "));
  }

  field("LOC Domains Affected", locList.length ? locList.join(", ") : "None Selected");
  if (otherDomains) field("Other Domains", otherDomains);

  field("Last LOC Date", getVal("lastLOC"));
  
  const hasChoices = document.getElementById("hasChoices")?.checked ? "Yes" : "No";
  const choicesDesc = getVal("choicesDescription");
  field("Individual has Choices?", choicesDesc ? `${hasChoices} (${choicesDesc})` : hasChoices);

  line("");
  head("WAIVER RECIPIENTS & COMPLIANCE");
  const dissent = getVal("dissentingOpinions");
  field("Dissenting Opinions", dissent ? dissent : "None documented.");
  field("Conflict of Interest Info Provided", getVal("conflictInfo"));
  
  const sdsAw = document.getElementById("sdsAwareness")?.checked ? "Yes" : "No";
  const sdsInt = getVal("sdsInterest");
  field("Individual/Guardian aware of SDS", sdsInt ? `${sdsAw} (Interest: ${sdsInt})` : sdsAw);
  field("TCM Satisfaction Survey", document.getElementById("tcsmSatisfactionSurvey")?.checked ? "Completed/Addressed" : "No");
  
  line("");
  line("If there are concerns with services or support provided by the support coordinator, they may contact the TCM assistant supervisor, Barb Van Abbema, at 573-248-1077 ext. 111, the TCM supervisor, Mahogany Wallis, at 573-248-1077 ext 102 or the SB40 executive director, Cathy Arrowsmith, at 573-248-1077 ext. 104.");
  line("");
  field("Last Assessment", getVal("lastAssessment"));
  field("RAS Score", getVal("rasSisScore"));
  field("PON Score", getVal("ponScore"));

  line("");
  let burialOpt = [];
  if (document.getElementById("burialPlanBurial")?.checked) burialOpt.push("Burial");
  if (document.getElementById("burialPlanCremation")?.checked) burialOpt.push("Cremation");
  field("Burial Plan", burialOpt.length ? burialOpt.join(" / ") : "None specified");
  field("Burial Financial Allocations", getVal("burialFinancialAllocations"));
  field("Burial Savings Plan", getVal("burialSavingsPlan"));

  line("");
  if (document.getElementById("clientDidNotAttend")?.checked) {
    field("Client Attended", `No - ${getVal("clientDidNotAttendReason") || "No reason provided"}`);
  } else {
    field("Client Attended", "Yes");
  }
  field("Meeting Format", getVal("meetingFormat"));
  if (meetingAttendees.length > 0) {
    line("Meeting Attendees & Contributions:");
    meetingAttendees.forEach((a, idx) => {
      line(`  ${idx + 1}. ${a.name || "[Name]"} | Role: ${a.role || "[Role]"}`);
      if (a.contribution) line(`     Contribution: ${a.contribution}`);
    });
  } else {
    line("Meeting Attendees: None documented.");
  }

  line("");
  if (document.getElementById("attachmentsIncluded")?.checked) {
    line("*** ATTACHMENTS INCLUDED WITH PCSP ***");
    const attDetails = getVal("attachmentsDetails");
    if (attDetails) {
      line(`Attachment Details: ${attDetails}`);
    }
  }

  line("");
  line(`${displayName ? displayName + ' and/or their Guardian' : 'The individual and/or guardian'} may contact the Office of Constituent Services at 1-800-364-9687 to file an anonymous complaint. All calls will be kept confidential and the caller can choose to remain anonymous.`);


  // ── SIGNATURE SECTION ──
  line("\n" + "═".repeat(67));
  line("SIGNATURES & APPROVAL");
  line("");
  line(`Individual: ${displayName.toUpperCase()}`);
  line("Signature: _____________________________________ Date: __________");
  line("");
  
  const cont = getVal("contributors");
  if (cont) {
    line("Plan Contributors:");
    cont.split('\n').filter(c => c.trim()).forEach(c => {
      line(`${c.trim()}: _____________________________________ Date: __________`);
      line("");
    });
  } else {
    line("Contributor: ____________________________________ Date: __________");
    line("");
  }

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
  const container = document.getElementById("dueProcessContainer");
  const btn = document.getElementById("addDueProcessBtn");
  if(container) container.style.display = cb.checked ? "none" : "";
  if(btn) btn.style.display = cb.checked ? "none" : "";
  updateUI();
}

function addDueProcess() {
  dueProcessItems.push({
    invitation: "",
    description: "",
    lessIntrusive: "",
    historical: "",
    teaching: "",
    liftingCriteria: "",
    monitoring: ""
  });
  renderDueProcess();
  updateUI();
}

function removeDueProcess(idx) {
  dueProcessItems.splice(idx, 1);
  renderDueProcess();
  updateUI();
}

function renderDueProcess() {
  const container = document.getElementById("dueProcessContainer");
  if (!container) return;
  container.innerHTML = "";
  dueProcessItems.forEach((dp, idx) => {
    const div = document.createElement("div");
    div.style.background = "var(--bg-light, #f8f9fa)";
    div.style.border = "1px solid var(--border, #ddd)";
    div.style.borderRadius = "8px";
    div.style.padding = "12px 14px";
    div.style.marginBottom = "10px";
    div.style.position = "relative";
    
    div.innerHTML = `
      <button class="remove-rep-btn" type="button" onclick="removeDueProcess(${idx})" title="Remove" style="position: absolute; right: 10px; top: 10px;">✕</button>
      <div style="font-weight: 700; margin-bottom: 8px;">Due Process / Limitation #${idx + 1}</div>
      <div class="form-grid">
        <div class="field-group">
          <label>Due Process Meeting Invitation</label>
          <textarea placeholder="Document when guardian/individual was invited and their response." oninput="dueProcessItems[${idx}].invitation = this.value; updateUI()">${dp.invitation}</textarea>
        </div>
        <div class="field-group">
          <label>Description of Limitation</label>
          <textarea placeholder="What is the restriction and where/when is it imposed?" oninput="dueProcessItems[${idx}].description = this.value; updateUI()">${dp.description}</textarea>
        </div>
        <div class="field-group full">
          <label>Less Intrusive Methods Tried (HCBS Requirement)</label>
          <textarea placeholder="Document specific methods that were attempted but did not work." oninput="dueProcessItems[${idx}].lessIntrusive = this.value; updateUI()">${dp.lessIntrusive}</textarea>
        </div>
        <div class="field-group full">
          <label>Historical Pattern / Source of Data</label>
          <textarea placeholder="Historical events justifying limitation. Include current data source (e.g. incident reports)." oninput="dueProcessItems[${idx}].historical = this.value; updateUI()">${dp.historical}</textarea>
        </div>
        <div class="field-group">
          <label>Teaching & Support Strategies</label>
          <textarea placeholder="Goals/tasks to help the individual overcome the need for this support." oninput="dueProcessItems[${idx}].teaching = this.value; updateUI()">${dp.teaching}</textarea>
        </div>
        <div class="field-group">
          <label>Measurable Criteria for Lifting</label>
          <textarea placeholder="How will the Team know when the limit can be reduced or lifted?" oninput="dueProcessItems[${idx}].liftingCriteria = this.value; updateUI()">${dp.liftingCriteria}</textarea>
        </div>
        <div class="field-group full">
          <label>Monitoring & Data Collection</label>
          <textarea placeholder="Who documents? Where is data kept? Frequency? Review dates by SC." oninput="dueProcessItems[${idx}].monitoring = this.value; updateUI()">${dp.monitoring}</textarea>
        </div>
      </div>
    `;
    container.appendChild(div);
  });
}

// ── SECTION 18: ATTENDEES ──
function addAttendee() {
  meetingAttendees.push({ name: "", role: "", contribution: "" });
  renderAttendees();
  updateUI();
}

function removeAttendee(idx) {
  meetingAttendees.splice(idx, 1);
  renderAttendees();
  updateUI();
}

function renderAttendees() {
  const container = document.getElementById("attendeesContainer");
  if (!container) return;
  container.innerHTML = "";
  meetingAttendees.forEach((a, idx) => {
    const div = document.createElement("div");
    div.style.background = "var(--bg-light, #f8f9fa)";
    div.style.border = "1px solid var(--border, #ddd)";
    div.style.borderRadius = "8px";
    div.style.padding = "12px 14px";
    div.style.marginBottom = "10px";
    div.style.position = "relative";
    
    div.innerHTML = `
      <button class="remove-rep-btn" type="button" onclick="removeAttendee(${idx})" title="Remove" style="position: absolute; right: 10px; top: 10px;">✕</button>
      <div class="form-grid" style="margin-top: 10px;">
        <div class="field-group">
          <label>Name</label>
          <input type="text" placeholder="Attendee Name" value="${a.name}" oninput="meetingAttendees[${idx}].name = this.value; updateUI()">
        </div>
        <div class="field-group">
          <label>Role</label>
          <input type="text" placeholder="Role (e.g. Individual, SC, Guardian)" value="${a.role}" oninput="meetingAttendees[${idx}].role = this.value; updateUI()">
        </div>
        <div class="field-group full">
          <label>Contributions to the Meeting</label>
          <textarea placeholder="Describe what they added/discussed during the meeting..." oninput="meetingAttendees[${idx}].contribution = this.value; updateUI()">${a.contribution}</textarea>
        </div>
      </div>
    `;
    container.appendChild(div);
  });
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


function addEmploymentEntry() {
  employmentEntries.push({ status: "Part-Time Employed", jobTitle: "", isSupported: false });
  renderEmploymentEntries();
  updateUI();
}
function removeEmploymentEntry(i) {
  employmentEntries.splice(i, 1);
  renderEmploymentEntries();
  updateUI();
}
function updateEmploymentEntry(i, field, value) {
  employmentEntries[i][field] = value;
  updateUI();
}
function renderEmploymentEntries() {
  const container = document.getElementById("employmentEntriesContainer");
  if (!container) return;
  if (employmentEntries.length === 0) {
    container.innerHTML = `<p style="font-size: 12px; color: var(--text-label); margin: 8px 0 12px">No jobs added. Click below to add one.</p>`;
    return;
  }
  container.innerHTML = employmentEntries.map((e, i) => `
    <div class="legal-rep-card" style="margin-bottom: 10px; background: var(--bg-light); padding: 15px; border-radius: 8px; border: 1px solid var(--border);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
        <span style="font-weight: 700; font-size: 11px; text-transform: uppercase; color: var(--gold);">Job / Employment Entry #${i + 1}</span>
        <button class="remove-rep-btn" onclick="removeEmploymentEntry(${i})">✕</button>
      </div>
      <div class="form-grid">
        <div class="field-group">
          <label>Status</label>
          <select onchange="updateEmploymentEntry(${i}, 'status', this.value)">
            <option value="Full-Time Employed" ${e.status === 'Full-Time Employed' ? 'selected' : ''}>Full-Time Employed</option>
            <option value="Part-Time Employed" ${e.status === 'Part-Time Employed' ? 'selected' : ''}>Part-Time Employed</option>
            <option value="Seasonal Employment" ${e.status === 'Seasonal Employment' ? 'selected' : ''}>Seasonal Employment</option>
            <option value="Self-Employed" ${e.status === 'Self-Employed' ? 'selected' : ''}>Self-Employed</option>
            <option value="Workshop" ${e.status === 'Workshop' ? 'selected' : ''}>Workshop</option>
            <option value="Student / BEST" ${e.status === 'Student / BEST' ? 'selected' : ''}>Student / BEST</option>
            <option value="Seeking Employment" ${e.status === 'Seeking Employment' ? 'selected' : ''}>Seeking Employment</option>
            <option value="Day Program / Vocational Training" ${e.status === 'Day Program / Vocational Training' ? 'selected' : ''}>Day Program / Vocational Training</option>
            <option value="Unemployed — Not Seeking" ${e.status === 'Unemployed — Not Seeking' ? 'selected' : ''}>Unemployed — Not Seeking</option>
            <option value="Retired" ${e.status === 'Retired' ? 'selected' : ''}>Retired</option>
            <option value="Student / Not Working" ${e.status === 'Student / Not Working' ? 'selected' : ''}>Student / Not Working</option>
          </select>
        </div>
        <div class="field-group">
          <label>Job Title / Employer / Description</label>
          <input type="text" value="${esc(e.jobTitle)}" placeholder="e.g. Dishwasher at Hannibal Diner" oninput="updateEmploymentEntry(${i}, 'jobTitle', this.value)">
        </div>
        <div class="field-group" style="justify-content: center;">
          <label class="eth-check" style="margin-top: 10px; font-size: 11px;">
            <input type="checkbox" ${e.isSupported ? 'checked' : ''} onchange="updateEmploymentEntry(${i}, 'isSupported', this.checked)">
            Supported Employment (Job Coach)
          </label>
        </div>
      </div>
    </div>
  `).join("");
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
function updateRepAuth(i, cb) {
  if (!Array.isArray(legalReps[i].legalType)) {
    // Convert old string format to array if necessary
    legalReps[i].legalType = legalReps[i].legalType ? [legalReps[i].legalType] : [];
  }
  if (cb.checked) {
    if (!legalReps[i].legalType.includes(cb.value)) {
      legalReps[i].legalType.push(cb.value);
    }
  } else {
    legalReps[i].legalType = legalReps[i].legalType.filter(a => a !== cb.value);
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
        <div class="field-group full">
          <label>Authority Type (Select all that apply)</label>
          <div class="ethnicity-grid" style="grid-template-columns: 1fr 1fr 1fr;">
            ${['Self / Full Rights', 'Full Guardianship', 'Limited Guardianship', 'Full Conservatorship', 'Limited Conservatorship', 'Power of Attorney', 'Representative Payee', 'Physical Custody', 'Legal Custody'].map(auth => `
              <label class="eth-check" style="font-size: 10px;">
                <input type="checkbox" value="${auth}" ${Array.isArray(r.legalType) && r.legalType.includes(auth) ? 'checked' : (r.legalType === auth ? 'checked' : '')} onchange="updateRepAuth(${i}, this)">
                ${auth}
              </label>
            `).join("")}
          </div>
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
  return legalReps.map((rep, i) => {
    const authType = Array.isArray(rep.legalType) ? rep.legalType.join(", ") : (rep.legalType || "N/A");
    return `  Rep #${i + 1}: ${rep.name || "[Name not provided]"} | ${authType} | Relationship: ${rep.relationship || "N/A"} | Lives with individual: ${rep.livesWith} | Phone: ${rep.phone || "N/A"}${rep.address && rep.livesWith !== "Yes" ? " | Address: " + rep.address : ""}`;
  }).join("\n");
}
function captureLegalReps() {
  return JSON.parse(JSON.stringify(legalReps));
}
function restoreLegalReps(d)  { legalReps = Array.isArray(d) ? d : []; renderLegalReps(); }

// ── PERSISTENCE ──
function captureFormData() {
  const fd = {
    _goalsData: goalsData,
    _clinicalGoalsTasks: clinicalGoalsTasks,
    _programServices: programServices,
    _currentSupports: currentSupports,
    _linkingSupports: linkingSupports,
    _legalReps: legalReps,
    _commChartRows: commChartRows,
    _importantPeople: importantPeople,
    _employmentEntries: employmentEntries,
    _dueProcessItems: dueProcessItems,
    _meetingAttendees: meetingAttendees,
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
  currentSupports = fd._currentSupports || [];
  linkingSupports = fd._linkingSupports || [];
  legalReps = fd._legalReps || [];
  employmentEntries = fd._employmentEntries || [];
  commChartRows = fd._commChartRows || [];
  importantPeople = fd._importantPeople || [];
  dueProcessItems = fd._dueProcessItems || [];
  meetingAttendees = fd._meetingAttendees || [];
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
  renderSupports('current');
  renderSupports('linking');
  renderLegalReps();
  renderEmploymentEntries();
  renderCommChart();
  renderImportantPeople();
  renderDueProcess();
  if (typeof renderAttendees === 'function') renderAttendees();
  if (document.getElementById("dueProcessNA")) {
    toggleDueProcess(document.getElementById("dueProcessNA"));
  }

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
async function initSecurity() {
  const config = localStorage.getItem("pcsp_vault_config");
  const subtitle = document.getElementById("lockSubtitle");
  const btn = document.getElementById("lockBtn");
  const passInput = document.getElementById("passInput");
  const hint = document.getElementById("passStrengthHint");

  if (!config) {
    subtitle.textContent = "Initialize your unique security vault";
    btn.textContent = "Initialize Vault";
    document.getElementById("confirmPassWrap").style.display = "block";
    passInput.placeholder = "Create master password";
  } else {
    _vaultConfig = JSON.parse(config);
    subtitle.textContent = "Unlock your secure workspace";
    btn.textContent = "Unlock Vault";
    document.getElementById("confirmPassWrap").style.display = "none";
    passInput.placeholder = "Enter master password";
  }

  // Strength hint listener
  passInput.addEventListener("input", () => {
    if (!localStorage.getItem("pcsp_vault_config")) {
      const strength = Security.getStrength(passInput.value);
      hint.textContent = strength.label ? `Strength: ${strength.label}` : "";
      hint.style.color = strength.color;
    } else {
      hint.textContent = "";
    }
  });
}

async function checkPass() {
  const pass = document.getElementById("passInput").value;
  const confirm = document.getElementById("passConfirm").value;
  const err = document.getElementById("errorMsg");
  err.textContent = "";

  if (!_vaultConfig) {
    // Initialization mode
    if (!pass || pass.length < 8) {
      err.textContent = "Password must be at least 8 characters.";
      return;
    }
    if (pass !== confirm) {
      err.textContent = "Passwords do not match.";
      return;
    }
    const strength = Security.getStrength(pass);
    if (strength.label === "Weak") {
      err.textContent = "Please choose a stronger password.";
      return;
    }

    try {
      // Create a challenge: encrypt a known string
      const challengeStr = "vault_verified_2026";
      const encryptedChallenge = await Security.encrypt({ challenge: challengeStr }, pass);
      
      _vaultConfig = { challenge: encryptedChallenge };
      localStorage.setItem("pcsp_vault_config", JSON.stringify(_vaultConfig));
      _sessionKey = pass; // Store for this session
      
      showToast("Vault initialized successfully!", "success");
      enterApp();
    } catch (e) {
      err.textContent = "Initialization failed: " + e.message;
    }
  } else {
    // Unlock mode
    try {
      const decrypted = await Security.decrypt(_vaultConfig.challenge, pass);
      if (decrypted && decrypted.challenge === "vault_verified_2026") {
        _sessionKey = pass;
        enterApp();
      } else {
        throw new Error("Invalid password");
      }
    } catch (e) {
      err.textContent = "Incorrect password. Access denied.";
      document.getElementById("passInput").value = "";
      document.getElementById("passInput").focus();
    }
  }
}

function enterApp() {
  document.getElementById("lockScreen").classList.add("fade-out");
  setTimeout(() => {
    document.getElementById("lockScreen").style.display = "none";
    document.getElementById("welcomeScreen").style.display = "flex";
  }, 700);
}

function launchApp() {
  const welcome = document.getElementById("welcomeScreen");
  welcome.style.opacity = "0";
  welcome.style.transition = "opacity 0.5s ease";
  setTimeout(() => {
    welcome.style.display = "none";
    document.getElementById("appContainer").style.display = "grid";
  }, 500);
}

document.getElementById("passInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") checkPass();
});
document.body.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && document.getElementById("passConfirm") === document.activeElement) checkPass();
});

function wipeSessionData() {
  if (confirm("HIPAA SECURITY ALERT: This will permanently wipe all local drafts and session data from this browser. This action cannot be undone. Proceed?")) {
    localStorage.clear();
    location.reload();
  }
}

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

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Add a temporary highlight effect
    el.classList.add('section-highlight');
    setTimeout(() => {
      el.classList.remove('section-highlight');
    }, 2000);
    
    // Auto-close sidebar on mobile after selection
    if (window.innerWidth <= 1024) {
      document.body.classList.remove('sidebar-active');
    }
  }
}

function toggleSidebar() {
  // Mobile uses body class, desktop toggles the grid container
  if (window.innerWidth <= 1024) {
    document.body.classList.toggle('sidebar-active');
  } else {
    document.getElementById('appContainer').classList.toggle('sidebar-collapsed');
  }
}

async function exportPCSP() {
  const data = captureFormData();
  let output;
  
  if (_sessionKey) {
    try {
      showToast("Encrypting data...", "success");
      output = await Security.encrypt(data, _sessionKey);
    } catch (e) {
      console.error("Encryption failed:", e);
      output = JSON.stringify(data, null, 2);
    }
  } else {
    output = JSON.stringify(data, null, 2);
  }

  const blob = new Blob([output], { type: "text/plain" });
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

async function importPCSP(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = async function (e) {
    await processPcspContent(e.target.result);
    event.target.value = "";
  };
  reader.readAsText(file);
}

async function processPcspContent(content) {
  try {
    let data;
    if (content.trim().startsWith("PCSPv3:")) {
      data = await attemptDecryption(content.trim());
    } else {
      // Legacy unencrypted JSON
      data = JSON.parse(content);
    }

    if (data) {
      restoreFormData(data);
      showToast("Loaded .pcsp successfully!", "success");
    }
  } catch (err) {
    console.error("Import Error:", err);
    showToast("Invalid .pcsp file or incorrect password.", "error");
  }
}

async function attemptDecryption(encryptedString) {
  // 1. Try session key first
  if (_sessionKey) {
    try {
      return await Security.decrypt(encryptedString, _sessionKey);
    } catch (e) {
      // Fall through to manual prompt
    }
  }

  // 2. Multi-user prompt
  const pass = prompt("Vault Lock Detected. Enter the password for this specific .pcsp file:");
  if (pass === null) return null; // User cancelled

  try {
    return await Security.decrypt(encryptedString, pass);
  } catch (e) {
    alert("Decryption failed. The password provided does not match this file's vault signature.");
    return await attemptDecryption(encryptedString); // Recurse for retry
  }
}

// ── DRAG AND DROP HANDLING ──
document.addEventListener("dragover", (e) => {
  e.preventDefault();
  e.stopPropagation();
});

document.addEventListener("drop", async (e) => {
  e.preventDefault();
  e.stopPropagation();

  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
    const file = e.dataTransfer.files[0];
    if (file.name.endsWith(".pcsp") || file.name.endsWith(".json")) {
      const reader = new FileReader();
      reader.onload = async function (evt) {
        await processPcspContent(evt.target.result);
      };
      reader.readAsText(file);
    }
  }
});

// ── BOOT ──
function init() {
  initSecurity();
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
