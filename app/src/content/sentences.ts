import type { Dialogue, Passage, Sentence } from './types';

const S = (id: string, en: string, hi: string, scene: string, blank?: string): Sentence => ({ id, en, hi, scene, blank });

export const SENTENCES: Record<string, Sentence> = Object.fromEntries(
  [
    // This is / It is
    S('this-cat', 'This is a cat.', 'यह एक बिल्ली है।', '👉🐈', 'cat'),
    S('this-bag', 'This is my bag.', 'यह मेरा थैला है।', '👉👜', 'bag'),
    S('this-pen', 'This is a pen.', 'यह एक पेन है।', '👉🖊️', 'pen'),
    S('it-big', 'It is big.', 'यह बड़ा है।', '🐘', 'big'),
    S('it-hot', 'It is hot.', 'यह गरम है।', '🔥☕', 'hot'),
    S('it-red', 'It is red.', 'यह लाल है।', '🍎🔴', 'red'),
    // I have / I can / I like
    S('have-phone', 'I have a phone.', 'मेरे पास एक फ़ोन है।', '🙋📱', 'phone'),
    S('have-book', 'I have a book.', 'मेरे पास एक किताब है।', '🙋📖', 'book'),
    S('have-two', 'I have two bananas.', 'मेरे पास दो केले हैं।', '🙋🍌🍌', 'two'),
    S('can-run', 'I can run.', 'मैं दौड़ सकता हूँ।', '🏃💨', 'run'),
    S('can-swim', 'I can swim.', 'मैं तैर सकता हूँ।', '🏊🌊', 'swim'),
    S('can-cook', 'I can cook rice.', 'मैं चावल बना सकता हूँ।', '🍳🍚', 'cook'),
    S('like-mango', 'I like mango.', 'मुझे आम पसंद है।', '😋🥭', 'mango'),
    S('like-tea', 'I like hot tea.', 'मुझे गरम चाय पसंद है।', '😋☕', 'tea'),
    S('like-play', 'We like to play.', 'हमें खेलना पसंद है।', '👫🎲', 'play'),
    // Feelings & describing people
    S('am-happy', 'I am happy.', 'मैं खुश हूँ।', '🙋😊', 'happy'),
    S('she-sad', 'She is sad.', 'वह दुखी है।', '👧😢', 'sad'),
    S('he-tall', 'He is tall.', 'वह लंबा है।', '👦📏', 'tall'),
    S('she-doctor', 'She is a doctor.', 'वह एक डॉक्टर है।', '🧑‍⚕️🏥', 'doctor'),
    S('he-farmer', 'He is a farmer.', 'वह एक किसान है।', '🧑‍🌾🌽', 'farmer'),
    // Where: in / on / under
    S('cat-box', 'The cat is in the box.', 'बिल्ली डिब्बे में है।', '🐈📦', 'in'),
    S('cup-table', 'The cup is on the bed.', 'कप बिस्तर पर है।', '🍵🛏️', 'on'),
    S('dog-under', 'The dog is under the tree.', 'कुत्ता पेड़ के नीचे है।', '🐕🌳', 'under'),
    S('ball-bag', 'The ball is in the bag.', 'गेंद थैले में है।', '⚽👜', 'in'),
    S('bird-tree', 'The bird is on the tree.', 'चिड़िया पेड़ पर है।', '🐦🌳', 'on'),
    // Daily life
    S('go-school', 'I go to school.', 'मैं स्कूल जाता हूँ।', '🚶🏫', 'school'),
    S('go-market', 'We go to the market.', 'हम बाज़ार जाते हैं।', '👫🛒', 'market'),
    S('eat-rice', 'I eat rice.', 'मैं चावल खाता हूँ।', '🍽️🍚', 'rice'),
    S('drink-water', 'I drink water.', 'मैं पानी पीता हूँ।', '🥤💧', 'water'),
    S('wake-up', 'I wake up in the morning.', 'मैं सुबह उठता हूँ।', '⏰🌅', 'morning'),
    S('wash-hands', 'I wash my hands.', 'मैं अपने हाथ धोता हूँ।', '🧼✋', 'hands'),
    S('sleep-night', 'I sleep at night.', 'मैं रात को सोता हूँ।', '😴🌃', 'night'),
    S('bus-late', 'The bus is late.', 'बस देर से है।', '🚌⏰', 'late'),
    S('it-rain', 'It is raining.', 'बारिश हो रही है।', '🌧️☂️', 'raining'),
    // sh / ch / th
    S('ship-sea', 'The ship is big.', 'जहाज़ बड़ा है।', '🚢🌊', 'ship'),
    S('fish-shop', 'I see a fish shop.', 'मुझे एक मछली की दुकान दिखती है।', '🐟🏪', 'shop'),
    S('chick-chair', 'The chick is on the chair.', 'चूज़ा कुर्सी पर है।', '🐤🪑', 'chair'),
    S('three-thumbs', 'I have three books.', 'मेरे पास तीन किताबें हैं।', '3️⃣📚', 'three'),
  ].map((s) => [s.id, s]),
);

const D = (id: string, q: string, qhi: string, a: string, ahi: string, scene: string): Dialogue => ({ id, q, qhi, a, ahi, scene });

export const DIALOGUES: Record<string, Dialogue> = Object.fromEntries(
  [
    D('name', 'What is your name?', 'तुम्हारा नाम क्या है?', 'My name is Asha.', 'मेरा नाम आशा है।', '🙋'),
    D('how', 'How are you?', 'तुम कैसे हो?', 'I am fine, thank you.', 'मैं ठीक हूँ, धन्यवाद।', '😊'),
    D('age', 'How old are you?', 'तुम्हारी उम्र क्या है?', 'I am ten years old.', 'मैं दस साल का हूँ।', '🎂'),
    D('live', 'Where do you live?', 'तुम कहाँ रहते हो?', 'I live in Pune.', 'मैं पुणे में रहता हूँ।', '🏠'),
    D('what-this', 'What is this?', 'यह क्या है?', 'It is a book.', 'यह एक किताब है।', '📖'),
    D('colour', 'What colour is it?', 'यह किस रंग का है?', 'It is blue.', 'यह नीला है।', '🔵'),
    D('like-eat', 'What do you like to eat?', 'तुम्हें क्या खाना पसंद है?', 'I like rice and dal.', 'मुझे चावल और दाल पसंद है।', '🍚'),
    D('how-much', 'How much is this?', 'यह कितने का है?', 'It is ten rupees.', 'यह दस रुपये का है।', '💰'),
    D('want', 'What do you want?', 'आपको क्या चाहिए?', 'I want two mangoes, please.', 'मुझे दो आम चाहिए, कृपया।', '🥭'),
    D('where-bus', 'Where is the bus stop?', 'बस स्टॉप कहाँ है?', 'It is near the school.', 'वह स्कूल के पास है।', '🚏'),
    D('time', 'What time is it?', 'कितने बजे हैं?', 'It is nine o\'clock.', 'नौ बजे हैं।', '🕘'),
    D('help', 'Can you help me?', 'क्या आप मेरी मदद कर सकते हैं?', 'Yes, I can help you.', 'हाँ, मैं आपकी मदद कर सकता हूँ।', '🤝'),
    D('feel', 'How do you feel?', 'तुम कैसा महसूस कर रहे हो?', 'I feel sick. My head hurts.', 'मेरी तबीयत ठीक नहीं है। मेरा सिर दुख रहा है।', '🤒'),
    D('phone-who', 'Hello, who is this?', 'हैलो, कौन बोल रहा है?', 'Hello, this is Ravi.', 'हैलो, मैं रवि बोल रहा हूँ।', '📱'),
  ].map((d) => [d.id, d]),
);

export const PASSAGES: Record<string, Passage> = {
  // Short passages used only in the placement / final tests (not taught in lessons)
  testA: {
    id: 'testA',
    title: 'Tom and his dog',
    titleHi: 'टॉम और उसका कुत्ता',
    emoji: '🐕',
    lines: [
      { en: 'Tom has a red ball.', hi: 'टॉम के पास एक लाल गेंद है।', scene: '👦🔴' },
      { en: 'He plays in the park.', hi: 'वह पार्क में खेलता है।', scene: '🏞️' },
      { en: 'His dog runs with him.', hi: 'उसका कुत्ता उसके साथ दौड़ता है।', scene: '🐕🏃' },
    ],
    questions: [
      { q: 'What colour is the ball?', qhi: 'गेंद किस रंग की है?', options: ['blue', 'red', 'green'], emoji: ['🔵', '🔴', '🟢'], answer: 1 },
      { q: 'Where does Tom play?', qhi: 'टॉम कहाँ खेलता है?', options: ['in the park', 'at school', 'at home'], emoji: ['🏞️', '🏫', '🏠'], answer: 0 },
      { q: 'Who runs with Tom?', qhi: 'टॉम के साथ कौन दौड़ता है?', options: ['his cat', 'his sister', 'his dog'], emoji: ['🐈', '👧', '🐕'], answer: 2 },
    ],
  },
  testB: {
    id: 'testB',
    title: 'Sita goes shopping',
    titleHi: 'सीता खरीदारी करने जाती है',
    emoji: '🏪',
    lines: [
      { en: 'Sita has a small bag.', hi: 'सीता के पास एक छोटा थैला है।', scene: '👧👜' },
      { en: 'She goes to the shop.', hi: 'वह दुकान जाती है।', scene: '🏪' },
      { en: 'She buys milk and bread.', hi: 'वह दूध और ब्रेड खरीदती है।', scene: '🥛🍞' },
    ],
    questions: [
      { q: 'What does Sita have?', qhi: 'सीता के पास क्या है?', options: ['a small bag', 'a big box', 'a phone'], emoji: ['👜', '📦', '📱'], answer: 0 },
      { q: 'Where does she go?', qhi: 'वह कहाँ जाती है?', options: ['to the park', 'to the shop', 'to the hospital'], emoji: ['🏞️', '🏪', '🏥'], answer: 1 },
      { q: 'What does she buy?', qhi: 'वह क्या खरीदती है?', options: ['rice and tea', 'mango and egg', 'milk and bread'], emoji: ['🍚☕', '🥭🥚', '🥛🍞'], answer: 2 },
    ],
  },
  family: {
    id: 'family',
    title: 'My Family',
    titleHi: 'मेरा परिवार',
    emoji: '👪',
    lines: [
      { en: 'This is my family.', hi: 'यह मेरा परिवार है।', scene: '👪' },
      { en: 'I have a mother and a father.', hi: 'मेरी एक माँ और एक पिता हैं।', scene: '👩👨' },
      { en: 'I have one sister.', hi: 'मेरी एक बहन है।', scene: '👧' },
      { en: 'We live in a small house.', hi: 'हम एक छोटे घर में रहते हैं।', scene: '🏠' },
      { en: 'We are happy.', hi: 'हम खुश हैं।', scene: '😊' },
    ],
    questions: [
      { q: 'How many sisters do I have?', qhi: 'मेरी कितनी बहनें हैं?', options: ['one', 'two', 'three'], emoji: ['1️⃣', '2️⃣', '3️⃣'], answer: 0 },
      { q: 'Is the house big or small?', qhi: 'घर बड़ा है या छोटा?', options: ['big', 'small'], emoji: ['🏰', '🏠'], answer: 1 },
      { q: 'How is the family?', qhi: 'परिवार कैसा है?', options: ['sad', 'happy', 'angry'], emoji: ['😢', '😊', '😠'], answer: 1 },
    ],
    writePrompt: { en: 'Write about your family. "I have a ..."', hi: 'अपने परिवार के बारे में लिखो। "I have a ..."' },
  },
  market: {
    id: 'market',
    title: 'At the Market',
    titleHi: 'बाज़ार में',
    emoji: '🛒',
    lines: [
      { en: 'Ravi goes to the market.', hi: 'रवि बाज़ार जाता है।', scene: '👦🛒' },
      { en: 'He wants mangoes.', hi: 'उसे आम चाहिए।', scene: '🥭' },
      { en: 'One mango is ten rupees.', hi: 'एक आम दस रुपये का है।', scene: '🥭💰' },
      { en: 'He buys three mangoes.', hi: 'वह तीन आम खरीदता है।', scene: '🥭🥭🥭' },
      { en: 'He pays thirty rupees.', hi: 'वह तीस रुपये देता है।', scene: '💵' },
    ],
    questions: [
      { q: 'Where does Ravi go?', qhi: 'रवि कहाँ जाता है?', options: ['school', 'market', 'hospital'], emoji: ['🏫', '🛒', '🏥'], answer: 1 },
      { q: 'What does he want?', qhi: 'उसे क्या चाहिए?', options: ['bananas', 'mangoes', 'milk'], emoji: ['🍌', '🥭', '🥛'], answer: 1 },
      { q: 'How many mangoes does he buy?', qhi: 'वह कितने आम खरीदता है?', options: ['one', 'two', 'three'], emoji: ['1️⃣', '2️⃣', '3️⃣'], answer: 2 },
      { q: 'How much does he pay?', qhi: 'वह कितने रुपये देता है?', options: ['ten rupees', 'thirty rupees', 'five rupees'], answer: 1 },
    ],
    writePrompt: { en: 'What do you buy at the market? "I buy ..."', hi: 'तुम बाज़ार से क्या खरीदते हो? "I buy ..."' },
  },
  rain: {
    id: 'rain',
    title: 'A Rainy Day',
    titleHi: 'बारिश का दिन',
    emoji: '🌧️',
    lines: [
      { en: 'It is a rainy day.', hi: 'आज बारिश का दिन है।', scene: '🌧️' },
      { en: 'Asha takes her umbrella.', hi: 'आशा अपना छाता लेती है।', scene: '👧☂️' },
      { en: 'The road is wet.', hi: 'सड़क गीली है।', scene: '🛣️💦' },
      { en: 'She sees a green frog.', hi: 'उसे एक हरा मेंढक दिखता है।', scene: '🐸' },
      { en: 'At home, she drinks hot tea.', hi: 'घर पर वह गरम चाय पीती है।', scene: '🏠☕' },
    ],
    questions: [
      { q: 'What does Asha take?', qhi: 'आशा क्या लेती है?', options: ['a bag', 'an umbrella', 'a book'], emoji: ['👜', '☂️', '📖'], answer: 1 },
      { q: 'What does she see?', qhi: 'उसे क्या दिखता है?', options: ['a frog', 'a cat', 'a bus'], emoji: ['🐸', '🐈', '🚌'], answer: 0 },
      { q: 'What does she drink?', qhi: 'वह क्या पीती है?', options: ['milk', 'water', 'tea'], emoji: ['🥛', '💧', '☕'], answer: 2 },
    ],
    writePrompt: { en: 'What do you do on a rainy day?', hi: 'बारिश के दिन तुम क्या करते हो?' },
  },
  bus: {
    id: 'bus',
    title: 'The Late Bus',
    titleHi: 'देर से आई बस',
    emoji: '🚌',
    lines: [
      { en: 'Sunil waits at the bus stop.', hi: 'सुनील बस स्टॉप पर इंतज़ार करता है।', scene: '🧍🚏' },
      { en: 'The bus is late.', hi: 'बस देर से है।', scene: '🚌⏰' },
      { en: 'He reads a book.', hi: 'वह एक किताब पढ़ता है।', scene: '📖' },
      { en: 'The bus comes at nine o\'clock.', hi: 'बस नौ बजे आती है।', scene: '🕘🚌' },
      { en: 'He sits by the window.', hi: 'वह खिड़की के पास बैठता है।', scene: '🪟' },
    ],
    questions: [
      { q: 'Where does Sunil wait?', qhi: 'सुनील कहाँ इंतज़ार करता है?', options: ['at the shop', 'at the bus stop', 'at home'], emoji: ['🏪', '🚏', '🏠'], answer: 1 },
      { q: 'What does he do?', qhi: 'वह क्या करता है?', options: ['He reads a book.', 'He sleeps.', 'He runs.'], emoji: ['📖', '😴', '🏃'], answer: 0 },
      { q: 'When does the bus come?', qhi: 'बस कब आती है?', options: ['at six', 'at nine', 'at ten'], emoji: ['🕕', '🕘', '🕙'], answer: 1 },
    ],
    writePrompt: { en: 'How do you go to school or work?', hi: 'तुम स्कूल या काम पर कैसे जाते हो?' },
  },
  doctor: {
    id: 'doctor',
    title: 'At the Doctor',
    titleHi: 'डॉक्टर के पास',
    emoji: '🏥',
    lines: [
      { en: 'Meena is sick.', hi: 'मीना बीमार है।', scene: '🤒' },
      { en: 'Her head hurts.', hi: 'उसका सिर दुख रहा है।', scene: '🤕' },
      { en: 'She goes to the hospital.', hi: 'वह अस्पताल जाती है।', scene: '🏥' },
      { en: 'The doctor gives her medicine.', hi: 'डॉक्टर उसे दवा देता है।', scene: '🧑‍⚕️💊' },
      { en: 'She sleeps and feels better.', hi: 'वह सोती है और बेहतर महसूस करती है।', scene: '😴😊' },
    ],
    questions: [
      { q: 'What hurts?', qhi: 'क्या दुख रहा है?', options: ['her hand', 'her head', 'her leg'], emoji: ['✋', '🤕', '🦵'], answer: 1 },
      { q: 'Where does Meena go?', qhi: 'मीना कहाँ जाती है?', options: ['to the hospital', 'to the park', 'to the market'], emoji: ['🏥', '🏞️', '🛒'], answer: 0 },
      { q: 'What does the doctor give?', qhi: 'डॉक्टर क्या देता है?', options: ['food', 'money', 'medicine'], emoji: ['🍚', '💰', '💊'], answer: 2 },
    ],
    writePrompt: { en: 'What do you do when you are sick?', hi: 'जब तुम बीमार होते हो तो क्या करते हो?' },
  },
  day: {
    id: 'day',
    title: 'My Day',
    titleHi: 'मेरा दिन',
    emoji: '🌅',
    lines: [
      { en: 'I wake up at six.', hi: 'मैं छह बजे उठता हूँ।', scene: '⏰🌅' },
      { en: 'I wash my face.', hi: 'मैं अपना चेहरा धोता हूँ।', scene: '🧼' },
      { en: 'I eat roti and drink milk.', hi: 'मैं रोटी खाता हूँ और दूध पीता हूँ।', scene: '🫓🥛' },
      { en: 'I go to school by bus.', hi: 'मैं बस से स्कूल जाता हूँ।', scene: '🚌🏫' },
      { en: 'In the evening, I play with my friends.', hi: 'शाम को मैं अपने दोस्तों के साथ खेलता हूँ।', scene: '⚽👫' },
    ],
    questions: [
      { q: 'When do I wake up?', qhi: 'मैं कब उठता हूँ?', options: ['at six', 'at ten', 'at night'], emoji: ['🕕', '🕙', '🌃'], answer: 0 },
      { q: 'What do I drink?', qhi: 'मैं क्या पीता हूँ?', options: ['tea', 'milk', 'water'], emoji: ['☕', '🥛', '💧'], answer: 1 },
      { q: 'How do I go to school?', qhi: 'मैं स्कूल कैसे जाता हूँ?', options: ['by car', 'by bus', 'I walk'], emoji: ['🚗', '🚌', '🚶'], answer: 1 },
      { q: 'What do I do in the evening?', qhi: 'मैं शाम को क्या करता हूँ?', options: ['I sleep', 'I cook', 'I play'], emoji: ['😴', '🍳', '⚽'], answer: 2 },
    ],
    writePrompt: { en: 'Write about your day. "I wake up at ..."', hi: 'अपने दिन के बारे में लिखो। "I wake up at ..."' },
  },
};
