import { useState, useEffect } from "react"
import { Button, Card, Carousel } from "react-bootstrap"

const Summary = (props) => {
    const [showMore, setShowMore] = useState(false)

    const handleShowMore = () => {
        setShowMore(!showMore)
    }

    const handleSave = () => {
        let savedCatIds = JSON.parse(sessionStorage.getItem("savedCatIds")) || []
        if (!savedCatIds.includes(props.id)) {
            savedCatIds.push(props.id)
            sessionStorage.setItem("savedCatIds", JSON.stringify(savedCatIds))
            props.save()
            alert(`${props.name} has been added to your basket!`)
        }
    }

    const handleUnsave = () => {
        let savedCatIds = JSON.parse(sessionStorage.getItem("savedCatIds")) || []
        if (savedCatIds.includes(props.id)) {
            savedCatIds = savedCatIds.filter(_ => _ !== props.id)
            sessionStorage.setItem("savedCatIds", JSON.stringify(savedCatIds))
            props.unsave()
            alert(`${props.name} has been removed from your basket!`)
        }
    }

    const handleAdopt = () => {
        let savedCatIds = JSON.parse(sessionStorage.getItem("savedCatIds")) || []
        let adoptedCatIds = JSON.parse(sessionStorage.getItem("adoptedCatIds")) || []
        if (savedCatIds.includes(props.id)) {
            savedCatIds = savedCatIds.filter(_ => _ !== props.id)
            adoptedCatIds.push(props.id)
            sessionStorage.setItem("savedCatIds", JSON.stringify(savedCatIds))
            sessionStorage.setItem("adoptedCatIds", JSON.stringify(adoptedCatIds))
            props.adopt()
            alert(`${props.name} has been adopted!`)
        }
    }

    return (
        <Card style={{ margin: "0.25rem", height: showMore ? "900px" : "500px"}}>
            {(() => {
                if (showMore) {
                    return (
                        <Carousel> {
                            props.imgIds.map((imgId, index) => (
                            <Carousel.Item key={index}>
                                <img
                                    className="d-block w-100"
                                    src={"https://raw.githubusercontent.com/CS571-F23/hw5-api-static-content/main/cats/" + imgId}
                                    alt={`Image ${index + 1} of ${props.name}`}
                                    style={{
                                        objectFit: "cover",
                                        height: "400px",
                                    }}
                                />
                            </Carousel.Item>
                            ))
                        }
                        </Carousel>
                    )
                } else {
                    return (
                        <Card.Img
                            src={"https://raw.githubusercontent.com/CS571-F23/hw5-api-static-content/main/cats/" + props.imgIds[0]}
                            alt={`A picture of ${props.name}`}
                            style={{
                                objectFit: "cover",
                                height: showMore ? "45%" : "70%",
                            }}
                        />
                    )
                }
            })()}
            <Card.Body>
                <h2 style={{ fontSize: "1.25rem" }}>{props.name}</h2>
                <p> {(() => {
                    if (showMore) {
                        return <p>
                            {props.gender} <br></br><br></br>
                            {props.breed} <br></br><br></br>
                            {(() => {
                                if (props.age >= 12) {
                                    if (props.age % 12 == 0) {
                                        return `${Math.floor(props.age / 12)} year(s) old`
                                    } else {
                                        return `${Math.floor(props.age / 12)} year(s) and ${props.age % 12} month(s) old`
                                    }
                                } else {
                                    return `${props.age} month(s) old`
                                }
                            })()} <br></br><br></br>
                            {props.description}
                        </p>
                    }
                })()}</p>
                {(() => {
                    let savedCatIds = JSON.parse(sessionStorage.getItem("savedCatIds")) || []
                    if (!savedCatIds.includes(props.id)) {
                        return <>
                            <Button style = {{ marginRight: "0.5rem"}} variant="primary" onClick={handleShowMore}>{
                                showMore ? "Show Less" : "Show More"
                            }</Button>
                            <Button variant="secondary" onClick={handleSave}>❤️ Save</Button>
                        </>
                    } else {
                        return <>
                            <Button style = {{ marginRight: "0.5rem"}} variant="secondary" onClick={handleUnsave}>Unselect</Button>
                            <Button variant="success" onClick={handleAdopt}>💕 Adopt</Button>
                        </>
                    }
                })()}
            </Card.Body>
        </Card>
    )
}

export default Summary