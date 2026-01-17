import axios from 'axios';
export async function CreateProjectAPI(data) {
  try {
    const res = await fetch("http://localhost:8080/api/project/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include", // IMPORTANT for auth cookies
      body: JSON.stringify(data)
    });

    const result = await res.json();

    return {
      status: res.status,
      success: res.ok,
      data: result
    };

  } catch (error) {
    console.error("CreateProjectAPI Error:", error);
    return {
      status: 500,
      success: false,
      error: error.message
    };
  }
}

