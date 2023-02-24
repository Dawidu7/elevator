import { useState, useEffect } from "react"


interface Person {
  id: number,
  start: number,
  destination: number | null,
  arrived: boolean
}

// TODO: animation using ref and CSS animations
export default function useElevator(floorCount: number) {
  const [ currentFloorIndex, setCurrentFloorIndex ] = useState(0)
  const [ passengers, setPassengers ] = useState<Person[]>([])
  const [ isMoving, setIsMoving ] = useState(false)
  const floors = Array.from({ length: floorCount }, (_, floor) => ({
    waiting: passengers.filter(({ start, destination }) => start === floor && destination === null),
    leaving: passengers.filter(({ destination, arrived }) => destination === floor && arrived === false)
  }))

  function requestElevator(floor: number) {
    setPassengers(prevPassengers => [
      ...prevPassengers, 
      { id: passengers.length, start: floor, destination: null, arrived: false }
    ])
  }

  function registerFloor(floor: number) {
    const currentPassenger = passengers.find(
      ({ start, destination }) => start === currentFloorIndex && destination === null
    )?.id
    if(currentPassenger === undefined) return

    setPassengers(prevPassengers => {
      const updatedPassengers = [ ...prevPassengers ]
      const passengerId = prevPassengers.findIndex(({ id }) => id === currentPassenger)
      updatedPassengers[passengerId] = { ...updatedPassengers[passengerId], destination: floor }

      return updatedPassengers
    })
  }

  async function moveElevator() {
    const direction = getDirection()
    // Dispatch people that want to leave on current floor
    if(floors[currentFloorIndex].leaving.length > 0) {
      setPassengers(prevPassengers => {
        const updatedPassengers = [ ...prevPassengers ]
        updatedPassengers
          .filter(({ destination, arrived }) => destination === currentFloorIndex && arrived === false)
          .forEach(passenger => passenger.arrived = true)
        
        return updatedPassengers
      })
    }
    // If there is no direction or there are people waiting on current floor - don't move
    if(direction === null || floors[currentFloorIndex].waiting.length > 0) return
    // Movement of the elevator
    setIsMoving(true)

    await delay(500)
    setCurrentFloorIndex(prevFloorIndex => direction === "up" ? prevFloorIndex + 1 : prevFloorIndex - 1)

    setIsMoving(false)
  }

  function getDirection() {
    const isFloorAbove = floors
      .slice(currentFloorIndex + 1)
      .find(floor => floor.leaving.length > 0 || floor.waiting.length > 0)

    if(isFloorAbove !== undefined) return "up"

    const isFloorBelow = floors
      .slice(0, currentFloorIndex)
      .find(floor => floor.leaving.length > 0 || floor.waiting.length > 0)

    if(isFloorBelow !== undefined) return "down"

    return null
  }

  useEffect(() => {
    if(isMoving) return

    moveElevator()
  }, [ currentFloorIndex, floors ])

  return {
    currentFloorIndex,
    passengers,
    floors,
    registerFloor,
    requestElevator,
  }
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}