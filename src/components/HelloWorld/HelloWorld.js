import { FormattedMessage, defineMessages } from "react-intl";

export const messages = defineMessages({
  hello: "Hello, world!"
});

export default function HelloWorld() {
  return (
    <h1>
      <FormattedMessage {...messages.hello} />
    </h1>
  );
}
