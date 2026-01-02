const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// 1. DATA: 48 Filipinized RIASEC Questions
const quizQuestions = [
    { id: 1, text: "Repair a broken household appliance or gadget (e.g., electric fan, phone).", cat: "R" },
    { id: 2, text: "Assemble furniture or build things using tools.", cat: "R" },
    { id: 3, text: "Work on a motorcycle or car engine (mechanical tasks).", cat: "R" },
    { id: 4, text: "Do practical 'DIY' projects around the house or school.", cat: "R" },
    { id: 5, text: "Operate heavy machinery or power tools (like those in TESDA courses).", cat: "R" },
    { id: 6, text: "Spend time gardening or doing outdoor landscaping work.", cat: "R" },
    { id: 7, text: "Install or troubleshoot a home/office network (CCTV, Wi-Fi).", cat: "R" },
    { id: 8, text: "Use a blueprint or technical drawing to build a physical object.", cat: "R" },
    { id: 9, text: "Conduct a scientific experiment in a laboratory.", cat: "I" },
    { id: 10, text: "Solve complex math problems or logic puzzles for fun.", cat: "I" },
    { id: 11, text: "Read about new medical discoveries or scientific breakthroughs.", cat: "I" },
    { id: 12, text: "Use a microscope or lab instruments to study samples.", cat: "I" },
    { id: 13, text: "Analyze data or statistics to find a trend or pattern.", cat: "I" },
    { id: 14, text: "Study the chemical properties of different substances.", cat: "I" },
    { id: 15, text: "Research how the human brain or body works.", cat: "I" },
    { id: 16, text: "Write a program or 'debug' a complex piece of code.", cat: "I" },
    { id: 17, text: "Design digital art, posters, or social media graphics.", cat: "A" },
    { id: 18, text: "Write a poem, short story, or script for a vlog.", cat: "A" },
    { id: 19, text: "Perform in a dance group, choir, or theater production.", cat: "A" },
    { id: 20, text: "Sketch, paint, or create a physical piece of art.", cat: "A" },
    { id: 21, text: "Edit a video with music, transitions, and effects.", cat: "A" },
    { id: 22, text: "Play a musical instrument or compose a song.", cat: "A" },
    { id: 23, text: "Design the 'look and feel' of a room or website.", cat: "A" },
    { id: 24, text: "Express yourself through unique creative hobbies.", cat: "A" },
    { id: 25, text: "Volunteer for a community outreach or NGO program.", cat: "S" },
    { id: 26, text: "Teach a friend or younger student a difficult subject.", cat: "S" },
    { id: 27, text: "Help people resolve a personal conflict or argument.", cat: "S" },
    { id: 28, text: "Take care of someone who is sick or injured.", cat: "S" },
    { id: 29, text: "Work with children or the elderly in a community setting.", cat: "S" },
    { id: 30, text: "Give advice to friends on their life or career problems.", cat: "S" },
    { id: 31, text: "Participate in a group project to solve a social issue.", cat: "S" },
    { id: 32, text: "Lead a youth group or student organization to help others.", cat: "S" },
    { id: 33, text: "Start a small online business (Shopee/Lazada shop).", cat: "E" },
    { id: 34, text: "Convince a group of people to support your idea.", cat: "E" },
    { id: 35, text: "Lead a team or be the 'Group Leader' in a school project.", cat: "E" },
    { id: 36, text: "Sell a product or service to a customer for profit.", cat: "E" },
    { id: 37, text: "Plan and manage a large school event or party.", cat: "E" },
    { id: 38, text: "Give a public speech or presentation in front of a crowd.", cat: "E" },
    { id: 39, text: "Negotiate a deal or discount with a supplier.", cat: "E" },
    { id: 40, text: "Manage the budget and goals for an organization.", cat: "E" },
    { id: 41, text: "Organize files, folders, and documents systematically.", cat: "C" },
    { id: 42, text: "Keep detailed records of expenses for a project.", cat: "C" },
    { id: 43, text: "Check reports or papers for small errors.", cat: "C" },
    { id: 44, text: "Work with spreadsheets (Excel/Google Sheets) for data.", cat: "C" },
    { id: 45, text: "Follow a strict set of rules and procedures.", cat: "C" },
    { id: 46, text: "Manage a database or inventory of items/supplies.", cat: "C" },
    { id: 47, text: "Perform audit or quality-control checks on work.", cat: "C" },
    { id: 48, text: "Organize a schedule or calendar for a team.", cat: "C" }
];

// 2. HELPER: Fisher-Yates Shuffle Algorithm
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// 3. CORE LOGIC HELPER (Updated for Categorization/Grouping)
function processRiasec(scores, callback) {
    // 1. Sort by RAW value (not absolute). 
    // This ensures -4 is ranked higher than -16.
    let sortedEntries = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    
    // 2. Define Top 3 based on highest raw scores
    const top1 = sortedEntries[0][0];
    const top2 = sortedEntries[1][0];
    const top3 = sortedEntries[2][0];

    // Create the Holland Code (only include positive interests if possible)
    let hollandCode = sortedEntries
        .slice(0, 3)
        .filter(entry => entry[1] > 0) 
        .map(entry => entry[0])
        .join('');
    
    if (!hollandCode) hollandCode = top1 + top2 + top3;

    const matches = [];

    fs.createReadStream('schools_database.csv')
        .pipe(csv())
        .on('data', (row) => {
            const courseCode = (row['RIASEC CODE'] || "").toUpperCase();
            let matchScore = 0;

            // POSITION-BASED SCORING 
            // We reward courses that match your top traits in the right order
            
            // Primary Trait (Weight: 15)
            if (courseCode[0] === top1) matchScore += 15;
            else if (courseCode.includes(top1)) matchScore += 5;

            // Secondary Trait (Weight: 10)
            if (courseCode[1] === top2) matchScore += 10;
            else if (courseCode.includes(top2)) matchScore += 3;

            // Tertiary Trait (Weight: 5)
            if (courseCode[2] === top3) matchScore += 5;
            else if (courseCode.includes(top3)) matchScore += 1;

            // Only suggest if the match is decent (Threshold: 10)
            if (matchScore >= 10) { 
                matches.push({
                    university: row['UNIVERSITY'],
                    campus: row['CAMPUS'],
                    course: row['COURSES'],
                    major: row['MAJOR'],
                    riasec: courseCode,
                    score: matchScore 
                });
            }
        })
        .on('end', () => {
            const sortedMatches = matches.sort((a, b) => b.score - a.score);

            // GROUPING SYSTEM (Prevents Flatness)
            const grouped = {};
            sortedMatches.forEach(match => {
                const courseKey = match.course.trim();
                if (!grouped[courseKey]) {
                    grouped[courseKey] = {
                        courseName: match.course,
                        riasec: match.riasec,
                        score: match.score,
                        providers: [] 
                    };
                }
                grouped[courseKey].providers.push({
                    university: match.university,
                    campus: match.campus,
                    major: match.major
                });
            });

            const finalUniqueMatches = Object.values(grouped).slice(0, 10);
            callback({ hollandCode, topMatches: finalUniqueMatches, scores }); 
        });
}

// ROUTE: Home Page
app.get('/', (req, res) => {
    const shuffledQuestions = [...quizQuestions];
    shuffleArray(shuffledQuestions);
    res.render('index', { quizQuestions: shuffledQuestions });
});

// ROUTE: Submission
app.post('/submit', (req, res) => {
    const userAnswers = req.body;
    const scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

    quizQuestions.forEach(q => {
        const val = parseInt(userAnswers['q' + q.id]);
        if (val) {
            let points = 0;
            if (val === 5) points = 3;  
            if (val === 4) points = 1;  
            if (val === 3) points = 0;  
            if (val === 2) points = -1; 
            if (val === 1) points = -3; 
            
            scores[q.cat] += points;
        }
    });

    processRiasec(scores, (results) => {
        res.render('results', { ...results, isDev: false });
    });
});

// ROUTE: Dev Tool
app.get('/results', (req, res) => {
    const devScores = {
        R: parseInt(req.query.r) || 0,
        I: parseInt(req.query.i) || 0,
        A: parseInt(req.query.a) || 0,
        S: parseInt(req.query.s) || 0,
        E: parseInt(req.query.e) || 0,
        C: parseInt(req.query.c) || 0
    };
    
    processRiasec(devScores, (results) => {
        res.render('results', { ...results, isDev: true });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});