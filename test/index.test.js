import { mountWithIntl } from "enzyme-react-intl";
import App from "../pages/home";

describe("Basic Test", () => {
  it('App shows "hello, world"', () => {
    const app = mountWithIntl(<App />);
    expect(app.find("h1").text()).toEqual("Hello, world!");
  });
});
