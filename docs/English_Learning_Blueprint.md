# English Learning Blueprint (v0.1 draft)

Pilot: one school project, ~30 children, Grades 3–5, phones.
Goal: measurable, sustained growth in English level by the end of the course, within **1 hour of phone use per child per day**.

---

## 1. Locked decisions

| Decision | Choice |
|---|---|
| Learners | Grades 3–5, ~30 children, mixed grades in one cohort |
| Placement levels | Four: **Pre-emergent, Emergent, Potential, High potential** |
| Device | Phones (Android-first, PWA) |
| Daily phone time | Target 30 min, hard cap 45 min. Well under the 60 min limit. |
| Support language | Marathi for instructions and explanations; English for target language |
| Scope | School project, not a PMC rollout. No parent-facing features. |
| Success | Children move up levels and keep their gains on a delayed check |

**Open decisions (see section 9):** course length, device ownership, Marathi content owner, consent route.

---

## 2. Four placement levels

The four levels are placement bands. Each child is placed by skill, not grade. A Grade 5 child can be Pre-emergent.

Each level is a band of content that maps onto the PRD's curriculum bands, as shown below.

| Level | PRD band | What a child can do at entry | What "passed" looks like |
|---|---|---|---|
| **1. Pre-emergent** | Discover | Knows few letter sounds. Cannot read a word. Follows simple Marathi-explained picture tasks. | Knows all 26 letter sounds. Reads 10 CVC words. Follows 1-step English instructions. |
| **2. Emergent** | Discover → Build | Knows some letters and sounds. Decodes a few simple words. Understands 1-step instructions. | Reads 30+ CVC and sight words. Writes simple words from dictation. Answers "what is this?" in English. |
| **3. Potential** | Build | Decodes CVC reliably. Reads simple sentences slowly. Writes 3–5 word phrases. | Reads short 3–4 sentence passages. Writes 3–5 sentence patterns. Follows 2-step instructions. |
| **4. High potential** | Express | Reads short passages with reasonable fluency. Writes short paragraphs with errors. | Reads and answers comprehension questions. Writes a short descriptive paragraph. Holds a simple 2–3 turn spoken exchange (teacher-scored). |

**Rules:**
- A child can be different levels in different skills. The profile is per skill.
- Level is set by the diagnostic. The app never sets it by grade.
- A High-potential child still starts in Grade-appropriate themes, not babyish content.

---

## 3. The five skill tracks

Each child has a separate mastery record for every skill:

1. **Listening**: understand spoken words, instructions and short sentences
2. **Reading**: letter-sound, decoding, sight words, passages
3. **Writing**: letters, words, sentences, short paragraphs
4. **Vocabulary**: knows and uses the word (not just picture recognition)
5. **Speaking**: answers and produces English. Teacher-scored.

The North Star metric (from the PRD) is: percentage of children who improve in **at least 3 of 5 skills** between baseline and endline.

---

## 4. Daily session (phone time)

Target about 30 minutes per child. The cap is 45 minutes including any catch-up.

| Stage | Min | What happens |
|---|---|---|
| Warm-up | 3 | Revise yesterday's 2 items |
| Discover | 5 | New item introduced using the 8-step loop (Marathi explanation, English audio) |
| Practise | 7 | Guided interactive practice with immediate feedback |
| Apply | 6 | Child uses the item independently in a new context |
| Check | 3 | Short scored check (5–8 items) |
| Celebrate | 1 | Progress shown. No ranking. |
| **Total** | **25** | Leaves a 20-minute buffer for catch-up and revision |

**Non-phone time:** Speaking is scored by a teacher or trained helper using a 2-minute recorded or observed check. Plan about 1 hour per week for this across the whole class.

**Pause and resume:** progress saves after every item. A child can stop at any point.

---

## 5. The 8-step learning loop (every concept)

SEE → UNDERSTAND (Marathi) → HEAR → REPEAT → RECOGNISE → READ & WRITE → APPLY → RECALL

Recall is always done on a later day, without the picture prompt. This is where the retention evidence comes from.

Worked example (Pre-emergent, Lesson 01, "CAT"):
1. SEE: tabby cat picture
2. UNDERSTAND: "मांजर" with the English word "cat" and a Marathi sentence "हे एक मांजर आहे"
3. HEAR: "cat" (native audio)
4. REPEAT: child records themselves, plays back
5. RECOGNISE: pick "cat" from three words (cat / cap / hat)
6. READ & WRITE: sound out C-A-T, then trace the letters
7. APPLY: "I see a cat." (sentence built from word cards)
8. RECALL (next day): three pictures, audio says "find the cat", no picture of the cat is shown

---

## 6. Adaptive rules (transparent, no AI)

The learning engine is a set of rules, not a black box. Thresholds are starting values to be tuned with pilot data.

**Per item:**
- Correct on first try: move to next item in the same skill
- Wrong twice: show the Marathi explanation and an easier version of the item, then retry
- Wrong three times in a row on one item: flag for teacher and move on to a different item of the same skill

**Per skill, per session:**
- Accuracy below 70%: revisit prerequisite items. Do not advance.
- Accuracy 70–84%: continue practice, add one new item
- Accuracy 85%+: eligible for mastery check

**Mastery (to move up a skill):**
- Passes a mastery check of 10 items, scoring 80% or higher, done independently, on 2 separate days
- Passes a delayed recall check 3 days later at 75% or higher

**Level move-up:**
- All 5 skills at the next level's mastery bar, **or** 4 of 5 skills plus the child is above the bar in the others
- Teacher can confirm or hold a child back. Teacher holds are logged.

**Stagnation flag:** the same error on the same item type three sessions running. Dashboard shows it. Suggests a different activity type (for example, from matching to listening).

Mastery is never based on lessons clicked or time spent.

---

## 7. Assessment and measuring sustained growth

| When | What | Who |
|---|---|---|
| Day 1 | Baseline diagnostic (all 5 skills) | App, with teacher present |
| Weekly | Quick check (10 items across skills) | App |
| Weekly | Speaking check (2 min per child) | Teacher or trained helper |
| End of each unit | Mastery check | App |
| End of course | Endline (equivalent but unfamiliar items) | App + teacher speaking |
| End of course + 2 weeks | **Delayed retention check** | App |

**The measures that matter for "sustainable growth":**
1. Level at endline vs baseline (per child)
2. Number of skills improved (per child; North Star)
3. Retention: score on the 2-week delayed check vs endline
4. Independent task completion (no teacher or peer help)

Growth is reported per skill and never as one overall score.

---

## 8. Content plan (first course)

Content is the biggest workload. Build a small, complete slice first.

**Course 1 target: Pre-emergent → Emergent, 8 weeks, 40 lessons** (5 per week). The PRD's 8-week outline is the base.

| Week | Theme | Focus | Lessons |
|---|---|---|---|
| 1 | My alphabet | Letter names and sounds A–M | 5 |
| 2 | More sounds | Letter sounds N–Z, uppercase and lowercase | 5 |
| 3 | Sounds around me | Beginning and ending sounds | 5 |
| 4 | First words (CVC short a) | Blend and read CAT, MAT, BAT, etc. | 5 |
| 5 | More words (CVC short i, o, u) | Blend and read, plus 20 sight words | 5 |
| 6 | Things around me | Nouns from the PRD unit list (body, family, colours, fruit) | 5 |
| 7 | Doing and saying | Action words, "I can…" sentences | 5 |
| 8 | Show what I know | Revision, endline, delayed check | 5 |

Each lesson uses the 8-step loop. Each lesson needs: 1 Marathi explanation, 1 English audio, 3–5 picture items, 5–8 check items, 1 apply sentence, and a recall item for a later session.

**Content counts needed before the pilot starts:**
- Level 1 (Pre-emergent): 40 lessons (Course 1 above)
- Level 2 (Emergent): ~20 lessons if Course 1 is the only course in the pilot
- Levels 3 and 4: outline only. Build after the pilot shows what works.

**Source rules:** no reused content from the third-party sites listed in the PRD. Original images and audio, or openly licensed ones with the licence recorded.

---

## 9. Open decisions and risks

| Item | Why it matters | Proposed default |
|---|---|---|
| Course length | "Sustained growth by course end" depends on how long a course runs | 8 weeks per course. Children who finish Course 1 continue to Course 2 if the school wants. |
| Phone ownership | Affects consent, device sharing and daily time | Assume school-owned phones, shared across children in rotation. Confirm before the pilot. |
| Marathi content owner | Nobody on the team yet writes or reviews Marathi-English lessons | Find one Marathi-speaking teacher in the school as reviewer, with a fixed weekly time |
| Consent route | Children's data: DPDP Act 2023 requires consent for under-18s | Check with the school principal and a lawyer before collecting any child's data |
| Speaking capacity | About 1 hour/week of teacher time for 30 children | Rotate: 10 children per day across 3 days |
| Device readiness | Android phones of mixed quality | Test on the lowest-spec device the school has |
| Recording storage | Speaking recordings are personal data | Delete after scoring unless there's a clear reason to keep them |

---

## 10. Build order

1. Paper pilot: run Lesson 01 with 5 children and cards (validates the loop before any code)
2. Finalise the Pre-emergent placement and diagnostic items
3. Write and review Course 1, Weeks 1–2 (10 lessons) with the Marathi reviewer
4. Scaffold the PWA: React + Vite, offline caching, class roster sign-in, the 8-step lesson screen, progress saving
5. Teacher view: class list, skill profile per child, stagnation flags
6. Pilot Weeks 1–2 with the class. Fix what breaks. Then write Weeks 3–8.

---

## 11. Success check (end of pilot)

- At least 70% of children move up at least 1 level **or** improve in at least 3 of 5 skills
- At least 60% of children keep their gain on the delayed check
- Median daily phone use under 30 minutes, with no child over 45
- Teacher can answer, from the dashboard alone: who is stuck, on what, and what to do next

These are proposed targets. Adjust them after the baseline data is in.
