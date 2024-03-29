import { Container, Dropdown, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';

const problems = [
  {
    shortName: 'dsa',
    longName: 'Data Structures and Algorithms',
    children: [
      {
        shortName: 'array',
        longName: 'Arrays',
        children: [
          {
            shortName: 'sort',
            longName: 'Sorting',
          },
        ],
      },
      {
        shortName: 'linked-list',
        longName: 'Linked Lists',
        children: [
          {
            shortName: 'reverse',
            longName: 'Reverse a Linked List',
          },
          {
            shortName: 'detect-cycle',
            longName: 'Detect a Cycle in a Linked List',
          },
          {
            shortName: 'remove-nth-from-end',
            longName: 'Remove Nth Node from End of Linked List',
          },
        ],
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

  const router = useRouter();

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
    <Navbar collapseOnSelect bg='info' variant='light' expand='lg'>
      <Container fluid>
        <Link href='/' passHref>
          <Navbar.Brand>Home</Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls='navbar' />
        <Navbar.Collapse id='navbar'>
          <Nav className='me-auto'>
            <Navbar.Brand
              href='https://github.com/benjaminJohnson2204/Algorithm-Visualizations'
              rel='noopener noreferrer'
              target='_blank'
            >
              Source Code
            </Navbar.Brand>
            {problems.map((topic, topicIndex) => (
              <NavDropdown
                key={topicIndex}
                id={topic.shortName}
                title={
                  <text onClick={() => router.push(`/${topic.shortName}`)}>
                    {topic.longName}
                  </text>
                }
                onMouseOver={() => setShowTopic(topicIndex, true)}
                onMouseLeave={() => setShowTopic(topicIndex, false)}
                show={showMenus[topicIndex].show}
              >
                {topic.children.map((subTopic, subTopicIndex) => (
                  <NavDropdown
                    drop='end'
                    key={subTopicIndex}
                    title={
                      <text
                        onClick={() =>
                          router.push(
                            `/${topic.shortName}/${subTopic.shortName}`
                          )
                        }
                      >
                        {subTopic.longName}
                      </text>
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
                      <Dropdown.Item
                        key={problemIndex}
                        onClick={() =>
                          router.push(
                            `/${topic.shortName}/${subTopic.shortName}/${problem.shortName}`
                          )
                        }
                      >
                        {problem.longName}
                      </Dropdown.Item>
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
