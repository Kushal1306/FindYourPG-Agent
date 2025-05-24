import React, { useState, useRef } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";

const languages = {
  python: { id: 71, label: "Python", monacoLang: "python" },
  javascript: { id: 63, label: "JavaScript", monacoLang: "javascript" },
  cpp: { id: 54, label: "C++", monacoLang: "cpp" },
};

const starterCodes = {
  python: `def reverse_string(s):\n    # your code here\n    return s`,
  javascript: `function reverseString(s) {\n  // your code here\n  return s;\n}`,
  cpp: `#include <iostream>\n#include <string>\nusing namespace std;\n\nstring reverseString(string s) {\n    // your code here\n    return s;\n}`
};

const  CodeEditor = () => {
  const [selectedLang, setSelectedLang] = useState("python");
  const [code, setCode] = useState(starterCodes.python);
  const [output, setOutput] = useState("");
  const editorRef = useRef(null);

  const handleLangChange = (e) => {
    const lang = e.target.value;
    setSelectedLang(lang);
    setCode(starterCodes[lang]);
  };

  const handleRun = async () => {
    const source_code = editorRef.current.getValue();
    console.log("the source code is:",source_code);
    const langConfig = languages[selectedLang];

    const payload = {
      source_code,
      language_id: langConfig.id,
      stdin: "\"hello\""
    };

    try {
    //   const res = await axios.post(
    //     "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true",
    //     payload,
    //     {
    //       headers: {
    //         "content-type": "application/json",
    //         "X-RapidAPI-Key": "YOUR_RAPID_API_KEY",
    //         "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com"
    //       }
    //     }
    //   );

    //   setOutput(res.data.stdout || res.data.stderr || "No output");
    } catch (err) {
      setOutput("Error running code");
      console.error(err);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-2">🧾 Problem: Reverse a String</h2>
      <p className="mb-4">Write a function that takes a string and returns the reversed string.</p>

      <div className="mb-4">
        <label htmlFor="language" className="mr-2 font-medium">Select Language:</label>
        <select
          id="language"
          value={selectedLang}
          onChange={handleLangChange}
          className="border px-2 py-1"
        >
          {Object.entries(languages).map(([key, val]) => (
            <option key={key} value={key}>{val.label}</option>
          ))}
        </select>
      </div>

      <Editor
        height="300px"
        language={languages[selectedLang].monacoLang}
        value={code}
        onMount={(editor) => (editorRef.current = editor)}
      />

      <button
        onClick={handleRun}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        ▶️ Run Code
      </button>

      <div className="mt-4 bg-gray-100 p-4 rounded">
        <strong>🧪 Output:</strong>
        <pre>{output}</pre>
      </div>
    </div>
  );
};

export default  CodeEditor;
