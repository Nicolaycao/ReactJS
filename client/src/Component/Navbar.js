import { Navbar, Nav, Form, Button } from 'react-bootstrap';

const NavBar = ({ loggedIn, logout }) => {
    return <>
        <Navbar bg="dark" variant="dark">
            <Navbar.Brand href="#home">Navbar</Navbar.Brand>
            <Nav className="mr-auto">
                <Nav.Link href="/">Home</Nav.Link>
                <Nav.Link href="/top3">LeaderBoard</Nav.Link>
                {loggedIn && <><Nav.Link href="/admin">Admin DashBoard</Nav.Link>
                </>}
            </Nav>
            <Form inline>
                {loggedIn ? <Button variant="outline-info" onClick={logout}>Logout</Button> : <Nav.Link href="/login">Login as Admin</Nav.Link>}
            </Form>
        </Navbar>
    </>
}

export { NavBar }