import { useState } from "react";
import { Button, Form } from "react-bootstrap";

export default function InputControls(props: {
  maxLength: number;
  invalid?: boolean;
  defaultInput: string;
  setCustomInput: (customInput: string) => void;
  setRandomInput: (randomInputLength: number) => void;
}) {
  const [randomInputLength, setRandomInputLength] = useState(5);
  return (
    <Form
      onSubmit={(event: React.ChangeEvent<any>) => {
        event.preventDefault();
        props.setCustomInput(event.target[0].value);
      }}
    >
      <Form.Group>
        <h4>Custom Input</h4>
        <Form.Control type='text' defaultValue={props.defaultInput} />
      </Form.Group>
      {props.invalid && <p className='text-danger'>Invalid input</p>}
      <Button type='submit'>Set</Button>
      <h4>Random Input</h4>
      <Form.Group>
        <Form.Label>Size</Form.Label>
        <Form.Range
          min='1'
          max={props.maxLength.toString()}
          defaultValue={"5"}
          onChange={(event) =>
            setRandomInputLength(parseInt(event.target.value))
          }
        />
      </Form.Group>

      <Button onClick={() => props.setRandomInput(randomInputLength)}>
        Set
      </Button>
    </Form>
  );
}

