interface Passenger {
  id: number,
  start: number,
  destination: number | null,
  arrived: boolean
}

interface Floor {
  waiting: Passenger[],
  leaving: Passenger[]
}