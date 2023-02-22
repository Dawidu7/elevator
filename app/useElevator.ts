import { useState, useEffect } from "react"


export default function useElevator(floorCount: number) {
  const [ currentFloorIndex, setCurrentFloorIndex ] = useState(0)
  const [ floors, setFloors ] = useState(Array.from({ length: floorCount }, _ => ({ leaving: 0, waiting: 0 })))
  const [ direction, setDirection ] = useState<"down" | "up" | null>(null)
  const currentFloor = floors[currentFloorIndex]

  function requestElevator(floor: number) {
    const updatedFloors = [ ...floors ]
    updatedFloors[floor].waiting += 1

    setFloors(updatedFloors)

    if(currentFloorIndex === floor || direction !== null) return

    start(floor)
  }

  function registerFloor(floor: number) {
    if(currentFloor.waiting === 0) return

    const updatedFloors = [ ...floors ]
    updatedFloors[floor].leaving += 1
    updatedFloors[currentFloorIndex].waiting -= 1

    setFloors(updatedFloors)

    if(currentFloor.waiting === 0) start(floor)
  }

  async function moveElevator(): Promise<void> {
    const destination = getNextDestination()
    console.log(destination)
    if(destination === -1) return dispatch()

    await delay(500)
    setCurrentFloorIndex(prev => direction === "down" ? prev + 1 : prev - 1)
    dispatch()
  }

  function getNextDestination(): number {
    // If it's stationary there's no need to get a destination
    if(direction === null) return -1

    // Get the floors that are above or under current one depending on direction
    const slicedFloors = floors
      .slice(
        direction === "down" ? currentFloorIndex + 1 : 0, 
        direction === "down" ? floors.length : currentFloorIndex
      )
    // Find first occurence of data > 0; reverse-checks if it goes up 
    const nextDestination = (
      direction === "down" 
        ? slicedFloors 
        : slicedFloors.reverse()
    ).find(floor => floor.leaving > 0 || floor.waiting > 0)

    if(nextDestination === undefined) return -1

    // If found - return
    if(nextDestination !== undefined) {
      return floors.indexOf(nextDestination)
    }

    // If there is any data > 0 it means it's in the other direction - change direction and repeat
    if(floors.some(floor => floor.leaving > 0 || floor.waiting > 0)) {
      setDirection(prev => prev === "down" ? "up" : "down")
      return getNextDestination()
    }

    // No destinations = stationary
    setDirection(null)
    return -1
  }

  function start(floor: number) {
    setDirection(currentFloorIndex < floor ? "down" : "up")
  }

  function dispatch() {
    const updatedFloors = [ ...floors ]
    updatedFloors[currentFloorIndex].leaving = 0
    
    setFloors(updatedFloors)
  }

  useEffect(() => {
    if(currentFloor.waiting > 0) {
      setDirection(null)
      return
    }
    if(direction === null) return

    moveElevator()
  }, [ currentFloorIndex, direction ])

  return {
    count: floors.reduce((count, { leaving }) => count + leaving, 0),
    currentFloorIndex,
    floors,
    registerFloor,
    requestElevator
  }
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}