import { RoomData } from './types'

export const ROOMS: RoomData[] = [
  {
    id: 'about',
    name: 'About Me',
    suit: '♥',
    holeCards: [
      { rank: 'Q', suit: '♥' },
      { rank: '4', suit: '♥' },
    ],
    communityCards: [
      {
        id: 'about-background',
        rank: '2',
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
        rank: '3',
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
        rank: '4',
        suit: '♥',
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
        suit: '♥',
        frontHeadline: 'Outside the Lab',
        frontSubtext: 'When not coding',
        back: {
          title: 'Outside the Lab',
          bullets: ['Basketball', 'Volleyball', 'Poker — competitive play, GTO strategy'],
        },
      },
      {
        id: 'about-gtoillini',
        rank: '6',
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
    communityCards: [
      {
        id: 'exp-comet',
        rank: '2',
        suit: '♠',
        frontHeadline: 'Comet',
        frontSubtext: 'Current',
        back: {
          title: 'Comet',
          bullets: ['Description coming soon.'],
        },
      },
      {
        id: 'exp-calltocase',
        rank: '3',
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
        rank: '4',
        suit: '♠',
        frontHeadline: 'UIUC Research',
        frontSubtext: 'Current',
        back: {
          title: 'UIUC Research',
          bullets: ['Description coming soon.'],
        },
      },
      {
        id: 'exp-nokia',
        rank: '5',
        suit: '♠',
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
        rank: '6',
        suit: '♠',
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
    communityCards: [
      {
        id: 'proj-poker',
        rank: '2',
        suit: '♦',
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
        suit: '♦',
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
        rank: '5',
        suit: '♦',
        frontHeadline: 'Languages',
        frontSubtext: 'How I write code',
        back: {
          title: 'Languages',
          tags: ['Python', 'C++', 'TypeScript', 'JavaScript', 'SQL', 'Java', 'HTML/CSS'],
        },
      },
      {
        id: 'skills-libraries',
        rank: '6',
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
    communityCards: [
      {
        id: 'award-amc',
        rank: '2',
        suit: '♣',
        frontHeadline: 'AMC 12B',
        frontSubtext: 'Top 5% Distinction',
        back: {
          title: 'AMC 12B — Distinction Award',
          bullets: ['Top 5% nationwide', 'American Mathematics Competition'],
        },
      },
      {
        id: 'award-aime',
        rank: '3',
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
        rank: '4',
        suit: '♣',
        frontHeadline: 'UWaterloo Euclid',
        frontSubtext: 'Top 1% of 24,000',
        back: {
          title: 'UWaterloo Euclid Mathematics Contest',
          bullets: ['Top 1% of 24,000 students', 'Honor Roll'],
        },
      },
      {
        id: 'award-csmc',
        rank: '5',
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
        rank: '6',
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
