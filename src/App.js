import {useEffect, useState} from "react";
import "./App.css";
import axios from "axios";
import { TodoistApi } from '@doist/todoist-api-typescript'
/*
* Plan:
*   1. Define backend url
*   2. Get items and show them +
*   3. Toggle item done +
*   4. Handle item add +
*   5. Delete +
*   6. Filter
*
* */

function App() {

  const BACKEND_URL = new TodoistApi('d5e3835c1f7cf13f35b7c2fee33c2bf409128b24')

  
  const [itemToAdd, setItemToAdd] = useState("");
  const [items, setItems] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const handleChangeItem = (event) => {
    setItemToAdd(event.target.value);
  };

  const handleAddItem = () => {
  //   BACKEND_URL.addTask({
  //     content: 'Buy Milk'
  // })
  //     .then((task) => console.log(task))
  //     .catch((error) => console.log(error))
    BACKEND_URL.addTask({
      content:itemToAdd,
      })
      .then((task) => {
        setItems([ ...items, task])
      })
    .catch((error) => console.log(error))
    setItemToAdd("");
          //setItemToAdd("");

  //   axios.post(`${BACKEND_URL}/todos`, {
  //       label:itemToAdd,
  //       done: false
  //   }).then((response) => {
  //       setItems([ ...items, response.data])
  //   })
  //   setItemToAdd("");
  // };



//   api.addTask({
//     content: 'Buy Milk',
// })
//     .then((task) => console.log(task))
//     .catch((error) => console.log(error))
    }
  const toggleItemDone = ({ id, done }) => {
      axios.put(`${BACKEND_URL}/todos/${id}`, {
          done: !done
      }).then((response) => {
          setItems(items.map((item) => {
              if (item.id === id) {
                  return {
                      ...item,
                      done: !done
                  }
              }
              return item
          }))

      })
  };

  // N => map => N
    // N => filter => 0...N
  const handleItemDelete = (id) => {
      axios.delete(`${BACKEND_URL}/todos/${id}`).then((response) => {
          const deletedItem = response.data;
          console.log('Было:',items)
          const newItems = items.filter((item) => {
              return deletedItem.id !== item.id
          })
          console.log('Осталось:',newItems)
          setItems(newItems)
      })
  };

  useEffect(() => {

      BACKEND_URL.getTasks()
      .then((tasks) => {
        setItems(tasks)
        console.log(tasks)
      })
      .catch((error) => console.log(error))

      // axios.get(`${BACKEND_URL}`).then((response) => {
      //     // //setItems(response.data);
          
      // })
  }, [searchValue])



  return (
    <div className="todo-app">
      {/* App-header */}
      <div className="app-header d-flex">
        <h1>Todo List</h1>
      </div>

      <div className="top-panel d-flex">
        {/* Search-panel */}
        <input
          type="text"
          className="form-control search-input"
          placeholder="type to search"
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
        />
      </div>

      {/* List-group */}
      <ul className="list-group todo-list">
        {items.length > 0 ? (
          items.map((item) => (
            <li key={item.id} className="list-group-item">
              <span className={`todo-list-item${item.done ? " done" : ""}`}>
                <span
                  className="todo-list-item-label"
                  onClick={() => toggleItemDone(item)}
                >
                  {item.content}
                </span>

                <button
                  type="button"
                  className="btn btn-outline-success btn-sm float-right"
                >
                  <i className="fa fa-exclamation" />
                </button>

                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm float-right"
                  onClick={() => handleItemDelete(item.id)}
                >
                  <i className="fa fa-trash-o" />
                </button>
              </span>
            </li>
          ))
        ) : (
          <div>No todos🤤</div>
        )}
      </ul>

      {/* Add form */}
      <div className="item-add-form d-flex">
        <input
          value={itemToAdd}
          type="text"
          className="form-control"
          placeholder="What needs to be done"
          onChange={handleChangeItem}
        />
        <button className="btn btn-outline-secondary" onClick={handleAddItem}>
          Add item
        </button>
      </div>
    </div>
  );
}

export default App;
