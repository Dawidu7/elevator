import { useState, useEffect } from "react"


interface Person {
  start: number,
  destination: number,
  arrived: boolean
}

export default function useElevator(floorCount: number) {
  const [ currentFloorIndex, setCurrentFloorIndex ] = useState(0)
  const [ floors, setFloors ] = useState(Array.from({ length: floorCount }, _ => ({ leaving: 0, waiting: 0 })))
  const [ isMoving, setIsMoving ] = useState(false)
  const currentFloor = floors[currentFloorIndex]

  function requestElevator(floor: number) {
    const updatedFloors = [ ...floors ]
    updatedFloors[floor].waiting += 1
    setFloors(updatedFloors)
  }

  function registerFloor(floor: number) {
    if(currentFloor.waiting <= 0) return

    const updatedFloors = [ ...floors ]
    updatedFloors[floor].leaving += 1
    currentFloor.waiting -= 1
    setFloors(updatedFloors)
  }

  async function moveElevator() {
    const direction = getDirection()
    if(currentFloor.leaving > 0) {
      const updatedFloors = [ ...floors ]
      updatedFloors[currentFloorIndex].leaving = 0
      setFloors(updatedFloors)
    }
    if(direction === null || currentFloor.waiting > 0) return

    setIsMoving(true)

    await delay(500)
    setCurrentFloorIndex(prev => direction === "down" ? prev + 1 : prev - 1)

    setIsMoving(false)
  }

  function getDirection() {
    const isFloorBelow = floors
      .slice(currentFloorIndex + 1)
      .find(floor => floor.leaving > 0 || floor.waiting > 0)

    if(isFloorBelow !== undefined) return "down"
    
    const isFloorAbove = floors
      .slice(0, currentFloorIndex)
      .reverse()
      .find(floor => floor.leaving > 0 || floor.waiting > 0)

    if(isFloorAbove !== undefined) return "up"

    return null
  }

  useEffect(() => {
    if(isMoving) return

    moveElevator()
  }, [ currentFloorIndex, floors ])

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