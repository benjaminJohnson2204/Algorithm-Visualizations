import {
  Container,
  Dropdown,
  Nav,
  Navbar,
  NavDropdown,
  NavItem,
  SSRProvider,
} from "react-bootstrap";
import Link from "next/link";
import { DropdownSubmenu, NavDropdownMenu } from "react-bootstrap-submenu";

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
    <Navbar collapseOnSelect bg="success" variant="dark" expand="lg">
      <Container fluid>
        <Link href="/" passHref>
          <Navbar.Brand>Home</Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="navbar" />
        <Navbar.Collapse id="navbar">
          <Nav className="me-auto">
            {problems.map((topic, topicIndex) => (
              <NavDropdownMenu
                key={topicIndex}
                title={topic.longName}
                id={topic.shortName}
              >
                {topic.children.map((subTopic, subTopicIndex) => (
                  <Dropdown.Item key={subTopicIndex}>
                    <Dropdown drop="end" autoClose="outside">
                      <Dropdown.Toggle>{subTopic.longName}</Dropdown.Toggle>
                      <Dropdown.Menu>
                        {subTopic.children.map((problem, problemIndex) => (
                          <Link
                            key={problemIndex}
                            href={`${topic.shortName}/${subTopic.shortName}/${problem.shortName}`}
                            passHref
                          >
                            <Dropdown.Item>{problem.longName}</Dropdown.Item>
                          </Link>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  </Dropdown.Item>
                  //   <DropdownSubmenu
                  //     className="dropend"
                  //     key={subTopicIndex}
                  //     title={subTopic.longName}
                  //   >
                  //     {subTopic.children.map((problem, problemIndex) => (
                  //       <Link
                  //         key={problemIndex}
                  //         href={`${topic.shortName}/${subTopic.shortName}/${problem.shortName}`}
                  //         passHref
                  //       >
                  //         <Dropdown.Item>{problem.longName}</Dropdown.Item>
                  //       </Link>
                  //     ))}
                  //   </DropdownSubmenu>
                ))}
              </NavDropdownMenu>
            ))}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default SiteHeader;
