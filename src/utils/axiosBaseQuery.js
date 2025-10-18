export const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: "" }) =>
  async ({ url, method, data, params }, { getState }) => {
    try {
      const token = getState().auth.token;

      const fullUrl = `${baseUrl}${url}`;

      const result = await fetch(fullUrl, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: data ? JSON.stringify(data) : undefined,
      });

      const json = await result.json();

      if (!result.ok) {
        return {
          error: {
            status: result.status,
            data: json,
          },
        };
      }

      return { data: json };
    } catch (err) {
      return {
        error: {
          status: err.response?.status || 500,
          data: err.response?.data || err.message,
        },
      };
    }
  };
