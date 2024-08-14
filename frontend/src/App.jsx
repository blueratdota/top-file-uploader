import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/files/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "hehe" })
      });
    } catch (error) {}
  };
  return (
    <>
      <form method="post" onSubmit={onSubmitForm}>
        <label htmlFor="input-file">File:</label>
        <input type="file" id="input-file" name="input-file" />
        <button type="submit">upload</button>
      </form>
    </>
  );
}

export default App;
