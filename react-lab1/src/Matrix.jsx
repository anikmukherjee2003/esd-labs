// Section 06 — the grid: a Matrix made of Cells.
//
// Props:  matrix        an array of rows, each an array of numbers (any size — don't assume 3)
//         onIncrement   a function: onIncrement(row, col)   (you need it in section 08)
//
// Render:
//   <table className="matrix">
//     <tbody>
//       one <tr> per row
//         one <td> per value, with a <Cell> inside it
//
// Lists need a key on the element you return from map — section 06 says which.
// Section 08: each Cell's onClick calls onIncrement with THAT cell's row and column.
import Cell from "./Cell.jsx";

export default function Matrix({ matrix, onIncrement }) {
  return (
    <table className="matrix">
      <tbody>
        {matrix.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((value, colIndex) => (
              <td key={colIndex}>
                <Cell
                  row={rowIndex}
                  col={colIndex}
                  value={value}
                  onClick={() => onIncrement(rowIndex, colIndex)}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
