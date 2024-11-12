import React from "react";

function Table() {
  var obj = JSON.parse(localStorage.getItem("obj"));

  return (
    <div>

      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Event</th>
            <th>₹</th>
          </tr>
        </thead>
        <tbody>
          {obj.map((item, index) => (
            <tr className={item[0]}>
              <td key={index}>{item[3]}</td>
              <td key={index}>{item[0]}</td>
              <td key={index}>{item[1]}</td>
              <td key={index}>{item[2]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
