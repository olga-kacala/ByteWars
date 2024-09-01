import { render, screen } from "@testing-library/react";
import { Header } from "./Header";
import { BrowserRouter as Router } from "react-router-dom";

describe("Header Component", () => {
  it("renders without crashing", () => {
    render(
      <Router>
        <Header />
      </Router>
    );
  });

  it("displays the correct title text", () => {
    render(
      <Router>
        <Header />
      </Router>
    );
    expect(screen.getByText(/Byte W/i)).toBeInTheDocument();
    expect(screen.getByText(/AI vs Hum/i)).toBeInTheDocument();
  });

  it('contains a link that points to the root path "/"', () => {
    render(
      <Router>
        <Header />
      </Router>
    );
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/");
  });
  
});
