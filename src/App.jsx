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

  // console.log("Type :", type, " Ruppee :", ruppee, " Total :", total);
  // console.log("Ruppee :", ruppee);

  const save = () => {
    let dateObj = new Date();
    let date =
      dateObj.getDate() +
      "-" +
      dateObj.getMonth() +
      "-" +
      dateObj.getFullYear();
    countTotal();
    let event = document.getElementById("event").value;
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
  };

  const loadData = useCallback(() => {
    console.log("load data run");
    var obj = JSON.parse(localStorage.getItem("obj"));

    if (obj == null) {
      return <h4>Add Data to find total!!</h4>;
    } else {
      return <Table />;
    }
  });

  const clear = () => {
    document.getElementById("event").value = "";
    document.getElementById("ruppee").value = NaN;
  };

  const clearAll = () => {
    localStorage.clear();
  };

  useEffect(() => {
    loadData();
  }, [save, clearAll]);

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
          <input type="text" id="event" placeholder="Event name" />
          <input
            type="number"
            id="ruppee"
            placeholder="₹"
            onBlur={(e) => {
              setRuppee(e.target.value);
            }}
          />
          <button className="save" onClick={save}>
            Save
          </button>
          <button className="clear" onClick={clear}>
            Clear
          </button>
        </div>

        <div className="line"></div>
        {loadData()}

        <h3>
          {total > 0 ? (
            <div style={{ display: "inline" }}>₹{total} Profit</div>
          ) : (
            <div></div>
          )}
          {total < 0 ? (
            <div style={{ display: "inline" }}>₹{total} Loss</div>
          ) : (
            <div></div>
          )}
          {total == 0 ? <div></div> : <div></div>}
        </h3>
        <button className="clear clear-all" onClick={clearAll}>
          Clear All Data
        </button>
      </div>
    </>
  );
}

export default App;
