// Stub implementation for security score
export const useSecurityScore = () => ({
  data: 85,
  loading: false,
  error: null,
  refetch: () => Promise.resolve({ data: 85 }),
});
