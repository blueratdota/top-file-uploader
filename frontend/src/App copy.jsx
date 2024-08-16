import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);
  const [upFile, setUpFile] = useState();

  const onSubmitForm = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", upFile);
    console.log(formData);
    try {
      const response = await fetch("http://localhost:3000/api/files/upload", {
        mode: "cors",
        method: "POST",
        body: formData
      });
    } catch (error) {}
  };
  return (
    <>
      <form method="post" onSubmit={onSubmitForm} encType="multipart/form-data">
        <label htmlFor="input-file">File:</label>
        <input
          type="file"
          id="input-file"
          name="input-file"
          onChange={(e) => {
            setUpFile(e.target.files[0]);
          }}
        />
        <button type="submit">upload</button>
      </form>
    </>
  );
}

export default App;
