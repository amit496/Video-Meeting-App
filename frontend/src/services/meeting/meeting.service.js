const API_URL = "http://localhost:5000/api";

export async function createMeeting() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/meetings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({}),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create meeting");
  }

  return data;
}

export async function joinMeeting(roomId) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/meetings/join`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      roomId,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to join meeting");
  }

  return data;
}