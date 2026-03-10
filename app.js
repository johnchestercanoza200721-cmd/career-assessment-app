/**
 * ────────────────────────────────────────────────────────────
 * PROJECT: T.A.H.A.K (Talents, Abilities, Hobbies & Knowledge)
 * ────────────────────────────────────────────────────────────
 * Research & Development Team:
 * • John Chester C. Canoza (Lead Developer)
 * • Jariz Maria T. Gose
 * • Marcus Lord Isiah R. Basañes
 * • Rhiane Chastine Lei V. Perida
 *
 * NOTICE: This source code is an original academic output
 * submitted for research documentation and archival purposes.
 * All rights reserved under the Intellectual Property Code
 * of the Philippines (R.A. 8293). Unauthorized reproduction,
 * redistribution, or commercial use is strictly prohibited.
 *
 * Build ID: STEM12-GRD12-TAHAK-2026
 * ────────────────────────────────────────────────────────────
 */

// ============================================================================
// IMPORTS
// ============================================================================
const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');

// ============================================================================
// TAHAK CORE IDENTITY & VERSION TRACKING
// ============================================================================
/**
 * Digital fingerprint for TAHAK core engine.
 * Updated on each stable build to track development progression.
 */
const _tahak_core = {
  projectName: 'T.A.H.A.K',
  fullName: 'Talents, Abilities, Hobbies and Knowledge',
  version: '1.0.0-Stable',
  build_id: 'STEM12-GRD12-TAHAK-2026',
  lead_developer: 'John Chester C. Canoza',
  team: [
    'John Chester C. Canoza',
    'Jariz Maria T. Gose',
    'Marcus Lord Isiah R. Basañes',
    'Rhiane Chastine Lei V. Perida'
  ],
  created: '2026-03-10',
  riasec_engine: 'Holland Code Matching v1.0',
  subcategory_tiebreaker: 'Enabled',
  education_demotion_threshold: 0.8,
};

console.log(`\n✓ ${_tahak_core.projectName} v${_tahak_core.version} | Build: ${_tahak_core.build_id}\n`);

// ============================================================================
// EXPRESS APPLICATION SETUP
// ============================================================================
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// ============================================================================
// DATA: RIASEC QUIZ QUESTIONS
// ============================================================================
/**
 * 48 Filipinized RIASEC questions mapped to 6 main traits and 12 subcategories.
 * Golden rule: each RIASEC letter has 8 questions, evenly split between 2
 * subcategories (4-4 balance) for precise career matching.
 */
const quizQuestions = [
    // REALISTIC (R) - 8 questions: 4 R-Mechanical, 4 R-Natural
    { id: 1, text: "Repair a broken household appliance or gadget (e.g., electric fan, phone).", cat: "R", subcategory: "R-Mechanical" },
    { id: 2, text: "Assemble furniture or build things using tools.", cat: "R", subcategory: "R-Mechanical" },
    { id: 3, text: "Work on a motorcycle or car engine (mechanical tasks).", cat: "R", subcategory: "R-Mechanical" },
    { id: 4, text: "Do practical 'DIY' projects around the house or school.", cat: "R", subcategory: "R-Natural", negativeCategory: "A" },
    { id: 5, text: "Operate heavy machinery or power tools (like those in TESDA courses).", cat: "R", subcategory: "R-Mechanical" },
    { id: 6, text: "Spend time gardening or doing outdoor landscaping work.", cat: "R", subcategory: "R-Natural" },
    { id: 7, text: "Install or troubleshoot a home/office network (CCTV, Wi-Fi).", cat: "R", subcategory: "R-Natural" },
    { id: 8, text: "Use a blueprint or technical drawing to build a physical object.", cat: "R", subcategory: "R-Natural", negativeCategory: "A" },
    
    // INVESTIGATIVE (I) - 8 questions: 4 I-Health, 4 I-Physical
    { id: 9, text: "Conduct a scientific experiment in a laboratory.", cat: "I", subcategory: "I-Physical" },
    { id: 10, text: "Solve complex math problems or logic puzzles for fun.", cat: "I", subcategory: "I-Health" },
    { id: 11, text: "Read about new medical discoveries or scientific breakthroughs.", cat: "I", subcategory: "I-Health" },
    { id: 12, text: "Use a microscope or lab instruments to study samples.", cat: "I", subcategory: "I-Health" },
    { id: 13, text: "Analyze data or statistics to find a trend or pattern.", cat: "I", subcategory: "I-Physical" },
    { id: 14, text: "Study the chemical properties of different substances.", cat: "I", subcategory: "I-Physical" },
    { id: 15, text: "Research how the human brain or body works.", cat: "I", subcategory: "I-Health" },
    { id: 16, text: "Write a program or 'debug' a complex piece of code.", cat: "I", subcategory: "I-Physical" },
    
    // ARTISTIC (A) - 8 questions: 4 A-Digital, 4 A-Literary
    { id: 17, text: "Design digital art, posters, or social media graphics.", cat: "A", subcategory: "A-Digital" },
    { id: 18, text: "Write a poem, short story, or script for a vlog.", cat: "A", subcategory: "A-Literary" },
    { id: 19, text: "Perform in a dance group, choir, or theater production.", cat: "A", subcategory: "A-Literary" },
    { id: 20, text: "Sketch, paint, or create a physical piece of art.", cat: "A", subcategory: "A-Digital" },
    { id: 21, text: "Edit a video with music, transitions, and effects.", cat: "A", subcategory: "A-Digital" },
    { id: 22, text: "Play a musical instrument or compose a song.", cat: "A", subcategory: "A-Literary" },
    { id: 23, text: "Design the 'look and feel' of a room or website.", cat: "A", subcategory: "A-Digital" },
    { id: 24, text: "Express yourself through unique creative hobbies.", cat: "A", subcategory: "A-Literary" },
    
    // SOCIAL (S) - 8 questions: 4 S-Educational, 4 S-Service
    { id: 25, text: "Volunteer for a community outreach or NGO program.", cat: "S", subcategory: "S-Service", negativeCategory: "C" },
    { id: 26, text: "Teach a friend or younger student a difficult subject.", cat: "S", subcategory: "S-Educational", negativeCategory: "C" },
    { id: 27, text: "Help people resolve a personal conflict or argument.", cat: "S", subcategory: "S-Service", negativeCategory: "C" },
    { id: 28, text: "Take care of someone who is sick or injured.", cat: "S", subcategory: "S-Service", negativeCategory: "C" },
    { id: 29, text: "Work with children or the elderly in a community setting.", cat: "S", subcategory: "S-Educational", negativeCategory: "C" },
    { id: 30, text: "Give advice to friends on their life or career problems.", cat: "S", subcategory: "S-Educational", negativeCategory: "C" },
    { id: 31, text: "Participate in a group project to solve a social issue.", cat: "S", subcategory: "S-Service", negativeCategory: "C" },
    { id: 32, text: "Lead a youth group or student organization to help others.", cat: "S", subcategory: "S-Educational", negativeCategory: "C" },
    
    // ENTERPRISING (E) - 8 questions: 4 E-Management, 4 E-Hospitality
    { id: 33, text: "Start a small online business (Shopee/Lazada shop).", cat: "E", subcategory: "E-Management" },
    { id: 34, text: "Convince a group of people to support your idea.", cat: "E", subcategory: "E-Hospitality" },
    { id: 35, text: "Lead a team or be the 'Group Leader' in a school project.", cat: "E", subcategory: "E-Hospitality" },
    { id: 36, text: "Sell a product or service to a customer for profit.", cat: "E", subcategory: "E-Hospitality" },
    { id: 37, text: "Plan and manage a large school event or party.", cat: "E", subcategory: "E-Hospitality" },
    { id: 38, text: "Give a public speech or presentation in front of a crowd.", cat: "E", subcategory: "E-Management" },
    { id: 39, text: "Negotiate a deal or discount with a supplier.", cat: "E", subcategory: "E-Management" },
    { id: 40, text: "Manage the budget and goals for an organization.", cat: "E", subcategory: "E-Management" },
    
    // CONVENTIONAL (C) - 8 questions: 4 C-Financial, 4 C-Logistical
    { id: 41, text: "Organize files, folders, and documents systematically.", cat: "C", subcategory: "C-Financial", negativeCategory: "A" },
    { id: 42, text: "Keep detailed records of expenses for a project.", cat: "C", subcategory: "C-Financial", negativeCategory: "A" },
    { id: 43, text: "Check reports or papers for small errors.", cat: "C", subcategory: "C-Logistical" },
    { id: 44, text: "Work with spreadsheets (Excel/Google Sheets) for data.", cat: "C", subcategory: "C-Financial", negativeCategory: "A" },
    { id: 45, text: "Follow a strict set of rules and procedures.", cat: "C", subcategory: "C-Logistical", negativeCategory: "E" },
    { id: 46, text: "Manage a database or inventory of items/supplies.", cat: "C", subcategory: "C-Logistical" },
    { id: 47, text: "Perform audit or quality-control checks on work.", cat: "C", subcategory: "C-Financial" },
    { id: 48, text: 'Organize a schedule or calendar for a team.', cat: 'C', subcategory: 'C-Logistical' },
];

// ============================================================================
// DATA: COURSE-TO-SUBCATEGORY MAPPING
// ============================================================================
/**
 * Maps course names to their primary subcategory for tie-breaking logic.
 * This serves as the ground truth for matching recommendations.
 */
const subCatMap = {
    // Investigative (I) - Health & Physical Sciences
    "BS Medical Technology": "I-Health",
    "BS Biology": "I-Health",
    "BS Pharmacy": "I-Health",
    "BS Computer Science": "I-Physical",
    "BS Statistics": "I-Physical",

    // Social (S) - Educational & Service
    "BS Nursing": "S-Service",
    "BS Psychology": "S-Service",
    "BS Criminology": "S-Service",
    "BS Social Work": "S-Service",
    "BS Secondary Education": "S-Educational",
    "BS Elementary Education": "S-Educational",
    "Bachelor of Secondary Education": "S-Educational",
    "Bachelor of Elementary Education": "S-Educational",
    "Bachelor of Physical Education": "S-Educational",
    "Bachelor of Early Childhood Education": "S-Educational",
    "BS Education": "S-Educational",
    "Bachelor of Science in Education": "S-Educational",

    // Realistic (R) - Mechanical & Natural
    "BS Civil Engineering": "R-Mechanical",
    "BS Mechanical Engineering": "R-Mechanical",
    "BS Marine Engineering": "R-Mechanical",
    "BS Agriculture": "R-Natural",

    // Artistic (A) - Digital & Literary
    "BS Architecture": "A-Digital",
    "BS Information Technology": "A-Digital",
    "BA Communication": "A-Literary",

    // Enterprising (E) - Management & Hospitality
    "BS Business Administration": "E-Management",
    "BS Hospitality Management": "E-Hospitality",
    "BS Tourism Management": "E-Hospitality",

    // Conventional (C) - Financial & Logistical
    'BS Accountancy': 'C-Financial',
    'BS Customs Administration': 'C-Logistical',
};

// ============================================================================
// DATA: SUBCATEGORY DISPLAY NAMES
// ============================================================================
/**
 * Human-readable display names for each subcategory, used in UI rendering.
 */
const subCategoryNames = {
  'R-Mechanical': 'Mechanical Engineering',
  'R-Natural': 'Natural Sciences',
  'I-Health': 'Health Sciences',
  'I-Physical': 'Physical Sciences',
  'A-Digital': 'Digital & Visual Arts',
  'A-Literary': 'Literary & Performance Arts',
  'S-Educational': 'Educational Services',
  'S-Service': 'Healthcare & Social Services',
  'E-Management': 'Business Management',
  'E-Hospitality': 'Hospitality & Event Management',
  'C-Financial': 'Financial Services',
  'C-Logistical': 'Logistics & Administration',
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Detects if a course is education-related (teaching profession).
 * Used to apply special scoring logic for education career paths.
 */
function isEducationCourse(courseName, major) {
  const lowerCourse = (courseName || '').toLowerCase();
  const lowerMajor = (major || '').toLowerCase();
  const combined = lowerCourse + ' ' + lowerMajor;

  const educationKeywords = [
    'education', 'teaching', 'teacher', 'pedagogy',
    'elementary education', 'secondary education',
    'early childhood', 'physical education',
    'science education', 'mathematics education',
    'english education', 'teacher training',
  ];

  return educationKeywords.some(keyword => combined.includes(keyword));
}

/**
 * Fisher-Yates shuffle algorithm for randomizing array order.
 * Used to shuffle quiz questions on each page load.
 */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Core matching algorithm: processes RIASEC scores and returns ranked course recommendations.
 * Handles matching logic, tie-breaking via subcategories, and education course demotion.
 */
function processRiasec(scores, subScores, callback) {
  // Sort by raw score (highest first) and extract top 3 traits for Holland Code
  let sortedEntries = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const top1 = sortedEntries[0][0];
  const top2 = sortedEntries[1][0];
  const top3 = sortedEntries[2][0];

  // Generate Holland Code from top 3 traits (prefer positive scores)
  let hollandCode = sortedEntries
    .slice(0, 3)
    .filter(entry => entry[1] > 0)
    .map(entry => entry[0])
    .join('');

  if (!hollandCode) hollandCode = top1 + top2 + top3;

  // Normalize scores to 0-1 scale for consistent comparison across traits
  const maxScore = Math.max(...Object.values(scores), 1);
  const minScore = Math.min(...Object.values(scores), 0);
  const scoreRange = maxScore - minScore || 1;

  const normalizedScores = {};
  Object.entries(scores).forEach(([trait, score]) => {
    normalizedScores[trait] = (score - minScore) / scoreRange;
  });

  const matches = [];

  fs.createReadStream('schools_database.csv')
    .pipe(csv())
    .on('data', (row) => {
      const courseCode = (row['RIASEC CODE'] || '').toUpperCase();
      const courseName = (row['COURSES'] || '').trim();

      if (courseCode.length === 0) return;

      let matchScore = 0;
      let traitCount = 0;

      // Calculate compatibility by weighing trait position and user's score strength
      for (let i = 0; i < courseCode.length && i < 3; i++) {
        const trait = courseCode[i];
        const userScore = normalizedScores[trait] || 0;
        const positionBonus = 1 - (i * 0.15); // First position weights highest
        const contribution = userScore * positionBonus * 100;
        matchScore += contribution;
        traitCount++;
      }

      // Bonus for 3-trait matches (most comprehensive alignment)
      if (courseCode.length === 3) {
        matchScore *= 1.05;
      }

      // Bonus for consecutive (ranked) traits (e.g., 'RIA' better than 'RAI')
      if (courseCode.length >= 2) {
        let consecutiveCount = 0;
        for (let i = 0; i < courseCode.length - 1; i++) {
          const currentTrait = courseCode[i];
          const nextTrait = courseCode[i + 1];
          const currentRank = sortedEntries.findIndex(e => e[0] === currentTrait);
          const nextRank = sortedEntries.findIndex(e => e[0] === nextTrait);

          if (Math.abs(currentRank - nextRank) <= 1) {
            consecutiveCount++;
          }
        }
        if (consecutiveCount > 0) {
          matchScore *= (1 + consecutiveCount * 0.1);
        }
      }

      // Apply education course demotion if user has low S-Educational interest
      let finalMatchScore = matchScore;
      if (isEducationCourse(courseName, row['MAJOR'])) {
        const sEducationalScore = subScores['S-Educational'] || 0;
        const allSubScoresArray = Object.values(subScores);
        const avgSubScore = allSubScoresArray.reduce((a, b) => a + b, 0) / allSubScoresArray.length;

        if (sEducationalScore < avgSubScore * 0.8) {
          finalMatchScore *= 0.50; // 50% score reduction for low educational interest
        }
      }

      const maxPossibleScore = 100;
      const threshold = maxPossibleScore * 0.45;

      if (finalMatchScore >= threshold) {
        const primarySubcategory = subCatMap[courseName] || null;
        matches.push({
          university: row['UNIVERSITY'],
          campus: row['CAMPUS'],
          course: row['COURSES'],
          major: row['MAJOR'],
          riasec: courseCode,
          score: Math.round(finalMatchScore),
          primarySubcategory: primarySubcategory,
        });
      }
    })
    .on('end', () => {
      // Sort matches using multi-level tie-breaker logic:
      // Level 1: Primary match score
      // Level 2: Subcategory alignment with user's top trait
      // Level 3: Fallback to signed order (stable sort)
      const sortedMatches = matches.sort((a, b) => {
        if (a.score !== b.score) {
          return b.score - a.score;
        }

        const courseAPrimaryTrait = a.riasec ? a.riasec[0] : null;
        const courseBPrimaryTrait = b.riasec ? b.riasec[0] : null;

        if (courseAPrimaryTrait === top1 || courseBPrimaryTrait === top1) {
          const aSubcategory = a.primarySubcategory || null;
          const aSubScore = aSubcategory ? (subScores[aSubcategory] || 0) : 0;

          const bSubcategory = b.primarySubcategory || null;
          const bSubScore = bSubcategory ? (subScores[bSubcategory] || 0) : 0;

          if (aSubScore !== bSubScore) {
            return bSubScore - aSubScore;
          }
        }

        // Fallback: Check subcategory scores even if primary not mapped
        const traitSubcategories = {
          'R': ['R-Mechanical', 'R-Natural'],
          'I': ['I-Health', 'I-Physical'],
          'A': ['A-Digital', 'A-Literary'],
          'S': ['S-Educational', 'S-Service'],
          'E': ['E-Management', 'E-Hospitality'],
          'C': ['C-Financial', 'C-Logistical'],
        };

        const top1Subcategories = traitSubcategories[top1] || [];
        let userTopSubcategoryScore = 0;

        top1Subcategories.forEach(sub => {
          const score = subScores[sub] || 0;
          if (score > userTopSubcategoryScore) {
            userTopSubcategoryScore = score;
          }
        });

        const aSubScore2 = a.primarySubcategory ? (subScores[a.primarySubcategory] || 0) : 0;
        const bSubScore2 = b.primarySubcategory ? (subScores[b.primarySubcategory] || 0) : 0;

        if (aSubScore2 !== bSubScore2) {
          return bSubScore2 - aSubScore2;
        }

        return 0;
      });

      // Group courses by name to avoid duplicates, keeping the best match score
      const grouped = {};
      sortedMatches.forEach(match => {
        const courseKey = match.course.trim();
        if (!grouped[courseKey]) {
          grouped[courseKey] = {
            courseName: match.course,
            riasec: match.riasec,
            score: match.score,
            primarySubcategory: match.primarySubcategory,
            subcategoryName: match.primarySubcategory ? subCategoryNames[match.primarySubcategory] : null,
            providers: [],
          };
        } else if (match.score > grouped[courseKey].score) {
          grouped[courseKey].score = match.score;
          grouped[courseKey].riasec = match.riasec;
          grouped[courseKey].primarySubcategory = match.primarySubcategory;
          grouped[courseKey].subcategoryName = match.primarySubcategory ? subCategoryNames[match.primarySubcategory] : null;
        }
        grouped[courseKey].providers.push({
          university: match.university,
          campus: match.campus,
          major: match.major,
        });
      });

      const finalUniqueMatches = Object.values(grouped).slice(0, 100);

      // Debug logging
      console.log('\n=== CAREER ASSESSMENT DEBUG INFO ===');
      console.log('Holland Code:', hollandCode);
      console.log('Main RIASEC Scores:', scores);

      const sortedSubScores = Object.entries(subScores)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

      const sEducScore = subScores['S-Educational'] || 0;
      const avgSubScore = Object.values(subScores).reduce((a, b) => a + b, 0) / Object.keys(subScores).length;
      const educationWarning = sEducScore < avgSubScore * 0.8 ? ' (⚠️  Education courses demoted)' : '';

      console.log('\n--- Top 3 User Subcategories ---');
      console.table(sortedSubScores.map(([subcategory, score]) => ({
        'Subcategory': subCategoryNames[subcategory] || subcategory,
        'Score': score,
      })));
      console.log(`S-Educational: ${sEducScore} (Avg: ${Math.round(avgSubScore)})${educationWarning}`);

      const top5Matches = finalUniqueMatches.slice(0, 5);
      console.log('\n--- Top 5 Course Recommendations ---');
      console.table(top5Matches.map((match, idx) => ({
        'Rank': idx + 1,
        'Course': match.courseName,
        'RIASEC': match.riasec,
        'Match Score': match.score,
        'Subcategory': match.subcategoryName || 'Not Mapped',
      })));

      console.log(`\nTotal matching courses returned: ${finalUniqueMatches.length}`);
      console.log('====================================\n');

      callback({ hollandCode, topMatches: finalUniqueMatches, scores, subScores });
    });
}

// ============================================================================
// ROUTES
// ============================================================================

/**
 * GET /
 * Renders the career assessment quiz page with shuffled questions.
 */
app.get('/', (req, res) => {
  const shuffledQuestions = [...quizQuestions];
  shuffleArray(shuffledQuestions);
  res.render('index', { quizQuestions: shuffledQuestions });
});

/**
 * POST /submit
 * Processes quiz submission, calculates RIASEC scores, and returns matched courses.
 */
app.post('/submit', (req, res) => {
  const userAnswers = req.body;
  const scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

  // Initialize 12 subcategory scores
  const subScores = {
    'R-Mechanical': 0,
    'R-Natural': 0,
    'I-Health': 0,
    'I-Physical': 0,
    'A-Digital': 0,
    'A-Literary': 0,
    'S-Educational': 0,
    'S-Service': 0,
    'E-Management': 0,
    'E-Hospitality': 0,
    'C-Financial': 0,
    'C-Logistical': 0,
  };

  quizQuestions.forEach(q => {
    const val = parseInt(userAnswers['q' + q.id]);
    if (val) {
      // Scoring scale: Strongly Agree (5.0), Agree (4.5), Neutral (2.0),
      // Disagree (2.5), Strongly Disagree (1.0). Boosts distinguish agree/disagree.
      let points = 0;
      if (val === 5) points = 5.0;
      if (val === 4) points = 4.5;
      if (val === 3) points = 2.0;
      if (val === 2) points = 2.5;
      if (val === 1) points = 1.0;

      scores[q.cat] += points;

      if (q.subcategory) {
        subScores[q.subcategory] += points;
      }

      // Apply negative scoring if question specifies opposite category
      if (q.negativeCategory) {
        const negativePoints = points * 0.15;
        scores[q.negativeCategory] -= negativePoints;
      }
    }
  });

  processRiasec(scores, subScores, (results) => {
    res.render('results', { ...results, isDev: false });
  });
});

// ============================================================================
// ROUTE: Results (Shared Links & Dev Mode)
/**
 * GET /results
 * Renders results page from shared link or dev mode query parameters.
 * Supports score-based reconstruction and legacy shared result display.
 */
app.get('/results', (req, res) => {
  // Check if this is a score-based request (shared link or dev mode)
  const hasScores = req.query.r !== undefined || req.query.i !== undefined ||
                    req.query.a !== undefined || req.query.s !== undefined ||
                    req.query.e !== undefined || req.query.c !== undefined;

  if (hasScores) {
    const devScores = {
      R: parseInt(req.query.r) || 0,
      I: parseInt(req.query.i) || 0,
      A: parseInt(req.query.a) || 0,
      S: parseInt(req.query.s) || 0,
      E: parseInt(req.query.e) || 0,
      C: parseInt(req.query.c) || 0,
    };

    // Parse actual subcategory scores from URL if provided
    const hasSubcategoryParams =
      req.query.rm !== undefined || req.query.rn !== undefined ||
      req.query.ih !== undefined || req.query.ip !== undefined ||
      req.query.ad !== undefined || req.query.al !== undefined ||
      req.query.se !== undefined || req.query.ss !== undefined ||
      req.query.em !== undefined || req.query.eh !== undefined ||
      req.query.cf !== undefined || req.query.cl !== undefined;

    let subScores;

    if (hasSubcategoryParams) {
      subScores = {
        'R-Mechanical': parseInt(req.query.rm) || 0,
        'R-Natural': parseInt(req.query.rn) || 0,
        'I-Health': parseInt(req.query.ih) || 0,
        'I-Physical': parseInt(req.query.ip) || 0,
        'A-Digital': parseInt(req.query.ad) || 0,
        'A-Literary': parseInt(req.query.al) || 0,
        'S-Educational': parseInt(req.query.se) || 0,
        'S-Service': parseInt(req.query.ss) || 0,
        'E-Management': parseInt(req.query.em) || 0,
        'E-Hospitality': parseInt(req.query.eh) || 0,
        'C-Financial': parseInt(req.query.cf) || 0,
        'C-Logistical': parseInt(req.query.cl) || 0,
      };
    } else {
      // Fallback: Proportional subcategory split for backward compatibility
      subScores = {
        'R-Mechanical': Math.round(devScores.R / 2),
        'R-Natural': Math.round(devScores.R / 2),
        'I-Health': Math.round(devScores.I / 2),
        'I-Physical': Math.round(devScores.I / 2),
        'A-Digital': Math.round(devScores.A / 2),
        'A-Literary': Math.round(devScores.A / 2),
        'S-Educational': Math.round(devScores.S / 2),
        'S-Service': Math.round(devScores.S / 2),
        'E-Management': Math.round(devScores.E / 2),
        'E-Hospitality': Math.round(devScores.E / 2),
        'C-Financial': Math.round(devScores.C / 2),
        'C-Logistical': Math.round(devScores.C / 2),
      };
    }

    processRiasec(devScores, subScores, (results) => {
      const markedResults = {
        ...results,
        isDev: false,
        isShared: req.query.code ? true : false,
      };
      res.render('results', markedResults);
    });
  } else if (req.query.code && req.query.path) {
    // Legacy: Fallback for minimal shared result display
    const sharedResult = {
      hollandCode: req.query.code,
      topPath: decodeURIComponent(req.query.path),
      major: decodeURIComponent(req.query.major || ''),
      rank: parseInt(req.query.rank) || 1,
      isShared: true,
    };

    res.render('results', {
      hollandCode: sharedResult.hollandCode,
      scores: { R: 20, I: 20, A: 20, S: 20, E: 20, C: 20 },
      topMatches: [],
      isShared: true,
      sharedResult: sharedResult,
      isDev: false,
    });
  } else {
    res.status(400).send('Missing required parameters for results page.');
  }
});

// ============================================================================
// ROUTE: Explore Courses
// ============================================================================

/**
 * GET /explore
 * Renders the course exploration/browsing page.
 */
app.get('/explore', (req, res) => {
  res.render('explore', {
    searchQuery: '',
    filterRiasec: '',
    results: [],
    totalResults: 0,
  });
});

// ============================================================================
// API ROUTES: Search & University Data
// ============================================================================

/**
 * GET /api/search
 * Searches course database by query and RIASEC filter.
 * Query params: q (search term), riasec (filter code)
 */
app.get('/api/search', (req, res) => {
  const query = (req.query.q || '').toLowerCase();
  const riasecFilter = (req.query.riasec || '').toUpperCase();
  const results = [];

    fs.createReadStream('schools_database.csv')
        .pipe(csv())
        .on('data', (row) => {
            const university = (row['UNIVERSITY'] || '').toLowerCase();
            const campus = (row['CAMPUS'] || '').toLowerCase();
            const course = (row['COURSES'] || '').toLowerCase();
            const major = (row['MAJOR'] || '').toLowerCase();
            const riasec = (row['RIASEC CODE'] || '').toUpperCase();
            
            // Match query in any field
            const matchesQuery = !query || 
                university.includes(query) || 
                campus.includes(query) || 
                course.includes(query) || 
                major.includes(query);
            
            // Match RIASEC filter
            const matchesRiasec = !riasecFilter || riasec.includes(riasecFilter);
            
            if (matchesQuery && matchesRiasec) {
                results.push({
                    university: row['UNIVERSITY'],
                    campus: row['CAMPUS'],
                    college: row['COLLEGE'],
                    course: row['COURSES'],
                    major: row['MAJOR'],
                    riasec: riasec,
                    primaryTag: row['PRIMARY TAG'],
                    secondaryTag: row['SECONDARY TAG'],
                    tertiaryTag: row['TERTIARY TAG']
                });
            }
        })
        .on('end', () => {
            // Limit results to 50 for performance
            const limited = results.slice(0, 50);
            res.json({ 
                results: limited,
                totalResults: results.length,
                shown: limited.length
            });
        });
});

// ROUTE: Get all universities (with course counts)
app.get('/api/universities', (req, res) => {
    const universities = {};

    fs.createReadStream('schools_database.csv')
        .pipe(csv())
        .on('data', (row) => {
            const uni = row['UNIVERSITY'];
            if (uni) {
                if (!universities[uni]) {
                    universities[uni] = { count: 0, campuses: new Set() };
                }
                universities[uni].count++;
                universities[uni].campuses.add(row['CAMPUS']);
            }
        })
        .on('end', () => {
            const result = Object.entries(universities)
                .map(([name, data]) => ({
                    name,
                    courseCount: data.count,
                    campusCount: data.campuses.size
                }))
                .sort((a, b) => b.courseCount - a.courseCount); // Sort by course count
            
            res.json(result);
        });
});

// ROUTE: Get campuses for a university
app.get('/api/universities/:name/campuses', (req, res) => {
    const targetUni = decodeURIComponent(req.params.name);
    const campuses = {};

    fs.createReadStream('schools_database.csv')
        .pipe(csv())
        .on('data', (row) => {
            if (row['UNIVERSITY'] === targetUni) {
                const campus = row['CAMPUS'];
                if (campus) {
                    if (!campuses[campus]) {
                        campuses[campus] = 0;
                    }
                    campuses[campus]++;
                }
            }
        })
        .on('end', () => {
            const result = Object.entries(campuses)
                .map(([name, count]) => ({ name, courseCount: count }))
                .sort((a, b) => b.courseCount - a.courseCount);
            
            res.json(result);
        });
});

// ROUTE: Get courses for a university + campus
app.get('/api/universities/:name/campuses/:campus/courses', (req, res) => {
    const targetUni = decodeURIComponent(req.params.name);
    const targetCampus = decodeURIComponent(req.params.campus);
    const courses = {};

    fs.createReadStream('schools_database.csv')
        .pipe(csv())
        .on('data', (row) => {
            if (row['UNIVERSITY'] === targetUni && row['CAMPUS'] === targetCampus) {
                const course = row['COURSES'];
                if (course) {
                    if (!courses[course]) {
                        courses[course] = {
                            courseName: row['COURSES'],
                            riasec: row['RIASEC CODE'],
                            major: row['MAJOR'],
                            college: row['COLLEGE']
                        };
                    }
                }
            }
        })
        .on('end', () => {
            const result = Object.values(courses)
                .map((val, idx) => ({ ...val, id: idx }))
                .sort((a, b) => a.courseName.localeCompare(b.courseName));
            
            res.json(result);
        });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});