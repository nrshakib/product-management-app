export const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: "" }) =>
  async ({ url, method, data, params }, { getState }) => {
    try {
      const token = getState().auth.token; // grab token from Redux
      const result = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: data ? JSON.stringify(data) : undefined,
      });
      const json = await result.json();
      return { data: json };
    } catch (err) {
      return {
        error: { status: err.response?.status, data: err.response?.data },
      };
    }
  };
