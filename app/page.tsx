"use client"

import useElevator from "./useElevator"


export default function Home() {
  const { currentFloorIndex, passengers, floors, registerFloor, requestElevator } = useElevator(10)

  function submitRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const registeredFloor = Number((
      (e.target as HTMLFormElement)
      .querySelector("input[type='submit']:focus") as HTMLInputElement
    ).value)

    registerFloor(registeredFloor)
  }

  console.log(floors)
  console.log(passengers)

  return (
    <main>
      <table>
        <tbody>
          {floors.map(({ waiting }, i) => (
            <tr key={i}>
              <td><button onClick={() => requestElevator(i)}>Request to floor {i}</button></td>
              <td className="waiting">
                {waiting.length}
                <ul>
                  {waiting.map(waiting => (
                    <li key={waiting.id}>p{waiting.id}</li>
                  ))}
                </ul>
              </td>
              <td
                className={`elevator${currentFloorIndex === i ? " current" : ""}`}
                data-count={floors.reduce((acc, { leaving }) => acc + leaving.length, 0)}
              >
                <ul>
                  {/* Display those who are currently in elevator */}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <form onSubmit={submitRegister}>
        {floors.map((_, i) => (
          <input key={i} type="submit" value={i} disabled={currentFloorIndex === i} />
        ))}
      </form>
    </main>
  )
}