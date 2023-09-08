import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");
  const [taskId, setTaskId] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
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
  const addTask = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("task", text);
    formData.append("description", description);
    formData.append("image", image);

    try {
      const res = await axios.post(`http://localhost:80/api/tasks`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // console.log(res.data);
      setTasks([res.data, ...tasks]);
    } catch (error) {
      console.log(error);
    }
    setText("");
    setDescription("");
  };

  const handleFileChange = (event) => {
    setImage(event.target.files[0]);
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

  const taskArea = {
    width: "800px",
  };

  const taskImg = {
    width: "180px",
    height: "160px",
  };

  const taskItems = {
    display: "flex",
    justifyContent: "center",
  };

  return (
    <>
      <div style={taskArea}>
        <form>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="追加するタスクを入力してください"
          />
          <textarea
            type="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="詳細を入力してください"
          />
          <input type="file" onChange={handleFileChange} />
          <button onClick={addTask}>追加</button>
        </form>

        <ul>
          {loading
            ? "Loading..."
            : tasks.map((task) => (
                <li key={task.id} style={taskItems}>
                  <div>
                    <input type="checkbox" />
                    {task.id}:{task.task}
                    <button onClick={() => updateTask(task.id)}>更新</button>
                    <button onClick={() => deleteTask(task.id)}>削除</button>
                    <p>{task.description}</p>
                  </div>
                  <img style={taskImg} src={task.image_path} alt="Task Image" />
                </li>
              ))}
        </ul>
        <input
          type="text"
          value={taskId}
          onChange={(e) => setTaskId(e.target.value)}
          placeholder="idを入力してください"
        />
        <button onClick={searchTask}>タスク選択</button>
        <h4>
          {selectTask && (
            <p>
              {selectTask.id} {selectTask.task}
              <button onClick={() => updateTask(selectTask.id)}>更新</button>
              <button onClick={() => deleteTask(selectTask.id)}>削除</button>
              <button onClick={() => setSelectTask("")}>✖︎</button>
              <p>{selectTask.description}</p>
              <img style={taskImg} src={selectTask.image_path} alt="Task Image" />
            </p>
          )}
        </h4>
      </div>
    </>
  );
}

export default App;
