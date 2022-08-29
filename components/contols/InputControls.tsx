import { Button, Form } from "react-bootstrap";

export default function InputControls(props: {
  setCustomInput: (customInput: string) => void;
  setRandomInput: (randomInputLength: number) => void;
}) {
  let randomInputLength = 5;

  return (
    <Form
      onSubmit={(event: React.ChangeEvent<any>) => {
        event.preventDefault();
        props.setCustomInput(event.target[0].value);
      }}
    >
      <Form.Group>
        <h4>Custom Input</h4>
        <Form.Control type="text" />
      </Form.Group>
      <Button type="submit">Set</Button>
      <h4>Random Input</h4>
      <Form.Group>
        <Form.Label>Size</Form.Label>
        <Form.Range
          min="1"
          max="200"
          defaultValue={"5"}
          onChange={(event) =>
            (randomInputLength = parseInt(event.target.value))
          }
        />
      </Form.Group>

      <Button onClick={() => props.setRandomInput(randomInputLength)}>
        Set
      </Button>
    </Form>
  );
}
