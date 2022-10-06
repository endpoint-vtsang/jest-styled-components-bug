import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StyledButton } from "./StyledButton";

describe("Button", () => {
  it("renders the component", () => {
    const { container } = render(<StyledButton />);

    expect(container).toMatchSnapshot();
  });

  it("renders a focus ring", async () => {
    render(<StyledButton />);

    const myButton = screen.getByRole("button");

    await userEvent.tab();

    await expect(myButton).toHaveFocus();
    await expect(myButton).toHaveStyleRule("box-shadow", "green", {
      modifier: "&:focus-visible:not(:disabled)",
    });
  });
});
