import { Container, Dropdown, Nav, Navbar, NavDropdown } from "react-bootstrap";
import Link from "next/link";

const problems = [
  {
    shortName: "dsa",
    longName: "Data Structures and Algorithms",
    children: [
      {
        shortName: "array",
        longName: "Arrays",
        children: [
          {
            shortName: "sort",
            longName: "Sorting",
          },
        ],
      },
      {
        shortName: "linked-list",
        longName: "Linked Lists",
        children: [],
      },
    ],
  },
];

const SiteHeader = () => {
  return (
    <Navbar collapseOnSelect bg="info" variant="light" expand="lg">
      <Container fluid>
        <Link href="/" passHref>
          <Navbar.Brand>Home</Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="navbar" />
        <Navbar.Collapse id="navbar">
          <Nav className="me-auto">
            {problems.map((topic, topicIndex) => (
              <NavDropdown
                key={topicIndex}
                id={topic.shortName}
                title={topic.longName}
              >
                {topic.children.map((subTopic, subTopicIndex) => (
                  <NavDropdown
                    drop="end"
                    key={subTopicIndex}
                    title={subTopic.longName}
                  >
                    {subTopic.children.map((problem, problemIndex) => (
                      <Link
                        key={problemIndex}
                        href={`${topic.shortName}/${subTopic.shortName}/${problem.shortName}`}
                        passHref
                      >
                        <Dropdown.Item>{problem.longName}</Dropdown.Item>
                      </Link>
                    ))}
                  </NavDropdown>
                ))}
              </NavDropdown>
            ))}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default SiteHeader;
