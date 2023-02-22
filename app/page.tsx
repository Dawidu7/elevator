"use client"

import useElevator from "./useElevator"


export default function Home() {
  const { currentFloor, floors, count, callElevator, registerFloor, moveElevator } = useElevator(10)

  function submitRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const registeredFloor = Number((
      (e.target as HTMLFormElement)
      .querySelector("input[type='submit']:focus") as HTMLInputElement
    ).value)

    registerFloor(registeredFloor)
  }

  return (
    <main>
      <table>
        <tbody>
          {floors.map((floor, i) => (
            <tr key={i}>
              <td><button onClick={() => callElevator(i)}>Call to floor {i}</button></td>
              <td>{floor.waiting}</td>
              <td className ={`elevator ${currentFloor === i ? "current" : ""}`} data-count={count} />
            </tr>
          ))}
        </tbody>
      </table>
      <form onSubmit={submitRegister}>
        {floors.map((_, i) => (
          <input key={i} type="submit" value={i} disabled={currentFloor === i} />
        ))}
      </form>
    </main>
  )
}