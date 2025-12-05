import { useState, useId } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const App = () => {
  const [content, setContent] = useState([]);
  const [typing, setTyping] = useState("");
  const [allQueries, setAllQueries] = useState([]);
  const [input, setInput] = useState("");

  const baseId = useId(); // 👈 unique base id for this component

  const genAI = new GoogleGenerativeAI(
    "AIzaSyD39VG8-EhtIAh-7dmQZjcdBJKoXScoGVA"
  );

  const typeEffect = (fullText) => {
    setTyping("");
    let index = 0;

    const interval = setInterval(() => {
      setTyping((prev) => prev + fullText[index]);
      index++;

      if (index >= fullText.length) {
        clearInterval(interval);
      }
    }, 5);
  };

  const fetchData = async () => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

      const result = await model.generateContent(
        `ans all queries based on previosly asked questions , which are in this array ${allQueries} now ans this query .${input}? do not ans previously asked questions again. Provide detailed ans.`
      );

      const text = result.response.text();

      const cleaned = text
        .replaceAll("**", "")
        .split("*")
        .filter((e) => e.trim() !== "");

      setContent(cleaned);
      typeEffect(cleaned.join("\n"));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const ans = () => {
    const newQuery = {
      que: input,
      id: `${baseId}-${crypto.randomUUID()}`, // 👈 unique ID using useId + UUID
    };

    setAllQueries((prev) => [...prev, newQuery]);
    fetchData();
    setInput("");
  };

  const keyEvent = (e) => {
    if (e.key === "Enter") {
      ans();
    }
  };

  return (
    <div>
      <h2>Hello, Generative AI!</h2>

      <ul>
        {allQueries.map((q) => (
          <li key={q.id}>{q.que}</li> // 👈 unique and stable ID
        ))}
      </ul>

      <input
        type="text"
        onChange={(e) => setInput(e.target.value)}
        value={input}
        placeholder="input..."
        onKeyDown={keyEvent}
      />

      <button onClick={ans}>answer</button>

      <pre
        style={{
          whiteSpace: "pre-wrap",
          marginTop: "20px",
          fontSize: "16px",
          lineHeight: "1.5",
          width: "50%",
          padding: "10px",
          borderRadius: "5px",
        }}
      >
        {typing}
      </pre>
    </div>
  );
};

export default App;
