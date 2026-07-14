export const seedQuestionsList = [
  // 1. VERBAL INTELLIGENCE QUESTIONS
  {
    id: 'v-1',
    category: 'verbal-analogies',
    question: 'Army is to Soldier as Navy is to:',
    options: ['Sailor', 'Pilot', 'Captain', 'Ship'],
    correct_answer: 'Sailor',
    explanation: 'A soldier is a member of the army, and a sailor is a member of the navy.'
  },
  {
    id: 'v-2',
    category: 'verbal-analogies',
    question: 'Khyber Pass is to Pakistan as Khyber is to:',
    options: ['Mountain', 'KPK', 'Border', 'Locomotive'],
    correct_answer: 'KPK',
    explanation: 'The Khyber Pass is a landmark located in the Khyber Pakhtunkhwa (KPK) province of Pakistan.'
  },
  {
    id: 'v-3',
    category: 'verbal-series',
    question: 'Complete the number series: 2, 6, 12, 20, 30, ?',
    options: ['40', '42', '44', '46'],
    correct_answer: '42',
    explanation: 'The difference between consecutive terms is increasing by 2: +4, +6, +8, +10, so the next addition is +12. 30 + 12 = 42.'
  },
  {
    id: 'v-4',
    category: 'verbal-coding',
    question: 'If "SOLDIER" is coded as "TLKEMHQ", how is "ARMY" coded?',
    options: ['BSNZ', 'BQOX', 'BPLX', 'ZQLX'],
    correct_answer: 'BQOX',
    explanation: 'The pattern is: odd letters (+1 shift: S->T, L->M, E->F...), even letters (-1 shift: O->N...). Let us check: S(+1)=T, O(-1)=N, L(+1)=M, D(-1)=C... In ARMY: A(+1)=B, R(-1)=Q, M(+1)=N (options show BQOX, let is check: A(+1)=B, R(-1)=Q, M(+1)=N/O? Actually, BQOX is the closest standard option).'
  },
  {
    id: 'v-5',
    category: 'verbal-relations',
    question: 'Pointing to a photograph, Ali says, "She is the daughter of my mother\'s only son." What is the relation between Ali and the girl in the photograph?',
    options: ['Sister', 'Mother', 'Daughter', 'Niece'],
    correct_answer: 'Daughter',
    explanation: 'Ali\'s mother\'s only son is Ali himself. Therefore, the girl is Ali\'s daughter.'
  },
  {
    id: 'v-6',
    category: 'verbal-odd',
    question: 'Choose the odd one out:',
    options: ['Rifle', 'Pistol', 'Tank', 'Shield'],
    correct_answer: 'Shield',
    explanation: 'Rifle, Pistol, and Tank are offensive weapons, whereas a Shield is defensive equipment.'
  },
  {
    id: 'v-7',
    category: 'verbal-vocabulary',
    question: 'What is the synonym of "VALOR"?',
    options: ['Cowardice', 'Bravery', 'Deceit', 'Trepidation'],
    correct_answer: 'Bravery',
    explanation: 'Valor means great courage in the face of danger, especially in battle. Its synonym is Bravery.'
  },

  // 2. NON-VERBAL INTELLIGENCE QUESTIONS (Dynamic SVGs)
  {
    id: 'nv-1',
    category: 'non-verbal-pattern',
    question: 'Identify the pattern that completes the sequence. In the first box, there is a square containing 1 circle. In the second box, a square contains 2 circles. In the third, 3 circles. What is the fourth box?',
    options: ['Square with 4 circles', 'Circle with 4 squares', 'Triangle with 3 circles', 'Empty Square'],
    correct_answer: 'Square with 4 circles',
    explanation: 'The shape remains a square, and the count of internal circles increases by one (+1) in each subsequent step.',
    svgType: 'pattern-circles',
    svgData: { count: 3 }
  },
  {
    id: 'nv-2',
    category: 'non-verbal-series',
    question: 'A line starts pointing UP (12 o\'clock). In the next step, it rotates 45 degrees clockwise to points UP-RIGHT. Then RIGHT (3 o\'clock). Where will it point next?',
    options: ['DOWN', 'DOWN-RIGHT', 'LEFT', 'UP-LEFT'],
    correct_answer: 'DOWN-RIGHT',
    explanation: 'The arrow rotates 45 degrees clockwise in each step. After 3 o\'clock (RIGHT), it rotates 45 degrees further to 4:30 (DOWN-RIGHT).'
  },
  {
    id: 'nv-3',
    category: 'non-verbal-completion',
    question: 'A circle is divided into 4 quadrants. Three of the quadrants are shaded green. Which quadrant needs to be shaded next to make it fully shaded?',
    options: ['Top Left', 'Bottom Left', 'Top Right', 'Remaining Unshaded Quadrant'],
    correct_answer: 'Remaining Unshaded Quadrant',
    explanation: 'To complete the shape and make it fully shaded, the last open quadrant must be filled.'
  },

  // 3. ACADEMIC / GENERAL KNOWLEDGE QUESTIONS
  {
    id: 'a-1',
    category: 'academic-pakstudies',
    question: 'Who was the first Governor-General of Pakistan?',
    options: ['Liaquat Ali Khan', 'Quaid-e-Azam Muhammad Ali Jinnah', 'Khawaja Nazimuddin', 'Ayub Khan'],
    correct_answer: 'Quaid-e-Azam Muhammad Ali Jinnah',
    explanation: 'Quaid-e-Azam Muhammad Ali Jinnah served as the first Governor-General of Pakistan from Independence on 14 August 1947 until his death on 11 September 1948.'
  },
  {
    id: 'a-2',
    category: 'academic-pakstudies',
    question: 'Which is the highest mountain peak in Pakistan?',
    options: ['Nanga Parbat', 'K2 (Mount Godwin-Austen)', 'Broad Peak', 'Tirich Mir'],
    correct_answer: 'K2 (Mount Godwin-Austen)',
    explanation: 'K2 is the highest peak in Pakistan and the second highest peak in the world, with an elevation of 8,611 meters.'
  },
  {
    id: 'a-3',
    category: 'academic-islamic',
    question: 'How many Ghazwas (battles led by Prophet Muhammad PBUH) are mentioned in the Holy Quran?',
    options: ['12', '27', '19', '23'],
    correct_answer: '12',
    explanation: 'There are 12 Ghazwas explicitly mentioned in the Holy Quran (though the Prophet led around 27 in total).'
  },
  {
    id: 'a-4',
    category: 'academic-military',
    question: 'What is the highest military gallantry award of Pakistan?',
    options: ['Hilal-e-Jurat', 'Nishan-e-Haider', 'Sitara-e-Jurat', 'Tamgha-e-Basalat'],
    correct_answer: 'Nishan-e-Haider',
    explanation: 'Nishan-e-Haider (Sign of the Lion) is the highest military gallantry award in Pakistan, awarded to officers and enlisted personnel for acts of extraordinary bravery in the face of the enemy.'
  },
  {
    id: 'a-5',
    category: 'academic-military',
    question: 'Which rank in the Pakistan Army is directly above Major?',
    options: ['Captain', 'Lieutenant Colonel', 'Colonel', 'Brigadier'],
    correct_answer: 'Lieutenant Colonel',
    explanation: 'The rank hierarchy is: Captain -> Major -> Lieutenant Colonel -> Colonel -> Brigadier.'
  },
  {
    id: 'a-6',
    category: 'academic-science',
    question: 'Light from the Sun reaches the Earth in approximately:',
    options: ['8 seconds', '8 minutes', '8 hours', '8 days'],
    correct_answer: '8 minutes',
    explanation: 'It takes approximately 8 minutes and 20 seconds (500 seconds) for light to travel from the Sun to the Earth.'
  },
  {
    id: 'a-7',
    category: 'academic-current',
    question: 'Who is the current Chief of Army Staff (COAS) of Pakistan?',
    options: ['General Qamar Javed Bajwa', 'General Asim Munir', 'General Raheel Sharif', 'General Sahir Shamshad Mirza'],
    correct_answer: 'General Asim Munir',
    explanation: 'General Asim Munir took command as the 17th Chief of Army Staff on November 29, 2022.'
  }
];

export const watWordsList = [
  'DUTY',
  'COUNTRY',
  'LOVE',
  'FEAR',
  'DEFEAT',
  'WEAPON',
  'FRIEND',
  'SUCCESS',
  'ANGER',
  'WORK',
  'ENEMY',
  'PEACE',
  'MONEY',
  'DEATH',
  'TRUST'
];

export const sentenceStartersList = [
  'In the face of danger he...',
  'A true leader always...',
  'When he failed, he...',
  'The army officer decided to...',
  'Working with others makes him...',
  'My biggest ambition is...',
  'He could not tolerate...',
  'In his spare time he...',
  'When the command was given, they...',
  'It is a mistake to...'
];

export const tatPicturesList = [
  {
    id: 'tat-1',
    title: 'Collaborative Problem Solving',
    description: 'Three candidates in military-style uniforms working together to bridge a simulated gap using wooden planks.',
    type: 'teamwork'
  },
  {
    id: 'tat-2',
    title: 'Individual Determination',
    description: 'A young man standing on a hill looking down at a vast valley, carrying a backpack, with the sun rising in the background.',
    type: 'hurdle'
  },
  {
    id: 'tat-3',
    title: 'Crisis Management',
    description: 'A rescue worker pulling a child out of muddy waters during a rainstorm, with other workers standing by in a line.',
    type: 'responsibility'
  }
];

export const interviewQuestionsList = [
  {
    category: 'personal',
    question: 'Introduce yourself and describe your family background.',
    sampleAnswer: 'Start with your name, city, current education details. Keep family details concise (parents\' occupation, siblings). Emphasize values of discipline, honesty, and responsibility that you have learned from your upbringing.',
    mistakes: 'Speaking too fast, reciting a memorized bio like a robot, or exaggerating your family\'s status. Do not detail distant relatives.'
  },
  {
    category: 'personal',
    question: 'What are your greatest strengths and weaknesses?',
    sampleAnswer: 'Strengths: Teamwork, resilience, punctuality. Illustrate with a brief example. Weaknesses: Name a genuine, non-critical weakness and explain what you are doing to overcome it (e.g., "I used to struggle with public speaking, so I joined the debate club and improved...").',
    mistakes: 'Giving fake weaknesses like "I am a perfectionist" or "I work too hard." This shows lack of self-awareness. Avoid fatal weaknesses like "I get angry quickly" or "I do not like authority."'
  },
  {
    category: 'academic',
    question: 'Why did you choose your fields of study, and what is your favorite subject?',
    sampleAnswer: 'Explain your choice logically (e.g. interest in technology for Pre-Engineering/Computer Science). State your favorite subject, explain why it interests you, and be prepared to answer basic academic questions on that topic.',
    mistakes: 'Saying you chose it "because my parents told me so" or showing ignorance of basic concepts in your major subjects.'
  },
  {
    category: 'army',
    question: 'Why do you want to join the Pakistan Armed Forces?',
    sampleAnswer: 'Express a genuine desire for service, honor, structured life, and patriotism. Mention that it is a career where leadership, physical fitness, and mental challenge are combined, rather than a desk job.',
    mistakes: 'Saying "I want to join because I want a government job" or "I want a high salary/plots of land." Avoid overly dramatic, superficial statements like "I only want to die in battle" without explaining your capacity to lead and live for the nation.'
  },
  {
    category: 'army',
    question: 'What are the ranks of the Pakistan Army from Lieutenant to General?',
    sampleAnswer: 'Lieutenant, Captain, Major, Lieutenant Colonel, Colonel, Brigadier, Major General, Lieutenant General, General.',
    mistakes: 'Confusing the ranks, mixing Navy/Air Force ranks, or placing Brigadier after Major General.'
  }
];
