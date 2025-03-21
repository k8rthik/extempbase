"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ShimmerButton from "@/components/ShimmerButton";

const OutlineForm = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [thesis, setThesis] = useState("");
  const [points, setPoints] = useState(["", "", ""]);
  const [error, setError] = useState<string | null>(null);

  const changePoint = (index: number, value: string) => {
    const updatedPoints = [...points];
    updatedPoints[index] = value;
    console.log(updatedPoints);
    setPoints(updatedPoints);
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  // Function with no parameters for the ShimmerButton onClick
  const handleButtonClick = () => {
    // The form submit handler will be triggered by the form's onSubmit event
    // This function is just to satisfy the type requirements
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Submit Your Outline</h2>
      {error && <div className="mb-4 text-red-500">{error}</div>}
      <form onSubmit={handleSubmit}>
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
            rows={3}
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
              rows={2}
              placeholder={`Main Point ${index + 1}`}
            ></textarea>
          ))}
        </div>
        <button type="submit" style={{ display: "none" }}></button>
        <ShimmerButton
          onClick={handleButtonClick}
          className="px-4 py-2 text-white rounded disabled:opacity-50"
        >
          Submit Outline
        </ShimmerButton>
      </form>
    </div>
  );
};

export default OutlineForm;
