const API_BASE = "https://insightiq-earu.onrender.com/api";

export const registerUser = async (userData) => {
  try {
    const res = await fetch("https://insightiq-earu.onrender.com/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await res.json();

    if (res.ok && data.token) {
      return {
        token: data.token,
        user: data.user,
        message: data.message,
      };
    } else {
      return { error: data.message || data.error || "Registration failed" };
    }
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "Network error" };
  }
};


export async function loginUser(data) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  return res.json();
}

export const fetchMetrics = async () => {
  try {
    const res = await fetch(`${API_BASE}/metrics`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await res.json();
    return res.ok ? data : [];
  } catch (err) {
    console.error("Error fetching metrics:", err);
    return [];
  }
};

// ✅ Fetch AI summary
export const fetchSummary = async () => {
  try {
    const res = await fetch(`${API_BASE}/summary`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await res.json();
    return res.ok ? data : { summary: "Failed to load summary." };
  } catch (err) {
    console.error("Error fetching summary:", err);
    return { summary: "Error fetching summary." };
  }
};