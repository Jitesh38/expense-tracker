import { useState, useEffect, useCallback } from "react";
import "./App.css";
import Table from "./component/Table";

function App() {
  const [type, setType] = useState("Income");
  const [ruppee, setRuppee] = useState(0);
  const [total, setTotal] = useState(Number(localStorage.getItem("total")));

  const countTotal = () => {
    if (type == "Income") {
      setTotal(total + Number(ruppee));
    } else if (type == "Expense") {
      setTotal(total - Number(ruppee));
    }
  };

  useEffect(() => {
    localStorage.setItem("total", total);
  }, [countTotal]);

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

  const save = () => {
    let event = document.getElementById("event").value.trim();

    if (event.length > 0 && ruppee != 0) {
      let date = toDay();
      countTotal();
      if (JSON.parse(localStorage.getItem("obj")) == null) {
        var obj = [type, event, ruppee, date];
        localStorage.setItem("obj", JSON.stringify([obj]));
      } else {
        obj = JSON.parse(localStorage.getItem("obj"));
        let index = obj.length;
        obj[index] = [type, event, ruppee, date];
        localStorage.setItem("obj", JSON.stringify(obj));
      }
      document.getElementById("event").value = "";
      document.getElementById("ruppee").value = NaN;
    } else {
      alert("Enter Valid Input !");
    }
  };

  const loadData = useCallback(() => {
    var obj = JSON.parse(localStorage.getItem("obj"));

    if (obj === null) {
      return <h4></h4>;
    } else {
      return <Table />;
    }
  });

  const clearAll = () => {
    localStorage.clear();
    window.location.reload();
  };

  useEffect(() => {
    loadData();
  }, [save]);

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
          {/* <button className="clear" onClick={clear}>
            Clear
          </button> */}
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
          {total == 0 ? <div></div> : <div></div>}
        </h3>
        {localStorage.getItem("obj") != null ? (
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
