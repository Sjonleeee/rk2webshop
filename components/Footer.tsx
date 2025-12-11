export default function Footer() {
  return (
    <footer style={{
      textAlign: "center",
      padding: "1rem 2rem",
      backgroundColor: "#f8f9fa",
      borderTop: "1px solid #e9ecef",
      marginTop: "auto",
    }}>
      <p>&copy; {new Date().getFullYear()} R/K2© Webshop. All rights reserved.</p>
    </footer>
  );
}