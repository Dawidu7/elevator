"use client"

import { useState } from "react"


export default function useElevator(floorCount: number) {
  const [ currentFloor, setCurrentFloor ] = useState(0)
  const [ floors, setFloors ] = useState(Array.from({ length: floorCount }, (_, i) => ({
    waiting: 0,
    leaving: 0,
  })))
  const count = floors.reduce((count, { leaving }) => count + leaving, 0)

  function callElevator(floor: number) {
    const newFloors = [ ...floors ]

    newFloors[floor].waiting = floors[floor].waiting + 1

    setFloors(newFloors)
  }

  function registerFloor(floor: number) {
    /* 
      When people in current floor waiting click register, the
      waiting number decrements by 1 and leaving to the floor increments
      by 1 etc.
    */
  }

  async function moveElevator(floor: number) {
    
  }

  return { currentFloor, floors, count, callElevator, registerFloor, moveElevator }
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}