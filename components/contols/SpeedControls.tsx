import { Col, Form, Row } from "react-bootstrap";

export default function SpeedControls(props: {
  setTransitionDuration: (duration: number) => void;
}) {
  return (
    <Form>
      <Row>
        <h4>Animation speed</h4>
        <Form.Group>
          <Form.Range
            min="0"
            max="500"
            step="50"
            onChange={(event) =>
              props.setTransitionDuration(parseInt(event.target.value))
            }
          />
        </Form.Group>
      </Row>

      <Row>
        <Col>Fast</Col>
        <Col style={{ textAlign: "right" }}>Slow</Col>
      </Row>
    </Form>
  );
}
