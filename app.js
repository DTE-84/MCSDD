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

const HCBS_SUBCATEGORIES = {
  "Applied Behavior Analysis": [
    "Adaptive Behavior Treatment with Protocol Modification: 97155 HO",
    "Adaptive Behavior Treatment with Protocol Modification: 97155 HN",
    "Behavior Identification Assessment: 97151 HO",
    "Behavior Identification Assessment-Observational: 97152 HO",
    "Behavior Identification Assessment-Observational: 97152 HM",
    "Behavior Identification Assessment-Observational: 97152 HN",
    "Behavior Identification Supporting Assessment-Exposure: 0362T HO",
    "Exposure Adaptive Behavior Treatment with Protocol Modification: 0373T HO",
    "Adaptive Behavior Treatment by Protocol by Technician: 97153 HO",
    "Adaptive Behavior Treatment by Protocol by Technician: 97153 HM",
    "Adaptive Behavior Treatment by Protocol by Technician: 97153 HN",
    "Family Adaptive Behavior Treatment Guidance: 97156 HO",
    "Family Adaptive Behavior Treatment Guidance: 97156 HN",
    "Group Adaptive Behavior Treatment with Protocol Modification: 97158 HO",
    "Group Adaptive Behavior Treatment with Protocol Modification: 97158 HN"
  ],
  "Assistive Technology": [
    "Assistive Technology / AT Consultation: A9999 UA",
    "Assistive Technology / AT Equipment: A9999 UB",
    "Assistive Technology / AT Service Delivery: A9999 UC",
    "Assistive Technology / AT Support: A9999 U9"
  ],
  "Benefits Planning": [
    "Benefits Planning: H0038 SE"
  ],
  "Career Planning": [
    "Career Planning, Individual: T2019"
  ],
  "Community Networking": [
    "Community Networking, Individual: T2021 SE",
    "Community Networking, Group: T2021 HQ SE"
  ],
  "Community Specialist": [
    "Community Specialist: T1016",
    "Community Specialist, Self-Directed: T1016 U2"
  ],
  "Community Transition": [
    "Community Transition: T2038"
  ],
  "Crisis Intervention": [
    "Crisis Intervention, Professional: S9484",
    "Crisis Intervention, Technician: S9484 HM"
  ],
  "Day Habilitation": [
    "Day Habilitation: T2021 HQ",
    "Day Habilitation: Medical Exception: T2021 SC",
    "Day Habilitation: Behavioral Exception: T2021 TG"
  ],
  "Dental": [
    "Dental: T2025"
  ],
  "Environmental Accessibility Adaptations": [
    "EAA: S5165",
    "EAA, Consultation: S5165 TC"
  ],
  "Family Peer Support Service": [
    "Family Peer Support: S5110 Individual",
    "Family Peer Support: S5110 HQ Group"
  ],
  "Group Home": [
    "Group Home: T2016 HQ",
    "Group Home-Intensive: T2016 HQ",
    "Group Home-Transition: T2016 HQ",
    "Residential Monthly Registered Nurse Oversight: T1002 HQ",
    "Residential License Practical Nurse(with Registered Nurse Oversight): T1003 HQ",
    "Residential Hospital Support: S5125"
  ],
  "Health Assessment and Coordination Services": [
    "Health Assessment and Coordination Services (HAC): 99499"
  ],
  "Home Delivered Meals": [
    "Home Delivered Meals: S5170"
  ],
  "Individual Directed Goods and Services": [
    "Individual Directed Goods and Services: T2028"
  ],
  "Individualized Skill Development": [
    "Individualized Skill Development (ISDI), Individual: S5108",
    "Individualized Skill Development (ISDG), Group: S5108 HQ"
  ],
  "Individual Supported Living": [
    "Individualized Supported Living: T2016",
    "Individualized Supported Living Transportation, Staff and Agency(non-modified): T2001",
    "Individualized Supported Living Transportation, Agency(modified): T2001 HE",
    "Individual Supported Living Monthly Registered Nurse Oversight: T1002 TD",
    "Individual Supported Living LPN(with Registered Nurse Oversight: T1003 TE",
    "Hospital Supports: S5125"
  ],
  "Intensive Therapeutic Residential Habilitation": [
    "Intensive Therapeutic Residential Habilitation: T2016 HK"
  ],
  "In-Home Respite": [
    "Respite Care, In-Home, Day: S5151",
    "Respite Care, In-Home, Individual: S5150",
    "Respite Care, In-Home, Group: S5150 HQ"
  ],
  "Job Development": [
    "Job development, Individual: H0038"
  ],
  "Occupational Therapy": [
    "Occupational Therapy: 97535",
    "Occupational Therapy, COTA: 97535",
    "Occupational Therapy, Consultation: 97535"
  ],
  "Out of Home Respite": [
    "Respite Care, Out-of-Home, Day: H0045",
    "Respite Care, Out-of-Home: T1005"
  ],
  "Personal Assistant": [
    "PA Individual, Self-Directed: T1019 U2",
    "PA Agency / Contractor: T1019",
    "PA, Group Size 2-3: T1019 HQ",
    "PA, Group Size 4-6: T1019 UQ",
    "PA, Medical, Agency / Contractor: T1019 SC",
    "PA, Medical, Self-Directed: T1019 SCSC"
  ],
  "Scheduled Team Conference": [
    "Scheduled Team Conference(Team Collaboration):G9007 U2"
  ],
  "Physical Therapy": [
    "Physical Therapy: 97110",
    "Physical Therapy, Consultation: 97110"
  ],
  "Prevocational": [
    "Pre-vocational Services, Individual: H2025",
    "Pre-vocational Services, Individual: H2025 HQ"
  ],
  "Professional Assessment and Monitoring": [
    "Professional Assessment and Monitoring, Registered Nurse: T1002",
    "Professional Assessment and Monitoring, License Practical Nurse: T1003",
    "Professional Assessment and Monitoring, Dietician: S9470"
  ],
  "Remote Supports": [
    "Remote Support: A9999 GT",
    "Remote Support Equipment: A9999 GT SE"
  ],
  "Shared Living": [
    "Shared Living (HOST / COMPANION Home): S5136",
    "Hospital Supports: S5125"
  ],
  "Specialized Medical Equipment and Supplies": [
    "Specialized Medical Equipment and Supplies (SME): T2029"
  ],
  "Speech Therapy": [
    "Speech Therapy: 92507",
    "Speech Therapy, Consultation: 92507"
  ],
  "Support Broker": [
    "Supporter Broker, Agency (SB): T2041"
  ],
  "Supported Employment": [
    "Supportive Employment, Individual (SEI): H2023",
    "Supportive Employment, Group (SEG): H2023 HQ"
  ],
  "Temporary Residential": [
    "Temporary Residential, Daily: H0045",
    "Temporary Residential, 1/4: T1005"
  ],
  "Transportation": [
    "Ambulatory Zone: 1(0-10mi): A0110",
    "w/N Non-Ambulatory Modification Zone: 1(0-10mi): A0110 HE",
    "Ambulatory Zone: 2(10+ to 20mi): T2002",
    "w/Non-Ambulatory Modifications Zone 2(10 + to 20 mi): T2002 HE",
    "Ambulatory Zone: 3(20+ mi): T2003",
    "w/Non-Ambulatory Modifications Zone: 3(20 + mi): T2003 HE"
  ],
  "Virtual Delivery of Services": [
    "Adaptive Behavior Treatment w/ Protocol Modification: 97155 HO",
    "Adaptive Behavior Treatment w/ Protocol Modification: 97155 HN",
    "Behavior Identification Assessment: 97151 HO",
    "Behavior Identification Supporting Assessment-Observational: 97152 HO",
    "Behavior Identification Supporting Assessment-Observational: 97152 HN",
    "Behavior Identification Supporting Assessment-Observational: 97152 HM",
    "Benefits Planning: H0038",
    "Career Planning: T2019",
    "Environmental Accessibility Adaptations Consultation Only: S5165 TC",
    "Family Adaptive Behavior Treatment Guidance: 97156 HO",
    "Family Adaptive Behavior Treatment Guidance: 97156 HN",
    "Group Adaptive Behavior Treatment w/ Protocol Modification: 97158 HO",
    "Group Adaptive Behavior Treatment w/ Protocol Modification: 97158 HN",
    "Health Assessment and Coordination: 99499",
    "Job Development: H0038",
    "Occupational Therapy: 97535-OT",
    "Occupational Therapy, Consultation: 97535-OT",
    "Prevocational Services: H2025",
    "Prevocational Services, Group: H2025 HQ",
    "Remote Supports: A9999 GT",
    "Remote Supports - Equipment: A9999 GTSE",
    "Speech Therapy: 92507-PT",
    "Speech Therapy, Consultation: 92507-PT",
    "Support Broker: T2041",
    "Supported Employment: H2023",
    "Supported Employment, Group: H2023 HQ"
  ]
};

// ── DATA STRUCTURES ──
let employmentEntries = []; 
let legalReps = [];
let commChartRows = [];
let importantPeople = [];
let programServices = []; // Section 7: Program Services
let medicalProfessionals = []; 
let preventions = [];
let immunizations = [];
let medications = [];
let hcbsServices = []; // Section 7: HCBS Services
let currentSupports = []; // Section 9: Current Services
let linkingSupports = []; // Section 9: Linking Services
let goalsData = [];
let transitionStartUpCosts = []; // Section 13: Start-Up Costs // Section 9: Action Plan
let clinicalGoalsTasks = []; // Section 2: Goals/Tasks
let dueProcessItems = []; // Section 15: Due Process
let meetingAttendees = []; // Section 18: Meeting Attendees
let dnrAltInstructions = [];
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
  "referralOtherText",
  "lifeTransitions", "wipaName1", "wipaName2", "u16SoftSkills", "u16Aptitude", "u16Opportunities", "u16SocialCapital", "u16WorkExperience", "u16IndependentLiving", "adultMatchCareer", "adultImproveSkills", "adultLearnBenefits", "transHabCenter", "transNursingHome", "transNewSupported", "commAssessSupports", "commHealthSafetySupports", "commAdjustSupports", "commBackupPlan", 
  "resTypeResidential", "resTypeNaturalHome", "resResourcesYes", "resResourcesNo",
  "resMeansWithin", "resMeansNotWithin", "resMeansNotWithinReason", "resResourcesNoReason", "resHousingExplored",
  "resInformedChoiceYes", "resInformedChoiceNo", "resInformedChoiceNoReason",
  "resSpendingAllowanceAmount", "resSpendingAllowanceSupport",
  "age17Yes", "age17NA", "age17SsiSupport", "age17DifferingOpinionCheck", "age17MinorDifferingOpinion", "age17AdultDifferingOpinion",
  "unemployedCheck", "incomeEmployedCheck", "incomeMaintainCheck", "incomeOwnPayeeCheck",
  "incomeHasPayeeCheck", "incomeEmployedText", "incomeMaintainAmount", "incomeMaintainSupports",
  "incomeOwnPayeeAmount", "incomeOwnPayeeSupports",
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
  "dmhLocation",
  "isTransferring",
  "transferredTcm",
  "transferredOfficeType", "transferredLocation", "transferredHomeType", "transferredAgencyName", "transferredLocationAddress", "transferredNotableChanges",
  "maritalStatus",
  "voterStatus",
  "religion",
  "religionOther",
  "nativeLanguage",
  "otherLanguages",
  "communityInvolvement",
  "communityBarriers",
  // Section 7 - Global Identifiers
  "employmentStatus7",
  "unemployedReasons7",
  "unemployedActivities7",
  "futureEmploymentDiscussions",
  "employerName7",
  "jobTitle7",
  "avgHoursWorked7",
  "competitiveIntegratedWork7",
  "groupSupportedEmploymentJustification7",
  "waiveredServicesUtilized7",
  "naturalSupportsDevelopment7",
  "targetedJobSkillDevelopment7",
  "methodologyEvaluatingNeed7",
  "isHcbsWaivered",

  "hcbsGlobalUpdatesExt1",
  "hcbsGlobalUpdatesCoord1",
  "hcbsGlobalUpdatesExt2",
  "hcbsGlobalUpdatesCoord2",
  "hcbsGlobalUpdatesEmail",
  "hcbsEduQ1",
  "hcbsEduQ2",
  "hcbsEduQ3",
  "hcbsEduQ4",
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
  "medHistory",
  // Section 9 - Community Support
  "hasNonDivisionalWaiver",
  // Section 10 - Ways to Support
  "waysToSupport",
  // Section 12 - Independence/Strengths
  "independenceStrengths",
  // Section 13 - Transition
  "transitionCategory",
  "retirementNotes",
  "referralNotes", "referralOtherText",
  // Section 14 - Behavioral
  "behavioralStatus",
  "behavioralGoalAdded",
  "crisisPlanYes",
  "crisisPlanNo",
  "crisisPlanLocation",
  "crisisPlanDetail",
  "behavioralAssessmentYes",
  "behavioralAssessmentNo",
  "behavioralAssessmentDate",
  "psychotropicProtocol",
  "behavioralNotes",
  // Section 15 - Supervision
  "alteredSupervision",
  "sup_chemicals", "risk_chemicals",
  "sup_cooking", "risk_cooking",
  
  
  "sup_stranger", "risk_stranger",
  
  "sup_choking_risk", "risk_choking_risk",
  "sup_mobility_falls", "risk_mobility_falls",
  
  
  
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
  "hrstDate",
  "hrstTotalScore",
  "hrstTotal4",
  "hrstQScored",
  "hrstLevel",
  "hrstCompletedBy",
  "hrstHasAdditionalInfo",
  "hrstAdditionalInfo",
  "hrstOptOutDate",
  "hrstOptOutExpiration",
  "telehealth",
  "familyMedicalHistory",
  "needsWheelchair",
  "adaptiveEquipment",
  "psychotropicDetails",
  "psychotropicProtocol",
  "selfAdmin",
  "selfAdminGoalAdded",
  "selfAdminSupports",
  "healthParamsOther",
  "hp_Weight",
  "hp_BloodPressure",
  "hp_BloodSugar",
  "hp_Hypertension",
  "hp_SeizureLogs",
  "hp_BowelLogs",
  "healthRisks",
  "criminalBehaviorNotes",
  "evacPlan",
  "dnrStatus",
  "dnrAltMustTake",
  "dnrAltMustAvoid", "dnrAltSettings",
  "dnrAltIndividualName",
  "dnrAltFormLocation",
  "dnrAltReviewDate",
  "seizureProtocols",
  "bowelProtocols",
  "mentalHealthSupports",
  // Misc
  "ethnicityOther",
  "legalSpecify",
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
    hcbs5: "",
    hcbs6: "",
    hcbs7: "",
    hcbs8: "",
    hcbs9: "",
    hcbs10: "",
    hcbs11: "",
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

  container.innerHTML = list.map((s, idx) => {
    if (type === 'current') {
      return `
      <div class="legal-rep-card" style="border-left: 3px solid var(--marion-blue); margin-bottom:15px;">
        <div class="rep-header">
          <span class="rep-title">Current Support #${idx + 1}</span>
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
        </div>
      </div>`;
    } else {
      return `
      <div class="legal-rep-card" style="border-left: 3px solid var(--marion-blue); margin-bottom:15px;">
        <div class="rep-header">
          <span class="rep-title">Linking Support #${idx + 1}</span>
          <button class="remove-rep-btn" onclick="removeSupport(${s.id}, '${type}')">×</button>
        </div>
        <div class="form-grid">
          <div class="field-group"><label>Service</label><input type="text" value="${esc(s.description)}" oninput="updateSupportField(${s.id}, '${type}', 'description', this.value)"></div>
          <div class="field-group"><label>Purpose</label><input type="text" value="${esc(s.purpose)}" oninput="updateSupportField(${s.id}, '${type}', 'purpose', this.value)"></div>
          <div class="field-group full">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
              <label style="margin-bottom: 0;">Enrollment Info</label>
              <label style="display: flex; align-items: center; gap: 8px; font-weight: 600; cursor: pointer; text-transform: none; color: var(--text-main); margin-bottom: 0; font-size: 11px;">
                <input type="checkbox" ${s.notUtilizing ? "checked" : ""} onchange="updateSupportField(${s.id}, '${type}', 'notUtilizing', this.checked)"> DMH Service-Not Currently Utilizing
              </label>
            </div>
            <input type="text" value="${esc(s.enrollmentInfo)}" placeholder="Location address, contact phone / e-mail" oninput="updateSupportField(${s.id}, '${type}', 'enrollmentInfo', this.value)">
          </div>
        </div>
      </div>`;
    }
  }).join("");
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
      <div class="form-grid" style="grid-template-columns: 1fr 1fr 1fr;">
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
          <label>Program Enrollment Status</label>
          <select onchange="updateProgramServiceField(${p.id},'programStatus',this.value)">
            <option value="">Select Status...</option>
            <option value="Active" ${p.programStatus === "Active" ? "selected" : ""}>Active</option>
            <option value="Inactive" ${p.programStatus === "Inactive" ? "selected" : ""}>Inactive</option>
            <option value="Waitlist" ${p.programStatus === "Waitlist" ? "selected" : ""}>Waitlist</option>
            <option value="Pending Approval" ${p.programStatus === "Pending Approval" ? "selected" : ""}>Pending Approval</option>
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
          
          <div style="margin-top: 15px;">
            <label style="font-size: 11px; margin-bottom: 5px; display: block;">5. Discuss funding for program/employment.</label>
            <textarea style="width: 100%; min-height: 60px;" oninput="updateProgramServiceField(${p.id},'hcbs5',this.value)">${esc(p.hcbs5)}</textarea>
          </div>
          
          <div style="margin-top: 15px;">
            <label style="font-size: 11px; margin-bottom: 5px; display: block;">6. Discuss hours of the program.</label>
            <input type="text" style="width: 100%;" oninput="updateProgramServiceField(${p.id},'hcbs6',this.value)" value="${esc(p.hcbs6)}">
          </div>
          
          <div style="margin-top: 15px;">
            <label style="font-size: 11px; margin-bottom: 5px; display: block;">7. Discuss if medications are taken at Program DMH facility.</label>
            <textarea style="width: 100%; min-height: 60px;" oninput="updateProgramServiceField(${p.id},'hcbs7',this.value)">${esc(p.hcbs7)}</textarea>
          </div>
          
          <div style="margin-top: 15px;">
            <label style="font-size: 11px; margin-bottom: 5px; display: block;">8. Discuss IEP and supports for school.</label>
            <textarea style="width: 100%; min-height: 60px;" oninput="updateProgramServiceField(${p.id},'hcbs8',this.value)">${esc(p.hcbs8)}</textarea>
          </div>
          
          <div style="margin-top: 15px;">
            <label style="font-size: 11px; margin-bottom: 5px; display: block;">9. Current release signed for school date:</label>
            <input type="text" style="width: 100%; max-width: 200px;" placeholder="Date..." oninput="updateProgramServiceField(${p.id},'hcbs9',this.value)" value="${esc(p.hcbs9)}">
          </div>
          
          <div style="margin-top: 15px;">
            <label style="font-size: 11px; margin-bottom: 5px; display: block;">10. Dates requested IEP if IEP not received (include log notes):</label>
            <textarea style="width: 100%; min-height: 60px;" placeholder="_____,______,___" oninput="updateProgramServiceField(${p.id},'hcbs10',this.value)">${esc(p.hcbs10)}</textarea>
          </div>
          
          <div style="margin-top: 15px;">
            <label style="font-size: 11px; margin-bottom: 5px; display: block;">11. Additional Funding/Supports (e.g. Easterseals PAC funding, BRT, Counseling, etc.):</label>
            <textarea style="width: 100%; min-height: 60px;" oninput="updateProgramServiceField(${p.id},'hcbs11',this.value)">${esc(p.hcbs11)}</textarea>
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
    throughDate: "",
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
        <div class="field-group"><label>Through Date</label><input type="date" value="${esc(goal.throughDate || '')}" oninput="updateGoalField(${goal.id},'throughDate',this.value)"></div>
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


// ── SECTION 13 LOGIC ──
function updateCommunityTransitionUI() {
  const isHab = document.getElementById("transHabCenter")?.checked;
  const isNurse = document.getElementById("transNursingHome")?.checked;
  const isNew = document.getElementById("transNewSupported")?.checked;
  
  const wrap = document.getElementById("communityTransitionFields");
  if (wrap) wrap.style.display = (isHab || isNurse || isNew) ? "flex" : "none";
  
  const msg = document.getElementById("congregateSettingMsg");
  if (msg) msg.style.display = (isHab || isNurse) ? "block" : "none";
}

function renderTransitionCosts() {
  const container = document.getElementById("transitionStartUpCostContainer");
  if (!container) return;
  
  if (transitionStartUpCosts.length === 0) {
    container.innerHTML = "";
    return;
  }
  
  container.innerHTML = transitionStartUpCosts.map((item, i) => `
    <div style="display: flex; gap: 10px; align-items: end; background: var(--header-bg); padding: 10px; border: 1px solid var(--border); border-radius: 6px;">
      <div class="field-group" style="flex: 2; margin-bottom: 0;">
        <label style="font-size: 11px;">Item</label>
        <input type="text" value="${esc(item.itemName || "")}" placeholder="Item description" oninput="updateTransitionCost(${i}, 'itemName', this.value)">
      </div>
      <div class="field-group" style="flex: 1; margin-bottom: 0;">
        <label style="font-size: 11px;">Cost</label>
        <input type="text" value="${esc(item.itemCost || "")}" placeholder="$0.00" oninput="updateTransitionCost(${i}, 'itemCost', this.value)">
      </div>
      <button class="btn btn-outline" style="color: var(--danger); border-color: var(--danger); margin-bottom: 0;" onclick="removeTransitionCost(${i})">X</button>
    </div>
  `).join("");
}

function addTransitionCost() {
  transitionStartUpCosts.push({ itemName: "", itemCost: "" });
  renderTransitionCosts();
  updateUI();
}

function updateTransitionCost(idx, field, val) {
  transitionStartUpCosts[idx][field] = val;
  updateUI();
}

function removeTransitionCost(idx) {
  transitionStartUpCosts.splice(idx, 1);
  renderTransitionCosts();
  updateUI();
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

function updateReferralUI() {
  const isOther = document.getElementById('referralOtherCheck')?.checked;
  const div = document.getElementById('referralOtherDiv');
  if (div) div.style.display = isOther ? "block" : "none";
}


function updateTransitionCostTotal() {
  const totalDiv = document.getElementById('transitionStartUpTotal');
  if (!totalDiv) return;
  if (transitionStartUpCosts.length === 0) {
    totalDiv.style.display = 'none';
    return;
  }
  let total = 0;
  transitionStartUpCosts.forEach(item => {
    let c = (item.itemCost || "").replace(/[^0-9.]/g, '');
    let val = parseFloat(c);
    if (!isNaN(val)) total += val;
  });
  totalDiv.innerText = `Total: ${total.toFixed(2)}`;
  totalDiv.style.display = 'block';
}

function updateBehavioralStatusUI() {
  const container = document.getElementById("behavioralStatusContainer");
  const tags = document.getElementById("behavioralStatusTags");
  const hiddenInput = document.getElementById("behavioralStatus");
  if(!container || !tags || !hiddenInput) return;
  
  const checkboxes = container.querySelectorAll('input[type="checkbox"]');
  const selected = [];
  checkboxes.forEach(cb => {
    if (cb.checked) selected.push(cb.value);
  });
  
  if (selected.length === 0) {
    tags.innerHTML = '<span class="placeholder">Select options...</span>';
  } else {
    tags.innerHTML = selected.map(val => `<span class="tag">${val}</span>`).join('');
  }
  
  hiddenInput.value = selected.join(", ");
}

function restoreBehavioralStatus(val) {
  if (!val) return;
  const container = document.getElementById("behavioralStatusContainer");
  if (!container) return;
  const checkboxes = container.querySelectorAll('input[type="checkbox"]');
  const selected = val.split(", ").map(s => s.trim());
  checkboxes.forEach(cb => {
    cb.checked = selected.includes(cb.value);
  });
  updateBehavioralStatusUI();
}


function toggleCrisisPlan() {
  const isYes = document.getElementById("crisisPlanYes")?.checked;
  const container = document.getElementById("crisisPlanDetailsContainer");
  if(container) container.style.display = isYes ? "block" : "none";
}

function toggleBehavioralAssessment() {
  const isYes = document.getElementById("behavioralAssessmentYes")?.checked;
  const container = document.getElementById("behavioralAssessmentDateContainer");
  if(container) container.style.display = isYes ? "block" : "none";
}

function updateUI() {
  if(typeof toggleTransferringLocation === 'function') toggleTransferringLocation();
  updateTransitionCostTotal();
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

  head("1. PCSP COVER LETTER / FACE SHEET");
  line("Marion County Services for the Developmentally Disabled");
  line("═".repeat(67));
  line("");
  field("INDIVIDUAL NAME", displayName.toUpperCase());
  field("DMH ID #", displayDMH);
  field("FUNDING", getVal("coverFundingType").toUpperCase());
  line("\nMISSOURI PCSP OFFICIAL DOCUMENT\n" + "═".repeat(67) + "\n");

  head("2. DEMOGRAPHICS & LEGAL AUTHORITY");
  line("Legal Representatives:");
  line(getLegalRepsNarrative());
  line("");
  field("TCM Agency", getVal("coordinator"));
  field("DMH Office Type", getVal("officeType"));
  if (getVal("officeType")) {
    field("DMH Facility Location", getVal("dmhLocation"));
  }
  field("Marital", getVal("maritalStatus"));
  if (document.getElementById("isTransferring")?.checked) {
    field("Transferring", "Yes");
    field("Transferred TCM Agency", getVal("transferredTcm"));
    field("Transferred DMH Office Type", getVal("transferredOfficeType"));
    if (getVal("transferredOfficeType")) {
      field("Location of Facility", getVal("transferredLocation"));
    }
    const homeType = getVal("transferredHomeType");
    if (homeType) {
      field("Transferred DMH Home / Facility", homeType);
      if (homeType === "DMH Home or Facility") {
        field("Name of Agency", getVal("transferredAgencyName"));
      }
    }
    field("Transferred Location Address", getVal("transferredLocationAddress"));
    field("Notable Changes due to Transfer", getVal("transferredNotableChanges"));
  }
  const rel = getVal("religion");
  if (rel === "Other") {
    field("Religion", getVal("religionOther"));
  } else {
    field("Religion", rel);
  }
  
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
  field("Legal Licenses", getVal("legalLicensesProbation"));
  line("");

  head("3. PREFERENCES, LIKES AND SPECIAL INTERESTS");
  field("Likes Activities", getVal("likesActivities"));
  field("Likes Foods", getVal("likesFoods"));
  field("Likes Places", getVal("likesPlaces"));
  field("Other Likes", getVal("likesOther"));
  line("");

  head("4. DISLIKES");
  field("Dislikes Activities", getVal("dislikesActivities"));
  field("Dislikes Foods", getVal("dislikesFoods"));
  field("Other Dislikes", getVal("dislikesOther"));
  line("");

  head("5. IMPORTANT PEOPLE AND/OR PETS");
  line(
    importantPeople.map((p) => `  - ${p.name || "[Name]"} (${p.relationship || "Relationship"})${p.activities ? "\n    Activities/Frequency: " + p.activities : ""}`).join("\n") ||
      "  None Listed",
  );
  field("Exploratory Relationships", getVal("relationshipsExplore"));
  line("");

  head("6. HOPES, DREAMS, ASPIRATIONS AND CONCERNS");
  field("Aspirations", getVal("aspirations"));
  field("Concerns", getVal("concerns"));
  line("");

  /* Removed duplicate section 6 output (moved to Section 8) */

  head("7. COMMUNICATION");
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

  head("8. PROGRAM OR OTHER SERVICES");
  
  line("Employment Status:");
  const empStatus7 = getVal("employmentStatus7");
  field("Status", empStatus7);
  if (empStatus7 === "Unemployed") {
    field("Reasons for excluding employment", getVal("unemployedReasons7"));
    field("Career Planning Activities", getVal("unemployedActivities7"));
    field("Future Employment Discussions", getVal("futureEmploymentDiscussions"));
  } else if (empStatus7 === "Employed") {
    field("Employer Name", getVal("employerName7"));
    field("Job Title", getVal("jobTitle7"));
    field("Avg. Hours/Week", getVal("avgHoursWorked7"));
    field("Competitive & Integrated", getVal("competitiveIntegratedWork7"));
    const groupSupport = getVal("groupSupportedEmploymentJustification7");
    if (groupSupport) {
      field("Group Supported Justification", groupSupport);
    }
    
    const waiveredUtilized = getVal("waiveredServicesUtilized7");
    field("Waivered Employment Services Utilized?", waiveredUtilized);
    if (waiveredUtilized === "Yes") {
      field("Natural Supports Development", getVal("naturalSupportsDevelopment7"));
      field("Targeted Job Skill Development", getVal("targetedJobSkillDevelopment7"));
      field("Evaluating Need Methodology", getVal("methodologyEvaluatingNeed7"));
    }
  }
  line("");



  /*
  if (programServices.length > 0) {
    line("Authorized Services & Waivers Matrix:");
    programServices.forEach((s, idx) => {
      line(`  [${idx + 1}] PROGRAM DEFINITION:`);
      line(`      Payer Source/Type: ${s.payerSource || "—"}`);
      line(`      Enrollment Status: ${s.programStatus || "—"}`);
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
        line(`        5. Funding for program/employment: ${s.hcbs5 || "—"}`);
        line(`        6. Hours of the program: ${s.hcbs6 || "—"}`);
        line(`        7. Medications at Program DMH facility: ${s.hcbs7 || "—"}`);
        line(`        8. IEP and supports for school: ${s.hcbs8 || "—"}`);
        line(`        9. Current release signed for school date: ${s.hcbs9 || "—"}`);
        line(`        10. Dates requested IEP if not received: ${s.hcbs10 || "—"}`);
        line(`        11. Additional Funding/Supports: ${s.hcbs11 || "—"}`);
      }
      line("");
    });
  } else {
    // line("Authorized Services: None documented.");
    // line("");
  }
  */

  const isHcbsWaivered = getVal("isHcbsWaivered");
  field("Is individual receiving HCBS Waiver services?", isHcbsWaivered);
  if (isHcbsWaivered === "Yes" || isHcbsWaivered === "No") {
    line("HCBS Waiver Choice & Education:");
    const isWaivered = document.getElementById("isHcbsWaivered") ? document.getElementById("isHcbsWaivered").value : "";
    if (hcbsServices.length === 0) {
      line("  No HCBS Services/Programs documented.");
    } else {
      hcbsServices.forEach((s, idx) => {
        line(`  [${idx + 1}] Service / Program: ${s.serviceName || "—"}`);
        if (s.subcategories && s.subcategories.length > 0) {
          field("      Subcategories", s.subcategories.map(sub => {
            let parts = [sub.name];
            if (sub.pos21) parts.push("[-POS21 Inpatient]");
            if (sub.pos02) parts.push("[-POS02 Other than patient's home]");
            if (sub.pos10) parts.push("[-10 In patient's home]");
            return parts.join(" ");
          }).join(" | "));
        }
        if (s.serviceDetails && !s.sdsUtilized) field("      Service/Program Details", s.serviceDetails);
        if (s.serviceHours && !s.sdsUtilized) field("      Provided hours", s.serviceHours);
        
        field("      Program", Array.isArray(s.q5Funding) && s.q5Funding.length > 0 ? s.q5Funding.join(", ") : "");
        if (s.medicationDMH) {
          field("      Medication taken at Program(DMH Facility)", "Yes");
          if (s.medicationDMHDetails) {
            field("      Medication Details", s.medicationDMHDetails);
          }
        }
        
        if (s.sdsUtilized) {
          line("      -- Self-Directed Services (SDS) --");
          field("      Designated Representative", s.sdsDesignatedRep);
          field("      Training Exemptions Justification", s.sdsTrainingExemptions);
          field("      SDS Back-up Plan", s.sdsBackupPlan);
          field("      Budget Allocation Complete & Matches", s.sdsBudgetAllocationMatch ? "Yes" : "No");
          field("      DHSS State Plan Auth Checked", s.sdsDhssAuthChecked ? "Yes" : "No");
          field("      Paid Family Member Providing Supports?", s.sdsPaidFamilyMember);
          if (s.sdsPaidFamilyMember === "Yes") {
            field("        Individual opposed to family member?", s.sdsFamilyOpposed);
            if (s.sdsFamilyOpposed === 'Yes') {
              field("        Opposition Details", s.sdsFamilyOpposedDetails);
            }
            field("        Supports solely for individual", s.sdsFamilyHouseholdTasks ? "Yes" : "No");
            if (!s.sdsFamilyHouseholdTasks) {
              field("        Household Tasks Details", s.sdsFamilyHouseholdTasksDetails);
            }
            field("        Team agrees family best meets needs", s.sdsFamilyBestMeetNeeds ? "Yes" : "No");
            if (!s.sdsFamilyBestMeetNeeds) {
              field("        Team Agreement Details", s.sdsFamilyBestMeetNeedsDetails);
            }
          }
        }
        
        if (isWaivered === 'Yes') {
          field("      Signee", s.whoSigned);
          field("      Name of Signee", s.signeeNames);
          field("      Provider & Services Choice Statement Effective Signed Date", s.signedDate);
          field("      Updated edit to previously signed Statement", s.isUpdate ? "Yes" : "No");
          if (s.isUpdate) {
            field("      Previous Signed Date", s.prevSignedDate);
          }
          line("");
          
          if (s.sig2Date || s.sig2Who || s.sig2Names) {
            line("      Additional Signature:");
            field("        Signee", s.sig2Who);
            field("        Name of Signee", s.sig2Names);
            field("        Effective Signed Date", s.sig2Date);
            line("");
          }
          if (s.sig3Date || s.sig3Who || s.sig3Names) {
            line("      3rd Signature:");
            field("        Signee", s.sig3Who);
            field("        Name of Signee", s.sig3Names);
            field("        Effective Signed Date", s.sig3Date);
            line("");
          }
          field("      1. Informed of options", s.q1);
          if (!s.q2UnableToSupport && !s.q2Educated && s.q2) {
            field("      2. Informed of range", s.q2);
          } else {
            line("      2. Informed of range:");
            if (s.q2UnableToSupport) {
              line("         [x] Provider is unable to support the individual in achieving his/her personal identified goals.");
              if (s.q2UnableToSupportReason) {
                line(`             Problem: ${s.q2UnableToSupportReason}`);
              }
            }
            if (s.q2Educated) {
              line("         [x] Educated and Informed of the Full Range of HCBS");
              line(`             Provider: ${s.q2EducatedProvider || "______"}, agreed to support Individual: ${s.q2EducatedIndividual || "________"} achievement of his/her personally identified goals.`);
            }
            if (!s.q2UnableToSupport && !s.q2Educated) {
              line("         —");
            }
          }
          field("      3. Alternatives considered", s.q4);
          line("");
          
          if (s.hasBackupPlan) {
            line("      -- Backup Plan --");
            if (Array.isArray(s.backupPlanDetailsArray) && s.backupPlanDetailsArray.length > 0) {
              s.backupPlanDetailsArray.forEach((bp, bpIdx) => {
                if (bp.trim()) line(`      • ${bp.trim()}`);
              });
            } else if (s.backupPlanDetails) {
              line(`      • ${s.backupPlanDetails}`);
            }
            line("");
          } else {
            line("      -- Backup Plan --");
            line("      The individual's needs were assessed, and based on that assessment, no additional individualized Backup Plans were identified as necessary at this time.");
            line("");
          }
        }
      });
      
      if (isHcbsWaivered === "No") {
        field("  4. Additional Funding/Supports", getVal("hcbsEduQ4"));
        line("");
      }
      
      const ext1 = getVal("hcbsGlobalUpdatesExt1") || "____";
      const coord1 = getVal("hcbsGlobalUpdatesCoord1") || "_______";
      const ext2 = getVal("hcbsGlobalUpdatesExt2") || "____";
      const coord2 = getVal("hcbsGlobalUpdatesCoord2") || "_______";
      const email = getVal("hcbsGlobalUpdatesEmail") || "_____________";
      
      line("  For all Waivered services and programs, Individual to request updates as needed may contact:");
      line(`  If updates are needed to the plan, contact the SC team at (573) 248-1077, ext. ${ext1} Coordinator: ${coord1} or ext. ${ext2} Coordinator: ${coord2} or by E-Mail: ${email}`);
      line("");
      
      
      line("  -- Education --");
      field("      1. IEP and supports for school", getVal("hcbsEduQ1"));
      field("      2. Current release signed for school date", getVal("hcbsEduQ2"));
      field("      3. Dates requested IEP if not received", getVal("hcbsEduQ3"));
      line("");
    }
  }


  head("9. HEALTH, SAFETY & RISK PLANNING (MEDICAL PROFILE)");
  field("Diagnosis", getVal("diagnosis"));
  field("Personal Outcomes", getVal("personalOutcomes"));
  const hrstStatus = getVal("hrstStatus");
  field("HRST Status", hrstStatus);
  if (hrstStatus === "Complete") {
    field("  - Completion Date", getVal("hrstDate"));
    field("  - Total Score", getVal("hrstTotalScore"));
    field("  - Total 4 Ratings", getVal("hrstTotal4"));
    field("  - Q Scored", getVal("hrstQScored"));
    field("  - Healthcare Level", getVal("hrstLevel"));
    field("  - Completed By", getVal("hrstCompletedBy"));
    if (document.getElementById("hrstHasAdditionalInfo")?.checked) {
      field("  - Additional Info", getVal("hrstAdditionalInfo"));
    }
  } else if (hrstStatus === "Opt-Out (Form in Packet)") {
    field("  - Opt-Out Date", getVal("hrstOptOutDate"));
    field("  - Expiration Date", getVal("hrstOptOutExpiration"));
  }
  field("Telehealth Used?", getVal("telehealth"));
  field("Family Medical History", getVal("familyMedicalHistory"));
  
  if (document.getElementById("needsWheelchair")?.checked) {
    line("Adaptive / Specialized Medical Equipment:");
    line("  - [X] Needs Wheelchair Assistance");
    field("  - Details", getVal("adaptiveEquipment"));
  } else {
    field("Adaptive / Specialized Medical Equipment", getVal("adaptiveEquipment"));
  }
  field("Past Physical/Mental Illnesses, Traumatic Experiences, Stressors", getVal("medHistory"));
  
  if (medicalProfessionals.length > 0) {
    line("Providers & Specialists:");
    medicalProfessionals.forEach((m, idx) => {
      let cat = m.category === "Other" && m.categoryOther ? m.categoryOther : m.category;
      line(`  [${idx + 1}] ${cat}`);
      field("      Name", m.name);
      if (m.contact) field("      Contact", m.contact);
      if (m.frequency) field("      Frequency", m.frequency);
      if (m.date) field("      Date", m.date);
      if (m.results) field("      Results/Details", m.results);
    });
  }

  if (preventions.length > 0) {
    line("Prevention:");
    preventions.forEach((m, idx) => {
      line(`  [${idx + 1}] ${m.name}`);
      if (m.results) field("      Details", m.results);
    });
  }

  if (immunizations.length > 0) {
    line("Residential Immunizations & Cancer Screenings:");
    immunizations.forEach((m, idx) => {
      line(`  [${idx + 1}] ${m.name}`);
      if (m.contact) field("      Contact/Facility", m.contact);
      if (m.frequency) field("      Frequency", m.frequency);
      if (m.date) field("      Date", m.date);
      if (m.results) field("      Results/Details", m.results);
    });
  }

  if (medications.length > 0) {
    line("Current Medications:");
    medications.forEach((m, idx) => {
      line(`  [${idx + 1}] ${m.name}`);
      if (m.frequency) field("      Dosage/Frequency", m.frequency);
      if (m.results) field("      Results/Notes", m.results);
    });
  }

  field("Psychotropic Medications (Purpose, Dosage, Risk Factors)", getVal("psychotropicDetails"));
  field("PRN Psychotropic Protocol", getVal("psychotropicProtocol"));
  
  const selfAdminStatus = getVal("selfAdmin");
  field("Self-Administration of Meds", selfAdminStatus);
  if (selfAdminStatus === "Needs Supports") {
    const goalAdded = document.getElementById("selfAdminGoalAdded")?.checked;
    field(" - Goal Added in Action Plan", goalAdded ? "Yes" : "No (Required)");
  }
  if (selfAdminStatus === "Independent" || selfAdminStatus === "Needs Supports") {
    field(" - Supports Needed to Maintain Skill", getVal("selfAdminSupports"));
  }
  const healthP = [];
  document.querySelectorAll('#healthParamsContainer input[type="checkbox"]:checked').forEach(cb => healthP.push(cb.value));
  if (healthP.length === 0) {
    field("Parameters or Protocols for Diagnosis", "None Selected");
  } else {
    line("Parameters or Protocols for Diagnosis:");
    healthP.forEach(param => {
      let val = "";
      if (param === "Weight") val = getVal("hp_Weight");
      else if (param === "Blood Pressure") val = getVal("hp_BloodPressure");
      else if (param === "Blood Sugar") val = getVal("hp_BloodSugar");
      else if (param === "Hypertension") val = getVal("hp_Hypertension");
      else if (param === "Seizure Logs") val = getVal("hp_SeizureLogs");
      else if (param === "Bowel Logs" || param === "Bowel Movement Logs") val = getVal("hp_BowelLogs");
      
      field(`  - ${param}`, val);
    });
  }
  field("Other Parameters / Protocols", getVal("healthParamsOther"));
  const dnrStatus = getVal("dnrStatus");
  field("DNR / CPR Status", dnrStatus);
  if (dnrStatus === "Alternative to CPR (Waivered)") {
    line("");
    line("ALTERNATIVE TO CPR DETAILS:");
    line("  1. Specified Modified Interventions");
    line(`     - Staff MUST TAKE: In a cardiac or respiratory emergency, staff will not perform chest compressions or standard CPR. Staff will immediately administer ${getVal("dnrAltMustTake") || "__________"} and call 911.`);
    line(`     - MUST AVOID: ${getVal("dnrAltMustAvoid") || "__________"}`);
    line(`  Residential or Service Setting: ${getVal("dnrAltSettings") || "__________"}`);
    line("  2. Emergency Services (911) Protocol");
    line("     Staff will call 911 immediately during an emergency. Staff must present the original, signed ALTERNATIVE to CPR Order Form directly to the first responders upon their arrival.");
    line("  3. Staff Training Requirements");
    line(`     All staff supporting ${getVal("dnrAltIndividualName") || "__________"} must be trained by a qualified medical professional on the specific protocols outlined in the Alternative to CPR Order prior to working independently.`);
    line("  4. Location of the Physical Form");
    line(`     The original, signed Appendix D Alternative to CPR Form is located ${getVal("dnrAltFormLocation") || "__________"}.`);
    line("  5. Review and Oversight Schedule");
    line(`     Plan Re-evaluation: ${getVal("dnrAltReviewDate") || "__________"}`);
    line("     The Alternative to CPR protocol will be reviewed continuously by the planning team and the attending physician at minimum during the annual PCSP meeting, or sooner if a change in health status occurs.");
    if (dnrAltInstructions && dnrAltInstructions.length > 0) {
      line("  Specific Modified Instructions:");
      dnrAltInstructions.forEach((item) => line(`     - ${item.text}`));
    }

    line("");
  }
  field("Known Suspected Health Risks", getVal("healthRisks"));
  field("Risk Level", getVal("riskLevel"));
  field("Supervision Level", getVal("supervisionLevel"));
  field("Seizure Protocols", getVal("seizureProtocols"));
  field("Bowel Problems / Protocols", getVal("bowelProtocols"));
  field("Mental Health Supports", getVal("mentalHealthSupports"));
  field("Allergies / Sensitivities / Reactions", getVal("allergies"));
  line("");

  head("10. COMMUNITY NATURAL AND NON-DIVISION SUPPORT");
  if (document.getElementById("hasNonDivisionalWaiver")?.checked) {
    line("Non-Divisional Waiver: Yes");
  }
  line("");
  
  if (currentSupports.length > 0) {
    line("Current Services:");
    currentSupports.forEach((s, idx) => {
      line(`  [${idx + 1}] Support: ${s.description || "—"} (${s.type})`);
      line(`      Purpose: ${s.purpose || "—"}`);
      line(`      Freq: ${s.frequency || "—"}`);
    });
    line("");
  }

  if (linkingSupports.length > 0) {
    line("Linking Services:");
    linkingSupports.forEach((s, idx) => {
      line(`  [${idx + 1}] Service: ${s.description || "—"}`);
      line(`      Purpose: ${s.purpose || "—"}`);
      const utilizingStr = s.notUtilizing ? " [DMH Service-Not Currently Utilizing]" : "";
      if (s.enrollmentInfo || s.notUtilizing) {
        line(`      Enrollment Info: ${s.enrollmentInfo || "—"}${utilizingStr}`);
      }
    });
    line("");
  }
  
  head("11. WAYS TO SUPPORT THE INDIVIDUAL");
  field("Assessment Limitations", getVal("maasTools"));
  field("Rituals & Routines", getVal("ritualsRoutines"));
  field("Religious supports", getVal("religiousSupports"));
  field("Staff Preference", getVal("staffPreference"));

  const learnS = [];
  document.querySelectorAll('#learningStyleContainer input[type="checkbox"]:checked').forEach(cb => learnS.push(cb.value));
  field("Learning Styles", learnS.length ? learnS.join(", ") : "None Selected");

  field("Learning Style Notes", getVal("learningStyleNotes"));
  
  field("Cultural Considerations", getVal("culturalDifferences"));

  let incomeText = [];
  if (document.getElementById("unemployedCheck")?.checked) {
    incomeText.push("Unemployed");
  }
  if (document.getElementById("incomeEmployedCheck")?.checked) {
    incomeText.push(`Employed: ${getVal("incomeEmployedText") || "Not specified"}`);
  }
  if (document.getElementById("incomeMaintainCheck")?.checked) {
    let v = getVal("incomeMaintainAmount");
    let s = getVal("incomeMaintainSupports");
    incomeText.push(`Maintain Benefits: ${v ? "$" + v : "No amount specified"} - Supports: ${s || "None"}`);
  }
  if (document.getElementById("incomeOwnPayeeCheck")?.checked) {
    let v = getVal("incomeOwnPayeeAmount");
    let s = getVal("incomeOwnPayeeSupports");
    incomeText.push(`Own Payee: ${v ? "$" + v : "No amount specified"} - Supports: ${s || "None"}`);
  }
  if (document.getElementById("incomeHasPayeeCheck")?.checked) {
    incomeText.push(`Has Payee: (Refer to Demographics section under Payee)`);
  }
  if (incomeText.length > 0) {
    field("Personal Income", incomeText.join(" | "));
  } else {
    field("Personal Income", "Not specified");
  }

  
  if (document.getElementById("resTypeResidential")?.checked || document.getElementById("resTypeNaturalHome")?.checked) {
    let resType = document.getElementById("resTypeResidential")?.checked ? "Residential" : "Natural Home";
    field("Residential Setup", resType);
    
    if (document.getElementById("resTypeResidential")?.checked) {
       let resC = document.getElementById("resResourcesYes")?.checked ? "Yes" : (document.getElementById("resResourcesNo")?.checked ? "No" : "Not specified");
       if (document.getElementById("resResourcesYes")?.checked) {
         if (document.getElementById("resMeansWithin")?.checked) resC += " (Within means)";
         if (document.getElementById("resMeansNotWithin")?.checked) resC += ` (Not within means: ${getVal("resMeansNotWithinReason")})`;
       } else if (document.getElementById("resResourcesNo")?.checked) {
         resC += ` (Reason: ${getVal("resResourcesNoReason")})`;
       }
       field("Resources Considered for Room & Board", resC);
       field("Housing Resources Explored", getVal("resHousingExplored"));
       
       let ic = document.getElementById("resInformedChoiceYes")?.checked ? "Yes" : (document.getElementById("resInformedChoiceNo")?.checked ? `No - ${getVal("resInformedChoiceNoReason")}` : "Not specified");
       field("Informed Choice Given", ic);
       
       field("Monthly Spending Allowance", `${getVal("resSpendingAllowanceAmount") || "0"} - Supports: ${getVal("resSpendingAllowanceSupport")}`);
    }
  }

  if (document.getElementById("age17Yes")?.checked) {
    field("Transitioning Youth - School (Age 17+ SSI Prep)", getVal("age17SsiSupport"));
    if (document.getElementById("age17DifferingOpinionCheck")?.checked) {
      field("Differing Opinions (Minor)", getVal("age17MinorDifferingOpinion"));
      field("Differing Opinions (Adult)", getVal("age17AdultDifferingOpinion"));
    }
  } else if (document.getElementById("age17NA")?.checked) {
    field("Transitioning Youth - School", "Not Applicable");
  }

  field("Water Temp Req", getVal("waterTemp"));

  field("General Strategies", getVal("waysToSupport"));
  line("");

  line("11. [SECTION 11 NOT SPECIFIED]");
  line("");

  head("12. INDEPENDENCE PERSONAL STRENGTHS AND ASSETS");
  field("Strengths/Assets", getVal("independenceStrengths"));
  line("");

  head("13. TRANSITION YOUTH / ADULTS / COMMUNITY");
  head("13. TRANSITION YOUTH / ADULTS / COMMUNITY");
  
  const lifeTrans = getVal("lifeTransitions");
  if (lifeTrans) {
    line("LIFE TRANSITIONS:");
    line("  " + lifeTrans);
    line("");
  }
  
  const wName1 = getVal("wipaName1") || "[Individual]";
  const wName2 = getVal("wipaName2") || "[Individual]";
  line("ASSET DEVELOPMENT AND FINANCIAL LITERACY:");
  line(`  To promote financial literacy, self-determination, and a successful transition into the workforce, ${wName1} will utilize the Work Incentives Planning and Assistance (WIPA) program. A certified Community Work Incentives Coordinator (CWIC) will provide the individualized benefits counseling to evaluate how the employment wages will interact with Supplemental Security Income (SSI) Social Security Disability Insurance (SSDI), Medicaid/Medicare, and other public benefits. This collaborative planning will empower ${wName2} to maximize active Social Security work incentives, mitigate the risk of overpayments, and build long-term economic independence.`);
  line("");

  const transCat = getVal("transitionCategory");
  field("Category / Life Stage", transCat);
  
  if (transCat === "School Age (Under 16)") {
    line("  EARLY TRANSITION & SOFT SKILL DEVELOPMENT (TEAM DISCUSSION):");
    field("  Self-Determination/Soft Skills", getVal("u16SoftSkills"));
    field("  Interest/Aptitude Exploration", getVal("u16Aptitude"));
    field("  Career Opportunities", getVal("u16Opportunities"));
    field("  Social Capital", getVal("u16SocialCapital"));
    field("  Early Work Experience", getVal("u16WorkExperience"));
    field("  Independent Living Skills", getVal("u16IndependentLiving"));
  } else if (transCat === "Adult / Employment Age") {
    line("  ADULT TRANSITION & EMPLOYMENT (16+):");
    field("  Match Career Interest with Real Work", getVal("adultMatchCareer"));
    field("  Improve Job/Interview Skills", getVal("adultImproveSkills"));
    field("  Learn About Benefits/Services", getVal("adultLearnBenefits"));
    
    // Referrals
    const referralCbs = Array.from(document.querySelectorAll("#referralGrid input[type='checkbox']:checked")).map((cb) => {
      if (cb.value === "Other") return `Other: ${getVal("referralOtherText") || "Not specified"}`;
      return cb.value;
    });
    field("  Community Support Programs", referralCbs.length > 0 ? referralCbs.join(", ") : "None");
    const rNotes = getVal("referralNotes");
    if (rNotes) line("    " + rNotes);
  } else if (transCat === "Retirement Age (65+)") {
    field("  Retirement Status & Context", getVal("retirementNotes"));
  }
  line("");

  // Community
  const isHab = document.getElementById("transHabCenter")?.checked;
  const isNurse = document.getElementById("transNursingHome")?.checked;
  const isNew = document.getElementById("transNewSupported")?.checked;
  
  if (isHab || isNurse || isNew) {
    line("COMMUNITY TRANSITION:");
    let tSources = [];
    if (isHab) tSources.push("Habilitation Center");
    if (isNurse) tSources.push("Nursing Home");
    if (isNew) tSources.push("New Supported Living Setting from a Natural Home");
    line(`  Transitioning From: ${tSources.join(", ")}`);
    
    if (isHab || isNurse) {
      line("  * These Services are Necessary for the Individual to move from this Congregate Setting.");
    }
    
    field("  Assessment Supports", getVal("commAssessSupports"));
    field("  Health & Safety Supports", getVal("commHealthSafetySupports"));
    field("  Adjustment Supports", getVal("commAdjustSupports"));
    field("  Back-up Plan", getVal("commBackupPlan"));
    line("");
  }

  // Start-Up Costs
  if (transitionStartUpCosts.length > 0) {
    line("TRANSITION START-UP COSTS:");
    let startupTotal = 0;
    transitionStartUpCosts.forEach(item => {
      line(`  - ${item.itemName || "Unnamed Item"}: ${item.itemCost || "$0"}`);
      let c = (item.itemCost || "").replace(/[^0-9.]/g, '');
      let val = parseFloat(c);
      if (!isNaN(val)) startupTotal += val;
    });
    line(`  --------------------------`);
    line(`  TOTAL: ${startupTotal.toFixed(2)}`);
    line("");
  }

  head("14. BEHAVIORAL");
  field("Behavioral Status", getVal("behavioralStatus"));
  field("Goal Added in Action Plan", document.getElementById("behavioralGoalAdded")?.checked ? "Yes" : "No");

  const cpYes = document.getElementById("crisisPlanYes")?.checked;
  const cpNo = document.getElementById("crisisPlanNo")?.checked;
  if(cpYes || cpNo) {
    field("Implemented Crisis Plan", cpYes ? "Yes" : "No");
    if(cpYes) {
      field("  Location of Crisis Plan", getVal("crisisPlanLocation"));
      field("  Crisis Plan Details", getVal("crisisPlanDetail"));
    }
  }

  const baYes = document.getElementById("behavioralAssessmentYes")?.checked;
  const baNo = document.getElementById("behavioralAssessmentNo")?.checked;
  if(baYes || baNo) {
    field("Behavioral Assessment Completed by SC", baYes ? "Yes" : "No");
    if(baYes) {
      field("  Assessment Date", getVal("behavioralAssessmentDate"));
      line("  See attachment for Behavioral Risk Assessment details");
    }
  }
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
    { label: "Stranger awareness", id: "stranger" },
    { label: "Choking risk / aspiration supports needed", id: "choking_risk" },
    { label: "Mobility support needs / falls", id: "mobility_falls" }
  ];
  domains.forEach(d => {
    line(`  - ${d.label}: Supervision (${getVal(`sup_${d.id}`)}) | Risk (${getVal(`risk_${d.id}`)})`);
  });
  
  field("Criminal and other Behavior / Probation / Parole", getVal("criminalBehaviorNotes"));
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
  } else {
    line("  - No limitations documented.");
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
          `[${g.domain}] Goal: ${g.goal} | Task: ${g.task} | Responsible: ${g.responsible.join(", ")} | Frequency: ${g.frequency.join(", ")}${g.throughDate ? " | Through Date: " + g.throughDate : ""}`,
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

    // Format for display safely
  let safeHTML = esc(t);
  
  // Highlight Section Headers (starts with digit and dot, e.g. "1. PCSP COVER LETTER")
  safeHTML = safeHTML.replace(/^(.*?\d+\.\s[A-Z0-9\s&;\/\-]+)$/gm, '<span class="print-head">$1</span>');
  
  // Highlight Divider Lines
  safeHTML = safeHTML.replace(/^(─{10,}|═{10,})$/gm, '<span class="print-head-line">$1</span>');
  
  // Highlight Field Labels (any text ending with colon at start of line)
  safeHTML = safeHTML.replace(/^([A-Za-z0-9\s\/\-&;\(\)]+): (.*)$/gm, '<span class="print-label">$1:</span> <span class="print-value">$2</span>');

  document.getElementById("narrativeDisplay").innerHTML = safeHTML;
}

// ── UTILS ──
function toggleMultiSelect(id) {
  document.getElementById(id).classList.toggle("active");
}
function toggleDnrAlt() {
  const status = document.getElementById("dnrStatus")?.value;
  const container = document.getElementById("dnrAltContainer");
  if (container) {
    container.style.display = (status === "Alternative to CPR (Waivered)") ? "block" : "none";
  }
}
function toggleHrstFields() {
  const status = document.getElementById("hrstStatus")?.value;
  const container = document.getElementById("hrstDetailsContainer");
  const optOutContainer = document.getElementById("hrstOptOutContainer");
  
  if (container) {
    container.style.display = (status === "Complete") ? "block" : "none";
  }
  if (optOutContainer) {
    optOutContainer.style.display = (status === "Opt-Out (Form in Packet)") ? "block" : "none";
  }
}
function toggleHrstAdditional() {
  const checked = document.getElementById("hrstHasAdditionalInfo")?.checked;
  const container = document.getElementById("hrstAdditionalInfoContainer");
  if (container) {
    container.style.display = checked ? "block" : "none";
  }
}

function updateHealthParams() {
  const container = document.getElementById("healthParamsContainer");
  const tags = document.getElementById("healthParamsTags");
  const checked = container.querySelectorAll('input[type="checkbox"]:checked');
  tags.innerHTML = "";
  
  // Hide all wrappers first
  const allValues = ["Weight", "Blood Pressure", "Blood Sugar", "Hypertension", "Seizure Logs", "Bowel Logs"];
  allValues.forEach(val => {
    const wrap = document.getElementById("hpWrap_" + val);
    if(wrap) wrap.style.display = "none";
  });

  if (checked.length === 0) {
    tags.innerHTML = '<span class="placeholder">Select Parameters...</span>';
  } else {
    checked.forEach((cb) => {
      const tag = document.createElement("span");
      tag.className = "selected-tag";
      tag.textContent = cb.value;
      tags.appendChild(tag);
      
      const wrap = document.getElementById("hpWrap_" + cb.value);
      if(wrap) wrap.style.display = "block";
    });
  }
  updateUI();
}


function updateResidentialUI(sourceId) {
  if (sourceId === 'resTypeResidential') document.getElementById('resTypeNaturalHome').checked = false;
  if (sourceId === 'resTypeNaturalHome') document.getElementById('resTypeResidential').checked = false;
  
  if (sourceId === 'resResourcesYes') document.getElementById('resResourcesNo').checked = false;
  if (sourceId === 'resResourcesNo') document.getElementById('resResourcesYes').checked = false;
  
  if (sourceId === 'resMeansWithin') document.getElementById('resMeansNotWithin').checked = false;
  if (sourceId === 'resMeansNotWithin') document.getElementById('resMeansWithin').checked = false;
  
  if (sourceId === 'resInformedChoiceYes') document.getElementById('resInformedChoiceNo').checked = false;
  if (sourceId === 'resInformedChoiceNo') document.getElementById('resInformedChoiceYes').checked = false;

  const isResidential = document.getElementById("resTypeResidential")?.checked;
  const wrapPrompt = document.getElementById("residentialPromptFields");
  if (wrapPrompt) wrapPrompt.style.display = isResidential ? "flex" : "none";

  const isResYes = document.getElementById("resResourcesYes")?.checked;
  const wrapResYes = document.getElementById("resResourcesYesFields");
  if (wrapResYes) wrapResYes.style.display = isResYes ? "block" : "none";
  
  const isResNo = document.getElementById("resResourcesNo")?.checked;
  const wrapResNo = document.getElementById("resResourcesNoFields");
  if (wrapResNo) wrapResNo.style.display = isResNo ? "block" : "none";

  const isNotWithin = document.getElementById("resMeansNotWithin")?.checked;
  const wrapNotWithin = document.getElementById("resMeansNotWithinFields");
  if (wrapNotWithin) wrapNotWithin.style.display = isNotWithin ? "block" : "none";

  const isInformedNo = document.getElementById("resInformedChoiceNo")?.checked;
  const wrapInformedNo = document.getElementById("resInformedChoiceNoFields");
  if (wrapInformedNo) wrapInformedNo.style.display = isInformedNo ? "block" : "none";
}


function updateAge17MainUI(sourceId) {
  if (sourceId === 'age17Yes') document.getElementById('age17NA').checked = false;
  if (sourceId === 'age17NA') document.getElementById('age17Yes').checked = false;
  
  const isYes = document.getElementById("age17Yes")?.checked;
  const wrap = document.getElementById("age17Fields");
  if (wrap) wrap.style.display = isYes ? "flex" : "none";
}

function updateAge17UI() {
  const hasDiffering = document.getElementById("age17DifferingOpinionCheck")?.checked;
  const wrapDiff = document.getElementById("age17DifferingOpinionFields");
  if (wrapDiff) wrapDiff.style.display = hasDiffering ? "flex" : "none";
}

function updatePersonalIncomeUI() {
  const unemployed = document.getElementById("unemployedCheck")?.checked;
  const wrapper = document.getElementById("personalIncomeWrapper");
  const tags = document.getElementById("personalIncomeTags");
  
    const employedCheck = document.getElementById("incomeEmployedCheck");
  const employedLabel = employedCheck ? employedCheck.closest("label.multi-option") : null;

  if (wrapper) wrapper.style.display = "block";

  if (unemployed) {
    if (employedLabel) employedLabel.style.display = "none";
    if (employedCheck && employedCheck.checked) {
       employedCheck.checked = false;
    }
  } else {
    if (employedLabel) employedLabel.style.display = "flex";
  }

  // Update Tags
  const container = document.getElementById("personalIncomeContainer");
  if(container) {
    const checked = container.querySelectorAll('input[type="checkbox"]:checked');
    if(tags) {
      tags.innerHTML = "";
      if (checked.length === 0) {
        tags.innerHTML = '<span class="placeholder">Select options...</span>';
      } else {
        checked.forEach((cb) => {
          const tag = document.createElement("span");
          tag.className = "selected-tag";
          tag.textContent = cb.value;
          tags.appendChild(tag);
        });
      }
    }
  }

  const emp = document.getElementById("incomeEmployedCheck")?.checked;
  const maint = document.getElementById("incomeMaintainCheck")?.checked;
  const payee = document.getElementById("incomeOwnPayeeCheck")?.checked;
  const has = document.getElementById("incomeHasPayeeCheck")?.checked;

  if (document.getElementById("incomeEmployedFields")) document.getElementById("incomeEmployedFields").style.display = emp ? "block" : "none";
  if (document.getElementById("incomeMaintainFields")) document.getElementById("incomeMaintainFields").style.display = maint ? "block" : "none";
  if (document.getElementById("incomeOwnPayeeFields")) document.getElementById("incomeOwnPayeeFields").style.display = payee ? "block" : "none";
  if (document.getElementById("incomeHasPayeeFields")) document.getElementById("incomeHasPayeeFields").style.display = has ? "block" : "none";
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
      tag.className = "selected-tag";
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
function toggleHcbsFields() {
  const val = document.getElementById("isHcbsWaivered").value;
  const container = document.getElementById("hcbsFieldsContainer");
  const fundingContainer = document.getElementById("hcbsAdditionalFundingContainer");
  
  if (container) {
    container.style.display = (val === "Yes" || val === "No") ? "block" : "none";
  }
  if (fundingContainer) {
    fundingContainer.style.display = (val === "No") ? "block" : "none";
  }
  renderHcbsServices();
  updateUI();
}
function toggleSelfAdmin8() {
  const val = document.getElementById("selfAdmin").value;
  const goalGroup = document.getElementById("selfAdminGoalContainer");
  const supportsGroup = document.getElementById("selfAdminSupportsContainer");
  
  if (goalGroup) {
    goalGroup.style.display = (val === "Needs Supports") ? "block" : "none";
  }
  if (supportsGroup) {
    supportsGroup.style.display = (val === "Independent" || val === "Needs Supports") ? "block" : "none";
  }
}
function toggleEthnicityOther(cb) {
  document.getElementById("ethnicityOtherGroup").style.display = cb.checked
    ? ""
    : "none";
}
function toggleDmhLocation() {
  const officeType = document.getElementById("officeType").value;
  const container = document.getElementById("dmhLocationContainer");
  if (container) {
    container.style.display = officeType ? "block" : "none";
  }
}
function toggleTransferringLocation() {
  const type = document.getElementById("transferredOfficeType")?.value;
  const container = document.getElementById("transferringLocationContainer");
  if (container) {
    container.style.display = type ? "block" : "none";
  }
}
function toggleTransferringHome() {
  const t = document.getElementById("transferredHomeType")?.value;
  const c = document.getElementById("transferredAgencyContainer");
  if (c) c.style.display = (t === "DMH Home or Facility") ? "block" : "none";
}
function toggleTransferring() {
  const isTransferring = document.getElementById("isTransferring").checked;
  const tcmContainer = document.getElementById("transferringTcmContainer");
  const dmhContainer = document.getElementById("transferringDmhContainer");
  if (tcmContainer) tcmContainer.style.display = isTransferring ? "block" : "none";
  if (dmhContainer) dmhContainer.style.display = isTransferring ? "block" : "none";
  const extraContainer = document.getElementById("transferringExtraContainer");
  if (extraContainer) extraContainer.style.display = isTransferring ? "block" : "none";
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

function toggleEmploymentStatus7() {
  const status = document.getElementById("employmentStatus7").value;
  const unemployedGroup = document.getElementById("futureEmploymentGroup");
  const employedGroup = document.getElementById("employedDetailsGroup");
  
  if (unemployedGroup) {
    unemployedGroup.style.display = (status === "Unemployed" || status === "Student Unemployed" || status === "Retired") ? "" : "none";
  }
  if (employedGroup) {
    employedGroup.style.display = (status === "Employed" || status === "Student Employed") ? "block" : "none";
  }
}

function toggleWaiveredServices7() {
  const utilized = document.getElementById("waiveredServicesUtilized7").value;
  const group = document.getElementById("waiveredServicesGroup");
  if (group) {
    group.style.display = (utilized === "Yes") ? "block" : "none";
  }
}

function toggleSDS7() {
  const utilized = document.getElementById("sdsUtilized7").value;
  const group = document.getElementById("sdsGroup7");
  if (group) {
    group.style.display = (utilized === "Yes") ? "block" : "none";
  }
}

function toggleSDSPaidFamily7() {
  const paidFam = document.getElementById("sdsPaidFamilyMember7").value;
  const group = document.getElementById("sdsPaidFamilyGroup7");
  if (group) {
    group.style.display = (paidFam === "Yes") ? "block" : "none";
  }
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

// 1. Medical Professionals
function addMedicalProfessional() {
  medicalProfessionals.push({ category: "Primary Care Physician", categoryOther: "", name: "", contact: "", frequency: "", date: "", results: "" });
  renderMedicalProfessionals();
  updateUI();
}
function removeMedicalProfessional(i) {
  medicalProfessionals.splice(i, 1);
  renderMedicalProfessionals();
  updateUI();
}
function updateMedicalProfessional(i, f, v) {
  medicalProfessionals[i][f] = v;
  const container = document.getElementById("medicalProfessionalsContainer");
  if (container) {
    const titles = container.querySelectorAll(".rep-title");
    if (titles[i]) titles[i].textContent = `Provider/Specialist #${i + 1}${medicalProfessionals[i].name ? " — " + medicalProfessionals[i].name : ""}`;
  }
  updateUI();
}
function renderMedicalProfessionals() {
  const c = document.getElementById("medicalProfessionalsContainer");
  if (!c) return;
  
  const options = [
    "Primary Care Physician", "Dentist", "Orthodontist", "Dietician", "Audiologist", 
    "OBGYN", "Orthopedic", "Pediatrist", "Optometrist / Ophthalmologist", 
    "Dermatologist", "Cardiologist", "Gastroenterologist", "Otolaryngologist (ENT)", 
    "Neurologist", "Psychiatrist", "Endocrinologist", "Urologist", "Podiatrist", 
    "Allergist / Immunologist", "Oncologist", "Pediatrician", "Other"
  ];
  
  c.innerHTML = medicalProfessionals
    .map(
      (m, i) => `<div class="legal-rep-card" style="margin-bottom:15px; border-left: 4px solid var(--gold);">
        <div class="rep-header">
          <span class="rep-title">Provider/Specialist #${i + 1}${m.name ? " — " + esc(m.name) : ""}</span>
          <button class="remove-rep-btn" onclick="removeMedicalProfessional(${i})">×</button>
        </div>
        <div class="form-grid">
          <div class="field-group full">
            <label>Doctor / Physician / Medical Professional</label>
            <select onchange="updateMedicalProfessional(${i},'category',this.value); renderMedicalProfessionals();">
              ${options.map(opt => `<option value="${opt}" ${m.category === opt ? 'selected' : ''}>${opt}</option>`).join('')}
            </select>
          </div>
          ${m.category === 'Other' ? `
          <div class="field-group full">
            <label>Specify Other Professional</label>
            <input type="text" placeholder="Please specify..." value="${esc(m.categoryOther || '')}" oninput="updateMedicalProfessional(${i},'categoryOther',this.value)">
          </div>
          ` : ''}
          <div class="field-group">
            <label>Name</label>
            <input type="text" placeholder="Name" value="${esc(m.name)}" oninput="updateMedicalProfessional(${i},'name',this.value)">
          </div>
          <div class="field-group">
            <label>Contact</label>
            <input type="text" placeholder="Contact info" value="${esc(m.contact)}" oninput="updateMedicalProfessional(${i},'contact',this.value)">
          </div>
          <div class="field-group">
            <label>Frequency of Visits</label>
            <input type="text" placeholder="e.g. Annually, Every 6 months" value="${esc(m.frequency)}" oninput="updateMedicalProfessional(${i},'frequency',this.value)">
          </div>
          <div class="field-group">
            <label>Date of Last Visit</label>
            <input type="date" value="${esc(m.date)}" oninput="updateMedicalProfessional(${i},'date',this.value)">
          </div>
          <div class="field-group full">
            <label>Results / Details</label>
            <textarea placeholder="Outcomes, notes, etc." oninput="updateMedicalProfessional(${i},'results',this.value)">${esc(m.results)}</textarea>
          </div>
        </div>
      </div>`
    )
    .join("");
}

// 2. Preventions
function addPrevention() {
  preventions.push({ name: "", contact: "", frequency: "", date: "", results: "" });
  renderPreventions();
  updateUI();
}
function removePrevention(i) {
  preventions.splice(i, 1);
  renderPreventions();
  updateUI();
}
function updatePrevention(i, f, v) {
  preventions[i][f] = v;
  const container = document.getElementById("preventionsContainer");
  if (container) {
    const titles = container.querySelectorAll(".rep-title");
    if (titles[i]) titles[i].textContent = `Prevention #${i + 1}${preventions[i].name ? " — " + preventions[i].name : ""}`;
  }
  updateUI();
}
function renderPreventions() {
  const c = document.getElementById("preventionsContainer");
  if (!c) return;
  c.innerHTML = preventions
    .map(
      (m, i) => `<div class="legal-rep-card" style="margin-bottom:15px; border-left: 4px solid var(--gold);">
        <div class="rep-header">
          <span class="rep-title">Prevention #${i + 1}${m.name ? " — " + esc(m.name) : ""}</span>
          <button class="remove-rep-btn" onclick="removePrevention(${i})">×</button>
        </div>
        <div class="form-grid">
          <div class="field-group full">
            <label>Name / Type</label>
            <input type="text" placeholder="e.g. Diet plan, Therapy" value="${esc(m.name)}" oninput="updatePrevention(${i},'name',this.value)">
          </div>
          <div class="field-group full">
            <label>Details</label>
            <textarea placeholder="Outcomes, notes, etc." oninput="updatePrevention(${i},'results',this.value)">${esc(m.results)}</textarea>
          </div>
        </div>
      </div>`
    )
    .join("");
}

// 3. Immunizations
function addImmunization() {
  immunizations.push({ name: "", contact: "", frequency: "", date: "", results: "" });
  renderImmunizations();
  updateUI();
}
function removeImmunization(i) {
  immunizations.splice(i, 1);
  renderImmunizations();
  updateUI();
}
function updateImmunization(i, f, v) {
  immunizations[i][f] = v;
  const container = document.getElementById("immunizationsContainer");
  if (container) {
    const titles = container.querySelectorAll(".rep-title");
    if (titles[i]) titles[i].textContent = `Immunization/Screening #${i + 1}${immunizations[i].name ? " — " + immunizations[i].name : ""}`;
  }
  updateUI();
}
function renderImmunizations() {
  const c = document.getElementById("immunizationsContainer");
  if (!c) return;
  c.innerHTML = immunizations
    .map(
      (m, i) => `<div class="legal-rep-card" style="margin-bottom:15px; border-left: 4px solid var(--gold);">
        <div class="rep-header">
          <span class="rep-title">Immunization/Screening #${i + 1}${m.name ? " — " + esc(m.name) : ""}</span>
          <button class="remove-rep-btn" onclick="removeImmunization(${i})">×</button>
        </div>
        <div class="form-grid">
          <div class="field-group">
            <label>Name</label>
            <input type="text" placeholder="e.g. Flu Shot, Mammogram" value="${esc(m.name)}" oninput="updateImmunization(${i},'name',this.value)">
          </div>
          <div class="field-group">
            <label>Contact / Facility</label>
            <input type="text" placeholder="Contact info" value="${esc(m.contact)}" oninput="updateImmunization(${i},'contact',this.value)">
          </div>
          <div class="field-group">
            <label>Frequency</label>
            <input type="text" placeholder="e.g. Annually" value="${esc(m.frequency)}" oninput="updateImmunization(${i},'frequency',this.value)">
          </div>
          <div class="field-group">
            <label>Date</label>
            <input type="date" value="${esc(m.date)}" oninput="updateImmunization(${i},'date',this.value)">
          </div>
          <div class="field-group full">
            <label>Results / Details</label>
            <textarea placeholder="Outcomes, notes, etc." oninput="updateImmunization(${i},'results',this.value)">${esc(m.results)}</textarea>
          </div>
        </div>
      </div>`
    )
    .join("");
}

// 4. Medications
function addMedication() {
  medications.push({ name: "", contact: "", frequency: "", date: "", results: "" });
  renderMedications();
  updateUI();
}
function removeMedication(i) {
  medications.splice(i, 1);
  renderMedications();
  updateUI();
}
function updateMedication(i, f, v) {
  medications[i][f] = v;
  const container = document.getElementById("medicationsContainer");
  if (container) {
    const titles = container.querySelectorAll(".rep-title");
    if (titles[i]) titles[i].textContent = `Medication #${i + 1}${medications[i].name ? " — " + medications[i].name : ""}`;
  }
  updateUI();
}
function renderMedications() {
  const c = document.getElementById("medicationsContainer");
  if (!c) return;
  c.innerHTML = medications
    .map(
      (m, i) => `<div class="legal-rep-card" style="margin-bottom:15px; border-left: 4px solid var(--gold);">
        <div class="rep-header">
          <span class="rep-title">Medication #${i + 1}${m.name ? " — " + esc(m.name) : ""}</span>
          <button class="remove-rep-btn" onclick="removeMedication(${i})">×</button>
        </div>
        <div class="form-grid">
          <div class="field-group">
            <label>Name / Purpose</label>
            <input type="text" placeholder="Medication name and purpose" value="${esc(m.name)}" oninput="updateMedication(${i},'name',this.value)">
          </div>
          <div class="field-group">
            <label>Dosage / Frequency</label>
            <input type="text" placeholder="e.g. 50mg daily" value="${esc(m.frequency)}" oninput="updateMedication(${i},'frequency',this.value)">
          </div>
          <div class="field-group full">
            <label>Results / Details</label>
            <textarea placeholder="Side effects, efficacy, notes" oninput="updateMedication(${i},'results',this.value)">${esc(m.results)}</textarea>
          </div>
        </div>
      </div>`
    )
    .join("");
}

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
  const container = document.getElementById("importantPeopleContainer");
  if (container) {
    const titles = container.querySelectorAll(".rep-title");
    if (titles[i]) titles[i].textContent = `Person/Pet #${i + 1}${importantPeople[i].name ? " — " + importantPeople[i].name : ""}`;
  }
  updateUI();
}
function renderImportantPeople() {
  const c = document.getElementById("importantPeopleContainer");
  if (!c) return;
  c.innerHTML = importantPeople
    .map(
      (p, i) => `<div class="legal-rep-card" style="margin-bottom:15px;">
        <div class="rep-header">
          <span class="rep-title">Person/Pet #${i + 1}${p.name ? " — " + esc(p.name) : ""}</span>
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

function addHcbsService() {
  hcbsServices.push({ 
    serviceName: "",
    subcategories: [],
    serviceDetails: "",
    serviceHours: "",
    signedDate: "",
    isUpdate: false,
    prevSignedDate: "",
    whoSigned: "",
    signeeNames: "",
    sig2Date: "", sig2Who: "", sig2Names: "",
    sig3Date: "", sig3Who: "", sig3Names: "",
    q1: "", q2: "", q4: "", q5Funding: [],
    medicationDMH: false, medicationDMHDetails: "",
    q2UnableToSupport: false, q2UnableToSupportReason: "",
    q2Educated: false, q2EducatedProvider: "", q2EducatedIndividual: "",
    hasBackupPlan: false, backupPlanDetailsArray: [""]
  });
  renderHcbsServices();
  updateUI();
}

function removeHcbsService(i) {
  hcbsServices.splice(i, 1);
  renderHcbsServices();
  updateUI();
}

function updateHcbsFunding(i, value, isChecked) {
  if (!Array.isArray(hcbsServices[i].q5Funding)) {
    hcbsServices[i].q5Funding = [];
  }
  if (isChecked) {
    if (!hcbsServices[i].q5Funding.includes(value)) hcbsServices[i].q5Funding.push(value);
  } else {
    hcbsServices[i].q5Funding = hcbsServices[i].q5Funding.filter(v => v !== value);
  }
  updateUI();
}

function addHcbsBackupDetail(i) {
  if (!Array.isArray(hcbsServices[i].backupPlanDetailsArray)) {
    hcbsServices[i].backupPlanDetailsArray = [];
  }
  hcbsServices[i].backupPlanDetailsArray.push("");
  renderHcbsServices();
  updateUI();
}

function removeHcbsBackupDetail(i, dIdx) {
  if (Array.isArray(hcbsServices[i].backupPlanDetailsArray)) {
    hcbsServices[i].backupPlanDetailsArray.splice(dIdx, 1);
  }
  renderHcbsServices();
  updateUI();
}

function updateHcbsBackupDetail(i, dIdx, val) {
  if (Array.isArray(hcbsServices[i].backupPlanDetailsArray)) {
    hcbsServices[i].backupPlanDetailsArray[dIdx] = val;
  }
  updateUI();
}

function setHcbsSubcategory(i, subName) {
  hcbsServices[i].subcategories = [{ name: subName, pos21: false, pos02: false, pos10: false }];
  updateUI();
}

function toggleHcbsSubcategory(i, subName, isChecked) {
  if (!Array.isArray(hcbsServices[i].subcategories)) hcbsServices[i].subcategories = [];
  if (isChecked) {
    if (!hcbsServices[i].subcategories.some(x => x.name === subName)) {
      hcbsServices[i].subcategories.push({ name: subName, pos21: false, pos02: false, pos10: false });
    }
  } else {
    hcbsServices[i].subcategories = hcbsServices[i].subcategories.filter(x => x.name !== subName);
  }
  renderHcbsServices();
  updateUI();
}

function toggleHcbsSubcategoryModifier(i, subName, modifierKey, isChecked) {
  if (Array.isArray(hcbsServices[i].subcategories)) {
    let subObj = hcbsServices[i].subcategories.find(x => x.name === subName);
    if (subObj) subObj[modifierKey] = isChecked;
  }
  updateUI();
}

function updateHcbsService(i, field, value) {
  hcbsServices[i][field] = value;
  if (field === 'serviceName') {
    hcbsServices[i].subcategories = [];
    renderHcbsServices();
  }
  updateUI();
}

function renderHcbsServices() {
  const container = document.getElementById("hcbsServicesList");
  if (!container) return;
  if (hcbsServices.length === 0) {
    container.innerHTML = "";
    return;
  }
  const isWaivered = document.getElementById("isHcbsWaivered") ? document.getElementById("isHcbsWaivered").value : "";
  
  const serviceOptions = [
    "Applied Behavior Analysis",
    "Assistive Technology",
    "Benefits Planning",
    "Career Planning",
    "Community Networking",
    "Community Specialist",
    "Community Transition",
    "Crisis Intervention",
    "Day Habilitation",
    "Dental",
    "Environmental Accessibility Adaptations",
    "Family Peer Support Service",
    "Group Home",
    "Health Assessment and Coordination Services",
    "Home Delivered Meals",
    "In-Home Respite",
    "Individual Directed Goods and Services",
    "Individual Supported Living",
    "Individualized Skill Development",
    "Intensive Therapeutic Residential Habilitation",
    "Job Development",
    "Occupational Therapy",
    "Out of Home Respite",
    "Personal Assistant",
    "Physical Therapy",
    "Prevocational",
    "Professional Assessment and Monitoring",
    "Remote Supports",
    "Scheduled Team Conference",
    "Shared Living",
    "Specialized Medical Equipment and Supplies",
    "Speech Therapy",
    "Support Broker",
    "Supported Employment",
    "Temporary Residential",
    "Transportation",
    "Virtual Delivery of Services"
  ];
  
  container.innerHTML = hcbsServices.map((s, i) => `
    <div class="field-group full" style="border: 1px solid var(--border); padding: 15px; border-radius: 8px; margin-bottom: 20px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
        <label style="font-size: 13px; font-weight: 700; color: var(--gold); text-transform: uppercase;">HCBS Service / Program #${i + 1}</label>
        <button type="button" class="remove-rep-btn" onclick="removeHcbsService(${i})">✕</button>
      </div>
      
      <div class="form-grid">
        <div class="field-group full">
          <label>Service / Program Name</label>
          <select onchange="updateHcbsService(${i}, 'serviceName', this.value)">
            <option value="">Select...</option>
            ${serviceOptions.map(opt => `<option value="${opt}" ${s.serviceName === opt ? 'selected' : ''}>${opt}</option>`).join("")}
          </select>
        </div>
        ${s.serviceName && HCBS_SUBCATEGORIES[s.serviceName] ? `
          <div class="field-group full" style="margin-top: 10px; background: rgba(0,0,0,0.02); padding: 10px; border-radius: 6px; border: 1px solid var(--border);">
            <label style="font-size: 11px; font-weight: 700; color: var(--gold); margin-bottom: 8px; display: block; text-transform: uppercase;">${s.serviceName === 'Applied Behavior Analysis' ? 'Select Subcategories (Multiple allowed)' : 'Select Subcategory'}</label>
            ${s.serviceName === 'Applied Behavior Analysis' ? `
              <div style="display: flex; flex-direction: column; gap: 8px;">
                ${HCBS_SUBCATEGORIES[s.serviceName].map(sub => {
                  const isChecked = s.subcategories && s.subcategories.some(x => x.name === sub);
                  const subObj = isChecked ? s.subcategories.find(x => x.name === sub) : null;
                  return `
                  <div style="display: flex; align-items: center; gap: 15px; flex-wrap: wrap;">
                    <label class="eth-check" style="font-size: 13px; color: var(--text-base); flex: 1; min-width: 250px;">
                      <input type="checkbox" ${isChecked ? 'checked' : ''} onchange="toggleHcbsSubcategory(${i}, '${esc(sub)}', this.checked)">
                      ${esc(sub)}
                    </label>
                    ${isChecked ? `
                      <label class="eth-check" style="font-size: 12px; color: var(--text-base); white-space: nowrap; margin-left: 20px;">
                        <input type="checkbox" ${subObj && subObj.pos21 ? 'checked' : ''} onchange="toggleHcbsSubcategoryModifier(${i}, '${esc(sub)}', 'pos21', this.checked)">
                        -POS21 (Inpatient)
                      </label>
                    ` : ''}
                  </div>
                  `;
                }).join('')}
              </div>
            ` : `
              <div style="display: flex; flex-direction: column; gap: 8px;">
                ${HCBS_SUBCATEGORIES[s.serviceName].map(sub => {
                  const isChecked = s.subcategories && s.subcategories.length > 0 && s.subcategories[0].name === sub;
                  const subObj = isChecked ? s.subcategories[0] : null;
                  return `
                  <div style="display: flex; align-items: center; gap: 15px; flex-wrap: wrap;">
                    <label class="eth-check" style="font-size: 13px; color: var(--text-base); flex: 1; min-width: 250px;">
                      <input type="radio" name="hcbs_sub_${i}" value="${esc(sub)}" ${isChecked ? 'checked' : ''} onchange="setHcbsSubcategory(${i}, '${esc(sub)}')">
                      ${esc(sub)}
                    </label>
                    ${(isChecked && s.serviceName === 'Out of Home Respite') ? `
                      <label class="eth-check" style="font-size: 12px; color: var(--text-base); white-space: nowrap; margin-left: 20px;">
                        <input type="checkbox" ${subObj && subObj.pos21 ? 'checked' : ''} onchange="toggleHcbsSubcategoryModifier(${i}, '${esc(sub)}', 'pos21', this.checked)">
                        -POS21 (Inpatient)
                      </label>
                    ` : ''}
                    ${(isChecked && s.serviceName === 'Virtual Delivery of Services') ? `
                      <label class="eth-check" style="font-size: 12px; color: var(--text-base); white-space: nowrap; margin-left: 20px;">
                        <input type="checkbox" ${subObj && subObj.pos02 ? 'checked' : ''} onchange="toggleHcbsSubcategoryModifier(${i}, '${esc(sub)}', 'pos02', this.checked)">
                        -POS02 (Other than patient's home)
                      </label>
                      <label class="eth-check" style="font-size: 12px; color: var(--text-base); white-space: nowrap; margin-left: 20px;">
                        <input type="checkbox" ${subObj && subObj.pos10 ? 'checked' : ''} onchange="toggleHcbsSubcategoryModifier(${i}, '${esc(sub)}', 'pos10', this.checked)">
                        -10 (In patient's home)
                      </label>
                    ` : ''}
                  </div>
                  `;
                }).join('')}
              </div>
            `}
          </div>
        ` : ''}
        ${s.serviceName && !s.sdsUtilized ? `
          <div style="display: flex; gap: 15px; margin-top: 15px; padding: 0 5px;">
            <div class="field-group" style="flex: 1;">
              <label style="font-size: 11px; font-weight: 700; color: var(--gold); margin-bottom: 5px; display: block; text-transform: uppercase;">Service/Program Details</label>
              <textarea oninput="updateHcbsService(${i}, 'serviceDetails', this.value)" style="min-height: 80px;">${esc(s.serviceDetails || "")}</textarea>
            </div>
            <div class="field-group" style="flex: 1;">
              <label style="font-size: 11px; font-weight: 700; color: var(--gold); margin-bottom: 5px; display: block; text-transform: uppercase;">Provided hours</label>
              <textarea oninput="updateHcbsService(${i}, 'serviceHours', this.value)" style="min-height: 80px;">${esc(s.serviceHours || "")}</textarea>
            </div>
          </div>
        ` : ''}
        <div class="field-group full" style="margin-top: 15px;">
          <label style="font-size: 12px; font-weight: 700; color: var(--gold); margin-bottom: 5px; display: block; text-transform: uppercase;">Program:</label>
          <div style="display: flex; gap: 15px; flex-wrap: wrap;">
            <label class="eth-check" style="font-size: 13px; color: var(--text-base);">
              <input type="checkbox" value="Comprehensive Waiver" ${s.q5Funding && s.q5Funding.includes("Comprehensive Waiver") ? 'checked' : ''} onchange="updateHcbsFunding(${i}, this.value, this.checked)">
              Comprehensive Waiver
            </label>
            <label class="eth-check" style="font-size: 13px; color: var(--text-base);">
              <input type="checkbox" value="Support Waiver" ${s.q5Funding && s.q5Funding.includes("Support Waiver") ? 'checked' : ''} onchange="updateHcbsFunding(${i}, this.value, this.checked)">
              Support Waiver
            </label>
            <label class="eth-check" style="font-size: 13px; color: var(--text-base);">
              <input type="checkbox" value="Sarah Lopez Waiver(MOCDD)" ${s.q5Funding && s.q5Funding.includes("Sarah Lopez Waiver(MOCDD)") ? 'checked' : ''} onchange="updateHcbsFunding(${i}, this.value, this.checked)">
              Sarah Lopez Waiver(MOCDD)
            </label>
            <label class="eth-check" style="font-size: 13px; color: var(--text-base);">
              <input type="checkbox" value="Partnership for Hope Waiver(PFH)" ${s.q5Funding && s.q5Funding.includes("Partnership for Hope Waiver(PFH)") ? 'checked' : ''} onchange="updateHcbsFunding(${i}, this.value, this.checked)">
              Partnership for Hope Waiver(PFH)
            </label>
          </div>
        </div>

        <div class="field-group full" style="margin-top: 15px; padding-top: 15px; border-top: 1px dashed var(--border);">
          <label class="eth-check" style="font-size: 13px; color: var(--text-base);">
            <input type="checkbox" ${s.medicationDMH ? 'checked' : ''} onchange="updateHcbsService(${i}, 'medicationDMH', this.checked); renderHcbsServices();">
            Medication taken at Program(DMH Facility)
          </label>
          ${s.medicationDMH ? `
            <div style="margin-top: 10px; padding-left: 25px;">
              <label style="font-size: 11px; font-weight: 700; color: var(--gold); margin-bottom: 5px; display: block; text-transform: uppercase;">Details</label>
              <textarea oninput="updateHcbsService(${i}, 'medicationDMHDetails', this.value)" style="min-height: 45px;">${esc(s.medicationDMHDetails || "")}</textarea>
            </div>
          ` : ''}
        </div>
        
        <div class="field-group full" style="margin-top: 15px; padding-top: 15px; border-top: 1px dashed var(--border);">
          <label style="font-size: 13px; font-weight: 700; color: var(--gold); margin-bottom: 10px; display: block; text-transform: uppercase;">Self-Directed Services (SDS)</label>
          <label class="eth-check" style="font-size: 13px; color: var(--text-base);">
            <input type="checkbox" ${s.sdsUtilized ? 'checked' : ''} onchange="updateHcbsService(${i}, 'sdsUtilized', this.checked); renderHcbsServices();">
            Are Self-Directed Services (SDS) being utilized?
          </label>
          
          ${s.sdsUtilized ? `
            <div style="margin-top: 15px; padding-left: 15px; border-left: 2px solid var(--border);">
              <div class="field-group full">
                <label>Designated Representative</label>
                <input type="text" value="${esc(s.sdsDesignatedRep || "")}" oninput="updateHcbsService(${i}, 'sdsDesignatedRep', this.value)" placeholder="Name, or state 'None Appointed'">
              </div>
              <div class="field-group full">
                <label>Justify any training exemptions for personal assistance (see training checklist)</label>
                <textarea oninput="updateHcbsService(${i}, 'sdsTrainingExemptions', this.value)">${esc(s.sdsTrainingExemptions || "")}</textarea>
              </div>
              <div class="field-group full">
                <label>SDS Back-up Plan (Provisions for scheduled employees not providing supports)</label>
                <textarea oninput="updateHcbsService(${i}, 'sdsBackupPlan', this.value)" placeholder="May refer to separate documents attached to the plan...">${esc(s.sdsBackupPlan || "")}</textarea>
              </div>
              <div class="field-group full">
                <label class="eth-check">
                  <input type="checkbox" ${s.sdsBudgetAllocationMatch ? 'checked' : ''} onchange="updateHcbsService(${i}, 'sdsBudgetAllocationMatch', this.checked)">
                  SDS Budget Allocation tool is complete and matches the money amount on the Authorization form (for new individuals to SDS program)
                </label>
              </div>
              <div class="field-group full">
                <label class="eth-check">
                  <input type="checkbox" ${s.sdsDhssAuthChecked ? 'checked' : ''} onchange="updateHcbsService(${i}, 'sdsDhssAuthChecked', this.checked)">
                  If receiving Medicaid State Plan personal care services through DHSS - authorization for services system has been checked to ensure these services are not being self-directed or waivered.
                </label>
              </div>
              <div class="field-group full" style="margin-top: 15px;">
                <label>Is a Paid Family Member providing supports?</label>
                <select onchange="updateHcbsService(${i}, 'sdsPaidFamilyMember', this.value); renderHcbsServices();">
                  <option value="">Select...</option>
                  <option value="Yes" ${s.sdsPaidFamilyMember === 'Yes' ? 'selected' : ''}>Yes</option>
                  <option value="No" ${s.sdsPaidFamilyMember === 'No' ? 'selected' : ''}>No</option>
                </select>
              </div>
              ${s.sdsPaidFamilyMember === 'Yes' ? `
                <div style="margin-top: 15px; padding: 15px; background: rgba(0,0,0,0.02); border: 1px solid var(--border);">
                  <div class="field-group full" style="margin-bottom: 25px;">
                    <label>Is the individual opposed to the family member providing the support?</label>
                    <div style="display: flex; gap: 15px; align-items: flex-start;">
                      <select style="width: 150px; flex-shrink: 0;" onchange="updateHcbsService(${i}, 'sdsFamilyOpposed', this.value)">
                        <option value="">Select...</option>
                        <option value="Yes" ${s.sdsFamilyOpposed === 'Yes' ? 'selected' : ''}>Yes</option>
                        <option value="No" ${s.sdsFamilyOpposed === 'No' ? 'selected' : ''}>No</option>
                      </select>
                      ${s.sdsFamilyOpposed === 'Yes' ? `
                        <textarea style="flex: 1;" placeholder="Provide detailed information regarding the opposition..." oninput="updateHcbsService(${i}, 'sdsFamilyOpposedDetails', this.value)">${esc(s.sdsFamilyOpposedDetails || "")}</textarea>
                      ` : ''}
                    </div>
                  </div>
                  <div class="field-group full">
                    <label class="eth-check">
                      <input type="checkbox" ${s.sdsFamilyHouseholdTasks ? 'checked' : ''} onchange="updateHcbsService(${i}, 'sdsFamilyHouseholdTasks', this.checked)">
                      The supports to be provided are solely for the individual and not household tasks expected to be shared with people who live in the family unit.
                    </label>
                    ${!s.sdsFamilyHouseholdTasks ? `
                      <textarea style="margin-top: 10px;" placeholder="Please detail why..." oninput="updateHcbsService(${i}, 'sdsFamilyHouseholdTasksDetails', this.value)">${esc(s.sdsFamilyHouseholdTasksDetails || "")}</textarea>
                    ` : ''}
                  </div>
                  <div class="field-group full">
                    <label class="eth-check">
                      <input type="checkbox" ${s.sdsFamilyBestMeetNeeds ? 'checked' : ''} onchange="updateHcbsService(${i}, 'sdsFamilyBestMeetNeeds', this.checked)">
                      The PCSP team agrees that the family member providing the individual assistance will best meet the individual's needs.
                    </label>
                    ${!s.sdsFamilyBestMeetNeeds ? `
                      <textarea style="margin-top: 10px;" placeholder="Please detail why..." oninput="updateHcbsService(${i}, 'sdsFamilyBestMeetNeedsDetails', this.value)">${esc(s.sdsFamilyBestMeetNeedsDetails || "")}</textarea>
                    ` : ''}
                  </div>
                </div>
              ` : ''}
            </div>
          ` : ''}
        </div>
      </div>

      ${isWaivered === 'Yes' ? `
      <div class="field-group full" style="border: 1px solid var(--border); padding: 15px; border-radius: 8px; margin-top: 15px;">
        <label style="font-size: 12px; font-weight: 700; color: var(--text-base); margin-bottom: 10px; display: block; text-transform: uppercase;">Primary Signature</label>
        <div class="form-grid" style="align-items: end;">
          <div class="field-group">
            <label>Signee</label>
            <select onchange="updateHcbsService(${i}, 'whoSigned', this.value)">
              <option value="">Select...</option>
              <option value="Individual" ${s.whoSigned === 'Individual' ? 'selected' : ''}>Individual</option>
              <option value="Guardian" ${s.whoSigned === 'Guardian' ? 'selected' : ''}>Guardian</option>
            </select>
          </div>
          <div class="field-group">
            <label>Name of Signee</label>
            <input type="text" value="${esc(s.signeeNames || "")}" placeholder="Name..." oninput="updateHcbsService(${i}, 'signeeNames', this.value)">
          </div>
          <div class="field-group">
            <label>Provider & Services Choice Statement Effective Signed Date</label>
            <input type="text" value="${esc(s.signedDate || "")}" placeholder="e.g. MM/DD/YYYY" oninput="updateHcbsService(${i}, 'signedDate', this.value)">
          </div>
        </div>
        <div class="field-group full" style="display: flex; gap: 20px; align-items: flex-end; flex-wrap: wrap; margin-top: 15px;">
          <div style="margin-bottom: 5px;">
            <label class="eth-check" style="color: var(--gold);">
              <input type="checkbox" ${s.isUpdate ? "checked" : ""} onchange="updateHcbsService(${i}, 'isUpdate', this.checked); renderHcbsServices();">
              Updated edit to previously signed Statement
            </label>
          </div>
          ${s.isUpdate ? `
          <div style="flex: 1; min-width: 250px; margin-bottom: 5px;">
            <label>Previous Signed Date</label>
            <input type="text" value="${esc(s.prevSignedDate || "")}" placeholder="e.g. MM/DD/YYYY" oninput="updateHcbsService(${i}, 'prevSignedDate', this.value)">
          </div>
          ` : ""}
        </div>
        <button type="button" class="btn btn-outline" style="margin-top: 15px; font-size: 11px; display: ${s.sig2Date || s.sig2Who || s.sig2Names ? 'none' : 'block'};" onclick="this.nextElementSibling.style.display='block'; this.style.display='none';">+ Add Additional Signature</button>
        
        <div style="display: ${s.sig2Date || s.sig2Who || s.sig2Names ? 'block' : 'none'}; margin-top: 15px; border-top: 1px solid var(--border); padding-top: 15px;">
          <label style="font-size: 11px; font-weight: 700; color: var(--text-base); margin-bottom: 10px; display: block; text-transform: uppercase;">Additional Signature</label>
          <div class="form-grid" style="align-items: end;">
            <div class="field-group">
              <label>Signee</label>
              <select onchange="updateHcbsService(${i}, 'sig2Who', this.value)">
                <option value="">Select...</option>
                <option value="Individual" ${s.sig2Who === 'Individual' ? 'selected' : ''}>Individual</option>
                <option value="Guardian" ${s.sig2Who === 'Guardian' ? 'selected' : ''}>Guardian</option>
              </select>
            </div>
            <div class="field-group">
              <label>Name of Signee</label>
              <input type="text" value="${esc(s.sig2Names || "")}" placeholder="Name..." oninput="updateHcbsService(${i}, 'sig2Names', this.value)">
            </div>
            <div class="field-group full">
              <label>Effective Signed Date</label>
              <input type="text" value="${esc(s.sig2Date || "")}" placeholder="e.g. MM/DD/YYYY" oninput="updateHcbsService(${i}, 'sig2Date', this.value)">
            </div>
          </div>
          <button type="button" class="btn btn-outline" style="margin-top: 15px; font-size: 11px; display: ${s.sig3Date || s.sig3Who || s.sig3Names ? 'none' : 'block'};" onclick="this.nextElementSibling.style.display='block'; this.style.display='none';">+ Add 3rd Signature</button>
          
          <div style="display: ${s.sig3Date || s.sig3Who || s.sig3Names ? 'block' : 'none'}; margin-top: 15px; border-top: 1px solid var(--border); padding-top: 15px;">
            <label style="font-size: 11px; font-weight: 700; color: var(--text-base); margin-bottom: 10px; display: block; text-transform: uppercase;">3rd Signature</label>
            <div class="form-grid" style="align-items: end;">
              <div class="field-group">
                <label>Signee</label>
                <select onchange="updateHcbsService(${i}, 'sig3Who', this.value)">
                  <option value="">Select...</option>
                  <option value="Individual" ${s.sig3Who === 'Individual' ? 'selected' : ''}>Individual</option>
                  <option value="Guardian" ${s.sig3Who === 'Guardian' ? 'selected' : ''}>Guardian</option>
                </select>
              </div>
              <div class="field-group">
                <label>Name of Signee</label>
                <input type="text" value="${esc(s.sig3Names || "")}" placeholder="Name..." oninput="updateHcbsService(${i}, 'sig3Names', this.value)">
              </div>
              <div class="field-group full">
                <label>Effective Signed Date</label>
                <input type="text" value="${esc(s.sig3Date || "")}" placeholder="e.g. MM/DD/YYYY" oninput="updateHcbsService(${i}, 'sig3Date', this.value)">
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="form-grid" style="margin-top: 15px;">
        <div class="field-group full">
          <label>1. How was the individual educated and informed of the options listed in the Medicaid waiver, provider and services choice statement?</label>
          <textarea oninput="updateHcbsService(${i}, 'q1', this.value)">${esc(s.q1 || "")}</textarea>
        </div>
        <div class="field-group full">
          <label style="margin-bottom: 5px; display: block;">2. How was the individual educated and informed of the full range of HCBS available to support achievement of personally identified goals?</label>
          <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 10px; background: rgba(0,0,0,0.02); padding: 15px; border-radius: 6px; border: 1px solid var(--border);">
            
            <label class="eth-check" style="font-size: 13px; color: var(--text-base);">
              <input type="checkbox" ${s.q2UnableToSupport ? 'checked' : ''} onchange="updateHcbsService(${i}, 'q2UnableToSupport', this.checked); renderHcbsServices();">
              Provider is unable to support the individual in achieving his/her personal identified goals.
            </label>
            ${s.q2UnableToSupport ? `
              <div style="margin-top: 5px; margin-bottom: 15px; padding-left: 25px;">
                <label style="font-size: 12px; color: var(--gold);">State what the problem is:</label>
                <textarea oninput="updateHcbsService(${i}, 'q2UnableToSupportReason', this.value)">${esc(s.q2UnableToSupportReason || "")}</textarea>
              </div>
            ` : ''}

            <label class="eth-check" style="font-size: 13px; color: var(--text-base);">
              <input type="checkbox" ${s.q2Educated ? 'checked' : ''} onchange="updateHcbsService(${i}, 'q2Educated', this.checked); renderHcbsServices();">
              Educated and Informed of the Full Range of HCBS
            </label>
            ${s.q2Educated ? `
              <div style="margin-top: 5px; padding-left: 25px; display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                <span style="font-size: 13px; color: var(--text-base);">Provider:</span>
                <input type="text" style="width: 200px;" value="${esc(s.q2EducatedProvider || "")}" placeholder="..." oninput="updateHcbsService(${i}, 'q2EducatedProvider', this.value)">
                <span style="font-size: 13px; color: var(--text-base);">agreed to support Individual:</span>
                <input type="text" style="width: 200px;" value="${esc(s.q2EducatedIndividual || "")}" placeholder="..." oninput="updateHcbsService(${i}, 'q2EducatedIndividual', this.value)">
                <span style="font-size: 13px; color: var(--text-base);">achievement of his/her personally identified goals.</span>
              </div>
            ` : ''}

          </div>
        </div>

        <div class="field-group full">
          <label>3. Discuss the alternative home and community based settings that were considered by the individual.</label>
          <textarea oninput="updateHcbsService(${i}, 'q4', this.value)">${esc(s.q4 || "")}</textarea>
        </div>
        
        <div class="field-group full" style="margin-top: 10px; border-top: 1px solid var(--border); padding-top: 15px;">
          <label style="font-size: 13px; font-weight: 700; color: var(--gold); margin-bottom: 10px; display: block; text-transform: uppercase;">Individualized Backup Plan</label>
          <label class="eth-check" style="margin-bottom: 10px; color: var(--text-base);">
            <input type="checkbox" ${s.hasBackupPlan ? 'checked' : ''} onchange="updateHcbsService(${i}, 'hasBackupPlan', this.checked); renderHcbsServices();">
            This service/program has a designated backup plan (Mandatory for Critical Services)
          </label>
          ${s.hasBackupPlan ? `
            <div style="margin-top: 10px;">
              ${(s.backupPlanDetailsArray || [""]).map((detail, dIdx) => `
                <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                  <textarea placeholder="Backup plan bullet point..." style="flex: 1; min-height: 40px;" oninput="updateHcbsBackupDetail(${i}, ${dIdx}, this.value)">${esc(detail)}</textarea>
                  ${(s.backupPlanDetailsArray || [""]).length > 1 ? `<button type="button" class="remove-rep-btn" style="position: static; margin-top: 5px;" onclick="removeHcbsBackupDetail(${i}, ${dIdx})">×</button>` : ''}
                </div>
              `).join('')}
              <button type="button" class="btn btn-outline" style="font-size: 11px;" onclick="addHcbsBackupDetail(${i})">+ Add Bullet Point</button>
            </div>
          ` : `
            <div style="font-size: 12px; color: var(--text-muted); font-style: italic; margin-top: 5px; padding-left: 28px;">
              The individual's needs were assessed, and based on that assessment, no additional individualized Backup Plans were identified as necessary at this time.
            </div>
          `}
        </div>
      </div>
      ` : ''}
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
  renderLegalReps();
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
          ${(Array.isArray(r.legalType) ? r.legalType.includes('Power of Attorney') : r.legalType === 'Power of Attorney') ? `
            <div style="margin-top: 10px;">
              <label style="font-size: 11px; color: var(--gold);">Type of Power of Attorney</label>
              <input type="text" value="${esc(r.poaType || "")}" placeholder="..." oninput="updateRep(${i},'poaType',this.value)">
            </div>
          ` : ''}
          ${(Array.isArray(r.legalType) ? r.legalType.includes('Limited Guardianship') : r.legalType === 'Limited Guardianship') ? `
            <div style="margin-top: 10px;">
              <label style="font-size: 11px; color: var(--gold);">Type of Limited Guardianship</label>
              <input type="text" value="${esc(r.limitedGuardianshipType || "")}" placeholder="..." oninput="updateRep(${i},'limitedGuardianshipType',this.value)">
            </div>
          ` : ''}
          ${(Array.isArray(r.legalType) ? r.legalType.includes('Limited Conservatorship') : r.legalType === 'Limited Conservatorship') ? `
            <div style="margin-top: 10px;">
              <label style="font-size: 11px; color: var(--gold);">Type of Limited Conservatorship</label>
              <input type="text" value="${esc(r.limitedConservatorshipType || "")}" placeholder="..." oninput="updateRep(${i},'limitedConservatorshipType',this.value)">
            </div>
          ` : ''}
        </div>
        <div class="field-group">
          <label>Lives with Individual?</label>
          <select onchange="updateRep(${i},'livesWith',this.value); renderLegalReps()">
            <option value="Yes" ${r.livesWith === 'Yes' ? 'selected' : ''}>Yes</option>
            <option value="No" ${r.livesWith === 'No' ? 'selected' : ''}>No</option>
          </select>
        </div>
        <div class="field-group">
          <label>Phone Number</label>
          <input type="text" value="${esc(r.phone)}" placeholder="(573) 555-0100" oninput="updateRep(${i},'phone',this.value)">
        </div>
        <div class="field-group">
          <label>E-mail</label>
          <input type="text" value="${esc(r.email || "")}" placeholder="name@example.com" oninput="updateRep(${i},'email',this.value)">
        </div>
        ${r.livesWith !== 'Yes' ? `
        <div class="field-group full">
          <label>Address / Contact Note</label>
          <input type="text" value="${esc(r.address || "")}" placeholder="Address if different" oninput="updateRep(${i},'address',this.value)">
        </div>
        ` : ''}
      </div>
    </div>
  `).join("");
}
function getLegalRepsNarrative() {
  if (!legalReps.length) return "  None on file.";
  return legalReps.map((rep, i) => {
    let authType = Array.isArray(rep.legalType) ? rep.legalType.join(", ") : (rep.legalType || "N/A");
    
    if (rep.poaType && (Array.isArray(rep.legalType) ? rep.legalType.includes('Power of Attorney') : rep.legalType === 'Power of Attorney')) {
      authType = authType.replace('Power of Attorney', `Power of Attorney (${rep.poaType})`);
    }
    if (rep.limitedGuardianshipType && (Array.isArray(rep.legalType) ? rep.legalType.includes('Limited Guardianship') : rep.legalType === 'Limited Guardianship')) {
      authType = authType.replace('Limited Guardianship', `Limited Guardianship (${rep.limitedGuardianshipType})`);
    }
    if (rep.limitedConservatorshipType && (Array.isArray(rep.legalType) ? rep.legalType.includes('Limited Conservatorship') : rep.legalType === 'Limited Conservatorship')) {
      authType = authType.replace('Limited Conservatorship', `Limited Conservatorship (${rep.limitedConservatorshipType})`);
    }
    
    return `  Rep #${i + 1}: ${rep.name || "[Name not provided]"} | ${authType} | Relationship: ${rep.relationship || "N/A"} | Lives with individual: ${rep.livesWith} | Phone: ${rep.phone || "N/A"}${rep.email ? " | E-mail: " + rep.email : ""}${rep.address && rep.livesWith !== "Yes" ? " | Address: " + rep.address : ""}`;
  }).join("\n");
}
function captureLegalReps() {
  return JSON.parse(JSON.stringify(legalReps));
}
function restoreLegalReps(d)  { legalReps = Array.isArray(d) ? d : []; renderLegalReps(); }

function addDnrAltListItem(type) {
  if (type === 'instruction') {
    dnrAltInstructions.push({ id: Date.now(), text: "" });
  }
  renderDnrAltLists();
  updateUI();
}
function removeDnrAltListItem(type, id) {
  if (type === 'instruction') {
    dnrAltInstructions = dnrAltInstructions.filter(i => i.id !== id);
  }
  renderDnrAltLists();
  updateUI();
}
function updateDnrAltListItem(type, id, val) {
  if (type === 'instruction') {
    const item = dnrAltInstructions.find(i => i.id === id);
    if (item) item.text = val;
  }
  updateUI();
}
function renderDnrAltLists() {
  const instrContainer = document.getElementById("dnrAltInstructionsContainer");
  if (instrContainer) {
    instrContainer.innerHTML = dnrAltInstructions.map((item, idx) => `
      <div style="display: flex; gap: 10px; margin-bottom: 10px;">
        <input type="text" value="${esc(item.text)}" placeholder="Instruction..." oninput="updateDnrAltListItem('instruction', ${item.id}, this.value)" style="flex: 1;">
        <button class="btn btn-outline" style="color: var(--danger); border-color: var(--danger);" onclick="removeDnrAltListItem('instruction', ${item.id})">X</button>
      </div>
    `).join("");
  }
  
  
}

// ── PERSISTENCE ──
function captureFormData() {
  const fd = {
    _goalsData: goalsData,
    _transitionStartUpCosts: transitionStartUpCosts,
    _clinicalGoalsTasks: clinicalGoalsTasks,
    _programServices: programServices,
    _hcbsServices: hcbsServices,
    _currentSupports: currentSupports,
    _linkingSupports: linkingSupports,
    _legalReps: legalReps,
    _medicalProfessionals: medicalProfessionals,
    _preventions: preventions,
    _immunizations: immunizations,
    _medications: medications,
    _dnrAltInstructions: dnrAltInstructions,
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
  transitionStartUpCosts = fd._transitionStartUpCosts || [];
  renderTransitionCosts();
  updateCommunityTransitionUI();
  clinicalGoalsTasks = fd._clinicalGoalsTasks || [];
  programServices = fd._programServices || [];
  hcbsServices = fd._hcbsServices || [];
  
  // Migration: If employment/education was saved inside the first hcbsService, move it to global
  if (hcbsServices.length > 0) {
    const firstS = hcbsServices[0];
    if (firstS.q6 !== undefined && !fd.hcbsEmpQ1 && document.getElementById('hcbsEmpQ1')) document.getElementById('hcbsEmpQ1').value = firstS.q6 || "";
    if (firstS.q7 !== undefined && !fd.hcbsEmpQ2 && document.getElementById('hcbsEmpQ2')) document.getElementById('hcbsEmpQ2').value = firstS.q7 || "";
    if (firstS.q8 !== undefined && !fd.hcbsEduQ1 && document.getElementById('hcbsEduQ1')) document.getElementById('hcbsEduQ1').value = firstS.q8 || "";
    if (firstS.q9 !== undefined && !fd.hcbsEduQ2 && document.getElementById('hcbsEduQ2')) document.getElementById('hcbsEduQ2').value = firstS.q9 || "";
    if (firstS.q10 !== undefined && !fd.hcbsEduQ3 && document.getElementById('hcbsEduQ3')) document.getElementById('hcbsEduQ3').value = firstS.q10 || "";
    if (firstS.q11 !== undefined && !fd.hcbsEduQ4 && document.getElementById('hcbsEduQ4')) document.getElementById('hcbsEduQ4').value = firstS.q11 || "";
  }
  
  hcbsServices.forEach(s => {
    if (!s.subcategories) s.subcategories = [];
    if (s.backupPlanDetails && (!s.backupPlanDetailsArray || s.backupPlanDetailsArray.length === 0)) {
      s.backupPlanDetailsArray = [s.backupPlanDetails];
    } else if (!s.backupPlanDetailsArray) {
      s.backupPlanDetailsArray = [""];
    }
  });
  currentSupports = fd._currentSupports || [];
  linkingSupports = fd._linkingSupports || [];
  legalReps = fd._legalReps || [];
  medicalProfessionals = fd._medicalProfessionals || [];
  preventions = fd._preventions || [];
  immunizations = fd._immunizations || [];
  medications = fd._medications || [];
  dnrAltInstructions = fd._dnrAltInstructions || [];

  // Migration from temporary medicalItems array
  if (fd._medicalItems && fd._medicalItems.length > 0) {
    fd._medicalItems.forEach(m => {
      if (m.category === "Current Medications") medications.push(m);
      else if (m.category === "Residential Immunizations & Cancer Screenings") immunizations.push(m);
      else if (m.category === "Prevention (Diet, Exercise, Counseling, Therapy)") preventions.push(m);
      else medicalProfessionals.push(m);
    });
  }
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
  renderHcbsServices();
  renderSupports('current');
  renderSupports('linking');
  renderLegalReps();
  renderMedicalProfessionals();
  renderPreventions();
  renderImmunizations();
  renderMedications();
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
    updatePersonalIncomeUI();
    updateResidentialUI();
    updateAge17MainUI();
    updateAge17UI();
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
    if (typeof updateReferralUI === "function") updateReferralUI();
  }

  renderDnrAltLists();
  updateUI();
  toggleTransitionFields(); // Ensure section 13 visibility is correct
  toggleEmploymentStatus7(); // Ensure employment status visibility is correct
  toggleWaiveredServices7(); // Ensure waivered services visibility is correct
  toggleHcbsFields();
  toggleHcbsSignatures();
  toggleSDS7();
  toggleHrstFields();
  toggleDnrAlt();
  toggleHrstAdditional();
  toggleSDSPaidFamily7();
  toggleSelfAdmin8();
  toggleDmhLocation();
  toggleTransferring();
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


// --- SCROLL SPY LOGIC ---
function initScrollSpy() {
  const workspace = document.querySelector('.main-workspace');
  if (!workspace) return;

  const navItems = Array.from(document.querySelectorAll('.nav-item'));
  const sectionsMap = new Map();
  
  navItems.forEach(nav => {
    const onclickStr = nav.getAttribute('onclick') || '';
    const match = onclickStr.match(/'(sec-[^']+)'/);
    if (match) {
      sectionsMap.set(match[1], nav);
    }
  });

  const observerOptions = {
    root: workspace,
    rootMargin: '-10% 0px -80% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        const activeNav = sectionsMap.get(id);
        if (activeNav) {
          navItems.forEach(n => n.classList.remove('active-nav'));
          activeNav.classList.add('active-nav');
          // Optional: Scroll the sidebar to keep the active item in view
          activeNav.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    });
  }, observerOptions);

  sectionsMap.forEach((nav, id) => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });
}

// Initialize on load
document.addEventListener("DOMContentLoaded", () => {
  initScrollSpy();
});

initScrollSpy();