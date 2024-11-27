
import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [domainFilter, setDomainFilter] = useState("all");
  const [specializationFilter, setSpecializationFilter] = useState("all");
  const navigate = useNavigate();
  const fetchStudents = async () => {
    const apiUrl = "http://localhost:8000/api/v1/student";
    try {
      const token = localStorage.getItem("jwtToken");

      if (!token) {
        console.error("No token found in localStorage. Authorization is required.");
        setError("Authorization required. Please log in.");
        setLoading(false);
        return;
      }

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch student data: ${response.statusText}`);
      }

      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDomainFilterChange = async (event) => {
    const domain = event.target.value;
    setDomainFilter(domain);

    if (domain === "all") {
      fetchStudents();
      return;
    }

    try {
      const token = localStorage.getItem("jwtToken");
      const response = await fetch(`http://localhost:8000/api/v1/student/domain/${domain}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch students by domain: ${response.statusText}`);
      }

      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students by domain:", error);
      setError("Failed to filter students by domain.");
    }
  };

  const handleSpecializationFilterChange = async (event) => {
    const specialization = event.target.value;
    setSpecializationFilter(specialization);

    if (specialization === "all") {
      fetchStudents();
      return;
    }

    try {
      const token = localStorage.getItem("jwtToken");
      const response = await fetch(
        `http://localhost:8000/api/v1/student/specialization/${specialization}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch students by specialization: ${response.statusText}`);
      }

      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students by specialization:", error);
      setError("Failed to filter students by specialization.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("isLoggedIn");
    console.log("Logged out successfully.");
    return navigate("/");
  }

  const handleCalculateSpecializations = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await fetch("http://localhost:8000/api/v1/student/calculate", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to calculate specializations: ${response.statusText}`);
      }

      const message = await response.text();
      console.log("Calculation completed:", message);
      alert("Specialization calculation completed successfully.");
      fetchStudents(); // Refresh the table
    } catch (error) {
      console.error("Error calculating specializations:", error);
      setError("Failed to calculate specializations.");
    }
  };

  // Filter students based on the selected filters
  const filteredStudents = students.filter((student) => {
    const matchesDomain =
      domainFilter === "all" ||
      student.domainProgram.toLowerCase() === domainFilter.toLowerCase();
    const matchesSpecialization =
      specializationFilter === "all" ||
      student.specialisationName.toLowerCase() === specializationFilter.toLowerCase();
    return matchesDomain && matchesSpecialization;
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1 className="text-center">Student Dashboard</h1>
      <div className="filters">
        <label htmlFor="domain">Filter by Domain:</label>
        <select id="domain" onChange={handleDomainFilterChange}>
          <option value="all">All</option>
          <option value="cse">CSE</option>
          <option value="ece">ECE</option>
          <option value="mechanical">Mechanical</option>
        </select>
        <label htmlFor="specialization">Filter by Specialization:</label>
        <select id="specialization" onChange={handleSpecializationFilterChange}>
          <option value="all">All</option>
          <option value="data science">Data Science</option>
          <option value="computer science">Computer Science</option>
          <option value="ece">ECE</option>
        </select>
        <button onClick={handleCalculateSpecializations} className="btn btn-primary ml-2">
          Recalculate Specializations
        </button>
        <button onClick={handleLogout} className="btn btn-danger ml-4 logout">
          Logout
        </button>
      </div>
      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Roll Number</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Photograph</th>
            <th>CGPA</th>
            <th>Total Credits</th>
            <th>Graduation Year</th>
            <th>Domain</th>
            <th>Specialization</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((student) => (
            <tr key={student.studentId}>
              <td>{student.firstName} {student.lastName}</td>
              <td>{student.rollNumber}</td>
              <td>{student.firstName}</td>
              <td>{student.lastName}</td>
              <td>{student.email}</td>
              <td>
                <img
                  src={student.photographPath || "/default-image.png"}
                  alt={`${student.firstName} ${student.lastName}'s photograph`}
                  width="50"
                />
              </td>
              <td>{student.cgpa}</td>
              <td>{student.totalCredits}</td>
              <td>{student.graduationYear}</td>
              <td>{student.domainProgram}</td>
              <td>{student.specialisationName || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
