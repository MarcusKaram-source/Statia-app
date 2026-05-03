export default function LoadingSpinner({ size = 40, color = "var(--gold)" }) {
  return (
    <div style={{
      width: size,
      height: size,
      border: `3px solid ${color}33`,
      borderTopColor: color,
      borderRadius: "50%",
      animation: "spin 1s linear infinite"
    }} />
  );
}