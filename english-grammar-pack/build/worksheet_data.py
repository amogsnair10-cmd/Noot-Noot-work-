# -*- coding: utf-8 -*-
"""Content for the 20 Grade-4 grammar worksheets.

Item formats (the FIRST item in every section is the SOLVED EXAMPLE):
  match   : (left, right)
  choose  : (question, correct, [wrong, ...])
  fill    : (sentence_with____, answer)
  write   : (prompt, starter, sample_answer, draw_box_bool)
  order   : ([jumbled chips], correct_sentence)
  sequence: [ [sentences in correct order], ... ]   (first story is the example)
"""

PINK, YEL, GRN, CYAN, ORG, PUR = "#F0597A", "#F5B800", "#8FB300", "#14A9D1", "#FF7A00", "#8A5CD6"


def scene(kind):
    """Tiny HTML doodle scenes for prepositions."""
    return f'<div class="scene {kind}"><span class="a">🐱</span><span class="b">📦</span></div>'


WS = []

# ------------------------------------------------------------------ 1 NOUNS I
WS.append(dict(
    no=1, topic="Nouns", title="Naming Words", color=PINK,
    can="I can find nouns: words that name people, places, animals and things.",
    rule="A <b>noun</b> is a <b>naming word</b>. It names a <b>person</b>, a <b>place</b>, an <b>animal</b> or a <b>thing</b>.",
    cards=[("👩‍🏫", "person"), ("🏫", "place"), ("🐶", "animal"), ("⚽", "thing")],
    tip="Ask yourself: can I SEE it or TOUCH it, and does it have a name? Then it is a noun!",
    sections=[
        dict(type="match", title="Match the word to its picture", items=[
            ("book", "📖"), ("bus", "🚌"), ("apple", "🍎"), ("doctor", "👩‍⚕️"), ("lion", "🦁"), ("park", "🏞️")]),
        dict(type="choose", title="Circle the correct noun", items=[
            ("Which word is a noun?", "dog", ["happy", "jump"]),
            ("Which word names a PERSON?", "teacher", ["table", "jump"]),
            ("Which word names a PLACE?", "market", ["banana", "sing"]),
            ("Which word names an ANIMAL?", "rabbit", ["pencil", "green"]),
            ("Which word names a THING?", "bag", ["zoo", "doctor"]),
            ("Which word is a noun?", "mango", ["quickly", "jump"])]),
        dict(type="fill", title="Fill in the blank with a noun", items=[
            ("The ____ barks loudly. 🐶", "dog"),
            ("A ____ has a long trunk. 🐘", "elephant"),
            ("The ____ gave me medicine. 👩‍⚕️", "doctor"),
            ("A bird sits on the ____. 🌳", "tree"),
            ("Mom bakes a ____ for my birthday. 🎂", "cake"),
            ("We learn new things at ____. 🏫", "school")]),
        dict(type="write", title="Write your own sentences", items=[
            ("Write a sentence with the noun <b>cat</b>.", "The cat ____", "The cat drinks milk.", False),
            ("Write a sentence about your favourite PLACE. Circle the noun.", "I love to go to ____", "I love to go to the beach.", False),
            ("Draw an animal in the box. Then write a sentence about it.", "I drew a ____", "I drew a green parrot.", True)]),
    ]))

# ------------------------------------------------------------------ 2 NOUNS II
WS.append(dict(
    no=2, topic="Nouns", title="Common &amp; Proper Nouns", color=PINK,
    can="I can tell a common noun from a proper noun and use capital letters correctly.",
    rule="<b>Common nouns</b> name anything: <i>girl, city, river</i>. <b>Proper nouns</b> name ONE special person, place or thing and start with a <b>CAPITAL letter</b>: <i>Meera, Delhi, Ganga</i>.",
    cards=[("👧", "girl → Meera"), ("🏙️", "city → Delhi"), ("🏞️", "river → Ganga"), ("🐶", "dog → Bruno")],
    tip="Special name? Capital letter! Meera, Monday, Mumbai, Diwali.",
    sections=[
        dict(type="match", title="Match the common noun to its proper noun", items=[
            ("city", "Delhi"), ("girl", "Meera"), ("river", "Ganga"), ("country", "India"), ("festival", "Diwali"), ("day", "Monday")]),
        dict(type="choose", title="Circle the correct answer", items=[
            ("Which is a proper noun?", "Delhi", ["city", "town"]),
            ("Which is a proper noun?", "Everest", ["mountain", "hill"]),
            ("Which sentence is correct?", "I met Riya at school.", ["I met riya at school.", "i met Riya at school."]),
            ("Which is a common noun?", "puppy", ["Tommy", "Bruno"]),
            ("Which is a proper noun?", "Taj Mahal", ["building", "palace"]),
            ("Which word needs a capital letter?", "chennai", ["table", "pencil"])]),
        dict(type="fill", title="Fill in the blank with a proper noun", items=[
            ("My friend ____ loves to paint. 🎨", "Sara"),
            ("My cousin ____ plays cricket. 🏏", "Rahul"),
            ("My uncle lives in ____. 🏙️", "Mumbai"),
            ("We have no school on ____. 🎒", "Saturday"),
            ("Elephants are common in ____. 🐘", "Kerala"),
            ("Our pet parrot is named ____. 🦜", "Mitthu")]),
        dict(type="write", title="Write your own sentences", items=[
            ("Write your name and your city. Use capital letters!", "My name is ____ and I live in ____", "My name is Sara and I live in Pune.", False),
            ("Write a sentence about your favourite festival.", "My favourite festival is ____", "My favourite festival is Diwali.", False),
            ("Write 2 sentences about a famous place you want to visit.", "I want to visit ____", "I want to visit Agra. I will see the Taj Mahal.", False)]),
    ]))

# ------------------------------------------------------------------ 3 VERBS I
WS.append(dict(
    no=3, topic="Verbs", title="Action Words", color=CYAN,
    can="I can find verbs: words that tell what someone or something DOES.",
    rule="A <b>verb</b> is an <b>action word</b>. It tells what a person, animal or thing <b>does</b>.",
    cards=[("🏃", "run"), ("🍎", "eat"), ("🤸", "jump"), ("😴", "sleep")],
    tip="Can you ACT it out? Then it is a verb! Try it: clap, hop, spin.",
    sections=[
        dict(type="match", title="Match the verb to its picture", items=[
            ("swim", "🏊"), ("run", "🏃"), ("sleep", "😴"), ("read", "📖"), ("dance", "💃"), ("sing", "🎤")]),
        dict(type="choose", title="Circle the verb", items=[
            ("Which word is a verb?", "jump", ["table", "green"]),
            ("Which word is a verb?", "kick", ["ball", "red"]),
            ("Which word is a verb?", "laugh", ["happy", "tree"]),
            ("Find the action word: The baby crawls.", "crawls", ["baby", "The"]),
            ("Find the action word: Dad cooks dinner.", "cooks", ["Dad", "dinner"]),
            ("Which word is NOT a verb?", "spoon", ["clap", "write"])]),
        dict(type="fill", title="Fill in the blank with a verb", items=[
            ("Birds ____ in the sky. 🐦", "fly"),
            ("Fish ____ in water. 🐟", "swim"),
            ("I ____ my teeth every morning. 🦷", "brush"),
            ("Cows ____ grass. 🐄", "eat"),
            ("Children ____ in the garden. ⚽", "play"),
            ("We ____ bicycles to the park. 🚲", "ride")]),
        dict(type="write", title="Write your own sentences", items=[
            ("Write what you do after school.", "After school, I ____", "After school, I play football.", False),
            ("Write 2 sentences about what your best friend does at lunch. Circle the verbs.", "My friend ____", "My friend eats rice. She shares her chapati.", False),
            ("What does a pet do all day? Draw it and write a sentence. 🐾", "My pet ____", "My dog chases the ball.", True)]),
    ]))

# ------------------------------------------------------------------ 4 VERBS II
WS.append(dict(
    no=4, topic="Verbs", title="Today &amp; Yesterday Verbs", color=CYAN,
    can="I can change a verb to show if it happened now or before.",
    rule="Verbs change when the action happened. <b>Now:</b> I walk. <b>Before (yesterday):</b> I walk<b>ed</b>. Add <b>-ed</b> to most verbs. Some verbs change completely: <i>go → went, eat → ate, run → ran</i>.",
    cards=[("🚶", "walk → walked"), ("🏃", "run → ran"), ("🍽️", "eat → ate"), ("🚌", "go → went")],
    tip="Yesterday, last night, last week = use the PAST verb!",
    sections=[
        dict(type="match", title="Match today's verb to yesterday's verb", items=[
            ("walk", "walked"), ("jump", "jumped"), ("play", "played"), ("go", "went"), ("eat", "ate"), ("run", "ran")]),
        dict(type="choose", title="Circle the correct verb", items=[
            ("Yesterday I ____ to school.", "walked", ["walk", "walking"]),
            ("Yesterday we ____ a movie.", "watched", ["watch", "watching"]),
            ("Today I ____ rice for lunch.", "eat", ["ate", "eaten"]),
            ("Last night the baby ____ well.", "slept", ["sleep", "sleeping"]),
            ("Right now the boys ____ football.", "play", ["played", "plays"]),
            ("Yesterday Dad ____ me a gift.", "gave", ["give", "gives"])]),
        dict(type="fill", title="Write the past form of the verb in brackets", items=[
            ("Yesterday I ____ (kick) the ball. ⚽", "kicked"),
            ("Last Sunday we ____ (visit) our grandma. 👵", "visited"),
            ("Mira ____ (paint) a rainbow. 🌈", "painted"),
            ("I ____ (see) a big elephant at the zoo. 🐘", "saw"),
            ("My cousins ____ (come) to our house. 🏠", "came"),
            ("The teacher ____ (clap) when we sang. 👏", "clapped")]),
        dict(type="write", title="Write your own sentences", items=[
            ("Write one sentence about what you did yesterday.", "Yesterday I ____", "Yesterday I played with my cousin.", False),
            ("Write 2 sentences about what you did last weekend.", "Last weekend I ____", "Last weekend I visited my aunt. We ate ice-cream.", False),
            ("Write one sentence about what you do EVERY morning (now).", "Every morning I ____", "Every morning I brush my teeth.", False)]),
    ]))

# ------------------------------------------------------------------ 5 ADJECTIVES I
WS.append(dict(
    no=5, topic="Adjectives", title="Describing Words", color=YEL,
    can="I can find and use adjectives to describe nouns.",
    rule="An <b>adjective</b> is a <b>describing word</b>. It tells us more about a noun: how it looks, feels, sounds or tastes.",
    cards=[("🐘", "a BIG elephant"), ("🍎", "a RED apple"), ("🥭", "a SWEET mango"), ("🌶️", "a SPICY chilli")],
    tip="Adjectives go with nouns. A tiny ant, a loud drum, a soft pillow.",
    sections=[
        dict(type="match", title="Match the describing phrase to its picture", items=[
            ("tall giraffe", "🦒"), ("tiny ant", "🐜"), ("round ball", "⚽"), ("fluffy cloud", "☁️"), ("yellow banana", "🍌"), ("cold ice-cream", "🍦")]),
        dict(type="choose", title="Circle the adjective", items=[
            ("Which word is an adjective?", "soft", ["pillow", "sleep"]),
            ("Find the adjective: a noisy classroom", "noisy", ["a", "classroom"]),
            ("Which word is an adjective?", "brave", ["run", "lion"]),
            ("Find the adjective: The shy girl hid.", "shy", ["girl", "hid"]),
            ("Which word fits best? The ice is ____.", "cold", ["loud", "sleepy"]),
            ("Which word fits best? The soup is too ____ to eat.", "hot", ["blue", "run"])]),
        dict(type="fill", title="Fill in the blank with an adjective", items=[
            ("The ____ sun shines in the sky. ☀️", "bright"),
            ("An elephant is a very ____ animal. 🐘", "big"),
            ("The ____ chilli made my tongue burn. 🌶️", "spicy"),
            ("I wore my ____ raincoat in the rain. 🌧️", "yellow"),
            ("Birbal told a ____ story. 😂", "funny"),
            ("The ____ puppy has soft fur. 🐶", "fluffy")]),
        dict(type="write", title="Write your own sentences", items=[
            ("Describe a banana with 2 adjectives.", "A banana is ____ and ____", "A banana is yellow and sweet.", False),
            ("Write 2 adjectives for your school bag. Use them in a sentence.", "My bag is ____ and ____", "My bag is blue and heavy.", False),
            ("Draw a monster! Describe it with 3 adjectives.", "My monster is ____, ____ and ____", "My monster is huge, hairy and funny.", True)]),
    ]))

# ------------------------------------------------------------------ 6 ADJECTIVES II
WS.append(dict(
    no=6, topic="Adjectives", title="Opposites &amp; Comparing", color=YEL,
    can="I can use opposite adjectives and compare things using -er and -est.",
    rule="<b>Opposites:</b> hot ↔ cold. <b>Compare 2 things:</b> add <b>-er</b> (taller than). <b>Compare 3 or more:</b> add <b>-est</b> (the tallest).",
    cards=[("🐭", "small"), ("🐕", "smaller → bigger"), ("🐘", "the biggest!"), ("🔥❄️", "hot ↔ cold")],
    tip="'than' = use -er. 'the' = use -est.",
    sections=[
        dict(type="match", title="Match each adjective to its opposite", items=[
            ("hot", "cold"), ("big", "small"), ("happy", "sad"), ("fast", "slow"), ("soft", "hard"), ("full", "empty")]),
        dict(type="choose", title="Circle the correct word", items=[
            ("Ravi is ____ than Sam.", "taller", ["tall", "tallest"]),
            ("A mouse is ____ than an elephant.", "smaller", ["small", "smallest"]),
            ("Mount Everest is the ____ mountain in the world.", "highest", ["high", "higher"]),
            ("Which is the opposite of 'clean'?", "dirty", ["fresh", "neat"]),
            ("My bag is ____ than your bag.", "heavier", ["heavy", "heaviest"]),
            ("The cheetah is the ____ animal on land.", "fastest", ["fast", "faster"])]),
        dict(type="fill", title="Fill in the blank with the right form", items=[
            ("A lion is ____ than a cat. (big)", "bigger"),
            ("A cheetah is ____ than a rabbit. (fast)", "faster"),
            ("The Ganga is the ____ river in India. (long)", "longest"),
            ("My sister is ____ than me. (old)", "older"),
            ("This is the ____ cake ever! (tasty) 🎂", "tastiest"),
            ("A feather is ____ than a stone. (light)", "lighter")]),
        dict(type="write", title="Write your own sentences", items=[
            ("Compare a mouse and a cat.", "A mouse is ____er than ____", "A mouse is smaller than a cat.", False),
            ("Compare two people in your family using -er.", "My ____ is ____er than my ____", "My father is taller than my mother.", False),
            ("Write about the BEST or BIGGEST thing you know using -est.", "The ____est ____ is ____", "The tallest animal is the giraffe.", False)]),
    ]))

# ------------------------------------------------------------------ 7 PRONOUNS I
WS.append(dict(
    no=7, topic="Pronouns", title="Pronoun Power", color=GRN,
    can="I can use pronouns (he, she, it, they, we, I, you) instead of repeating nouns.",
    rule="A <b>pronoun</b> takes the place of a noun so we do not repeat it. <i>Ravi → he, Meera → she, the dog → it, Ravi and Meera → they, my friends and I → we.</i>",
    cards=[("👦", "Ravi → he"), ("👧", "Meera → she"), ("🐶", "dog → it"), ("👫", "Ravi &amp; Meera → they")],
    tip="Don't be a Repeat-Robot! Swap the name for a pronoun.",
    sections=[
        dict(type="match", title="Match the noun(s) to the pronoun that can replace them", items=[
            ("Meera", "she"), ("my dog", "it"), ("Arjun", "he"), ("Rita and Sam", "they"), ("Mom and I", "we"), ("you and your friends", "you")]),
        dict(type="choose", title="Circle the correct pronoun", items=[
            ("____ is my brother. (Rohan)", "He", ["She", "They"]),
            ("Priya is clever. ____ wins every quiz.", "She", ["He", "It"]),
            ("The tigers are hungry. ____ roar loudly.", "They", ["He", "It"]),
            ("The book is old. ____ has torn pages.", "It", ["She", "They"]),
            ("My friends and I love cricket. ____ play every day.", "We", ["They", "He"]),
            ("Sir said, '____ should finish your work.'", "You", ["It", "He"])]),
        dict(type="fill", title="Fill in the blank with a pronoun", items=[
            ("Kavya is a dancer. ____ dances well. 💃", "She"),
            ("Raju has a kite. ____ flies high. 🪁", "He"),
            ("Ma and Papa went out. ____ will be back soon.", "They"),
            ("The moon is bright. ____ shines at night. 🌙", "It"),
            ("Sneha and I are friends. ____ sit together.", "We"),
            ("Anita is my aunt. ____ is a doctor. 👩‍⚕️", "She")]),
        dict(type="write", title="Write your own sentences", items=[
            ("Write about a friend using <b>he</b> or <b>she</b>.", "My friend ____. He/She ____", "My friend Anu is kind. She shares her lunch.", False),
            ("Write about your pet or favourite animal using <b>it</b>.", "It ____", "My cat is white. It sleeps all day.", False),
            ("Write about you and your friends using <b>we</b>.", "We ____", "We play kho-kho at lunch.", False)]),
    ]))

# ------------------------------------------------------------------ 8 PRONOUNS II
WS.append(dict(
    no=8, topic="Pronouns", title="Whose Is It? (my, your, his, her...)", color=GRN,
    can="I can use my, your, his, her, its, our and their to show who owns something.",
    rule="Some pronouns show <b>who something belongs to</b>: <b>my</b> (me), <b>your</b> (you), <b>his</b> (boy), <b>her</b> (girl), <b>its</b> (animal/thing), <b>our</b> (us), <b>their</b> (them).",
    cards=[("🎒", "my bag"), ("📚", "his book"), ("🎀", "her ribbon"), ("🏫", "our school")],
    tip="Ask: Whose is it? Then pick the owner word!",
    sections=[
        dict(type="match", title="Match who owns it to the right pronoun", items=[
            ("Meera's bag", "her bag"), ("Arjun's kite", "his kite"), ("the cat's tail", "its tail"), ("Dad's and my car", "our car"), ("the children's toys", "their toys"), ("the pen that belongs to you", "your pen")]),
        dict(type="choose", title="Circle the correct word", items=[
            ("This is ____ bag. (it belongs to me)", "my", ["your", "her"]),
            ("Sara loves ____ doll.", "her", ["his", "their"]),
            ("The boys washed ____ hands.", "their", ["his", "our"]),
            ("The dog wagged ____ tail.", "its", ["his", "our"]),
            ("Ravi, is this ____ notebook?", "your", ["my", "her"]),
            ("We love ____ school.", "our", ["their", "my"])]),
        dict(type="fill", title="Fill in the blank", items=[
            ("Is this ____ pencil, Anil? ✏️", "your"),
            ("I lost ____ lunchbox. 🍱", "my"),
            ("Rahul packed ____ bag. 🎒", "his"),
            ("Meera combed ____ hair. 💇", "her"),
            ("The birds built ____ nest. 🐦", "their"),
            ("We cleaned ____ classroom. 🏫", "our")]),
        dict(type="write", title="Write your own sentences", items=[
            ("Write about something that belongs to you.", "This is my ____", "This is my red cycle.", False),
            ("Write about something your friend owns. Use his or her.", "My friend has ____. His/Her ____", "My friend has a kite. Her kite is green.", False),
            ("Write one sentence about your family using <b>our</b>.", "Our ____", "Our house has a big garden.", False)]),
    ]))

# ------------------------------------------------------------------ 9 ARTICLES
WS.append(dict(
    no=9, topic="Articles", title="A, An &amp; The", color=ORG,
    can="I can choose a, an or the correctly.",
    rule="<b>a</b> goes before a consonant sound: <i>a dog</i>. <b>an</b> goes before a vowel sound (a, e, i, o, u): <i>an apple</i>. <b>the</b> points to a special one: <i>the sun</i>.",
    cards=[("🐶", "a dog"), ("🍎", "an apple"), ("☀️", "the sun"), ("☂️", "an umbrella")],
    tip="Say it aloud! 'a apple' sounds bumpy. 'an apple' sounds smooth.",
    sections=[
        dict(type="match", title="Match the noun to its correct article", items=[
            ("apple", "an apple"), ("pencil", "a pencil"), ("umbrella", "an umbrella"), ("zebra", "a zebra"), ("elephant", "an elephant"), ("kite", "a kite")]),
        dict(type="choose", title="Circle the correct article", items=[
            ("Mina has ____ big kite.", "a", ["an"]),
            ("She has ____ pretty doll.", "a", ["an"]),
            ("Dad bought ____ ice-cream.", "an", ["a"]),
            ("____ sun rises in the east.", "The", ["A", "An"]),
            ("There is ____ ant on the leaf.", "an", ["a"]),
            ("Look at ____ moon tonight!", "the", ["a", "an"])]),
        dict(type="fill", title="Fill in the blank with a, an or the", items=[
            ("There is ____ owl in the tree. 🦉", "an"),
            ("Ria drew ____ star on the card. ⭐", "a"),
            ("We saw ____ elephant at the zoo. 🐘", "an"),
            ("____ sky is full of stars tonight. 🌌", "The"),
            ("Can I have ____ egg, please? 🥚", "an"),
            ("My uncle is ____ pilot. ✈️", "a")]),
        dict(type="write", title="Write your own sentences", items=[
            ("Write a sentence using <b>an</b>.", "I see an ____", "I see an owl.", False),
            ("Write a sentence using <b>an</b> and <b>a</b> together. 🍎🍌", "I eat an ____ and a ____", "I eat an apple and a banana.", False),
            ("Write a sentence with <b>the</b> about the sun, moon or sky.", "The ____", "The moon is bright tonight.", False)]),
    ]))

# ------------------------------------------------------------------ 10 PREPOSITIONS I
WS.append(dict(
    no=10, topic="Prepositions", title="Where Is It? (in, on, under...)", color=PUR,
    can="I can use in, on, under, behind, in front of and next to to say WHERE something is.",
    rule="A <b>preposition</b> tells <b>where</b> something is. It joins a noun to the rest of the sentence: the cat is <b>in</b> the box.",
    cards=[(scene("in"), "in"), (scene("on"), "on"), (scene("under"), "under"), (scene("behind"), "behind"), (scene("front"), "in front of")],
    tip="Look at the cat and the box. Where is the cat?",
    sections=[
        dict(type="match", title="Match where the thing is to the preposition", items=[
            ("The book is on top of the desk.", "on"), ("The ball is inside the bag.", "in"), ("The dog hides below the bed.", "under"),
            ("Ria stands at the back of Meera in the line.", "behind"), ("The teacher stands ahead of the class, facing them.", "in front of"),
            ("The cat sits at the side of the sofa.", "next to")]),
        dict(type="choose", title="Circle the correct preposition", items=[
            ("The cap is ____ the table. (on top)", "on", ["in", "under"]),
            ("Fish live ____ the water.", "in", ["on", "under"]),
            ("The boy hid ____ the curtain. (at the back)", "behind", ["on", "in"]),
            ("The shoes are ____ the bed. (below it)", "under", ["on", "behind"]),
            ("The clock hangs ____ the wall.", "on", ["in", "under"]),
            ("There is a tree ____ our house. (just outside the door)", "in front of", ["in", "under"])]),
        dict(type="fill", title="Fill in the blank with a preposition", items=[
            ("The bird sits ____ the branch. 🐦", "on"),
            ("The sun hides ____ the clouds. ☁️", "behind"),
            ("The puppy sleeps ____ the table. 🐶", "under"),
            ("A pencil is ____ my bag. ✏️", "in"),
            ("Sit ____ me, my friend. 👫", "next to"),
            ("The cake is ____ the plate. 🎂", "on")]),
        dict(type="write", title="Write your own sentences", items=[
            ("Where is your bag right now?", "My bag is ____ the ____", "My bag is under my desk.", False),
            ("Where is your pencil box?", "My pencil box is ____", "My pencil box is in my bag.", False),
            ("Write where the teacher is and where YOU are.", "The teacher is ____. I am ____", "The teacher is in front of the class. I am next to Ria.", False)]),
    ]))

# ------------------------------------------------------------------ 11 PREPOSITIONS II
WS.append(dict(
    no=11, topic="Prepositions", title="More Place &amp; Time Words", color=PUR,
    can="I can use between, near, across, through, above, and at / on / in for time.",
    rule="<b>between</b> = in the middle of two. <b>near</b> = not far. <b>across</b> = from one side to the other. <b>through</b> = in one end, out the other. <b>above</b> = higher than. For time: <b>at</b> 5 o'clock, <b>on</b> Monday, <b>in</b> June.",
    cards=[("🧒🐶🧒", "between"), ("🚶‍♂️➡️🛣️", "across"), ("🚂🕳️", "through"), ("🐦<br>🏠", "above")],
    tip="at = clock time, on = day, in = month or year.",
    sections=[
        dict(type="match", title="Match the clue to the preposition", items=[
            ("The ball is in the middle of two boys.", "between"), ("The kite flies high up, higher than the roof.", "above"),
            ("The train goes in one end of the tunnel and out the other.", "through"), ("Ravi walks from one side of the road to the other.", "across"),
            ("The school is not far from my home.", "near"), ("We use this word for clock time: ____ 5 o'clock.", "at")]),
        dict(type="choose", title="Circle the correct word", items=[
            ("Sam sits ____ Ria and Tom.", "between", ["on", "at"]),
            ("The aeroplane flew ____ the clouds. (higher)", "above", ["under", "between"]),
            ("We have school ____ Monday.", "on", ["at", "in"]),
            ("My birthday is ____ June.", "in", ["at", "on"]),
            ("The film starts ____ 6 o'clock.", "at", ["on", "in"]),
            ("The train went ____ the tunnel.", "through", ["above", "between"])]),
        dict(type="fill", title="Fill in the blank", items=[
            ("I wake up ____ 6 o'clock. ⏰", "at"),
            ("The post office is ____ my house. It is close. 📮", "near"),
            ("The cat walked ____ the road. 🐈", "across"),
            ("The bird flew ____ the tree, higher up. 🐦", "above"),
            ("The cheese is ____ two slices of bread. 🥪", "between"),
            ("The thread goes ____ the hole. 🧵", "through")]),
        dict(type="write", title="Write your own sentences", items=[
            ("Where do you sit in class?", "I sit between ____ and ____", "I sit between Anu and Ravi.", False),
            ("Write when your birthday is.", "My birthday is ____ / ____", "My birthday is in May.", False),
            ("Write what time you wake up. Then write a day you love.", "I wake up at ____. On ____", "I wake up at 7 o'clock. On Sundays I sleep late.", False)]),
    ]))

# ------------------------------------------------------------------ 12 ADVERBS I
WS.append(dict(
    no=12, topic="Adverbs", title="How? Adverbs", color=ORG,
    can="I can use adverbs to tell HOW an action is done.",
    rule="An <b>adverb</b> tells us <b>how</b> something is done. Many end in <b>-ly</b>: slow → slow<b>ly</b>, quick → quick<b>ly</b>, loud → loud<b>ly</b>.",
    cards=[("🐢", "walks slowly"), ("🐆", "runs quickly"), ("📣", "shouts loudly"), ("🤫", "whispers softly")],
    tip="Ask HOW? Verb + how = adverb. Walks... how? Slowly!",
    sections=[
        dict(type="match", title="Match who does it to HOW they do it", items=[
            ("🐢 The turtle walks", "slowly."), ("🐆 The cheetah runs", "quickly."), ("📣 The teacher shouts", "loudly."),
            ("🤫 The girl whispers", "softly."), ("😁 The baby laughs", "happily."), ("🥚 Dad carries the eggs", "carefully.")]),
        dict(type="choose", title="Circle the correct word", items=[
            ("The snail moves ____.", "slowly", ["slow", "slower"]),
            ("The rabbit hops ____.", "quickly", ["quick", "quicker"]),
            ("Which word is an adverb? <i>He spoke softly.</i>", "softly", ["spoke", "He"]),
            ("Please talk ____ in the library.", "quietly", ["quiet", "quick"]),
            ("Pat the puppy ____.", "gently", ["gentle", "gentlest"]),
            ("The kids cheered ____.", "loudly", ["loud", "louder"])]),
        dict(type="fill", title="Fill in the blank with an adverb", items=[
            ("The puppy wags its tail ____. 🐶", "happily"),
            ("The thunder roared ____. ⛈️", "loudly"),
            ("Walk ____ with the hot soup. 🍲", "carefully"),
            ("The mouse crept ____ past the cat. 🐭", "quietly"),
            ("The snail crawled ____ on the leaf. 🐌", "slowly"),
            ("The rocket zoomed ____ into the sky. 🚀", "quickly")]),
        dict(type="write", title="Write your own sentences", items=[
            ("How does a turtle walk?", "The turtle walks ____", "The turtle walks slowly.", False),
            ("Write how you walk when you are late for school.", "I walk ____", "I walk quickly.", False),
            ("How do you speak in a library? How do you shout at a cricket match?", "In the library I speak ____. At a match I shout ____", "In the library I speak softly. At a match I shout loudly.", False)]),
    ]))

# ------------------------------------------------------------------ 13 ADVERBS II
WS.append(dict(
    no=13, topic="Adverbs", title="When? Where? Adverbs", color=ORG,
    can="I can use adverbs that tell WHEN and WHERE.",
    rule="Adverbs of <b>time</b> tell <b>WHEN</b>: today, tomorrow, yesterday, soon, now. Adverbs of <b>place</b> tell <b>WHERE</b>: here, there, inside, outside, everywhere.",
    cards=[("📅", "WHEN? tomorrow"), ("⏰", "WHEN? now"), ("🌳", "WHERE? outside"), ("🏠", "WHERE? inside")],
    tip="Ask WHEN? or WHERE? about the action. The answer is the adverb!",
    sections=[
        dict(type="match", title="Match the word to its meaning", items=[
            ("outside", "not inside the house"), ("tomorrow", "the day after today"), ("yesterday", "the day before today"),
            ("here", "in this place"), ("everywhere", "in all places"), ("soon", "in a short time")]),
        dict(type="choose", title="Circle the correct answer", items=[
            ("What does <i>inside</i> tell? The cat is inside.", "where", ["when", "how"]),
            ("Which word tells WHEN? We will leave soon.", "soon", ["leave", "We"]),
            ("Which word tells WHERE? The kids play outside.", "outside", ["play", "kids"]),
            ("I was sick ____, so I missed school.", "yesterday", ["tomorrow", "here"]),
            ("Look! The bird sits ____, in that far tree.", "there", ["here", "now"]),
            ("Please come ____. (to this place)", "here", ["there", "yesterday"])]),
        dict(type="fill", title="Fill in the blank", items=[
            ("It is raining ____, so take an umbrella. ☔", "today"),
            ("We will go to the zoo ____. (the day after today) 🦁", "tomorrow"),
            ("The children are playing ____ in the garden. 🌳", "outside"),
            ("Mom is cooking ____ in the kitchen. 🍳", "inside"),
            ("I looked ____ for my pen, but could not find it. 🔍", "everywhere"),
            ("I finished my homework ____. (before today)", "yesterday")]),
        dict(type="write", title="Write your own sentences", items=[
            ("Write what you will do tomorrow.", "Tomorrow I will ____", "Tomorrow I will fly a kite.", False),
            ("Write one thing you did yesterday and one thing you will do tomorrow.", "Yesterday I ____. Tomorrow I ____", "Yesterday I read a story. Tomorrow I will play cricket.", False),
            ("Write where you like to play: inside or outside?", "I like to play ____", "I like to play outside.", False)]),
    ]))

# ------------------------------------------------------------------ 14 CONJUNCTIONS
WS.append(dict(
    no=14, topic="Conjunctions", title="Glue Words (and, but, or, because, so)", color=PINK,
    can="I can use conjunctions to join words and sentences.",
    rule="A <b>conjunction</b> is a <b>glue word</b> that joins words or sentences. <b>and</b> adds ➕ &nbsp; <b>but</b> shows a difference ↔ &nbsp; <b>or</b> gives a choice 🔀 &nbsp; <b>because</b> gives a reason 💡 &nbsp; <b>so</b> shows a result 🎯",
    cards=[("➕", "and"), ("↔️", "but"), ("🔀", "or"), ("💡", "because"), ("🎯", "so")],
    tip="Two short sentences feel choppy. Add glue and they flow!",
    sections=[
        dict(type="match", title="Match the first half to the second half", items=[
            ("Ria likes mangoes", "and bananas."), ("I was hungry,", "so I ate a sandwich."), ("We stayed inside", "because it was raining."),
            ("Do you want juice", "or milk?"), ("The sun is hot", "but the water is cold."), ("I have a cat", "and a rabbit.")]),
        dict(type="choose", title="Circle the correct conjunction", items=[
            ("The test was easy, ____ I got full marks.", "so", ["but", "or"]),
            ("I wanted to play, ____ it was raining.", "but", ["and", "or"]),
            ("Do you want tea ____ coffee?", "or", ["but", "because"]),
            ("I was late ____ I missed the bus.", "because", ["but", "or"]),
            ("It was cold, ____ I wore a sweater.", "so", ["or", "because"]),
            ("Anil is small ____ very strong.", "but", ["or", "because"])]),
        dict(type="fill", title="Fill in the blank with the right glue word", items=[
            ("We can walk ____ take the bus. 🚌", "or"),
            ("I like pizza ____ I do not like onions. 🍕", "but"),
            ("Ria was happy ____ she won the race. 🏆", "because"),
            ("The glass fell, ____ it broke. 🥛", "so"),
            ("I packed my pencil ____ eraser. ✏️", "and"),
            ("Would you like a cake ____ a cookie? 🍪", "or")]),
        dict(type="write", title="Write your own sentences", items=[
            ("Join these with <b>and</b>: I like dancing. I like singing.", "I like dancing ____", "I like dancing and singing.", False),
            ("Finish the sentence with <b>but</b>.", "I wanted to ____ but ____", "I wanted to play outside but it was raining.", False),
            ("Finish the sentence with <b>because</b>.", "I was happy because ____", "I was happy because it was my birthday.", False)]),
    ]))

# ------------------------------------------------------------------ 15 SENTENCE DETECTIVE I
WS.append(dict(
    no=15, topic="Sentences", title="Sentence Detective: Jumbled Words", color=CYAN,
    can="I can put jumbled words in the right order so a sentence makes sense.",
    rule="A sentence needs <b>Who? + Does what? + What / Where?</b> It starts with a <b>Capital letter</b> and ends with a <b>full stop</b>. Example: <b>The cat</b> (who) <b>drinks</b> (does what) <b>milk.</b> (what)",
    cards=[("🐱", "Who? The cat"), ("🥛", "Does what? drinks"), ("🔍", "Start: Capital"), ("⚫", "End: full stop .")],
    tip="Detective tools: 1) find the Capital 2) find the dot 3) find the action 4) read it aloud!",
    sections=[
        dict(type="choose", title="Circle the sentence that is in the correct order", items=[
            ("Which sentence is correct?", "The dog barks loudly.", ["Dog the loudly barks.", "Barks the dog loudly."]),
            ("Which sentence is correct?", "The sun shines brightly.", ["Shines the sun brightly.", "Brightly the shines sun."]),
            ("Which sentence is correct?", "Birds fly in the sky.", ["In fly birds sky the.", "Fly birds the sky in."]),
            ("Which sentence is correct?", "I eat an apple every day.", ["Apple I every an eat day.", "Every day apple I an eat."]),
            ("Which sentence is correct?", "My mother cooks tasty food.", ["Tasty my cooks food mother.", "Food cooks mother tasty my."])]),
        dict(type="order", title="Unjumble the words. Write the sentence.", items=[
            (["the", "ball", "kicks", "Raju"], "Raju kicks the ball."),
            (["to", "school", "go", "We"], "We go to school."),
            (["is", "The", "green", "parrot"], "The parrot is green."),
            (["a", "Meera", "song", "sings"], "Meera sings a song."),
            (["morning", "every", "I", "brush", "my", "teeth"], "I brush my teeth every morning.")]),
        dict(type="match", title="Match the beginning to the right ending", items=[
            ("The little puppy", "wags its tail."), ("My grandmother", "tells us stories."), ("The red balloon", "floated away."),
            ("Birds", "build nests in trees."), ("The teacher", "reads a book to us.")]),
        dict(type="fill", title="Fill the missing word so the sentence makes sense", items=[
            ("The girl ____ a story. 📖", "reads"),
            ("The ____ barks at strangers. 🐕", "dog"),
            ("We ____ water when we are thirsty. 💧", "drink"),
            ("The ____ shines at night. 🌙", "moon")]),
        dict(type="write", title="Write your own sentences", items=[
            ("Make a sentence with these cards: <b>my friend</b> | <b>plays</b> | <b>in the park</b>", "My friend ____", "My friend plays in the park.", False),
            ("Write a sentence about your best friend: Who? Does what? Where?", "____ ____ ____", "Ria reads books in the library.", False)]),
    ]))

# ------------------------------------------------------------------ 16 MIXED 1
WS.append(dict(
    no=16, topic="Mixed", title="Mixed 1: Nouns, Verbs &amp; Adjectives", color=PINK, mixed=True,
    can="I can tell nouns, verbs and adjectives apart.",
    rule="<b style='color:#F0597A'>Noun</b> = naming word (dog). <b style='color:#14A9D1'>Verb</b> = action word (runs). <b style='color:#E0A000'>Adjective</b> = describing word (big). &nbsp; <i>The <u>big</u> <u>dog</u> <u>runs</u>.</i>",
    cards=[("🐶", "noun: dog"), ("🏃", "verb: runs"), ("🌈", "adjective: big"), ("🔎", "find all 3!")],
    tip="Who/what? = noun. Does what? = verb. What like? = adjective.",
    sections=[
        dict(type="match", title="Match the verb to the noun that does it", items=[
            ("bark", "dog"), ("fly", "bird"), ("moo", "cow"), ("swim", "fish"), ("roar", "lion"), ("buzz", "bee")]),
        dict(type="choose", title="Circle the correct word", items=[
            ("Which word is a VERB?", "jump", ["table", "tall"]),
            ("Which word is a NOUN?", "giraffe", ["tall", "eat"]),
            ("Which word is an ADJECTIVE?", "shiny", ["coin", "spin"]),
            ("Which word is a VERB?", "dance", ["pretty", "party"]),
            ("In <i>The big dog barks</i>, which word is the NOUN?", "dog", ["big", "barks"]),
            ("In <i>Mina eats a juicy peach</i>, which word is the ADJECTIVE?", "juicy", ["eats", "peach"])]),
        dict(type="fill", title="Fill in the blank (the word type is in brackets)", items=[
            ("The ____ (adjective) cat sleeps. 🐱", "lazy"),
            ("The ____ (noun) flew over the roof. 🐦", "bird"),
            ("My brother can ____ (verb) very fast. 🏃", "run"),
            ("I ate a ____ (adjective) mango. 🥭", "sweet"),
            ("The ____ (noun) rings the bell. 🔔", "teacher"),
            ("The kids ____ (verb) in the rain. 🌧️", "splash")]),
        dict(type="write", title="Write your own sentences", items=[
            ("Write a sentence with a noun, a verb and an adjective.", "The ____ ____ ____", "The happy dog runs.", False),
            ("Write a sentence about a monster. Use an adjective, a noun and a verb.", "The ____ monster ____", "The hairy monster dances.", False),
            ("Write about your lunch. Use 1 noun, 1 verb and 2 adjectives.", "My lunch is ____ and ____. I eat ____", "My lunch is hot and tasty. I eat rice.", False)]),
    ]))

# ------------------------------------------------------------------ 17 MIXED 2
WS.append(dict(
    no=17, topic="Mixed", title="Mixed 2: Pronouns, Articles &amp; Prepositions", color=GRN, mixed=True,
    can="I can use pronouns, articles and prepositions in sentences.",
    rule="<b>Pronoun</b>: he, she, it, they, my. <b>Article</b>: a, an, the. <b>Preposition</b>: in, on, under, behind, between.",
    cards=[("🙋", "pronoun: she"), ("🍎", "article: an"), ("📦", "preposition: in"), ("🔎", "spot them!")],
    tip="Read the sentence aloud. Which little word sounds right?",
    sections=[
        dict(type="match", title="Match the sentence to the missing word", items=[
            ("Anna is smart. ____ is my friend.", "She"), ("Rahul is my friend. ____ is kind.", "He"), ("I see ____ owl.", "an"),
            ("The cat is ____ the chair.", "under"), ("The children love ____ teacher.", "their"), ("The bird sits on ____ roof.", "the")]),
        dict(type="choose", title="Circle the correct word", items=[
            ("Where is the cat? It is ____ the box. (inside)", "in", ["on", "under"]),
            ("Aman and Dev are friends. ____ play together.", "They", ["He", "It"]),
            ("She ate ____ apple.", "an", ["a"]),
            ("The mouse hid ____ the cupboard. (at the back)", "behind", ["in", "on"]),
            ("I lost ____ pencil box.", "my", ["me", "I"]),
            ("He wants ____ big cookie.", "a", ["an"])]),
        dict(type="fill", title="Fill in the blank", items=[
            ("The bird is ____ the nest. 🐦", "in"),
            ("____ sun is hot today. ☀️", "The"),
            ("Sam is tired. ____ is going to bed. 🛏️", "He"),
            ("The kids hung ____ bags on hooks. 🎒", "their"),
            ("A ladybird sat ____ the leaf. (on top) 🐞", "on"),
            ("I ate ____ egg for breakfast. 🥚", "an")]),
        dict(type="write", title="Write your own sentences", items=[
            ("Write a sentence using <b>she</b> and <b>on</b>.", "She sits ____ the ____", "She sits on the swing.", False),
            ("Write a sentence with <b>they</b> and <b>under</b>.", "They ____ under ____", "They sit under a tree.", False),
            ("Write 2 sentences using <b>an</b>, <b>my</b> and <b>in front of</b>.", "I saw an ____ in front of my ____", "I saw an elephant in front of my house.", False)]),
    ]))

# ------------------------------------------------------------------ 18 MIXED 3
WS.append(dict(
    no=18, topic="Mixed", title="Mixed 3: Adverbs, Conjunctions &amp; Verbs", color=ORG, mixed=True,
    can="I can use adverbs, conjunctions and verbs to make my sentences interesting.",
    rule="<b>Verb</b> = what happens. <b>Adverb</b> = how / when / where. <b>Conjunction</b> = glue (and, but, or, because, so). <i>The boy <u>jumped</u> <u>happily</u> <u>because</u> he won.</i>",
    cards=[("🤸", "verb: jumped"), ("😄", "adverb: happily"), ("🔗", "glue: because"), ("🔎", "spot them!")],
    tip="Verb + HOW = adverb. Two ideas + glue = one smooth sentence.",
    sections=[
        dict(type="match", title="Match the first half to the second half", items=[
            ("The turtle walks", "slowly."), ("She smiled", "happily."), ("I was tired,", "so I went to bed."),
            ("We ran fast", "but we missed the bus."), ("Do you like tea", "or coffee?"), ("I drank water", "because I was thirsty.")]),
        dict(type="choose", title="Circle the correct answer", items=[
            ("Which word is an ADVERB?", "quickly", ["quick", "run"]),
            ("Which word is a CONJUNCTION?", "because", ["quietly", "jump"]),
            ("Pat the puppy ____.", "gently", ["gentle", "gentlest"]),
            ("I like ice-cream ____ I do not like cold weather.", "but", ["so", "because"]),
            ("Which word is the VERB? <i>The boys played outside.</i>", "played", ["boys", "outside"]),
            ("It rained, ____ we stayed inside.", "so", ["or", "but"])]),
        dict(type="fill", title="Fill in the blank", items=[
            ("She sings ____. (how?) 🎤", "sweetly"),
            ("Ravi opened the box ____. (how?) 📦", "carefully"),
            ("I wanted ice-cream, ____ it was finished. 🍦", "but"),
            ("The frog ____ into the pond. 🐸", "jumped"),
            ("I am happy ____ it is my birthday. 🎂", "because"),
            ("We will visit Grandma ____. (the day after today)", "tomorrow")]),
        dict(type="write", title="Write your own sentences", items=[
            ("How does a robot walk?", "A robot walks ____", "A robot walks stiffly.", False),
            ("Write a sentence with a verb and an adverb about an animal.", "The ____ ____ ____", "The monkey jumps quickly.", False),
            ("Why do you love weekends? Use <b>because</b>.", "I love weekends because ____", "I love weekends because I can play all day.", False)]),
    ]))

# ------------------------------------------------------------------ 19 MIXED 4  (sentence order)
WS.append(dict(
    no=19, topic="Mixed", title="Mixed 4: Sentence Detective, Jumbled Phrases", color=CYAN, mixed=True,
    can="I can put jumbled phrases and sentences in the right order so they make sense.",
    rule="Phrases are small groups of words. Put the pieces in order: <b>Who?</b> → <b>Does what?</b> → <b>Where / When / Why?</b> A story needs its sentences in order too: <b>First, Next, Then, Last</b>.",
    cards=[("🧩", "phrases"), ("1️⃣", "First"), ("2️⃣", "Next"), ("3️⃣", "Then")],
    tip="Read each piece aloud. Which piece can start a sentence? Which one has the full stop?",
    sections=[
        dict(type="match", title="Match the starting phrase to its ending", items=[
            ("In the garden,", "the butterflies are dancing."), ("After lunch,", "we play kho-kho."), ("Under the old tree,", "a little squirrel sleeps."),
            ("At night,", "the stars twinkle."), ("With a big smile,", "Rani gave me a gift.")]),
        dict(type="choose", title="Circle the sentence that makes sense", items=[
            ("Which sentence makes sense?", "The children are playing in the park.", ["In the park playing are the children.", "Playing the children park the in are."]),
            ("Which sentence makes sense?", "My uncle drives a red car to work.", ["Car my uncle red a to drives work.", "To work red a drives uncle my car."]),
            ("Which sentence makes sense?", "The tiny ant carried a big leaf.", ["A big the leaf tiny carried ant.", "Carried ant tiny the a leaf big."]),
            ("Which sentence makes sense?", "Every evening, we walk by the river.", ["River the by walk we evening every.", "We every by walk the evening river."])]),
        dict(type="order", title="Put the phrases in order. Write the sentence.", items=[
            (["in the garden", "The bees", "buzz"], "The bees buzz in the garden."),
            (["to the market", "My mother", "goes", "every Sunday"], "My mother goes to the market every Sunday."),
            (["is sleeping", "The little kitten", "under the bed"], "The little kitten is sleeping under the bed."),
            (["we", "In the library,", "read stories"], "In the library, we read stories."),
            (["Mom", "gave me a gift", "because it was my birthday"], "Mom gave me a gift because it was my birthday.")]),
        dict(type="sequence", title="Number the sentences 1, 2, 3, 4 to make a story", items=[
            ["I woke up.", "I brushed my teeth.", "I ate breakfast.", "I went to school."],
            ["Meera planted a seed.", "She watered it every day.", "A little plant grew.", "Soon it had a red flower."],
            ["Rohan lost his kite.", "He looked everywhere.", "He found it in a tree.", "He climbed up and got it back."]]),
        dict(type="fill", title="Complete the sentence with the best phrase", items=[
            ("The kids clap ____.", "after the show"),
            ("____ we eat our lunch.", "At noon,"),
            ("My friend ____ every day.", "reads a book"),
            ("The sun rises ____.", "in the east")]),
        dict(type="write", title="Write your own sentences", items=[
            ("Use the phrases: <b>the clown</b> | <b>made us laugh</b> | <b>at the party</b>", "The clown ____", "The clown made us laugh at the party.", False),
            ("Use the phrases: <b>in the pond</b> | <b>swims</b> | <b>the duck</b>", "The duck ____", "The duck swims in the pond.", False),
            ("Write 3 sentences about your morning. Use <b>First, Next, Then</b>.", "First, I ____. Next, I ____. Then, I ____", "First, I wake up. Next, I brush my teeth. Then, I eat breakfast.", False)]),
    ]))

# ------------------------------------------------------------------ 20 GRAND CHALLENGE
WS.append(dict(
    no=20, topic="Mixed", title="Mixed 5: Grand Grammar Challenge", color=PUR, mixed=True,
    can="I can find and use ALL eight kinds of words.",
    rule="Noun • Verb • Adjective • Pronoun • Article • Preposition • Adverb • Conjunction. <i>The <u>tiny</u> mouse <u>quietly</u> ran <u>under</u> a chair <u>because</u> <u>it</u> was scared.</i>",
    cards=[("🏷️", "noun"), ("🏃", "verb"), ("🌈", "adjective"), ("🙋", "pronoun"), ("🅰️", "article"), ("📍", "preposition"), ("🐢", "adverb"), ("🔗", "conjunction")],
    tip="You are a Grammar Superstar! Read each sentence aloud and trust your ear.",
    sections=[
        dict(type="match", title="Match the kind of word to an example", items=[
            ("Noun", "elephant"), ("Verb", "jump"), ("Adjective", "tiny"), ("Pronoun", "they"),
            ("Article", "an"), ("Preposition", "under"), ("Adverb", "slowly"), ("Conjunction", "because")]),
        dict(type="choose", title="Circle the correct answer", items=[
            ("Which word is a PRONOUN?", "she", ["happy", "run"]),
            ("In <i>The tiny kitten drank milk quickly</i>, find the ADVERB.", "quickly", ["tiny", "drank"]),
            ("Which sentence is in the correct order?", "I eat an apple every day.", ["Eat apple I every an day.", "Apple an I every eat day."]),
            ("I have ____ orange.", "an", ["a"]),
            ("Find the PREPOSITION: The cat sleeps under the bed.", "under", ["sleeps", "cat"]),
            ("Find the CONJUNCTION: I am tired but happy.", "but", ["tired", "happy"])]),
        dict(type="fill", title="Fill in the blank", items=[
            ("Anna is my friend. ____ is a good singer. 🎤", "She"),
            ("Ravi is sad ____ he lost his pen. ✏️", "because"),
            ("The mouse ran ____ the chair. (below) 🐭", "under"),
            ("Birds ____ in the sky. 🐦", "fly"),
            ("____ elephant is a big animal. 🐘", "An"),
            ("The teacher smiled ____ at us. 😊", "kindly")]),
        dict(type="write", title="Write your own sentences", items=[
            ("Write a sentence with a noun, a verb and an adverb.", "The ____ ____ ____", "The rabbit hops quickly.", False),
            ("Write a sentence using an adjective and a preposition.", "The ____ ____ ____ the ____", "The tiny mouse hid under the chair.", False),
            ("Write a sentence using <b>and</b> or <b>but</b>.", "I like ____ and/but ____", "I like cricket but I do not like homework.", False),
            ("Write a 2-line story about a dragon. Use at least 3 describing words. 🐉", "Once there was ____", "Once there was a huge, green dragon. He was kind and funny.", True)]),
    ]))

assert len(WS) == 20

# --- layout tweaks: sections per page ("splits" = indexes where a new page starts)
WS[14]["sections"][1], WS[14]["sections"][2] = WS[14]["sections"][2], WS[14]["sections"][1]  # W15: choose, match | order, fill, write
WS[18]["splits"] = [2, 4]   # W19: match, choose | order, sequence | fill, write
WS[19]["splits"] = [1, 3]   # W20: match | choose, fill | write
WS[14]["tight"] = True
WS[18]["tight"] = True
WS[18]["tight"] = [1]
