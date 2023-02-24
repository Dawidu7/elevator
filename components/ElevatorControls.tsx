interface ElevatorControlsProps {
  currentFloorIndex: number,
  floors: Floor[],
  registerFloor: (floor: number) => void
}

export default function ElevatorControls({ currentFloorIndex, floors, registerFloor }: ElevatorControlsProps) {
  function submitRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const registeredFloor = Number((
      (e.target as HTMLFormElement)
      .querySelector("input[type='submit']:focus") as HTMLInputElement
    ).value)

    registerFloor(registeredFloor)
  }

  return (
    <form onSubmit={submitRegister}>
      {floors.map((_, i) => (
        <input 
          key={i} 
          type="submit" 
          value={i} 
          disabled={currentFloorIndex === i}
        />
      ))}
    </form>
  )
}
