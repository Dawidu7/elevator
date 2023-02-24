import { MdElevator } from "react-icons/md"


interface ElevatorProps {
  currentFloorIndex: number,
  elevatorContainer: React.RefObject<HTMLTableSectionElement>,
  floors: Floor[],
  requestElevator: (floor: number) => void
}

export default function Elevator({ currentFloorIndex, elevatorContainer, floors, requestElevator }: ElevatorProps) {
  const leaving = floors.reduce((acc: Passenger[], { leaving }) => [ ...acc, ...leaving ], [])
  
  return (
    <table>
      <tbody ref={elevatorContainer}>
        {floors.map((floor, i) => (
          <tr key={i}>
            <td><button onClick={() => requestElevator(i)}><MdElevator size={24} /> {i}</button></td>
            <td className="waiting">
              {floor.waiting.length}
              <ul>
                {floor.waiting.map(waiting => (
                  <li key={waiting.id}>p{waiting.id}</li>
                ))}
              </ul>
            </td>
            <td
              className={`elevator${currentFloorIndex === i ? " current" : ""}`}
              data-count={leaving.length}
            >
              {currentFloorIndex === i && (
                <ul>
                  {leaving.map(leaving => (
                    <li key={leaving.id}>p{leaving.id}</li>
                  ))}
                </ul>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
