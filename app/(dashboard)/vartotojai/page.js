"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function VartotojuSarasas() {
  const [vartotojai, setVartotojai] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("https://localhost:7237/api/Vartotojai", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) setVartotojai(await res.json());
    };
    fetchUsers();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Sistemos vartotojai</h2>
      <table className="table table-hover bg-white shadow-sm rounded">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Vardas Pavardė</th>
            <th>El. paštas</th>
            <th>Rolė</th>
            <th>Veiksmai</th>
          </tr>
        </thead>
        <tbody>
          {vartotojai.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.vardas} {u.pavarde}</td>
              <td>{u.elPastas}</td>
              <td><span className="badge bg-info text-dark">{u.role}</span></td>
              <td>
                <Link href={`/vartotojai/redaguoti/${u.id}`} className="btn btn-sm btn-outline-primary">
                  Redaguoti
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}