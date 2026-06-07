import { RoomData, ScriptNode } from './types'

// ---------------------------------------------------------------------------
// Shared villain roster (same 5 names across all rooms)
// ---------------------------------------------------------------------------
const mkVillains = (startingStack: number) => [
  { position: 'UTG' as const, name: 'Marcus', startingStack, avatar: 'M' },
  { position: 'LJ'  as const, name: 'Chen',   startingStack, avatar: 'C' },
  { position: 'HJ'  as const, name: 'Sofia',  startingStack, avatar: 'S' },
  { position: 'BTN' as const, name: 'Viktor', startingStack, avatar: 'V' },
  { position: 'SB'  as const, name: 'Danny',  startingStack, avatar: 'D' },
]

// ---------------------------------------------------------------------------
// Build a "villain bets → hero call/raise/fold" block (for check-then-villain-bets).
// betPercent: villain bets X% of current pot.
// raisePercent: hero's check-raise total = Y% of pot (always offered — check-raise available).
// Labels use {x} placeholder resolved at execution time.
// ---------------------------------------------------------------------------
function villainBetBlock(betPercent: number, raisePercent: number): ScriptNode[] {
  return [
    {
      kind: 'action' as const,
      position: 'BTN' as const,
      action: 'bet' as const,
      potPercent: betPercent,
      label: `Viktor bets {x}`,
    },
    {
      kind: 'decision' as const,
      options: [
        {
          action: 'call' as const,
          callCurrent: true,
          label: 'Call {x}',
          next: [],
        },
        {
          action: 'raise' as const,
          potPercent: raisePercent,
          label: `Raise to {x}`,
          next: [
            {
              kind: 'action' as const,
              position: 'BTN' as const,
              action: 'call' as const,
              callCurrent: true,
              label: `Viktor calls {x}`,
            },
          ],
        },
        {
          action: 'fold' as const,
          isFold: true,
          label: 'Fold',
          next: [],
        },
      ],
    },
  ]
}

// ===========================================================================
// ABOUT — Q♥ 4♥ vs K♦ K♣ | Board: A♥ K♥ 6♠ 5♦ 2♥
// Backdoor flush draw hits the river. Hero flushes out Viktor's trips.
// ===========================================================================
const aboutScript: RoomData['handScript'] = {
  preflop: [
    { kind: 'action', position: 'UTG', action: 'fold', label: 'UTG folds' },
    { kind: 'action', position: 'LJ',  action: 'fold', label: 'LJ folds' },
    { kind: 'action', position: 'HJ',  action: 'fold', label: 'HJ folds' },
    { kind: 'action', position: 'BTN', action: 'raise', amount: 6, label: 'Viktor raises to $6' },
    { kind: 'action', position: 'SB',  action: 'fold', label: 'Danny folds' },
    {
      kind: 'decision',
      options: [
        {
          action: 'call', amount: 4, label: 'Call $4',
          next: [],
        },
        {
          action: 'raise', amount: 16, label: 'Raise to $18',
          next: [
            { kind: 'action', position: 'BTN', action: 'call', amount: 12, label: 'Viktor calls' },
          ],
        },
        { action: 'fold', label: 'Fold', isFold: true, next: [] },
      ],
    },
  ],
  flop: [
    {
      kind: 'decision',
      options: [
        {
          action: 'check', label: 'Check',
          next: villainBetBlock(65, 200),
        },
        {
          action: 'bet', potPercent: 65, label: 'Bet {x}',
          next: [{ kind: 'action', position: 'BTN', action: 'call', callCurrent: true, label: 'Viktor calls' }],
        },
        { action: 'fold', label: 'Fold', isFold: true, next: [] },
      ],
    },
  ],
  turn: [
    {
      kind: 'decision',
      options: [
        {
          action: 'check', label: 'Check',
          next: villainBetBlock(65, 200),
        },
        {
          action: 'bet', potPercent: 65, label: 'Bet {x}',
          next: [{ kind: 'action', position: 'BTN', action: 'call', callCurrent: true, label: 'Viktor calls' }],
        },
        { action: 'fold', label: 'Fold', isFold: true, next: [] },
      ],
    },
  ],
  river: [
    {
      kind: 'decision',
      options: [
        {
          action: 'bet', potPercent: 75, label: 'Bet {x}',
          next: [{ kind: 'action', position: 'BTN', action: 'call', callCurrent: true, label: 'Viktor calls' }],
        },
        {
          action: 'check', label: 'Check',
          next: [{ kind: 'action', position: 'BTN', action: 'check', label: 'Viktor checks' }],
        },
        { action: 'fold', label: 'Fold', isFold: true, next: [] },
      ],
    },
  ],
  showdown: {
    heroWins: true,
    description: 'Q♥4♥ flush beats K♦K♣ three-of-a-kind',
  },
}

// ===========================================================================
// EXPERIENCE — A♠ K♠ vs 9♦ 9♥ | Board: A♥ 9♠ 2♦ A♦ K♣
// Hero flops top pair, turn pairs the ace (two pair), river kings up = full house
// ===========================================================================
const experienceScript: RoomData['handScript'] = {
  preflop: [
    { kind: 'action', position: 'UTG', action: 'fold', label: 'UTG folds' },
    { kind: 'action', position: 'LJ',  action: 'fold', label: 'LJ folds' },
    { kind: 'action', position: 'HJ',  action: 'fold', label: 'HJ folds' },
    { kind: 'action', position: 'BTN', action: 'raise', amount: 6, label: 'Viktor raises to $6' },
    { kind: 'action', position: 'SB',  action: 'fold', label: 'Danny folds' },
    {
      kind: 'decision',
      options: [
        {
          action: 'raise', amount: 18, label: 'Raise to $20',
          next: [
            { kind: 'action', position: 'BTN', action: 'call', amount: 14, label: 'Viktor calls' },
          ],
        },
        {
          action: 'call', amount: 4, label: 'Call $4',
          next: [],
        },
        { action: 'fold', label: 'Fold', isFold: true, next: [] },
      ],
    },
  ],
  flop: [
    {
      kind: 'decision',
      options: [
        {
          action: 'bet', potPercent: 65, label: 'Bet {x}',
          next: [{ kind: 'action', position: 'BTN', action: 'call', callCurrent: true, label: 'Viktor calls' }],
        },
        {
          action: 'check', label: 'Check',
          next: villainBetBlock(65, 200),
        },
        { action: 'fold', label: 'Fold', isFold: true, next: [] },
      ],
    },
  ],
  turn: [
    {
      kind: 'decision',
      options: [
        {
          action: 'bet', potPercent: 65, label: 'Bet {x}',
          next: [{ kind: 'action', position: 'BTN', action: 'call', callCurrent: true, label: 'Viktor calls' }],
        },
        {
          action: 'check', label: 'Check',
          next: villainBetBlock(65, 200),
        },
        { action: 'fold', label: 'Fold', isFold: true, next: [] },
      ],
    },
  ],
  river: [
    {
      kind: 'decision',
      options: [
        {
          action: 'bet', potPercent: 75, label: 'Bet {x}',
          next: [{ kind: 'action', position: 'BTN', action: 'call', callCurrent: true, label: 'Viktor calls' }],
        },
        {
          action: 'check', label: 'Check',
          next: villainBetBlock(75, 250),
        },
        { action: 'fold', label: 'Fold', isFold: true, next: [] },
      ],
    },
  ],
  showdown: {
    heroWins: true,
    description: 'A♠K♠ full house (aces full of kings) beats 9♦9♥ full house (nines full of aces)',
  },
}

// ===========================================================================
// PROJECTS — A♥ A♦ vs 5♠ 6♠ | Board: A♠ 3♠ 4♦ 2♣ 2♦
// Hero flops trips, villain flops straight draw. Hero makes full house; villain's straight loses.
// ===========================================================================
const projectsScript: RoomData['handScript'] = {
  preflop: [
    { kind: 'action', position: 'UTG', action: 'fold', label: 'UTG folds' },
    { kind: 'action', position: 'LJ',  action: 'fold', label: 'LJ folds' },
    { kind: 'action', position: 'HJ',  action: 'fold', label: 'HJ folds' },
    { kind: 'action', position: 'BTN', action: 'raise', amount: 6, label: 'Viktor raises to $6' },
    { kind: 'action', position: 'SB',  action: 'fold', label: 'Danny folds' },
    {
      kind: 'decision',
      options: [
        {
          action: 'raise', amount: 18, label: 'Raise to $20',
          next: [
            { kind: 'action', position: 'BTN', action: 'call', amount: 14, label: 'Viktor calls' },
          ],
        },
        {
          action: 'call', amount: 4, label: 'Call $4',
          next: [],
        },
        { action: 'fold', label: 'Fold', isFold: true, next: [] },
      ],
    },
  ],
  flop: [
    {
      kind: 'decision',
      options: [
        {
          action: 'check', label: 'Check',
          next: villainBetBlock(65, 200),
        },
        {
          action: 'bet', potPercent: 65, label: 'Bet {x}',
          next: [{ kind: 'action', position: 'BTN', action: 'call', callCurrent: true, label: 'Viktor calls' }],
        },
        { action: 'fold', label: 'Fold', isFold: true, next: [] },
      ],
    },
  ],
  turn: [
    {
      kind: 'decision',
      options: [
        {
          action: 'check', label: 'Check',
          next: [
            { kind: 'action', position: 'BTN', action: 'bet', potPercent: 65, label: 'Viktor bets {x}' },
            {
              kind: 'decision',
              options: [
                {
                  action: 'raise', potPercent: 220, label: 'Raise to {x}',
                  next: [{ kind: 'action', position: 'BTN', action: 'call', callCurrent: true, label: 'Viktor calls {x}' }],
                },
                { action: 'call', callCurrent: true, label: 'Call {x}', next: [] },
                { action: 'fold', label: 'Fold', isFold: true, next: [] },
              ],
            },
          ],
        },
        {
          action: 'bet', potPercent: 65, label: 'Bet {x}',
          next: [{ kind: 'action', position: 'BTN', action: 'call', callCurrent: true, label: 'Viktor calls' }],
        },
        { action: 'fold', label: 'Fold', isFold: true, next: [] },
      ],
    },
  ],
  river: [
    {
      kind: 'decision',
      options: [
        {
          action: 'bet', potPercent: 100, label: 'Bet {x}',
          next: [{ kind: 'action', position: 'BTN', action: 'call', callCurrent: true, label: 'Viktor calls' }],
        },
        {
          action: 'check', label: 'Check',
          next: villainBetBlock(75, 250),
        },
        { action: 'fold', label: 'Fold', isFold: true, next: [] },
      ],
    },
  ],
  showdown: {
    heroWins: true,
    description: 'A♥A♦ full house (aces full of twos) beats 5♠6♠ straight',
  },
}

// ===========================================================================
// AWARDS — J♣ 10♣ vs A♥ A♦ | Board: A♠ K♣ Q♦ Q♣ A♣
// Viktor flops top set, hero has Broadway draw. River completes the ROYAL FLUSH.
// ===========================================================================
const awardsScript: RoomData['handScript'] = {
  preflop: [
    { kind: 'action', position: 'UTG', action: 'fold', label: 'UTG folds' },
    { kind: 'action', position: 'LJ',  action: 'fold', label: 'LJ folds' },
    { kind: 'action', position: 'HJ',  action: 'fold', label: 'HJ folds' },
    { kind: 'action', position: 'BTN', action: 'raise', amount: 6, label: 'Viktor raises to $6' },
    { kind: 'action', position: 'SB',  action: 'fold', label: 'Danny folds' },
    {
      kind: 'decision',
      options: [
        {
          action: 'call', amount: 4, label: 'Call $4',
          next: [],
        },
        {
          action: 'raise', amount: 16, label: 'Raise to $18',
          next: [
            { kind: 'action', position: 'BTN', action: 'call', amount: 12, label: 'Viktor calls' },
          ],
        },
        { action: 'fold', label: 'Fold', isFold: true, next: [] },
      ],
    },
  ],
  flop: [
    {
      kind: 'decision',
      options: [
        {
          action: 'check', label: 'Check',
          next: villainBetBlock(65, 200),
        },
        {
          // Hero bets, Viktor raises big (he has top set), hero can call or fold
          action: 'bet', potPercent: 65, label: 'Bet {x}',
          next: [
            { kind: 'action', position: 'BTN', action: 'raise', potPercent: 220, label: 'Viktor raises to {x}' },
            {
              kind: 'decision',
              options: [
                { action: 'call', callCurrent: true, label: 'Call {x}', next: [] },
                {
                  action: 'raise', potPercent: 380, label: 'Shove {x}',
                  next: [{ kind: 'action', position: 'BTN', action: 'call', callCurrent: true, label: 'Viktor calls — all in!' }],
                },
                { action: 'fold', label: 'Fold', isFold: true, next: [] },
              ],
            },
          ],
        },
        { action: 'fold', label: 'Fold', isFold: true, next: [] },
      ],
    },
  ],
  turn: [
    {
      kind: 'decision',
      options: [
        {
          action: 'check', label: 'Check',
          next: villainBetBlock(65, 200),
        },
        {
          action: 'bet', potPercent: 65, label: 'Bet {x}',
          next: [{ kind: 'action', position: 'BTN', action: 'call', callCurrent: true, label: 'Viktor calls' }],
        },
        { action: 'fold', label: 'Fold', isFold: true, next: [] },
      ],
    },
  ],
  river: [
    {
      kind: 'decision',
      options: [
        {
          action: 'check', label: 'Check',
          next: [
            { kind: 'action', position: 'BTN', action: 'bet', potPercent: 65, label: 'Viktor bets {x}' },
            {
              kind: 'decision',
              options: [
                {
                  action: 'raise', potPercent: 300, label: 'Raise to {x}',
                  next: [{ kind: 'action', position: 'BTN', action: 'call', callCurrent: true, label: 'Viktor calls — all in!' }],
                },
                { action: 'call', callCurrent: true, label: 'Call {x}', next: [] },
                { action: 'fold', label: 'Fold', isFold: true, next: [] },
              ],
            },
          ],
        },
        {
          action: 'bet', potPercent: 65, label: 'Bet {x}',
          next: [
            { kind: 'action', position: 'BTN', action: 'raise', potPercent: 220, label: 'Viktor raises to {x}' },
            {
              kind: 'decision',
              options: [
                {
                  action: 'raise', potPercent: 400, label: 'Shove {x}',
                  next: [{ kind: 'action', position: 'BTN', action: 'call', callCurrent: true, label: 'Viktor calls — all in!' }],
                },
                { action: 'call', callCurrent: true, label: 'Call {x}', next: [] },
                { action: 'fold', label: 'Fold', isFold: true, next: [] },
              ],
            },
          ],
        },
        { action: 'fold', label: 'Fold', isFold: true, next: [] },
      ],
    },
  ],
  showdown: {
    heroWins: true,
    description: 'J♣10♣ ROYAL FLUSH beats A♥A♦ four aces',
  },
}

// ===========================================================================
// ROOM DATA
// ===========================================================================
export const ROOMS: RoomData[] = [
  {
    id: 'about',
    name: 'About Me',
    suit: '♥',
    holeCards: [
      { rank: 'Q', suit: '♥' },
      { rank: '4', suit: '♥' },
    ],
    villains: mkVillains(200),
    mainVillainPosition: 'BTN',
    villainHoleCards: [
      { rank: 'K', suit: '♦' },
      { rank: 'K', suit: '♣' },
    ],
    heroStartingStack: 200,
    bigBlind: 2,
    smallBlind: 1,
    handScript: aboutScript,
    communityCards: [
      {
        id: 'about-background',
        rank: 'A',
        suit: '♥',
        frontHeadline: 'Background',
        frontSubtext: 'Who I am',
        back: {
          title: 'Background',
          bullets: [
            'Eric Song',
            'University of Illinois Urbana-Champaign',
            'B.S. Computer Science · 4.0 GPA',
            'Champaign-Urbana, Illinois',
          ],
        },
      },
      {
        id: 'about-contacts',
        rank: 'K',
        suit: '♥',
        frontHeadline: 'Contacts',
        frontSubtext: 'Get in touch',
        back: {
          title: 'Contacts',
          links: [
            { label: 'ericyousong@gmail.com', href: 'mailto:ericyousong@gmail.com' },
            { label: 'LinkedIn', href: 'https://www.linkedin.com/in/eric-song-0b6980274' },
            { label: 'GitHub', href: 'https://github.com/EricSong03' },
            { label: '217-607-3020', href: 'tel:2176073020' },
          ],
        },
      },
      {
        id: 'about-tech-interests',
        rank: '6',
        suit: '♠',
        frontHeadline: 'Technical Interests',
        frontSubtext: 'What I build',
        back: {
          title: 'Technical Interests',
          bullets: [
            'AI / Machine Learning systems',
            'Full-stack product engineering',
            'Systems programming',
            'IoT & network security',
          ],
        },
      },
      {
        id: 'about-extracurriculars',
        rank: '5',
        suit: '♦',
        frontHeadline: 'Outside the Lab',
        frontSubtext: 'When not coding',
        back: {
          title: 'Outside the Lab',
          bullets: ['Basketball', 'Volleyball', 'Poker — competitive play, GTO strategy'],
        },
      },
      {
        id: 'about-gtoillini',
        rank: '2',
        suit: '♥',
        frontHeadline: 'GTOIllini',
        frontSubtext: 'Executive Secretary',
        back: {
          title: 'GTOIllini · Executive Secretary',
          bullets: [
            "UIUC's GTO poker club",
            'Tiered sponsorship packages: Joker / Ace / King / Queen',
            'Targeting quant finance firms in Chicago',
            'Club ops, communications, event coordination',
          ],
        },
      },
    ],
  },
  {
    id: 'experience',
    name: 'Experience',
    suit: '♠',
    holeCards: [
      { rank: 'A', suit: '♠' },
      { rank: 'K', suit: '♠' },
    ],
    villains: mkVillains(200),
    mainVillainPosition: 'BTN',
    villainHoleCards: [
      { rank: '9', suit: '♦' },
      { rank: '9', suit: '♥' },
    ],
    heroStartingStack: 200,
    bigBlind: 2,
    smallBlind: 1,
    handScript: experienceScript,
    communityCards: [
      {
        id: 'exp-comet',
        rank: 'A',
        suit: '♥',
        frontHeadline: 'Comet',
        frontSubtext: 'Current',
        back: {
          title: 'Comet',
          bullets: ['Description coming soon.'],
        },
      },
      {
        id: 'exp-calltocase',
        rank: '9',
        suit: '♠',
        frontHeadline: 'CallToCase',
        frontSubtext: 'Current',
        back: {
          title: 'CallToCase',
          bullets: ['Description coming soon.'],
        },
      },
      {
        id: 'exp-uiuc-research',
        rank: '2',
        suit: '♦',
        frontHeadline: 'UIUC Research',
        frontSubtext: 'Current',
        back: {
          title: 'UIUC Research',
          bullets: ['Description coming soon.'],
        },
      },
      {
        id: 'exp-nokia',
        rank: 'A',
        suit: '♦',
        frontHeadline: 'Nokia',
        frontSubtext: 'Software Engineer Intern · Summer 2024',
        back: {
          title: 'Nokia · Software Engineer Intern',
          bullets: [
            '11% improvement in 5G anomaly detection accuracy',
            'Implemented Isolation Forest and RNN algorithms',
            'Reduced Cloud Mobile Gateway downtime by 100 hrs/month',
            'Designed data sorting algorithms for internal engineering teams',
          ],
          tags: ['Python', '5G', 'Machine Learning', 'RNN', 'Ottawa'],
        },
      },
      {
        id: 'exp-guelph',
        rank: 'K',
        suit: '♣',
        frontHeadline: 'University of Guelph',
        frontSubtext: 'IoT Researcher · Summer 2024',
        back: {
          title: 'University of Guelph · IoT Researcher',
          bullets: [
            '24+ Zigbee/IP devices across 2 networks',
            '50+ days of network traffic data collected',
            'Published IEEE Dataport dataset',
            '2,500+ online views · 400+ downloads',
          ],
          tags: ['IoT', 'Wireshark', 'Killerbee', 'ApiMote v4', 'Zigbee'],
        },
      },
    ],
  },
  {
    id: 'projects',
    name: 'Projects & Skills',
    suit: '♦',
    holeCards: [
      { rank: 'A', suit: '♥' },
      { rank: 'A', suit: '♦' },
    ],
    villains: mkVillains(200),
    mainVillainPosition: 'BTN',
    villainHoleCards: [
      { rank: '5', suit: '♠' },
      { rank: '6', suit: '♠' },
    ],
    heroStartingStack: 200,
    bigBlind: 2,
    smallBlind: 1,
    handScript: projectsScript,
    communityCards: [
      {
        id: 'proj-poker',
        rank: 'A',
        suit: '♠',
        frontHeadline: 'Analytical Poker Platform',
        frontSubtext: 'Active · April 2026–Present',
        back: {
          title: 'Analytical Poker Platform',
          bullets: [
            'Real-time multiplayer poker gameplay',
            'GTO leak detection: VPIP, PFR, aggression factor',
            'Compares decisions against Game Theory Optimal play',
            'Integrated solver for hands-on strategy study',
          ],
          tags: ['Python', 'TypeScript', 'FastAPI', 'React', 'Redis', 'Vite'],
        },
      },
      {
        id: 'proj-cheetcode',
        rank: '3',
        suit: '♠',
        frontHeadline: 'CheetCode',
        frontSubtext: 'Shipped · Jan–Feb 2026',
        back: {
          title: 'CheetCode — AI Interview Trainer',
          bullets: [
            'Real-time AI hints via multi-agent interviewer',
            'Browser speech-to-text transcription live',
            'Safe code execution in Docker via Piston API',
            'Full telemetry: tokens, latency, model, cost',
          ],
          tags: ['Python', 'React', 'Flask', 'Keywords AI', 'Piston API'],
        },
      },
      {
        id: 'skills-frameworks',
        rank: '4',
        suit: '♦',
        frontHeadline: 'Frameworks',
        frontSubtext: 'What I build with',
        back: {
          title: 'Frameworks',
          tags: ['React', 'Node.js', 'Django', 'Flask', 'FastAPI'],
        },
      },
      {
        id: 'skills-languages',
        rank: '2',
        suit: '♣',
        frontHeadline: 'Languages',
        frontSubtext: 'How I write code',
        back: {
          title: 'Languages',
          tags: ['Python', 'C++', 'TypeScript', 'JavaScript', 'SQL', 'Java', 'HTML/CSS'],
        },
      },
      {
        id: 'skills-libraries',
        rank: '2',
        suit: '♦',
        frontHeadline: 'Libraries & ML',
        frontSubtext: 'The stack underneath',
        back: {
          title: 'Libraries & ML',
          tags: ['pandas', 'NumPy', 'Matplotlib', 'ScikitLearn', 'TensorFlow', 'PyTorch', 'Redis', 'Vercel'],
        },
      },
    ],
  },
  {
    id: 'awards',
    name: 'Awards',
    suit: '♣',
    holeCards: [
      { rank: 'J', suit: '♣' },
      { rank: '10', suit: '♣' },
    ],
    villains: mkVillains(200),
    mainVillainPosition: 'BTN',
    villainHoleCards: [
      { rank: 'A', suit: '♥' },
      { rank: 'A', suit: '♦' },
    ],
    heroStartingStack: 200,
    bigBlind: 2,
    smallBlind: 1,
    handScript: awardsScript,
    communityCards: [
      {
        id: 'award-amc',
        rank: 'A',
        suit: '♠',
        frontHeadline: 'AMC 12B',
        frontSubtext: 'Top 5% Distinction',
        back: {
          title: 'AMC 12B — Distinction Award',
          bullets: ['Top 5% nationwide', 'American Mathematics Competition'],
        },
      },
      {
        id: 'award-aime',
        rank: 'K',
        suit: '♣',
        frontHeadline: 'AIME',
        frontSubtext: 'Qualified twice · Top 25%',
        back: {
          title: 'AIME — American Invitational Mathematics Examination',
          bullets: ['Qualified twice', 'Top 25% of qualifiers'],
        },
      },
      {
        id: 'award-euclid',
        rank: 'Q',
        suit: '♦',
        frontHeadline: 'UWaterloo Euclid',
        frontSubtext: 'Top 1% of 24,000',
        back: {
          title: 'UWaterloo Euclid Mathematics Contest',
          bullets: ['Top 1% of 24,000 students', 'Honor Roll'],
        },
      },
      {
        id: 'award-csmc',
        rank: 'Q',
        suit: '♣',
        frontHeadline: 'Canadian Senior Math',
        frontSubtext: 'Top 1% of 15,000',
        back: {
          title: 'Canadian Senior Mathematics Contest',
          bullets: ['Top 1% of 15,000 students', 'Honor Roll'],
        },
      },
      {
        id: 'award-ipa',
        rank: 'A',
        suit: '♣',
        frontHeadline: 'IPA Challengers Division',
        frontSubtext: '2nd Place',
        back: {
          title: 'Intercollegiate Poker Association — Challengers Division',
          bullets: ['2nd Place finish', 'Intercollegiate competitive poker'],
        },
      },
    ],
  },
]

export const ROOM_MAP: Record<string, RoomData> = Object.fromEntries(
  ROOMS.map((r) => [r.id, r])
)
