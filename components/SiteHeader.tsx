import { Container, Dropdown, Nav, Navbar, NavDropdown } from "react-bootstrap";
import Link from "next/link";
import { useState } from "react";

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
  const [showMenus, setShowMenus] = useState(
    problems.map((topic) => ({
      show: false,
      showChildren: topic.children.map((child) => false),
    }))
  );

  const setShowTopic = (topicIndex: number, show: boolean) =>
    setShowMenus((prevShowMenus) =>
      prevShowMenus.map((element, index) =>
        index === topicIndex
          ? {
              showChildren: element.showChildren,
              show: show,
            }
          : element
      )
    );

  const setShowSubTopic = (
    topicIndex: number,
    subTopicIndex: number,
    show: boolean
  ) => {
    setShowMenus((prevShowMenus) =>
      prevShowMenus.map((element, index) =>
        index === topicIndex
          ? {
              showChildren: element.showChildren.map((subElement, subIndex) =>
                subIndex === subTopicIndex ? show : subElement
              ),
              show: element.show,
            }
          : element
      )
    );
  };

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
                title={
                  <Link href={`/${topic.shortName}`} passHref>
                    {topic.longName}
                  </Link>
                }
                onMouseOver={() => setShowTopic(topicIndex, true)}
                onMouseLeave={() => setShowTopic(topicIndex, false)}
                show={showMenus[topicIndex].show}
              >
                {topic.children.map((subTopic, subTopicIndex) => (
                  <NavDropdown
                    drop="end"
                    key={subTopicIndex}
                    title={
                      <Link
                        href={`/${topic.shortName}/${subTopic.shortName}`}
                        passHref
                      >
                        {subTopic.longName}
                      </Link>
                    }
                    onMouseOver={() =>
                      setShowSubTopic(topicIndex, subTopicIndex, true)
                    }
                    onMouseLeave={() =>
                      setShowSubTopic(topicIndex, subTopicIndex, false)
                    }
                    show={showMenus[topicIndex].showChildren[subTopicIndex]}
                  >
                    {subTopic.children.map((problem, problemIndex) => (
                      <Link
                        key={problemIndex}
                        href={`/${topic.shortName}/${subTopic.shortName}/${problem.shortName}`}
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
