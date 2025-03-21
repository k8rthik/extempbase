"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ShimmerButton from "@/components/ShimmerButton";

const OutlineForm = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [thesis, setThesis] = useState("");
  const [points, setPoints] = useState(["", "", ""]);
  const [error, setError] = useState(null);

  const changePoint = (index, value) => {
    const updatedPoints = [...points];
    updatedPoints[index] = value;
    console.log(updatedPoints);
    setPoints(updatedPoints);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const payload = { title, thesis, points };
    console.log(payload);

    try {
      const res = await fetch("/api/outlines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error("Failed to submit outline");
      }
      setTitle("");
      setThesis("");
      setPoints(["", "", ""]);
      router.push("/outlines");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Submit Your Outline</h2>
      {error && <div className="mb-4 text-red-500">{error}</div>}

      <div className="mb-4">
        <label htmlFor="title" className="block mb-1 font-medium">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="thesis" className="block mb-1 font-medium">
          Thesis
        </label>
        <textarea
          id="thesis"
          value={thesis}
          onChange={(e) => setThesis(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded"
          rows="3"
        ></textarea>
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Main Points</label>
        {points.map((point, index) => (
          <textarea
            key={index}
            value={point}
            onChange={(e) => changePoint(index, e.target.value)}
            required
            className="w-full px-3 py-2 border rounded mb-2"
            rows="2"
            placeholder={`Main Point ${index + 1}`}
          ></textarea>
        ))}
      </div>

      <ShimmerButton
        type="submit"
        onClick={handleSubmit}
        className="px-4 py-2 text-white rounded disabled:opacity-50"
      >
        Submit Outline
      </ShimmerButton>
    </div>
  );
};

export default OutlineForm;
