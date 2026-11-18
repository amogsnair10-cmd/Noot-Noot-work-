import type { Letter, Word } from './types';

// en | hi | emoji | category
const RAW = `
apple|सेब|🍎|food
ball|गेंद|⚽|things
cat|बिल्ली|🐈|animals
dog|कुत्ता|🐕|animals
egg|अंडा|🥚|food
fish|मछली|🐟|animals
goat|बकरी|🐐|animals
hat|टोपी|👒|things
insect|कीड़ा|🐛|animals
jeep|जीप|🚙|transport
key|चाबी|🔑|things
lion|शेर|🦁|animals
mango|आम|🥭|food
nose|नाक|👃|body
ox|बैल|🐂|animals
pen|पेन|🖊️|things
queen|रानी|👸|people
rabbit|खरगोश|🐇|animals
sun|सूरज|☀️|nature
tiger|बाघ|🐅|animals
umbrella|छाता|☂️|things
van|वैन|🚐|transport
watch|घड़ी|⌚|things
box|डिब्बा|📦|things
yellow|पीला|🟡|colours
zebra|ज़ेबरा|🦓|animals
mother|माँ|👩|family
father|पिता|👨|family
baby|बच्चा|👶|family
sister|बहन|👧|family
brother|भाई|👦|family
grandmother|दादी / नानी|👵|family
grandfather|दादा / नाना|👴|family
friend|दोस्त|🤝|family
family|परिवार|👪|family
eye|आँख|👁️|body
ear|कान|👂|body
mouth|मुँह|👄|body
hand|हाथ|✋|body
leg|टाँग|🦵|body
foot|पैर|🦶|body
teeth|दाँत|🦷|body
hair|बाल|💇|body
banana|केला|🍌|food
orange|संतरा|🍊|food
grapes|अंगूर|🍇|food
rice|चावल|🍚|food
bread|ब्रेड|🍞|food
milk|दूध|🥛|food
water|पानी|💧|food
tea|चाय|☕|food
carrot|गाजर|🥕|food
tomato|टमाटर|🍅|food
potato|आलू|🥔|food
corn|मक्का|🌽|food
cow|गाय|🐄|animals
hen|मुर्गी|🐔|animals
bird|चिड़िया|🐦|animals
monkey|बंदर|🐒|animals
elephant|हाथी|🐘|animals
horse|घोड़ा|🐎|animals
rat|चूहा|🐀|animals
pig|सूअर|🐖|animals
ant|चींटी|🐜|animals
bug|कीड़ा|🐞|animals
fox|लोमड़ी|🦊|animals
duck|बत्तख|🦆|animals
frog|मेंढक|🐸|animals
house|घर|🏠|home
door|दरवाज़ा|🚪|home
bed|बिस्तर|🛏️|home
phone|फ़ोन|📱|things
bag|थैला|👜|things
book|किताब|📖|things
cup|कप|🍵|things
pot|बर्तन|🍲|things
bus|बस|🚌|transport
car|गाड़ी|🚗|transport
cap|टोपी|🧢|things
map|नक्शा|🗺️|things
bat|बल्ला|🏏|things
pin|पिन|📌|things
net|जाल|🥅|things
man|आदमी|👨|people
bin|कूड़ेदान|🗑️|things
six|छह|6️⃣|numbers
ten|दस|🔟|numbers
nut|मूँगफली|🥜|food
mug|मग|☕|things
tub|टब|🛁|home
jet|जेट|✈️|transport
log|लकड़ी|🪵|nature
red|लाल|🔴|colours
blue|नीला|🔵|colours
green|हरा|🟢|colours
black|काला|⚫|colours
white|सफ़ेद|⚪|colours
brown|भूरा|🟤|colours
one|एक|1️⃣|numbers
two|दो|2️⃣|numbers
three|तीन|3️⃣|numbers
four|चार|4️⃣|numbers
five|पाँच|5️⃣|numbers
seven|सात|7️⃣|numbers
eight|आठ|8️⃣|numbers
nine|नौ|9️⃣|numbers
run|दौड़ना|🏃|actions
walk|चलना|🚶|actions
sit|बैठना|🧘|actions
eat|खाना|🍽️|actions
drink|पीना|🥤|actions
sleep|सोना|😴|actions
read|पढ़ना|📚|actions
write|लिखना|✍️|actions
sing|गाना|🎤|actions
jump|कूदना|🤸|actions
swim|तैरना|🏊|actions
cook|खाना बनाना|🍳|actions
play|खेलना|🎲|actions
wash|धोना|🧼|actions
cry|रोना|😭|actions
laugh|हँसना|😂|actions
big|बड़ा|🐘|describe
small|छोटा|🐜|describe
hot|गरम|🔥|describe
cold|ठंडा|🧊|describe
happy|खुश|😊|describe
sad|दुखी|😢|describe
fast|तेज़|🐆|describe
slow|धीमा|🐢|describe
tall|लंबा|🦒|describe
wet|गीला|💦|describe
school|स्कूल|🏫|places
shop|दुकान|🏪|places
market|बाज़ार|🛒|places
hospital|अस्पताल|🏥|places
park|पार्क|🏞️|places
road|सड़क|🛣️|places
station|स्टेशन|🚉|places
moon|चाँद|🌙|nature
star|तारा|⭐|nature
rain|बारिश|🌧️|nature
tree|पेड़|🌳|nature
flower|फूल|🌸|nature
night|रात|🌃|nature
morning|सुबह|🌅|nature
teacher|शिक्षक|🧑‍🏫|people
doctor|डॉक्टर|🧑‍⚕️|people
farmer|किसान|🧑‍🌾|people
police|पुलिस|👮|people
money|पैसे|💰|things
ship|जहाज़|🚢|transport
shoe|जूता|👟|things
chair|कुर्सी|🪑|home
cheese|पनीर|🧀|food
chick|चूज़ा|🐤|animals
thumb|अँगूठा|👍|body
hello|नमस्ते|👋|phrases
thank you|धन्यवाद|🙏|phrases
sorry|माफ़ कीजिए|😔|phrases
please|कृपया|🤲|phrases
yes|हाँ|✅|phrases
no|नहीं|❌|phrases
good morning|सुप्रभात|🌅|phrases
good night|शुभ रात्रि|🌙|phrases
bye|अलविदा|🙋|phrases
`;

export const WORDS: Record<string, Word> = {};
for (const line of RAW.trim().split('\n')) {
  const [en, hi, emoji, cat] = line.split('|');
  WORDS[en] = { en, hi, emoji, cat };
}

export const LETTERS: Letter[] = 'abcdefghijklmnopqrstuvwxyz'.split('').map((ch) => ({
  ch,
  word: {
    a: 'apple', b: 'ball', c: 'cat', d: 'dog', e: 'egg', f: 'fish', g: 'goat', h: 'hat', i: 'insect',
    j: 'jeep', k: 'key', l: 'lion', m: 'mango', n: 'nose', o: 'ox', p: 'pen', q: 'queen', r: 'rabbit',
    s: 'sun', t: 'tiger', u: 'umbrella', v: 'van', w: 'watch', x: 'box', y: 'yellow', z: 'zebra',
  }[ch]!,
}));

export const LETTER_MAP: Record<string, Letter> = Object.fromEntries(LETTERS.map((l) => [l.ch, l]));

// Sight words: high-frequency words taught with a short example sentence.
export const SIGHT: Record<string, { hi: string; example: string; exampleHi: string }> = {
  I: { hi: 'मैं', example: 'I am happy.', exampleHi: 'मैं खुश हूँ।' },
  a: { hi: 'एक', example: 'I see a cat.', exampleHi: 'मुझे एक बिल्ली दिखती है।' },
  the: { hi: 'वह / यह (खास चीज़)', example: 'The sun is hot.', exampleHi: 'सूरज गरम है।' },
  is: { hi: 'है', example: 'It is a dog.', exampleHi: 'यह एक कुत्ता है।' },
  it: { hi: 'यह / वह', example: 'It is big.', exampleHi: 'यह बड़ा है।' },
  my: { hi: 'मेरा / मेरी', example: 'This is my bag.', exampleHi: 'यह मेरा थैला है।' },
  you: { hi: 'तुम / आप', example: 'Thank you.', exampleHi: 'धन्यवाद।' },
  we: { hi: 'हम', example: 'We play.', exampleHi: 'हम खेलते हैं।' },
  he: { hi: 'वह (लड़का)', example: 'He can run.', exampleHi: 'वह दौड़ सकता है।' },
  she: { hi: 'वह (लड़की)', example: 'She is my sister.', exampleHi: 'वह मेरी बहन है।' },
  can: { hi: 'सकता / सकती', example: 'I can swim.', exampleHi: 'मैं तैर सकता हूँ।' },
  see: { hi: 'देखना', example: 'I see the moon.', exampleHi: 'मुझे चाँद दिखता है।' },
  go: { hi: 'जाना', example: 'I go to school.', exampleHi: 'मैं स्कूल जाता हूँ।' },
  to: { hi: 'को / की ओर', example: 'Go to the shop.', exampleHi: 'दुकान जाओ।' },
  and: { hi: 'और', example: 'A cat and a dog.', exampleHi: 'एक बिल्ली और एक कुत्ता।' },
  in: { hi: 'अंदर / में', example: 'The cat is in the box.', exampleHi: 'बिल्ली डिब्बे में है।' },
  on: { hi: 'ऊपर / पर', example: 'The cup is on the bed.', exampleHi: 'कप बिस्तर पर है।' },
  this: { hi: 'यह', example: 'This is a pen.', exampleHi: 'यह एक पेन है।' },
  have: { hi: 'पास होना', example: 'I have a phone.', exampleHi: 'मेरे पास एक फ़ोन है।' },
  like: { hi: 'पसंद', example: 'I like mango.', exampleHi: 'मुझे आम पसंद है।' },
  what: { hi: 'क्या', example: 'What is this?', exampleHi: 'यह क्या है?' },
  where: { hi: 'कहाँ', example: 'Where is the bus?', exampleHi: 'बस कहाँ है?' },
  am: { hi: 'हूँ', example: 'I am here.', exampleHi: 'मैं यहाँ हूँ।' },
  are: { hi: 'हैं / हो', example: 'You are my friend.', exampleHi: 'तुम मेरे दोस्त हो।' },
};

/** Items that a learner can see in "Words I know". */
export function wordLabel(key: string): { en: string; hi: string; emoji: string } | null {
  const [t, id] = [key.slice(0, 1), key.slice(2)];
  if (t === 'w' && WORDS[id]) return WORDS[id];
  if (t === 'l' && LETTER_MAP[id]) return { en: `${id.toUpperCase()} ${id}`, hi: WORDS[LETTER_MAP[id].word].en, emoji: WORDS[LETTER_MAP[id].word].emoji };
  if (t === 'g' && SIGHT[id]) return { en: id, hi: SIGHT[id].hi, emoji: '👁️' };
  return null;
}
