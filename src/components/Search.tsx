import { useState } from "react"

export default function Search() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div>
      <input 
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search..."
        className="border p-2 rounded"
      />
    </div>
  )
} 