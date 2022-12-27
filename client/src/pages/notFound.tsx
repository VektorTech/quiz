import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="section">
      <h2>404</h2>
      <p>page not found</p>
      <Link to="/">back home</Link>
    </section>
  );
}
