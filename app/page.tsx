"use client"

import { useElevator } from "@/hooks"
import { Elevator, ElevatorControls } from "@/components"


export default function Home() {
  const { currentFloorIndex, elevatorContainer, floors, registerFloor, requestElevator } = useElevator(10)

  return (
    <main>
      <Elevator
        currentFloorIndex={currentFloorIndex}
        elevatorContainer={elevatorContainer}
        floors={floors}
        requestElevator={requestElevator}
      />
      {floors[currentFloorIndex].waiting.length > 0 && (
        <ElevatorControls
          currentFloorIndex={currentFloorIndex}
          floors={floors}
          registerFloor={registerFloor}
        />
      )}
    </main>
  )
}