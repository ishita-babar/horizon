import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <main className="landing-container">
      <Navbar />
      <img src="/horizon.png" alt="Horizon" className="horizon-image" />
      <h1 className="landing-text">A Brighter Tomorrow <br /> Begins Now.</h1>
    </main>
  );
}
