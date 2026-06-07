export type Suit = '♥' | '♠' | '♦' | '♣'
export type Rank = 'A' | 'K' | 'Q' | 'J' | '10' | '9' | '8' | '7' | '6' | '5' | '4' | '3' | '2'
export type RoomId = 'about' | 'experience' | 'projects' | 'awards'
export type Street = 'preflop' | 'flop' | 'turn' | 'river'
export type PlayerAction = 'fold' | 'check' | 'call' | 'bet' | 'raise'
export type Position = 'UTG' | 'LJ' | 'HJ' | 'BTN' | 'SB' | 'BB'
export type GamePhase =
  | 'idle'
  | 'hero_deciding'
  | 'villain_acting'
  | 'collect_bets'
  | 'deal_street'
  | 'showdown'
  | 'hero_wins'
  | 'villain_wins'

export interface HoleCardData {
  rank: Rank
  suit: Suit
}

export interface CardLink {
  label: string
  href: string
}

export interface BackContent {
  title: string
  bullets?: string[]
  tags?: string[]
  links?: CardLink[]
}

export interface CommunityCardData {
  id: string
  rank: Rank
  suit: Suit
  frontHeadline: string
  frontSubtext: string
  back: BackContent
}

export interface VillainConfig {
  position: Position
  name: string
  startingStack: number
  avatar: string
}

// Script node types
export interface ScriptAction {
  kind: 'action'
  position: Position
  action: PlayerAction
  // fixed additional amount this player puts in from stack
  amount?: number
  // if set, amount = round(pot * potPercent / 100) at execution time
  potPercent?: number
  // if true, amount = heroStreetBet - this player's current streetBet (villain matches hero's raise)
  callCurrent?: boolean
  label: string
}

export interface DecisionOption {
  action: PlayerAction
  // fixed additional amount hero puts in from stack
  amount?: number
  // if set, amount = round(pot * potPercent / 100) at decision time
  potPercent?: number
  // if true, amount = max villain streetBet - heroStreetBet (hero matches villain's bet)
  callCurrent?: boolean
  label: string
  isFold?: boolean
  // nodes to prepend to queue after hero takes this option
  next: ScriptNode[]
}

export interface DecisionNode {
  kind: 'decision'
  options: DecisionOption[]
}

export type ScriptNode = ScriptAction | DecisionNode

export interface HandScript {
  preflop: ScriptNode[]
  flop: ScriptNode[]
  turn: ScriptNode[]
  river: ScriptNode[]
  showdown: {
    heroWins: boolean
    description: string
  }
}

export interface RoomData {
  id: RoomId
  name: string
  suit: Suit
  holeCards: [HoleCardData, HoleCardData]
  communityCards: CommunityCardData[]
  villains: VillainConfig[]
  mainVillainPosition: Position
  villainHoleCards: [HoleCardData, HoleCardData]
  heroStartingStack: number
  bigBlind: number
  smallBlind: number
  handScript: HandScript
}
