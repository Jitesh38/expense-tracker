import { useState, useEffect, useCallback, useId } from "react";
import "./App.css";
import dltLogo from "./assets/dlt.svg";

function App() {
  const [type, setType] = useState("Income");
  const [ruppee, setRuppee] = useState(0);
  const [total, setTotal] = useState(0);
  const [obj, setObj] = useState(JSON.parse(localStorage.getItem("obj")));
  const id = useId();

  //fetching current date
  const toDay = () => {
    let dateObj = new Date();
    let date =
      dateObj.getDate() +
      "-" +
      dateObj.getMonth() +
      "-" +
      dateObj.getFullYear();
    return date;
  };

  //count total from localstorage
  const countTotal = useCallback(() => {
    if (obj !== null && obj.length !== 0) {
      let finalTotal = 0;
      obj.map((item) => {
        if (item[0] == "Income") {
          finalTotal = finalTotal + Number(item[2]);
        } else if (item[0] == "Expense") {
          finalTotal = finalTotal - Number(item[2]);
        }
      });
      setTotal(finalTotal);
    } else {
      setTotal(0);
    }
  }, [obj, setObj]);

  //save data to localstorage
  const save = () => {
    let event = document.getElementById("event").value.trim();

    if (event.length > 0 && ruppee != 0) {
      let date = toDay();
      if (obj === null) {
        let obj = [type, event, ruppee, date];
        localStorage.setItem("obj", JSON.stringify([obj]));
      } else {
        let index = obj.length;
        obj[index] = [type, event, ruppee, date];
        localStorage.setItem("obj", JSON.stringify(obj));
      }
      setObj(JSON.parse(localStorage.getItem("obj")));
      document.getElementById("event").value = "";
      document.getElementById("ruppee").value = null;
    } else {
      alert("Enter Valid Input !");
    }
  };

  //Fetch data from localstorage in to table
  const loadData = useCallback(() => {
    if (obj === null || obj.length === 0) {
      return <></>;
    } else {
      return (
        <div>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Event</th>
                <th>₹</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {obj.map((item, index) => (
                <tr className={item[0]}>
                  <td key={id}>{item[3]}</td>
                  <td key={id}>{item[0]}</td>
                  <td key={id}>{item[1]}</td>
                  <td key={id}>{item[2]}</td>
                  <td
                    key={id}
                    id={index}
                    onClick={() => {
                      deleteRow(index);
                    }}
                  >
                    <img src={dltLogo} alt="" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
  }, [obj, setObj]);

  //handle individual delete on row
  const deleteRow = (index) => {
    obj.splice(index, 1);
    localStorage.setItem("obj", JSON.stringify(obj));
    setObj(JSON.parse(localStorage.getItem("obj")));
  };

  //clear all data from App
  const clearAll = () => {
    localStorage.clear();
    setObj(JSON.parse(localStorage.getItem("obj")));
  };

  //run methods when change in obj
  useEffect(() => {
    countTotal();
    loadData();
  }, [obj, setObj]);

  return (
    <>
      <div className="container">
        <div className="container-upper">
          <select
            name="opt"
            id="opt"
            onChange={(e) => {
              setType(e.target.value);
            }}
          >
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>
          <input type="text" id="event" placeholder="Event name" required />
          <input
            type="number"
            id="ruppee"
            placeholder="₹"
            min={0}
            onBlur={(e) => {
              if (e.target.value > 0) {
                setRuppee(e.target.value);
              }
            }}
            required
          />
          <button className="save" onClick={save}>
            Save
          </button>
        </div>

        <div className="line"></div>
        {loadData()}

        <h3>
          {total > 0 ? (
            <div style={{ display: "inline", color: "green" }}>
              ₹{total} Profit
            </div>
          ) : (
            <div></div>
          )}
          {total < 0 ? (
            <div style={{ display: "inline", color: "red" }}>
              ₹{Math.abs(total)} Loss
            </div>
          ) : (
            <div></div>
          )}
          {total === 0 && obj !== null && obj.length !== 0 ? (
            <div>EQUAL</div>
          ) : (
            <div></div>
          )}
        </h3>
        {obj !== null && obj.length !== 0 ? (
          <button className="clear clear-all" onClick={clearAll}>
            Clear
          </button>
        ) : (
          <div></div>
        )}
      </div>
    </>
  );
}

export default App;