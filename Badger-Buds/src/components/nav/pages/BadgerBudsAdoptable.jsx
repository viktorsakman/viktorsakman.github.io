import { useState, useEffect, useContext } from "react"
import { Col, Row } from "react-bootstrap"
import Summary from "./BadgerBudSummary"
import BadgerBudsDataContext from "../../../contexts/BadgerBudsDataContext"

export default function BadgerBudsAdoptable(props) {
    
    const buddies = useContext(BadgerBudsDataContext)
    const [savedCatIds, setSavedCatIds] = useState(JSON.parse(sessionStorage.getItem("savedCatIds")) || [])
    const [adoptedCatIds, setAdoptedCatIds] = useState(JSON.parse(sessionStorage.getItem("adoptedCatIds")) || [])
    const [filteredBuddies, setFilteredBuddies] = useState([])

    useEffect(() => {
        const filteredBuddies = buddies.filter((buddy) => !savedCatIds.includes(buddy.id) && !adoptedCatIds.includes(buddy.id))
        setFilteredBuddies(filteredBuddies)
    }, [buddies, savedCatIds, adoptedCatIds])

    const handleSave = (newId) => {
        setSavedCatIds((_) => [..._, newId])
    }

    return <div>
        <h1>Available Badger Buds</h1>
        <p>The following cats are looking for a loving home! Could you help?</p>
            <Row>
                {
                    filteredBuddies.length === 0 ? <p>No buds are available for adoption!</p>:
                    filteredBuddies.map(buddy => {
                        return <Col key={buddy.id} xs={12} sm={6} md={4} lg={3}>
                            <Summary
                                id={buddy.id}
                                name={buddy.name}
                                age={buddy.age}
                                breed={buddy.breed}
                                gender={buddy.gender}
                                description={buddy.description}
                                imgIds={buddy.imgIds}
                                save={() => handleSave(buddy.id)}
                            />
                        </Col>
                    })
                }
            </Row>
        <br />
    </div>
}