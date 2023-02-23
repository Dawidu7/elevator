"use client"

import useElevator from "./useElevator"


export default function Home() {
  const { count, currentFloorIndex, floors, registerFloor, requestElevator } = useElevator(10)

  function submitRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const registeredFloor = Number((
      (e.target as HTMLFormElement)
      .querySelector("input[type='submit']:focus") as HTMLInputElement
    ).value)

    registerFloor(registeredFloor)
  }

  return (
    <>
      <table>
        <tbody>
          {floors.map((floor, i) => (
            <tr key={i}>
              <td><button onClick={() => requestElevator(i)}>Call to floor {i}</button></td>
              <td>{floor.waiting}</td>
              <td className ={`elevator ${currentFloorIndex === i ? "current" : ""}`} data-count={count} />
            </tr>
          ))}
        </tbody>
      </table>
      <form onSubmit={submitRegister}>
        {floors.map((_, i) => (
          <input key={i} type="submit" value={i} disabled={currentFloorIndex === i} />
        ))}
      </form>
    </>
  )
}