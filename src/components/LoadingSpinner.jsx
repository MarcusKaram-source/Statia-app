export default function LoadingSpinner({
  size = 40,
  color = "var(--gold)",
  trackColor = "rgba(201,168,76,0.3)",
  thickness = 3,
  style = {}
}) {
  return (
    <div style={{
      width: size,
      height: size,
      border: `${thickness}px solid ${trackColor}`,
      borderTopColor: color,
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
      ...style
    }} />
  );
}
