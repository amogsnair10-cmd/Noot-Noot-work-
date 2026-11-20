# -*- coding: utf-8 -*-
"""9 TFI-style lesson plans (35 mins) for Grade 4 grammar."""

SVS = {
    "SELF_U": ("Leading Self", "Understand Self",
               "I can describe some aspects of my history, interests, aspirations, traits and rights",
               "I appreciate and leverage aspects of my history, interests, aspirations, traits and rights towards my goals"),
    "SELF_L": ("Leading Self", "Learn and Grow",
               "I am consistently on task learning rigorous and relevant content and meet some of my learning goals. I take part in available opportunities aligned with my goals",
               "I am interested and work hard consistently to learn rigorous and relevant content and meet many of my learning goals, and I choose opportunities aligned to my goals"),
    "OTH_U": ("Leading Others", "Understand Others",
              "I sometimes consider when acting, the needs and perspectives of others",
              "I consistently consider when acting, the needs and perspectives of others"),
    "OTH_B": ("Leading Others", "Build Community",
              "I build caring relationships with people around me and ask for help sometimes",
              "I build caring relationships with a diverse set of people and ask for help when I need it"),
    "IND_U": ("Leading India", "Understand India",
              "I can give examples and practice actions towards Equality, Justice, Liberty and Fraternity",
              "I raise my voice respectfully and take action towards Equality, Justice, Liberty and Fraternity"),
    "IND_C": ("Leading India", "Create Solutions Together",
              "I understand the problems I face and create solutions",
              "I understand the problems in my classroom and community and work with others to create solutions"),
}

L = []

# ============================================================== 1 NOUNS
L.append(dict(
    no=1, topic="Nouns", title="Name It to Claim It!", ws="Worksheets 1 &amp; 2 (Worksheet 16 for mixed revision)",
    obj="I can find <b>nouns</b> (naming words) and use them in my own sentences.",
    bigq="What would happen if <b>nothing</b> in the world had a name?",
    why="""<p><b>Hook:</b> “Hands up if you have ever lost your bag, your bottle or your pet. What did you tell Mum or Dad? You had to NAME it!”</p>
<p>Every time we ask for a snack, call a friend, tell someone where we left something, or send a message, we use <b>nouns</b>. Without them nobody knows WHO or WHAT we mean. Today we become <b>Name Masters</b>: people who can say exactly what they mean in stories, shops, games and real life.</p>""",
    spark="""<ul class="t">
<li><b>0:00 The Thingamajig Teacher.</b> Walk in and say, very seriously: “Good morning! Please take out your <i>whatchamacallit</i> from your <i>thingy</i> and put it on your <i>wobbly-bob</i>.” Use NO real nouns for 60 seconds. Students try to follow and giggle.</li>
<li><b>0:01</b> Ask: “Why couldn’t you do it?” (<i>We didn’t have the names!</i>)</li>
<li><b>0:02 Name Blast!</b> Point at things in the room. In 30 seconds the class shouts the real name of each. Write the best 6 words on the board and label them <b>NOUNS</b>.</li>
<li><b>0:04</b> Reveal the Big Question + objective. Class reads the objective in 3 voices: robot, whisper, superhero.</li></ul>""",
    kla="""<ul class="t">
<li><b>I Do (2 min):</b> Four corners with doodle posters: <b>Person 👩‍🏫, Place 🏫, Animal 🐶, Thing ⚽</b>. Teach a body sign for each (Person = stand tall, Place = arms make a roof, Animal = claws, Thing = hold an imaginary object).</li>
<li><b>We Do – Noun Corners (5 min):</b> Teacher reads or shows 10 word/picture cards (teacher, Mumbai, tiger, bag, school, Meera, rabbit, kite, doctor, river). Students <b>penguin-walk</b> to the right corner and freeze with the sign. Pause on tricky ones (<i>birthday? idea?</i>) and let kids argue it out politely.</li>
<li><b>You Do (3 min):</b> At their corner, each group has 60 seconds to add 4 more nouns (write or draw) on the corner chart, then rotates once and adds 2 more.</li>
<li><b>One-line add-on:</b> “Special names like <i>Meera, India, Diwali</i> are VIP nouns: they get a <b>CAPITAL letter</b>.”</li></ul>""",
    assess="""<p><b>18 mins total = Group Work (~12 mins, see Partnership row) + Individual check (~6 mins).</b></p>
<p><b>Individual check – “Noun or Not?”</b> Teacher reads 8 words (<i>teacher, jump, Mumbai, quickly, dog, blue, bag, run</i>). Students write <b>N</b> or <b>X</b> on slates. Then each writes ONE sentence with 2 nouns and underlines them.</p>
<p><b>Success:</b> 7/8 correct + a sentence with 2 nouns = <b>Got it</b> • 5–6 = <b>Nearly</b> • 4 or fewer = pull for a picture-card small group tomorrow.</p>""",
    closing="""<p><b>Name Mic-Drop (2 min):</b> Pass an imaginary mic around the circle. Each child says “I found a noun: ___” and drops the mic. Revisit the Big Question: “If nothing had a name…?” Class answers in a chorus: <i>“…we couldn’t ask, share or understand!”</i> Preview: worksheet tomorrow.</p>""",
    group="""<p><b>🛒 The Noun Market (groups of 4).</b> <i>Roles:</i> Shopkeeper, Customer, Announcer (counts nouns on fingers), Artist (draws the sign).</p>
<ul class="t"><li><b>Plan (3–4 min):</b> each group draws a Scene Card: <b>Market • Hospital • Zoo • School • Park • Kitchen</b>. List 8+ nouns for the place on a Noun Bank, then plan a 6-line dialogue.</li>
<li><b>Perform (2 × 4 min):</b> pair up groups. Group A performs for Group B, then switch. Audience = <b>Noun Catchers</b> (tally nouns heard).</li></ul>
<p><b>Sample dialogue:</b> <i>Customer: “Good morning! I want a mango and two bananas.” Shopkeeper: “Here you go! Anything else?” Customer: “Yes, a bag, please.”</i></p>
<p><b>Success:</b> 8+ nouns used • everyone speaks • audience tally matches.</p>""",
    svs=["OTH_B", "SELF_L"],
    look="Takes turns and cheers for the other group • asks a teammate for help • stays on task for the full Noun Corners round.",
    mats="Chart paper, markers, 4 corner posters, 10 picture/word cards, Scene Cards, slates, tape.",
    diff="<b>Pre-emergent:</b> picture-only cards, point-and-say, partner whisper. <b>Emergent:</b> sentence starter “I see a ___”. <b>Stretch:</b> add a describing word to each noun or find the proper noun for each.",
))

# ============================================================== 2 VERBS
L.append(dict(
    no=2, topic="Verbs", title="Action! Make It Happen!", ws="Worksheets 3 &amp; 4",
    obj="I can find <b>verbs</b> (action words) and say if something happens <b>now</b> or <b>before</b>.",
    bigq="Can a sentence come <b>alive</b> without an action?",
    why="""<p><b>Hook:</b> “Imagine a video game where nobody can run, jump or throw. Or a cooking video where nobody cooks!”</p>
<p>Every story, game, recipe and instruction (“Throw the ball!”, “Stir the dal!”) runs on <b>verbs</b>. Without them, writing is a frozen photo. Today we become <b>Action Heroes</b> who make sentences MOVE and can also say WHEN things happen, like telling your teacher what you did last weekend.</p>""",
    spark="""<ul class="t">
<li><b>0:00 Freeze Frame!</b> Play music or clap a beat; students dance. Clap = <b>FREEZE</b>.</li>
<li><b>0:02</b> Pick 3 frozen kids: “Describe the picture with NO action words.” (<i>girl… ball… table…</i>) It sounds flat and boring!</li>
<li><b>0:03 “ACTION!”</b> Shout verbs and everybody does them on the spot: <i>spin, hop, sleep, clap, swim.</i> “What made the room come alive?” Write 5 verbs on the board: <b>VERBS</b>.</li>
<li><b>0:05</b> Reveal Big Question + objective.</li></ul>""",
    kla="""<ul class="t">
<li><b>Verb Charades (4 min):</b> Teacher mimes (<i>kick, brush, read, climb</i>). Class calls the verb and says a sentence: “The boy <b>kicks</b> the ball.” Then 3 volunteers mime for the class.</li>
<li><b>Time Machine (5 min):</b> Tape a line on the floor: <b>YESTERDAY ◀ TODAY ▶</b>. Teacher says “I walk” (stand on TODAY). “I walked” (step to YESTERDAY). Class jumps the line with <i>jump/jumped, play/played</i>. Teach: most verbs just add <b>-ed</b>.</li>
<li><b>Rebel Verbs (1 min):</b> Some verbs are rebels and change completely: <b>go → went, eat → ate, run → ran, see → saw</b>. Class chants them with a sound effect.</li></ul>""",
    assess="""<p><b>18 mins total = Group Work (~12 mins) + Individual check (~6 mins).</b></p>
<p><b>Individual check – “Show Me!”</b> Teacher reads 6 sentences (<i>Ravi kicked the ball. / I eat rice. / We painted a rainbow…</i>). For each: (a) silently ACT the verb, (b) write the verb on a slate, (c) write <b>T</b> (today) or <b>Y</b> (yesterday).</p>
<p><b>Success:</b> 5/6 verbs found + tense right = <b>Got it</b>. Note names of anyone mixing <i>went/goed</i> style errors for tomorrow’s warm-up.</p>""",
    closing="""<p><b>Freeze &amp; Tell (2 min):</b> Music stops, everyone freezes in a pose from today. Tap 3 kids: “What did you do?” They answer in the past: “I <b>jumped</b>!” Revisit the Big Question: <i>No verb = no movie!</i></p>""",
    group="""<p><b>🎬 Silent Movie Directors (groups of 4–5).</b> <i>Roles:</i> Director (keeps time), 2–3 Actors, Narrator, Verb Spotter (writes verbs heard).</p>
<ul class="t"><li><b>Pick a Scene Card (3 min):</b> Morning routine • Cricket match • Cooking maggi • Getting ready for school • Rainy-day rescue.</li>
<li><b>Perform (2 × 4 min):</b> Actors mime in silence for 1 minute while the Narrator speaks in the <b>present</b>: “She <b>brushes</b> her teeth.” Then <b>replay in the past</b>: “Yesterday she <b>brushed</b> her teeth.”</li></ul>
<p><b>Success:</b> 6+ different verbs • at least 2 correct past forms • every child acts or narrates.</p>""",
    svs=["SELF_U", "SELF_L"],
    look="Chooses a scene from own interests (“I love cricket!”) • sticks with the task until both tenses are done • helps a teammate fix a past form.",
    mats="Music or clapper, floor tape, verb cards, Scene Cards, slates.",
    diff="<b>Pre-emergent:</b> act out and say the verb orally; use picture-verb cards. <b>Emergent:</b> narrator sentence frame “She ___ her ___.” <b>Stretch:</b> narrate in the future (“Tomorrow she will…”).",
))

# ============================================================== 3 ADJECTIVES
L.append(dict(
    no=3, topic="Adjectives", title="Wow Words: Describe Like a Superstar!", ws="Worksheets 5 &amp; 6 (Worksheet 16 for mixed revision)",
    obj="I can use <b>adjectives</b> (describing words) to paint a picture with words.",
    bigq="How can I make someone <b>SEE</b> a picture that only exists in my head?",
    why="""<p><b>Hook:</b> “If I say ‘I got a dog’… what do you see? Now: ‘I got a tiny, fluffy, golden puppy.’ What do you see NOW?”</p>
<p>Game designers, cartoonists, food bloggers and YouTubers all use <b>adjectives</b> so that people can imagine, choose and get excited (“a spicy, crunchy samosa!”). Adjectives also help us describe <b>ourselves</b> (<i>brave, curious, kind</i>) and understand how others feel.</p>""",
    spark="""<ul class="t">
<li><b>0:00 Mystery Bag.</b> Put an object in a cloth bag (a mango, a soft toy, a spiky ball, a stone). Three kids feel it and describe WITHOUT naming it: “soft… round… bumpy…” The class guesses.</li>
<li><b>0:03 Boring vs WOW.</b> Board: “I saw a dog.” vs “I saw a <b>tiny, fluffy, golden</b> dog.” Class shows a bored face for the first and a WOW face for the second.</li>
<li><b>0:05</b> “What did we use to paint the picture? <b>Adjectives!</b>” Reveal Big Question + objective.</li></ul>""",
    kla="""<ul class="t">
<li><b>Sentence Stretch (4 min):</b> Board: “The cat sat.” Add one adjective at a time. Students <b>stretch their arms wider</b> with each one: “The <b>lazy</b> cat sat.” → “The lazy <b>orange</b> cat sat on the <b>soft</b> mat.”</li>
<li><b>Five Senses Wow Wall (4 min):</b> Five chart sheets: SEE 👀 TOUCH ✋ TASTE 👅 SMELL 👃 HEAR 👂. Teacher names a noun (<i>ice-cream, rain, drum</i>); groups run to stick sticky notes with adjectives on the right sheet.</li>
<li><b>Big, Bigger, Biggest (2 min):</b> Three volunteers line up: <i>tall, taller, tallest</i>. Use <b>-er</b> for 2 things and <b>-est</b> for 3+.</li></ul>""",
    assess="""<p><b>18 mins total = Group Work (~12 mins) + Individual check (~6 mins).</b></p>
<p><b>Individual check – “A or B?”</b> Flash 4 pairs of sentences (one plain, one with adjectives). Students hold up an <b>A/B card</b> for the one that paints a better picture, then underline the adjectives on a slate. Finally each writes 1 sentence about their school bag or pet with <b>2 adjectives</b>.</p>
<p><b>Success:</b> underlines 3/4 correctly + sentence has 2 adjectives = <b>Got it</b>.</p>""",
    closing="""<p><b>Adjective Selfie (2 min):</b> Each child says one adjective that describes how they feel or how they worked today (“I felt <b>proud</b>.” “I was <b>curious</b>.”). Revisit Big Question: <i>We paint pictures with adjectives!</i></p>""",
    group="""<p><b>👾 Monster Mash-Up: Describe &amp; Draw (groups of 4 = 2 pairs).</b></p>
<ul class="t"><li><b>Round 1 (4 min):</b> Partner A holds a secret monster drawing (teacher-made or A draws one). Sitting <b>back-to-back</b>, A describes it using only adjectives + nouns: “It has three <b>huge, green</b> eyes.” Partner B draws and may ask: “Is it <b>big</b> or <b>small</b>?”</li>
<li><b>Reveal &amp; swap (4 min):</b> Compare drawings. Swap roles.</li>
<li><b>WANTED poster (4 min):</b> The group writes a WANTED poster with 5 adjectives for their favourite monster and presents it: “Wanted: a <b>hairy, noisy, purple</b> monster!”</li></ul>
<p><b>Success:</b> 5+ adjectives • B asks at least 2 questions politely.</p>""",
    svs=["SELF_U", "OTH_U"],
    look="Describes self or favourite things with adjectives • listens carefully to partner before drawing • asks polite clarifying questions.",
    mats="Cloth bag + 4 objects, chart paper (5 sense sheets), sticky notes, A/B cards, secret monster drawings, plain paper.",
    diff="<b>Pre-emergent:</b> choose from an adjective picture bank (big/small, hot/cold…). <b>Emergent:</b> frame “It is ___ and ___.” <b>Stretch:</b> use comparing words (-er / -est) in the poster.",
))

# ============================================================== 4 PRONOUNS
L.append(dict(
    no=4, topic="Pronouns", title="Pronoun Power: Stop the Repeat-Robot!", ws="Worksheets 7 &amp; 8 (Worksheet 17 for mixed revision)",
    obj="I can use <b>pronouns</b> (he, she, it, they, we, I, you) and <b>my, your, his, her, our, their</b> so I don’t repeat names.",
    bigq="Why don’t we say “Meera” ten times in one story?",
    why="""<p><b>Hook:</b> “Imagine telling your friend: ‘Rahul went to Rahul’s house and Rahul took Rahul’s bag.’ Would they stay to listen?”</p>
<p><b>Pronouns</b> make our speaking and writing smooth, quick and natural: in stories, chats and messages. They also help us show respect, because we use the pronoun that each person uses for themselves. Today we beat the <b>Repeat-Robot</b>!</p>""",
    spark="""<ul class="t">
<li><b>0:00 The Repeat-Robot.</b> Teacher speaks like a robot: “Meera has a kite. Meera’s kite is red. Meera flies Meera’s kite. Meera loves Meera’s kite.”</li>
<li><b>0:02</b> Students press an imaginary <b>BUZZER</b> (“BZZT!”) every time a name repeats. Count the buzzes.</li>
<li><b>0:03 Fix the robot!</b> Class re-tells the story: “Meera has a kite. <b>It</b> is red. <b>She</b> flies it. <b>She</b> loves <b>her</b> kite.” Cheer!</li>
<li><b>0:05</b> Reveal Big Question + objective.</li></ul>""",
    kla="""<ul class="t">
<li><b>Pronoun Gestures (3 min):</b> <b>I</b> = hand on chest • <b>you</b> = point to a friend • <b>he/she</b> = point to a boy/girl across the room • <b>it</b> = point to an object • <b>we</b> = group hug • <b>they</b> = wave at a group. Teacher says “Meera”, “Arjun and Rita”, “my pencil”, “you and me”; class does the gesture + says the pronoun.</li>
<li><b>Whose is it? (4 min):</b> Basket with a bag, bottle, pencil, book. Hold up each item: “Whose is this? It is <b>his</b> bag. It is <b>her</b> bottle. It is <b>our</b> book. It is <b>their</b> pencil.” Chart: <b>my, your, his, her, its, our, their</b> with doodles.</li>
<li><b>Pronoun Swap (3 min):</b> Teacher says a sentence with a name; class replies in chorus with the pronoun version (“Rohan eats rice.” → “<b>He</b> eats rice.”).</li></ul>""",
    assess="""<p><b>18 mins total = Group Work (~12 mins) + Individual check (~6 mins).</b></p>
<p><b>Individual check – Show-Me Cards.</b> Each child has mini cards: <b>he, she, it, they, we, his, her</b>. Teacher reads 6 blanks (“___ is my best friend (Ria).” “The boys washed ___ hands.”). Students hold up the right card. Then they write 2 sentences about a friend using 2 pronouns.</p>
<p><b>Success:</b> 5/6 cards right + 2 pronouns used = <b>Got it</b>.</p>""",
    closing="""<p><b>Pronoun Pass (2 min):</b> In a circle each child says “<b>I</b> love <b>my</b> ___.” Class replies “<b>He/She</b> loves <b>his/her</b> ___.” Re-tell the Meera story one more time with pronouns. Big Question answered: <i>pronouns beat the Repeat-Robot!</i></p>""",
    group="""<p><b>📰 Breaking News Reporters (pairs, then pair-of-pairs).</b></p>
<ul class="t"><li><b>Interview (4 min):</b> Reporter asks 3 questions: “What is your favourite game?” “Who is your best friend?” “What is in your bag?” and takes quick notes. Swap.</li>
<li><b>Broadcast (2 × 4 min):</b> Reporter turns to the “camera” (the other pair) and reports using pronouns: “Breaking news! Aman loves cricket. <b>He</b> plays with <b>his</b> brother. <b>His</b> bat is blue.” <b>Rule:</b> each name can only be said ONCE!</li></ul>
<p><b>Respect rule:</b> always use the pronoun your partner uses for themselves.</p>
<p><b>Success:</b> 4+ pronouns • name used only once • partner confirms “Yes, that’s me!”</p>""",
    svs=["OTH_U", "OTH_B"],
    look="Listens to a partner’s answers and reports them correctly • uses the pronoun a person prefers for themselves • encourages a nervous reporter.",
    mats="Buzzer (or kids’ voices), basket of 4 items, Show-Me pronoun cards, pronoun chart, notebooks.",
    diff="<b>Pre-emergent:</b> oral reporting with picture prompts. <b>Emergent:</b> frame “___ loves ___. He/She plays ___.” <b>Stretch:</b> use <i>its, their, our</i> in the broadcast.",
))

# ============================================================== 5 ARTICLES
L.append(dict(
    no=5, topic="Articles", title="A, An, The: Tiny Words, Big Jobs!", ws="Worksheet 9 (Worksheet 17 for mixed revision)",
    obj="I can choose <b>a, an or the</b> correctly when I speak and write.",
    bigq="Why do we say “<b>an</b> apple” but “<b>a</b> banana”?",
    why="""<p><b>Hook:</b> “Say it fast: ‘I want a apple.’ Did your tongue trip?”</p>
<p><b>An</b> makes words glide smoothly. And <b>a</b> vs <b>the</b> tells your listener if you mean <i>any one</i> or <i>one special one</i>: “Give me <b>a</b> pen” (any pen) vs “Give me <b>the</b> pen” (THAT pen). At a shop, while ordering lunch, in a game or when giving directions, these tiny words stop big confusion.</p>""",
    spark="""<ul class="t">
<li><b>0:00 The Hiccup Game.</b> Teacher says: “I ate <b>a</b> apple, <b>a</b> egg and <b>a</b> ice-cream.” Students <b>HICCUP</b> loudly at every mistake and shout the fix (“AN!”).</li>
<li><b>0:02 Any vs THE.</b> “Bring me <b>a</b> pencil.” (any pencil arrives!) “Bring me <b>the</b> pencil.” (they freeze: which one?) “<b>The</b> pencil on Rohan’s desk.” Now everyone knows exactly which. Ha!</li>
<li><b>0:05</b> Reveal Big Question + objective.</li></ul>""",
    kla="""<ul class="t">
<li><b>Vowel Doors (6 min):</b> Tape two doors on the floor: <b>A-DOOR</b> (consonant sounds) and <b>AN-DOOR</b> (vowel sounds a, e, i, o, u). Show word cards: <i>apple, banana, umbrella, zebra, elephant, kite, orange, egg, owl, pencil, ice-cream, ant</i>. Students hop through the correct door and say “<b>an</b> apple!”. Rule: listen for the <b>SOUND</b>, not just the letter.</li>
<li><b>THE = Spotlight (3 min):</b> Use a torch or finger-spotlight: “<b>The</b> sun, <b>the</b> moon, <b>the</b> board.” Use <b>the</b> for one special thing, or something already mentioned: “I saw <b>a</b> dog. <b>The</b> dog was big.”</li>
<li><b>Doodle rule chart (1 min):</b> a / an / the, drawn together on the board.</li></ul>""",
    assess="""<p><b>18 mins total = Group Work (~12 mins) + Individual check (~6 mins).</b></p>
<p><b>Individual check – Door-Hop Quiz.</b> Teacher reads 6 nouns (<i>umbrella, pencil, zebra, owl, kite, egg</i>). Students write <b>a</b> or <b>an</b> on slates. Then 3 quick fill-ins: “___ sun is hot.” “I see ___ ant.” “She has ___ doll.”</p>
<p><b>Success:</b> 7/9 correct = <b>Got it</b>.</p>""",
    closing="""<p><b>Article Echo (2 min):</b> Teacher says a noun, class echoes with the right article (<i>apple → an apple</i>). Final round: “the SUN!” Revisit Big Question: <i>vowel SOUNDS get an!</i></p>""",
    group="""<p><b>🛍️ The Kirana Store (groups of 3).</b> <i>Roles:</i> Shopkeeper, Customer, Narrator/Scribe (tallies correct articles). Rotate roles each round.</p>
<ul class="t"><li><b>Setup (2 min):</b> each group gets 8 picture cards (orange, banana, egg, umbrella, kite, apple…).</li>
<li><b>3 rounds × 3 min:</b> Customer must ask using <b>a/an/the</b>: “Can I have <b>an</b> orange and <b>a</b> banana?” Shopkeeper: “Which banana?” Customer: “<b>The</b> big one, please.” Scribe writes down each article used.</li></ul>
<p><b>Success:</b> 5+ correct articles per round • everyone plays each role once • politeness words used (please, thank you).</p>""",
    svs=["SELF_L", "OTH_B"],
    look="Keeps trying after a mistake (“let me say it again”) • asks teammates for help on tricky sounds • thanks the shopkeeper.",
    mats="Floor tape (2 doors), word cards, torch, picture cards for the store, slates.",
    diff="<b>Pre-emergent:</b> picture + word cards, say it aloud together. <b>Emergent:</b> scribe writes full sentences. <b>Stretch:</b> tricky sounds (<i>an hour, a university</i>).",
))

# ============================================================== 6 PREPOSITIONS
L.append(dict(
    no=6, topic="Prepositions", title="Where in the World? The Treasure Hunt", ws="Worksheets 10 &amp; 11 (Worksheet 17 for mixed revision)",
    obj="I can use <b>prepositions</b> (in, on, under, behind, between…) to say exactly <b>where</b> something is.",
    bigq="How can <b>words</b> lead someone to hidden treasure?",
    why="""<p><b>Hook:</b> “Where is my shoe?” “It’s… the bed.” <i>(Under? On? Behind?)</i> Without the little word, the clue is useless!</p>
<p>A treasure map, hide-and-seek, giving a friend directions to your house, telling Mum where you left your lunchbox: all need <b>prepositions</b>. They are the <b>GPS words</b> of English.</p>""",
    spark="""<ul class="t">
<li><b>0:00 Simon Says: Preposition Edition.</b> “Simon says put your pencil <b>ON</b> your head… <b>UNDER</b> your chair… <b>BEHIND</b> your back… <b>BETWEEN</b> two fingers… <b>IN FRONT OF</b> your nose… <b>NEXT TO</b> your friend.” Nobody is out; a wrong move earns a funny <b>penguin wobble</b>.</li>
<li><b>0:04</b> Ask: “Which words told you WHERE?” Write them on the board.</li>
<li><b>0:05</b> Reveal Big Question + objective.</li></ul>""",
    kla="""<ul class="t">
<li><b>Noot’s Hiding Spots (5 min):</b> Use a toy penguin (Noot) and a box. Model “Noot is <b>in</b> the box / <b>on</b> the box / <b>under</b>…” Then each group gets a chair + object. Teacher calls a word; groups place the object and <b>freeze</b>. Teacher checks and praises exact positions.</li>
<li><b>Picture Detective (3 min):</b> Classroom scene on the board with a cat, ball and bag: “The cat is ___ the table. The ball is ___ the shelf.” Partners whisper the answer, then shout together.</li>
<li><b>Time words chant (2 min):</b> <b>at</b> 5 o’clock, <b>on</b> Monday, <b>in</b> June. Clap the rhythm.</li></ul>""",
    assess="""<p><b>18 mins total = Group Work (~12 mins) + Individual check (~6 mins).</b></p>
<p><b>Individual check – Where’s Noot?</b> Show 6 pictures of Noot in different places. Students write the preposition on slates (in, on, under, behind, between, in front of). Then write a sentence: “My bag is ___ my desk.”</p>
<p><b>Success:</b> 5/6 correct + a full sentence = <b>Got it</b>.</p>""",
    closing="""<p><b>Whisper Where (2 min):</b> Partners whisper where their pencil is (“It is <b>in</b> my bag”). Class chorus: “Prepositions are our <b>GPS words</b>!”</p>""",
    group="""<p><b>🏴‍☠️ Treasure Hunt Dialogues (groups of 4: 2 Hiders, 2 Seekers).</b></p>
<ul class="t"><li><b>Hide &amp; write (4 min):</b> Hiders (Seekers face the wall) hide a “treasure” (eraser or toy) in a safe spot and write <b>3 clue cards</b>: “It is <b>in front of</b> the door.” “It is <b>under</b> something blue.” “It is <b>near</b> the window.”</li>
<li><b>Hunt (5 min):</b> Seekers get one clue at a time and may only ask preposition questions: “Is it <b>under</b> the table?” “No! Try <b>between</b> the books!”</li>
<li><b>Swap (3 min):</b> Seekers become Hiders and repeat quickly.</li></ul>
<p><b>Success:</b> 3 clues use 3 different prepositions • Seekers use polite questions • treasure found.</p>""",
    svs=["IND_C", "OTH_B"],
    look="Names the problem (“the treasure is hidden”) and solves it together • everybody gets a clue turn • teammates ask each other for help.",
    mats="Toy penguin (Noot), boxes/chairs, classroom scene picture, treasure objects, clue cards, slates.",
    diff="<b>Pre-emergent:</b> use gestures + the six core prepositions only. <b>Emergent:</b> clue cards with starter “It is ___ the ___.” <b>Stretch:</b> use <i>across, through, above</i> in clues.",
))

# ============================================================== 7 ADVERBS
L.append(dict(
    no=7, topic="Adverbs", title="Do It Like…! Adverb Acting", ws="Worksheets 12 &amp; 13 (Worksheet 18 for mixed revision)",
    obj="I can use <b>adverbs</b> to tell <b>how, when and where</b> something happens.",
    bigq="Does <b>HOW</b> you do something change what it means?",
    why="""<p><b>Hook:</b> “Close the door.” Now close it <b>gently</b>… <b>angrily</b>… <b>sleepily</b>. Same action, totally different story!</p>
<p><b>Adverbs</b> give feelings to stories, make instructions clear (“Walk <b>carefully</b>”), help us be kind (“Speak <b>softly</b>”) and help us understand how people feel. Commentators say “He hits the ball <b>beautifully</b>!” Actors use adverbs in every scene.</p>""",
    spark="""<ul class="t">
<li><b>0:00 Say It Like…</b> Teacher says “I am going to eat my lunch” in 4 ways (angrily, sleepily, excitedly, secretly). Class guesses HOW.</li>
<li><b>0:03</b> Students say “Good morning!” in the style shown on a mood-card (emoji faces). Write the adverbs on the board: “Words that tell <b>HOW</b> are <b>adverbs</b>.”</li>
<li><b>0:05</b> Reveal Big Question + objective.</li></ul>""",
    kla="""<ul class="t">
<li><b>Adverb Charades (4 min):</b> Two piles: VERB cards (<i>walk, eat, talk, open the door, drink</i>) and ADVERB cards (<i>slowly, loudly, sleepily, happily, quietly, carefully</i>). A volunteer picks one of each and acts. Class guesses: “He walks <b>slowly</b>.”</li>
<li><b>The -ly Factory (3 min):</b> Draw a doodle machine: slow → slow<b>ly</b>, quick → quick<b>ly</b>, happy → happ<b>ily</b> (y becomes i!). Class invents 3 more.</li>
<li><b>When? Where? How? Wheel (3 min):</b> Sentence: “The cat jumped.” Add <b>yesterday</b> (WHEN), <b>outside</b> (WHERE), <b>quickly</b> (HOW). Three students hold the cards and stand in order to build: “Yesterday the cat jumped quickly outside.”</li></ul>""",
    assess="""<p><b>18 mins total = Group Work (~12 mins) + Individual check (~6 mins).</b></p>
<p><b>Individual check – Show Me HOW.</b> Teacher whispers a verb + adverb to a child, who acts it; others write the adverb on slates. Do 5 rounds. Then each student writes 2 sentences: one with a HOW adverb, one with a WHEN or WHERE adverb.</p>
<p><b>Success:</b> 4/5 adverbs found + 2 correct sentences = <b>Got it</b>.</p>""",
    closing="""<p><b>Thank-you-ly (2 min):</b> Each child says “Thank you!” in a chosen adverb style (politely, happily…) and the class guesses. Ask: “Which way would YOU like to be spoken to?” Big Question answered: <i>yes, how we do it changes everything!</i></p>""",
    group="""<p><b>🍽️ Restaurant Drama: Three Ways (groups of 4: Waiter, Customer, Cook, Director).</b></p>
<ul class="t"><li><b>Script (3 min):</b> write a 6-line restaurant dialogue (“Table for two?” “What would you like?” “Pasta, please.”).</li>
<li><b>Rehearse (2 min):</b> perform it THREE times with different adverb moods: <b>politely, angrily, sleepily, excitedly</b>.</li>
<li><b>Perform (2 × 3 min):</b> pair-up groups; the audience guesses the adverb each time.</li></ul>
<p><b>Sample:</b> <i>Waiter: “What would you like?” Customer (<b>sleepily</b>): “Uh… pasta… please.”</i></p>
<p><b>Success:</b> 3 different adverbs • audience guesses at least 2 correctly • all four roles used.</p>""",
    svs=["OTH_U", "SELF_L"],
    look="Notices how tone affects feelings (“that sounded rude”) • chooses kind adverbs on purpose • takes feedback from the audience calmly.",
    mats="Mood cards, verb and adverb cards, chart paper (-ly Factory), When/Where/How cards, slates.",
    diff="<b>Pre-emergent:</b> mood faces instead of words, oral script. <b>Emergent:</b> script frame with blanks for adverbs. <b>Stretch:</b> add adverbs of time/place to the script.",
))

# ============================================================== 8 CONJUNCTIONS
L.append(dict(
    no=8, topic="Conjunctions", title="Glue Words: Join Me!", ws="Worksheet 14 (Worksheet 18 for mixed revision)",
    obj="I can join ideas with the glue words <b>and, but, or, because, so</b>.",
    bigq="How can tiny <b>glue words</b> join ideas… and even people?",
    why="""<p><b>Hook:</b> “I am hungry. I eat. It is hot. I wait.” Sounds like a choppy robot! Now: “I was hungry <b>so</b> I ate, <b>but</b> it was hot <b>so</b> I waited.”</p>
<p><b>Conjunctions</b> let us give reasons, make choices, explain ourselves and even disagree politely (“I understand, <b>but</b>…”). Our Constitution speaks of <b>Fraternity</b>: people joined like friends. Conjunctions join words; friendship joins people.</p>""",
    spark="""<ul class="t">
<li><b>0:00 Choppy Robot vs Smooth Speaker.</b> Teacher speaks in short robotic sentences; class says “bzzt!” Then the smooth version; class cheers.</li>
<li><b>0:02 Human Glue.</b> Two students hold sentence cards (“It was raining.” / “We played outside.”). A third student with a <b>but</b> card steps in between as GLUE. Class reads the joined sentence. Swap in <b>so</b>: “It was raining <b>so</b> we stayed inside.” Meaning changes!</li>
<li><b>0:05</b> Reveal Big Question + objective.</li></ul>""",
    kla="""<ul class="t">
<li><b>Glue Gestures (3 min):</b> <b>and</b> = clap hands together ➕ • <b>but</b> = push palms apart ↔ • <b>or</b> = hands like weighing scales 🔀 • <b>because</b> = point to head (reason) 💡 • <b>so</b> = arrow forward 🎯.</li>
<li><b>Which glue? (5 min):</b> Teacher reads half-sentences (“I was hungry ___ I ate.” “We stayed inside ___ it was raining.”). Class shows the gesture; teacher reveals the glue word card.</li>
<li><b>Finish My Sentence Relay (2 min):</b> Teams line up. Teacher gives starters (“I wanted to play but…”, “I was happy because…”). First child completes it in 5 seconds and goes to the back of the line.</li></ul>""",
    assess="""<p><b>18 mins total = Group Work (~12 mins) + Individual check (~6 mins).</b></p>
<p><b>Individual check – Glue Pick.</b> Each child has 5 glue cards. Teacher reads 6 half-sentences; students hold up the right glue card. Then they write ONE sentence using <b>because</b> (“I love weekends because…”).</p>
<p><b>Success:</b> 5/6 glue cards + a sentence with a reason = <b>Got it</b>.</p>""",
    closing="""<p><b>Chain Round (2 min):</b> In a circle, build one long sentence: “I woke up, <b>and</b> I…” each child adds a piece with a different glue word. Big Question answer: <i>glue words join ideas; friendship joins people.</i></p>""",
    group="""<p><b>🏛️ The Picnic Council (groups of 4: Chair, Reporter, 2 Thinkers).</b></p>
<ul class="t"><li><b>Debate (5 min):</b> decide where the class picnic should be (park, zoo, beach, museum). Use at least 4 different glue words: “We can go to the park <b>or</b> the zoo. The zoo is fun <b>but</b> it is far, <b>so</b>…” Everyone’s voice counts; disagree politely with “I understand, <b>but</b>…”.</li>
<li><b>Write (2 min):</b> Reporter writes 4 sentences using and / but / or / because / so.</li>
<li><b>Perform (2 × 2.5 min):</b> pair up groups; each performs their council meeting in 2 minutes.</li></ul>
<p><b>Success:</b> 4 different glue words • every child speaks • the group reaches a decision together.</p>""",
    svs=["IND_U", "IND_C"],
    look="Gives every teammate a turn to speak (equality) • disagrees respectfully and still helps the group decide • explains reasons with <i>because</i>.",
    mats="Glue-word cards (and, but, or, because, so), sentence cards for Human Glue, Council role cards, chart paper.",
    diff="<b>Pre-emergent:</b> choose between two pictures and say “I like ___ because ___.” <b>Emergent:</b> sentence frames for each glue word. <b>Stretch:</b> use <i>although, if, when</i>.",
))

# ============================================================== 9 SENTENCES
L.append(dict(
    no=9, topic="Sentences", title="Sentence Detectives: The Case of the Jumbled Words", ws="Worksheets 15 &amp; 19 (Worksheet 20 = Grand Challenge)",
    obj="I can put jumbled words and phrases in the right order so a sentence <b>makes sense</b>.",
    bigq="Does the <b>order</b> of words really matter?",
    why="""<p><b>Hook:</b> “The dog chased the cat.” vs “The cat chased the dog.” <b>Same words, two different stories!</b></p>
<p>Order is how we send clear messages: texts to friends, game instructions, jokes, stories, exam answers. A detective who can fix jumbled sentences can <b>read, write and speak</b> with power.</p>""",
    spark="""<ul class="t">
<li><b>0:00 Human Sentence.</b> Five students hold giant word cards (<i>the, dog, chased, the, cat</i>) standing in a jumbled order. Class: “That makes no sense!” and orders them.</li>
<li><b>0:03 Plot twist!</b> Swap <i>dog</i> and <i>cat</i>: “Whoa! Who’s chasing now?” The meaning flips.</li>
<li><b>0:04</b> Quick phrase jumble on the board: <i>in the garden / The bees / buzz</i>.</li>
<li><b>0:05</b> Reveal Big Question + objective.</li></ul>""",
    kla="""<ul class="t">
<li><b>Detective Toolkit (3 min, think-aloud):</b> 1) Find the <b>Capital</b> letter (start). 2) Find the <b>full stop</b> (end). 3) Find the <b>action word</b>. 4) Ask <b>Who? Does what? Where/What?</b> (colour-coded strips: green = Who, pink = Does what, blue = Where/What/When). 5) <b>Read it aloud</b> to check!</li>
<li><b>Floor Jumble (5 min):</b> 4 spots on the floor, each with a sentence cut into word cards. Each team of 4 builds the sentence in 1 minute, reads it aloud, and moves to the next spot.</li>
<li><b>Level up – phrase jumbles (2 min):</b> “every Sunday / My mother / goes / to the market”. Teams build it in 40 seconds.</li></ul>""",
    assess="""<p><b>18 mins total = Group Work (~12 mins) + Individual check (~6 mins).</b></p>
<p><b>Individual check – Quick-Fix Slate.</b> Four jumbled sentences on the board, 30 seconds each (e.g. <i>to school / go / We</i>; <i>is / The / green / parrot</i>; <i>read stories / we / In the library,</i>). Students write the fixed sentence with a capital and a full stop.</p>
<p><b>Success:</b> 3/4 correct with capital + full stop = <b>Got it</b>.</p>""",
    closing="""<p><b>Pass the Jumble (2 min):</b> Each child tells a partner a jumbled sentence aloud (“park the in play we”) for the partner to fix. Big Question answered: <i>yes, order changes everything!</i></p>""",
    group="""<p><b>🔐 Jumbled Story Escape Room (groups of 4: Reader, Builder, Checker, Director).</b> Each group gets an envelope of 4 jumbled sentences (word cards) that make a mini-story.</p>
<ul class="t"><li><b>Step 1 (4 min):</b> unjumble each sentence.</li>
<li><b>Step 2 (3 min):</b> put the 4 sentences in order to make the story (First, Next, Then, Last).</li>
<li><b>Step 3 (2 min):</b> show the Teacher-Guard the finished story to “unlock” the escape (get a stamp).</li>
<li><b>Step 4 (3 min):</b> perform the story as a 30-second mime while the Reader narrates.</li></ul>
<p><b>Story cards:</b> <b>A)</b> Meera planted a tiny seed. / She watered it every day. / A green plant grew. / Soon it had a red flower. &nbsp; <b>B)</b> Rohan lost his kite. / He looked everywhere. / He found it in a tree. / He climbed up and got it. &nbsp; <b>C)</b> Dark clouds covered the sky. / It began to rain. / The children ran inside. / They drank hot chocolate. &nbsp; <b>D)</b> Ria baked a cake. / She added the cream. / Her family sang a song. / Everyone ate the sweet cake.</p>
<p><b>Success:</b> all 4 sentences correct • story order right • everyone has a role.</p>""",
    svs=["SELF_L", "IND_C"],
    look="Persists through the jumble without giving up • assigns roles fairly • checks each other’s work kindly.",
    mats="Giant word cards, cut-up sentence strips (4 sets), colour strips, 4 story envelopes, stamp or sticker for escape, slates.",
    diff="<b>Pre-emergent:</b> sentences of 3–4 words with picture clues. <b>Emergent:</b> add 5–6 word sentences. <b>Stretch:</b> write their own jumble for another group to solve.",
))

assert len(L) == 9
