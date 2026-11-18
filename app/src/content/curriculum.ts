import type { Lesson, LessonKind, Level, Unit } from './types';

let order = 0;
const L = (level: number, id: string, title: string, titleHi: string, emoji: string, kind: LessonKind, items: string[]): Lesson => {
  order++;
  return { id: `L${level}-${id}`, level, title, titleHi, emoji, kind, items };
};
const U = (id: string, title: string, titleHi: string, emoji: string, lessons: Lesson[]): Unit => ({ id, title, titleHi, emoji, lessons });

const w = (...ids: string[]) => ids.map((x) => `w:${x}`);
const l = (s: string) => s.split('').map((c) => `l:${c}`);
const g = (...ids: string[]) => ids.map((x) => `g:${x}`);
const s = (...ids: string[]) => ids.map((x) => `s:${x}`);
const d = (...ids: string[]) => ids.map((x) => `d:${x}`);

export const LEVELS: Level[] = [
  {
    n: 1,
    key: 'pre',
    name: 'Pre-emergent',
    nameHi: 'शुरुआत',
    stage: 'Letters & first words',
    stageHi: 'अक्षर और पहले शब्द',
    emoji: '🌱',
    color: '#34E5A0',
    goal: 'Know all 26 letters, 60+ everyday words by picture and sound, and read your first words.',
    goalHi: 'सभी 26 अक्षर, चित्र और आवाज़ से 60+ रोज़ के शब्द, और पहले शब्द पढ़ना।',
    units: [
      U('L1-letters1', 'Letters A to I', 'अक्षर A से I', '🔤', [
        L(1, 'abc', 'A B C', 'A B C', '🍎', 'letters', l('abc')),
        L(1, 'def', 'D E F', 'D E F', '🐕', 'letters', l('def')),
        L(1, 'ghi', 'G H I', 'G H I', '🐐', 'letters', l('ghi')),
      ]),
      U('L1-me', 'Me and my family', 'मैं और मेरा परिवार', '👪', [
        L(1, 'family', 'My family', 'मेरा परिवार', '👪', 'vocab', w('mother', 'father', 'baby', 'sister', 'brother')),
        L(1, 'body', 'My body', 'मेरा शरीर', '✋', 'vocab', w('eye', 'ear', 'nose', 'mouth', 'hand', 'leg')),
      ]),
      U('L1-letters2', 'Letters J to R', 'अक्षर J से R', '🔤', [
        L(1, 'jkl', 'J K L', 'J K L', '🦁', 'letters', l('jkl')),
        L(1, 'mno', 'M N O', 'M N O', '🥭', 'letters', l('mno')),
        L(1, 'pqr', 'P Q R', 'P Q R', '🐇', 'letters', l('pqr')),
      ]),
      U('L1-food', 'Food and animals', 'खाना और जानवर', '🥭', [
        L(1, 'fruit', 'Fruits', 'फल', '🍌', 'vocab', w('apple', 'banana', 'mango', 'orange', 'grapes')),
        L(1, 'food', 'Food and drink', 'खाना-पीना', '🍚', 'vocab', w('rice', 'milk', 'water', 'egg', 'tea')),
        L(1, 'animals', 'Animals', 'जानवर', '🐄', 'vocab', w('cow', 'dog', 'cat', 'hen', 'goat', 'monkey')),
      ]),
      U('L1-letters3', 'Letters S to Z', 'अक्षर S से Z', '🔤', [
        L(1, 'stu', 'S T U', 'S T U', '☀️', 'letters', l('stu')),
        L(1, 'vwx', 'V W X', 'V W X', '⌚', 'letters', l('vwx')),
        L(1, 'yz', 'Y Z', 'Y Z', '🦓', 'letters', l('yz')),
      ]),
      U('L1-world', 'My world', 'मेरी दुनिया', '🏠', [
        L(1, 'colours', 'Colours', 'रंग', '🎨', 'vocab', w('red', 'blue', 'green', 'yellow', 'black', 'white')),
        L(1, 'numbers', 'Numbers 1 to 5', 'गिनती 1 से 5', '🔢', 'vocab', w('one', 'two', 'three', 'four', 'five')),
        L(1, 'home', 'At home', 'घर में', '🏠', 'vocab', w('house', 'door', 'bed', 'phone', 'bag', 'book')),
      ]),
      U('L1-read', 'My first reading', 'मेरा पहला पढ़ना', '📖', [
        L(1, 'cvc-a', 'Read: cat, hat, bat', 'पढ़ो: cat, hat, bat', '🐈', 'phonics', w('cat', 'hat', 'bat', 'rat', 'map')),
        L(1, 'cvc-u', 'Read: sun, bus, cup', 'पढ़ो: sun, bus, cup', '☀️', 'phonics', w('sun', 'bus', 'cup', 'nut', 'bug')),
        L(1, 'check', 'Level 1 Challenge', 'लेवल 1 चुनौती', '🏆', 'checkpoint', []),
      ]),
    ],
  },
  {
    n: 2,
    key: 'emergent',
    name: 'Emergent',
    nameHi: 'उभरता',
    stage: 'Read words and understand them',
    stageHi: 'शब्द पढ़ना और समझना',
    emoji: '🌿',
    color: '#22D3EE',
    goal: 'Read 3-letter words, know 25 sight words, and understand the meaning of what you read.',
    goalHi: '3 अक्षर वाले शब्द पढ़ना, 25 ज़रूरी शब्द पहचानना, और जो पढ़ो उसका मतलब समझना।',
    units: [
      U('L2-cvc', 'Sounding out words', 'शब्दों को जोड़कर पढ़ना', '🧩', [
        L(2, 'cvc-a', 'Short a: cap, bag, van', 'छोटा a', '🧢', 'phonics', w('cap', 'bag', 'van', 'man', 'cat')),
        L(2, 'cvc-i', 'Short i: pig, pin, six', 'छोटा i', '🐖', 'phonics', w('pig', 'pin', 'six', 'bin', 'sit')),
        L(2, 'cvc-o', 'Short o: dog, box, fox', 'छोटा o', '🦊', 'phonics', w('dog', 'box', 'fox', 'pot', 'hot')),
        L(2, 'cvc-e', 'Short e: hen, bed, pen', 'छोटा e', '🐔', 'phonics', w('hen', 'bed', 'pen', 'red', 'ten', 'jet')),
        L(2, 'cvc-u', 'Short u: mug, tub, sun', 'छोटा u', '☕', 'phonics', w('mug', 'tub', 'sun', 'bus', 'nut')),
      ]),
      U('L2-sight', 'Words to know by sight', 'देखकर पहचानने वाले शब्द', '👁️', [
        L(2, 'sight1', 'I, a, the, is, it', 'I, a, the, is, it', '👁️', 'sight', g('I', 'a', 'the', 'is', 'it')),
        L(2, 'sight2', 'my, you, we, he, she', 'my, you, we, he, she', '👫', 'sight', g('my', 'you', 'we', 'he', 'she')),
        L(2, 'sight3', 'can, see, go, to, and', 'can, see, go, to, and', '👀', 'sight', g('can', 'see', 'go', 'to', 'and')),
      ]),
      U('L2-meaning', 'Words with meaning', 'मतलब वाले शब्द', '💡', [
        L(2, 'actions', 'Action words', 'काम वाले शब्द', '🏃', 'vocab', w('run', 'walk', 'eat', 'drink', 'sleep', 'read')),
        L(2, 'describe', 'Describing words', 'बताने वाले शब्द', '🐘', 'vocab', w('big', 'small', 'hot', 'cold', 'happy', 'sad')),
        L(2, 'places', 'Places', 'जगहें', '🏫', 'vocab', w('school', 'shop', 'market', 'hospital', 'park', 'road')),
        L(2, 'people', 'People and jobs', 'लोग और काम', '🧑‍🏫', 'vocab', w('teacher', 'doctor', 'farmer', 'police', 'friend')),
        L(2, 'phrases', 'Polite words', 'अच्छे शब्द', '🙏', 'vocab', w('hello', 'thank you', 'sorry', 'please', 'yes', 'no')),
      ]),
      U('L2-more', 'More everyday words', 'रोज़ के और शब्द', '🌳', [
        L(2, 'nature', 'Nature', 'प्रकृति', '🌳', 'vocab', w('tree', 'flower', 'rain', 'moon', 'star', 'morning')),
        L(2, 'transport', 'Getting around', 'आना-जाना', '🚌', 'vocab', w('bus', 'car', 'jeep', 'ship', 'station', 'money')),
        L(2, 'sight4', 'in, on, this, have, like', 'in, on, this, have, like', '📦', 'sight', g('in', 'on', 'this', 'have', 'like')),
        L(2, 'check', 'Level 2 Challenge', 'लेवल 2 चुनौती', '🏆', 'checkpoint', []),
      ]),
    ],
  },
  {
    n: 3,
    key: 'potential',
    name: 'Potential',
    nameHi: 'संभावना',
    stage: 'Sentences and simple talk',
    stageHi: 'वाक्य और आसान बातचीत',
    emoji: '🌳',
    color: '#A78BFA',
    goal: 'Read and build simple sentences, ask and answer everyday questions.',
    goalHi: 'आसान वाक्य पढ़ना और बनाना, रोज़ के सवाल पूछना और जवाब देना।',
    units: [
      U('L3-this', 'This is...', 'यह है...', '👉', [
        L(3, 'this', 'This is a...', 'यह एक... है', '👉', 'sentences', s('this-cat', 'this-bag', 'this-pen', 'it-big', 'it-red')),
        L(3, 'have', 'I have... I can...', 'मेरे पास... मैं कर सकता हूँ...', '🙋', 'sentences', s('have-phone', 'have-book', 'have-two', 'can-run', 'can-swim')),
        L(3, 'talk1', 'Hello! Who are you?', 'नमस्ते! तुम कौन हो?', '👋', 'talk', d('name', 'how', 'age')),
      ]),
      U('L3-feel', 'People and feelings', 'लोग और भावनाएँ', '😊', [
        L(3, 'feel', 'I am happy', 'मैं खुश हूँ', '😊', 'sentences', s('am-happy', 'she-sad', 'he-tall', 'she-doctor', 'he-farmer')),
        L(3, 'like', 'I like...', 'मुझे पसंद है...', '😋', 'sentences', s('like-mango', 'like-tea', 'like-play', 'can-cook')),
        L(3, 'talk2', 'Talking about me', 'अपने बारे में बात', '🏠', 'talk', d('live', 'like-eat', 'what-this')),
      ]),
      U('L3-where', 'Where is it?', 'कहाँ है?', '📦', [
        L(3, 'where', 'In, on, under', 'में, पर, नीचे', '📦', 'sentences', s('cat-box', 'cup-table', 'dog-under', 'ball-bag', 'bird-tree')),
        L(3, 'sounds', 'sh, ch, th sounds', 'sh, ch, th आवाज़ें', '🚢', 'vocab', w('ship', 'shop', 'shoe', 'chair', 'cheese', 'chick', 'three', 'thumb')),
        L(3, 'sound-sent', 'Read sh, ch, th sentences', 'sh, ch, th वाले वाक्य', '🐤', 'sentences', s('ship-sea', 'fish-shop', 'chick-chair', 'three-thumbs')),
      ]),
      U('L3-day', 'My day', 'मेरा दिन', '🌅', [
        L(3, 'day', 'Every day', 'हर दिन', '⏰', 'sentences', s('wake-up', 'wash-hands', 'eat-rice', 'drink-water', 'sleep-night')),
        L(3, 'out', 'Going out', 'बाहर जाना', '🚶', 'sentences', s('go-school', 'go-market', 'bus-late', 'it-rain')),
        L(3, 'talk3', 'At the shop', 'दुकान पर', '🏪', 'talk', d('how-much', 'want', 'colour')),
        L(3, 'check', 'Level 3 Challenge', 'लेवल 3 चुनौती', '🏆', 'checkpoint', []),
      ]),
    ],
  },
  {
    n: 4,
    key: 'high',
    name: 'High potential',
    nameHi: 'उच्च संभावना',
    stage: 'Stories, writing and conversation',
    stageHi: 'कहानी, लिखना और बातचीत',
    emoji: '🌟',
    color: '#FFC857',
    goal: 'Read short stories with understanding, write your own sentences, and hold simple conversations.',
    goalHi: 'छोटी कहानियाँ समझकर पढ़ना, अपने वाक्य लिखना, और आसान बातचीत करना।',
    units: [
      U('L4-home', 'Home and family', 'घर और परिवार', '👪', [
        L(4, 'story-family', 'Story: My Family', 'कहानी: मेरा परिवार', '👪', 'story', ['p:family']),
        L(4, 'story-day', 'Story: My Day', 'कहानी: मेरा दिन', '🌅', 'story', ['p:day']),
        L(4, 'talk-time', 'Asking for help', 'मदद माँगना', '🤝', 'talk', d('time', 'help', 'where-bus')),
      ]),
      U('L4-out', 'Out and about', 'बाहर की दुनिया', '🛒', [
        L(4, 'story-market', 'Story: At the Market', 'कहानी: बाज़ार में', '🛒', 'story', ['p:market']),
        L(4, 'story-bus', 'Story: The Late Bus', 'कहानी: देर से आई बस', '🚌', 'story', ['p:bus']),
        L(4, 'talk-shop', 'Buying things', 'चीज़ें खरीदना', '💰', 'talk', d('how-much', 'want', 'phone-who')),
      ]),
      U('L4-life', 'Life skills', 'ज़िंदगी के काम', '🏥', [
        L(4, 'story-rain', 'Story: A Rainy Day', 'कहानी: बारिश का दिन', '🌧️', 'story', ['p:rain']),
        L(4, 'story-doctor', 'Story: At the Doctor', 'कहानी: डॉक्टर के पास', '🏥', 'story', ['p:doctor']),
        L(4, 'talk-feel', 'Talking about health', 'सेहत की बात', '🤒', 'talk', d('feel', 'help', 'how')),
        L(4, 'check', 'Final Challenge', 'आख़िरी चुनौती', '🏆', 'checkpoint', []),
      ]),
    ],
  },
];

export const ALL_LESSONS: Lesson[] = LEVELS.flatMap((lv) => lv.units.flatMap((u) => u.lessons));
export const LESSON_MAP: Record<string, Lesson> = Object.fromEntries(ALL_LESSONS.map((x) => [x.id, x]));
export const levelLessons = (n: number) => ALL_LESSONS.filter((x) => x.level === n);
export const LESSON_COUNT = order;
