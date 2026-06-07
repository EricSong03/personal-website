'use client'
import { useCallback, useEffect, useReducer, useRef } from 'react'
import {
  RoomData, GamePhase, Street, Position,
  ScriptNode, DecisionOption, DecisionNode,
} from '@/lib/types'

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
interface PlayerState {
  stack: number
  streetBet: number
  folded: boolean
}

export interface PokerHandState {
  phase: GamePhase
  street: Street
  pot: number
  heroStack: number
  heroStreetBet: number
  villainStates: Partial<Record<Position, PlayerState>>
  revealedBoardCards: 0 | 3 | 4 | 5
  actionLog: string[]
  currentOptions: DecisionOption[] | null
  showVillainCards: boolean
  winAmount: number | null
}

// ---------------------------------------------------------------------------
// Reducer actions
// ---------------------------------------------------------------------------
type ReducerAction =
  | { type: 'START_GAME' }
  | { type: 'APPLY_SCRIPT_ACTION'; position: Position; action: string; amount: number; label: string }
  | { type: 'HERO_ACT'; option: DecisionOption }
  | { type: 'AWAIT_DECISION'; options: DecisionOption[] }
  | { type: 'COLLECT_BETS' }
  | { type: 'DEAL_STREET'; street: Street; revealedCount: 0 | 3 | 4 | 5; streetLabel: string }
  | { type: 'SHOW_VILLAIN_CARDS' }
  | { type: 'HERO_WINS'; amount: number }
  | { type: 'VILLAIN_WINS' }
  | { type: 'RESET'; room: RoomData }

// ---------------------------------------------------------------------------
// Initial state builder
// ---------------------------------------------------------------------------
function buildInitialState(room: RoomData): PokerHandState {
  const villainStates: Partial<Record<Position, PlayerState>> = {}
  for (const v of room.villains) {
    villainStates[v.position] = { stack: v.startingStack, streetBet: 0, folded: false }
  }
  // SB posts blind
  const sb = villainStates['SB']
  if (sb) {
    sb.stack -= room.smallBlind
    sb.streetBet = room.smallBlind
  }
  return {
    phase: 'idle',
    street: 'preflop',
    pot: 0,
    heroStack: room.heroStartingStack - room.bigBlind,
    heroStreetBet: room.bigBlind,
    villainStates,
    revealedBoardCards: 0,
    actionLog: [`${room.suit} ${room.name}`, `SB posts $${room.smallBlind}`, `BB posts $${room.bigBlind}`],
    currentOptions: null,
    showVillainCards: false,
    winAmount: null,
  }
}

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------
function reducer(state: PokerHandState, action: ReducerAction): PokerHandState {
  switch (action.type) {
    case 'START_GAME': {
      return { ...state, phase: 'villain_acting' }
    }

    case 'APPLY_SCRIPT_ACTION': {
      const { position, action: pAction, amount, label } = action
      const newLog = [...state.actionLog, label]
      const newVillainStates = { ...state.villainStates }
      const prevV = newVillainStates[position] ?? { stack: 0, streetBet: 0, folded: false }

      if (pAction === 'fold') {
        newVillainStates[position] = { ...prevV, folded: true }
      } else if (amount > 0) {
        newVillainStates[position] = {
          ...prevV,
          stack: prevV.stack - amount,
          streetBet: prevV.streetBet + amount,
        }
      }

      return { ...state, villainStates: newVillainStates, actionLog: newLog, phase: 'villain_acting' }
    }

    case 'AWAIT_DECISION': {
      return { ...state, phase: 'hero_deciding', currentOptions: action.options }
    }

    case 'HERO_ACT': {
      const { option } = action
      const newLog = [...state.actionLog, `Hero ${option.label.toLowerCase()}`]
      const heroStreetBet = state.heroStreetBet + (option.amount ?? 0)
      const heroStack = state.heroStack - (option.amount ?? 0)
      return {
        ...state,
        heroStreetBet,
        heroStack,
        actionLog: newLog,
        phase: 'villain_acting',
        currentOptions: null,
      }
    }

    case 'COLLECT_BETS': {
      const villainTotal = Object.values(state.villainStates).reduce<number>(
        (sum, v) => sum + (v?.streetBet ?? 0), 0
      )
      const newPot = state.pot + state.heroStreetBet + villainTotal

      const resetVillains: Partial<Record<Position, PlayerState>> = {}
      for (const [pos, v] of Object.entries(state.villainStates)) {
        if (v) resetVillains[pos as Position] = { ...v, streetBet: 0 }
      }

      return {
        ...state,
        pot: newPot,
        heroStreetBet: 0,
        villainStates: resetVillains,
        phase: 'collect_bets',
      }
    }

    case 'DEAL_STREET': {
      return {
        ...state,
        phase: 'deal_street',
        street: action.street,
        revealedBoardCards: action.revealedCount,
        actionLog: [...state.actionLog, action.streetLabel],
      }
    }

    case 'SHOW_VILLAIN_CARDS': {
      return { ...state, phase: 'showdown', showVillainCards: true }
    }

    case 'HERO_WINS': {
      return {
        ...state,
        phase: 'hero_wins',
        winAmount: action.amount,
        heroStack: state.heroStack + action.amount,
        showVillainCards: true,
      }
    }

    case 'VILLAIN_WINS': {
      return {
        ...state,
        phase: 'villain_wins',
        showVillainCards: true,
        winAmount: -(state.heroStreetBet + state.pot),
      }
    }

    case 'RESET': {
      return buildInitialState(action.room)
    }

    default:
      return state
  }
}

// ---------------------------------------------------------------------------
// Dynamic amount resolution
// Resolves potPercent and callCurrent fields at execution/decision time.
// ---------------------------------------------------------------------------
function resolveScriptAmount(
  node: { amount?: number; potPercent?: number; callCurrent?: boolean },
  pot: number,
  heroStreetBet: number,
  villainStates: Partial<Record<Position, PlayerState>>,
  position: Position,
): number {
  if (node.potPercent !== undefined) {
    return Math.round(pot * node.potPercent / 100)
  }
  if (node.callCurrent) {
    // Villain matching hero's current street bet
    const villainIn = villainStates[position]?.streetBet ?? 0
    return Math.max(0, heroStreetBet - villainIn)
  }
  return node.amount ?? 0
}

function resolveOptionAmount(
  opt: DecisionOption,
  pot: number,
  heroStreetBet: number,
  villainStates: Partial<Record<Position, PlayerState>>,
): number {
  if (opt.potPercent !== undefined) {
    return Math.round(pot * opt.potPercent / 100)
  }
  if (opt.callCurrent) {
    // Hero matching the highest villain street bet
    const maxVillainBet = Math.max(0, ...Object.values(villainStates).map(v => v?.streetBet ?? 0))
    return Math.max(0, maxVillainBet - heroStreetBet)
  }
  return opt.amount ?? 0
}

function resolveLabel(label: string, amount: number): string {
  return label.replace('{x}', `$${amount}`)
}

// ---------------------------------------------------------------------------
// Street helpers
// ---------------------------------------------------------------------------
const STREET_ORDER: Street[] = ['preflop', 'flop', 'turn', 'river']

function nextStreet(current: Street): Street | null {
  const idx = STREET_ORDER.indexOf(current)
  return idx < STREET_ORDER.length - 1 ? STREET_ORDER[idx + 1] : null
}

function streetRevealCount(s: Street): 0 | 3 | 4 | 5 {
  return s === 'flop' ? 3 : s === 'turn' ? 4 : s === 'river' ? 5 : 0
}

function formatStreetLabel(
  street: Street,
  communityCards: RoomData['communityCards'],
): string {
  if (street === 'flop') {
    const [c0, c1, c2] = communityCards
    return `— FLOP: ${c0.rank}${c0.suit} ${c1.rank}${c1.suit} ${c2.rank}${c2.suit} —`
  }
  if (street === 'turn') {
    const c = communityCards[3]
    return `— TURN: ${c.rank}${c.suit} —`
  }
  if (street === 'river') {
    const c = communityCards[4]
    return `— RIVER: ${c.rank}${c.suit} —`
  }
  return ''
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------
export function usePokerHand(room: RoomData) {
  const [state, dispatch] = useReducer(reducer, room, buildInitialState)

  // Live state ref — readable inside stable setTimeout callbacks
  const stateRef    = useRef(state)
  stateRef.current  = state

  const queueRef    = useRef<ScriptNode[]>([])
  const timersRef   = useRef<ReturnType<typeof setTimeout>[]>([])
  const dispatchRef = useRef(dispatch)
  dispatchRef.current = dispatch

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
  }, [])

  // Stable processQueue — uses only refs
  const processQueue = useCallback(() => {
    if (queueRef.current.length === 0) {
      dispatchRef.current({ type: 'COLLECT_BETS' })
      return
    }

    const node = queueRef.current[0]
    queueRef.current = queueRef.current.slice(1)

    if ((node as DecisionNode).kind === 'decision') {
      const dn = node as DecisionNode
      const { pot, heroStreetBet, villainStates, heroStack } = stateRef.current
      // Resolve dynamic amounts for each option before presenting to hero
      const resolvedOptions = dn.options.map(opt => {
        let amount = resolveOptionAmount(opt, pot, heroStreetBet, villainStates)
        let label: string
        if (!opt.isFold && amount > heroStack) {
          amount = heroStack
          label = 'All In'
        } else {
          label = resolveLabel(opt.label, amount)
        }
        return { ...opt, amount, label }
      })
      dispatchRef.current({ type: 'AWAIT_DECISION', options: resolvedOptions })
      return
    }

    // It's a ScriptAction — execute with a human-like delay
    const sa = node as import('@/lib/types').ScriptAction
    const delay = 700 + Math.floor(Math.random() * 500)
    const t = setTimeout(() => {
      const { pot, heroStreetBet, villainStates } = stateRef.current
      const amount = resolveScriptAmount(sa, pot, heroStreetBet, villainStates, sa.position)
      const label  = resolveLabel(sa.label, amount)
      dispatchRef.current({
        type: 'APPLY_SCRIPT_ACTION',
        position: sa.position,
        action: sa.action,
        amount,
        label,
      })
      // Small pause then continue
      const t2 = setTimeout(() => processQueue(), 200)
      timersRef.current.push(t2)
    }, delay)
    timersRef.current.push(t)
  }, []) // stable — intentionally empty deps

  // Watch collect_bets -> deal next street
  useEffect(() => {
    if (state.phase !== 'collect_bets') return
    const t = setTimeout(() => {
      const ns = nextStreet(state.street)
      if (!ns) {
        dispatchRef.current({ type: 'SHOW_VILLAIN_CARDS' })
        return
      }
      const label = formatStreetLabel(ns, room.communityCards)
      dispatchRef.current({ type: 'DEAL_STREET', street: ns, revealedCount: streetRevealCount(ns), streetLabel: label })
    }, 600)
    timersRef.current.push(t)
    return () => clearTimeout(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.phase, state.street])

  // Watch deal_street -> load script and start processing
  useEffect(() => {
    if (state.phase !== 'deal_street') return
    const t = setTimeout(() => {
      const script = room.handScript[state.street]
      if (script) {
        queueRef.current = [...script]
        processQueue()
      }
    }, 1000) // wait for card flip animation
    timersRef.current.push(t)
    return () => clearTimeout(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.phase, state.street])

  // Watch showdown -> hero wins after reveal delay
  useEffect(() => {
    if (state.phase !== 'showdown') return
    const t = setTimeout(() => {
      if (room.handScript.showdown.heroWins) {
        dispatchRef.current({ type: 'HERO_WINS', amount: state.pot })
      } else {
        dispatchRef.current({ type: 'VILLAIN_WINS' })
      }
    }, 2200)
    timersRef.current.push(t)
    return () => clearTimeout(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.phase])

  const startGame = useCallback(() => {
    dispatchRef.current({ type: 'START_GAME' })
    queueRef.current = [...room.handScript.preflop]
    processQueue()
  }, [room, processQueue])

  const heroAct = useCallback((option: DecisionOption) => {
    if (option.isFold) {
      clearTimers()
      dispatchRef.current({ type: 'VILLAIN_WINS' })
      return
    }
    dispatchRef.current({ type: 'HERO_ACT', option })
    // Prepend option's continuation nodes then continue processing
    queueRef.current = [...option.next, ...queueRef.current]
    // Small pause for UX before continuing
    const t = setTimeout(() => processQueue(), 300)
    timersRef.current.push(t)
  }, [clearTimers, processQueue])

  const restart = useCallback(() => {
    clearTimers()
    queueRef.current = []
    dispatchRef.current({ type: 'RESET', room })
  }, [clearTimers, room])

  return { state, startGame, heroAct, restart }
}
