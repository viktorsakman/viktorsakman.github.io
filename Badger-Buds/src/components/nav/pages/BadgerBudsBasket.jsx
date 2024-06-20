import { useState, useEffect, useContext } from "react"
import { Col, Row } from "react-bootstrap"
import Summary from "./BadgerBudSummary"
import BadgerBudsDataContext from "../../../contexts/BadgerBudsDataContext"

export default function BadgerBudsBasket(props) {

    const buddies = useContext(BadgerBudsDataContext)
    const [savedCatIds, setSavedCatIds] = useState(JSON.parse(sessionStorage.getItem("savedCatIds")) || [])
    const [adoptedCatIds, setAdoptedCatIds] = useState(JSON.parse(sessionStorage.getItem("adoptedCatIds")) || [])
    const [filteredBuddies, setFilteredBuddies] = useState([])

    useEffect(() => {
        const filteredBuddies = buddies.filter((buddy) => savedCatIds.includes(buddy.id) && !adoptedCatIds.includes(buddy.id))
        setFilteredBuddies(filteredBuddies)
    }, [buddies, savedCatIds, adoptedCatIds])

    const handleUnsave = (removedId) => {
        setSavedCatIds(savedCatIds.filter(_ => _ !== removedId))
    }

    const handleAdopt = (adoptedId) => {
        setAdoptedCatIds((_) => [..._, adoptedId])
    }

    return <div>
        <h1>Badger Buds Basket</h1>
        <p>These cute cats could be all yours!</p>
            <Row>
                {
                    filteredBuddies.length === 0 ? <p>You have no buds in your basket!</p>:
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
                                unsave={() => handleUnsave(buddy.id)}
                                adopt={() => handleAdopt(buddy.id)}
                            />
                        </Col>
                    })
                }
            </Row>
        <br />
    </div>
}