import { useEffect, useState } from "react"
import { Table } from "react-bootstrap"
import { useParams } from "react-router";
import API from "../API"

function LeaderBoardComponent() {

    const [leaderBoard, setLeaderBoard] = useState([])
    // const params = useParams();
    
    
    useEffect(() => {
        const getTop3  = async () => {
            await API.getTop3().then((data) => {
                setLeaderBoard(data.data)
            })}
        getTop3();
        }, [])
    
    // useEffect(() => {
    //     API.getTop3().then((data) => {
    //         setLeaderBoard(data.data)
    //     })
    // }, [])

    return <div className="container">
        <h3>Hall Of Fame</h3>
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Total Score</th>
                </tr>
            </thead>
            <tbody>
                {leaderBoard.map((u) => {
                    return <tr>
                        <td>{u.name}</td>
                        <td>{u.score}</td>
                    </tr>
                })}
            </tbody>
        </Table></div>
}

export { LeaderBoardComponent };