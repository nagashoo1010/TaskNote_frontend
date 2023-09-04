import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");
  const [taskId, setTaskId] = useState("");
  const [selectTask, setSelectTask] = useState("");
  const [loading, setLoading] = useState(false);

  // タスク一覧表示
  useEffect(() => {
    const getTasks = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:80/api/tasks");
        console.log(res.data);
        setTasks(res.data);
      } catch (error) {
        console.log("データ取得に失敗しました");
      }
      setLoading(false);
    };

    getTasks();
  }, []);

  //タスク選択処理
  const searchTask = async () => {
    try {
      const res = await axios.get(`http://localhost:80/api/tasks/${taskId}`);
      console.log(res.data);
      setSelectTask(res.data);
    } catch (error) {
      console.log(error);
    }
    setTaskId("");
  };

  // タスク追加処理
  const addTask = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`http://localhost:80/api/tasks`, { task: text });
      console.log(res.data);
      setTasks([res.data, ...tasks]);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
    setText("");
  };

  // タスク更新処理
  const updateTask = async (id) => {
    try {
      const res = await axios.put(`http://localhost:80/api/tasks/${id}`, {
        task: "hello",
      });

      const updateTasks = tasks.map((task) => {
        if (task.id == res.data.id) {
          return res.data;
        } else {
          return task;
        }
      });
      setTasks(updateTasks);
    } catch (error) {
      console.log(error);
    }
  };

  // タスク削除処理
  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:80/api/tasks/${id}`);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div>
        <input type="text" value={text} onChange={(e) => setText(e.target.value)} />
        <button onClick={addTask}>追加</button>

        <ul>
          {loading
            ? "Loading..."
            : tasks.map((task) => (
                <li key={task.id}>
                  {task.id}:{task.task}
                  <button onClick={() => updateTask(task.id)}>更新</button>
                  <button onClick={() => deleteTask(task.id)}>削除</button>
                </li>
              ))}
        </ul>
        <input type="text" value={taskId} onChange={(e) => setTaskId(e.target.value)} />
        <button onClick={searchTask}>タスク選択</button>
        <h4>
          {selectTask && (
            <p>
              {selectTask.id} {selectTask.task}
              <button onClick={() => updateTask(selectTask.id)}>更新</button>
              <button onClick={() => deleteTask(selectTask.id)}>削除</button>
              <button onClick={() => setSelectTask("")}>リセット</button>
            </p>
          )}
        </h4>
      </div>
    </>
  );
}

export default App;
