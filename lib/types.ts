export type Suit = '♥' | '♠' | '♦' | '♣'
export type Rank = 'A' | 'K' | 'Q' | 'J' | '10' | '9' | '8' | '7' | '6' | '5' | '4' | '3' | '2'
export type RoomId = 'about' | 'experience' | 'projects' | 'awards'

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

export interface RoomData {
  id: RoomId
  name: string
  suit: Suit
  holeCards: [HoleCardData, HoleCardData]
  communityCards: CommunityCardData[]
}
