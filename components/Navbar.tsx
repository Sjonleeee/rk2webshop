export default function Navbar() {
  return (
    <nav style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "1rem 2rem",
      backgroundColor: "#f8f9fa",
      borderBottom: "1px solid #e9ecef",
    }}>
      <div style={{ fontWeight: "bold", fontSize: "1.5rem" }}>R/K2©</div>
      <ul style={{
        display: "flex",
        listStyle: "none",
        gap: "1.5rem",
        margin: 0,
        padding: 0,
      }}>
        <li><a href="#">Home</a></li>
        <li><a href="#">Shop</a></li>
        <li><a href="#">About</a></li>
        <li><a href="#">Contact</a></li>
      </ul>
    </nav>
  );
}