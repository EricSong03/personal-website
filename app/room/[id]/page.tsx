import { notFound } from "next/navigation"
import { ROOM_MAP, ROOMS } from "@/lib/roomContent"
import PokerRoom from "@/components/room/PokerRoom"

interface RoomPageProps {
  params: Promise<{ id: string }>
}

export default async function RoomPage({ params }: RoomPageProps) {
  const { id } = await params
  const room = ROOM_MAP[id]

  if (!room) notFound()

  return <PokerRoom room={room} />
}

export function generateStaticParams() {
  return ROOMS.map((r) => ({ id: r.id }))
}
