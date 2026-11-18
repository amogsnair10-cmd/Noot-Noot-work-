# Akshar English

A self-paced English learning app for learners who cannot yet read or speak English, with Hindi support. It works for children and adults, on phones, and offline after the first visit.

The app needs no reading ability to use: every instruction is spoken and shown with pictures. A friendly guide, **Mitra** 🦉, talks the learner through each step.

---

## Who it is for: four learner levels

Learners are placed by a short **starting test**, not by age or grade.

| Level | Name (Hindi) | Who | What they learn |
|---|---|---|---|
| 1 🌱 | Pre-emergent (शुरुआत) | Cannot read or write English at all | All 26 letters with sounds, 60+ everyday words by picture and sound, first 3-letter words |
| 2 🌿 | Emergent (उभरता) | Knows some letters, reads some words, but doesn't understand them | Sounding out words, 25 sight words, **word meaning** (English → Hindi), polite phrases |
| 3 🌳 | Potential (संभावना) | Reads and understands words | Reading and building sentences, in/on/under, sh/ch/th, everyday questions and answers |
| 4 🌟 | High potential (उच्च संभावना) | Reads simple sentences | Short stories with comprehension questions, own writing, real-life conversations (shop, bus, doctor, phone) |

60 lessons in 4 levels and 14 units. Each level ends with a **Challenge**. Passing it (80%+) moves the learner up a level.

## How a lesson works

Every lesson follows the PRD's learning loop in about 8–12 minutes:

1. **Warm-up** 🔁: recall 2–3 items from earlier lessons that are due for review (spaced repetition)
2. **Learn** 👀: see the picture, hear the English, get the Hindi meaning, hear it again (SEE → UNDERSTAND → HEAR)
3. **Practise** ✋: listen and pick the picture, pick the word for the picture, pick the meaning
4. **Use it** 🧩: spell with letter tiles, trace letters with a finger, build sentences, speak (REPEAT → READ & WRITE → APPLY)
5. **Check** 🎯: short independent check; only first-try answers count
6. **Celebrate** ⭐: stars, new words learned, gentle sounds

Activity types: listen-and-pick, read-and-pick, picture-to-word, word meaning, letter recognition, first sound, capital/small match, letter tracing (checked for accuracy), spelling with tiles, sentence order, fill the gap, listening to sentences, question-and-answer dialogues, read-along stories with word highlighting, story comprehension, speaking practice, and free writing.

## How it adapts (transparent rules, no AI)

- **Wrong answer:** the option fades and Mitra says "try again" in Hindi and replays the audio. After 2 misses the right answer glows. Learners always finish on a success, but assisted answers do **not** count as mastered.
- **Lesson pass:** 70%+ first-try accuracy in the Check unlocks the next lesson. Clicking through can't unlock anything.
- **Failed twice:** the lesson switches to **easy mode** (2 choices instead of 4, Hindi always on), and the teacher dashboard flags it as stuck.
- **Spaced repetition:** each word, letter and sentence moves through 6 review boxes (1, 2, 4, 7, 14, 30 days). Due items appear in the warm-up and in the Practice tab.
- **Hindi fades out:** levels 1–2 speak instructions in Hindi and show meanings. Levels 3–4 speak English and hide Hindi behind a tap.
- **Skill tracking:** six skills are tracked separately (listening, speaking, reading, writing, words, understanding), based on the last 20 independent answers in each.

## Measuring growth

- **Starting test (form A):** 4 adaptive stages (letters and words → reading words → sentences → story). It stops early when a stage is too hard, so beginners aren't overwhelmed. It sets the starting level and records a baseline for every skill.
- **Final test (form B):** the same structure with different, unfamiliar items, so it measures learning rather than memory. It opens after 4 weeks or 12 lessons, or any time from the teacher area.
- **Memory check:** 2 weeks after the final test, a short check on learned items measures retention.
- The **Progress** screen shows skills now against the starting test, the level journey, words learned and the learner's own writing.

## Time limits

- Daily goal: 25 minutes (ring on the home screen).
- **Hard limit: 60 minutes a day.** After that the app says "rest now, see you tomorrow". It never cuts a lesson off midway. The teacher can change both values or allow extra time for one learner.
- Learners can stop any time. The lesson resumes where they left off.

## Teacher area

Open with **More → Teacher area**. The PIN is `1234`; change it right away.

- Class overview: level counts and, per learner, start→now level, lessons, minutes in the last 7 days, and flags (stuck, inactive, moved up, no test).
- Learner detail: skills at start, now and final; tricky words; stuck lessons; a speaking rubric (0–4) for the teacher to score; set level; allow extra time; run the final test; share the report; delete.
- **Download CSV** of all learners on the phone, using the same measures as the tracking sheet.
- **Backup / Restore** a JSON file to move a learner to a new phone.

Because learners use their own phones and there is no server, each learner's data stays on their phone. Learners send their report to the teacher with **Progress → Send report** (WhatsApp share).

## Phone requirements and known limits

- Android phone with Chrome is best. iPhone Safari works too.
- **Voice:** uses the phone's built-in text-to-speech. English works on almost all phones. For Hindi audio the phone needs a Hindi voice (Settings → Text-to-speech → install Hindi). Without it, Hindi still shows as text.
- **Speaking check:** where Chrome speech recognition is available (online), the app listens and gives gentle feedback. Otherwise it records the learner and plays it back. Speaking never blocks progress, and the teacher's rubric is the main speaking score.
- Letter sounds are taught through key words ("A for apple"). Phone voices can't make isolated phonics sounds. Teacher-recorded audio is a good next step.

## Developing

```bash
cd app
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/ (PWA, works offline)
```

Tech: React + TypeScript + Vite, PWA (vite-plugin-pwa), Baloo 2 font bundled (Latin + Devanagari), no backend, everything in `localStorage`.

- Content: `src/content/` (words, letters, sight words, sentences, dialogues, stories, curriculum). New lessons are data only. The engine generates the activities.
- Engine: `src/lib/engine.ts` (lesson generator, adaptive rules, spaced repetition, scoring), `src/lib/placement.ts` (tests).
- Scripts (run against `npm run dev`, need Playwright): `scripts/validate-lessons.cjs` generates every lesson 20× and checks for bad options; `scripts/e2e-walkthrough.cjs <outdir> strong|weak <lessons>` plays the app like a learner and takes screenshots.

## Deploying

`.github/workflows/deploy-app.yml` builds and publishes to GitHub Pages on every push to `main` that touches `app/`. To turn it on once: repo **Settings → Pages → Source: GitHub Actions**. The app is then at `https://<user>.github.io/<repo>/`. Learners open it in Chrome and tap **Install app** (or "Add to Home screen").
