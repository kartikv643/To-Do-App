import React, { useState } from "react";

function TodoInput({ onAdd, loading }) {
  const [text, setText] = useState("");

  const handleAdd = () => {
    if (text.trim() === "") return;
    onAdd(text);
    setText("");
  };

  return (
    <div className="input-section">
      <input
        type="text"
        value={text}
        placeholder="Add a new task..."
        onChange={(e) => setText(e.target.value)}
        disabled={loading}
      />
      <button onClick={handleAdd} disabled={loading}>Add</button>
    </div>
  );
}

export default TodoInput;