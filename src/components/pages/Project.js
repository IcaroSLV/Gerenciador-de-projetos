import styles from './Project.module.css'

import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {parse, v4 as uuidv4} from 'uuid'

import Loading from '../Layout/Loading'
import Container from '../Layout/Container'
import ProjectForm from '../project/ProjectForm'
import Message from '../Layout/Message'
import ServiceForm from '../Service/ServiceForm'
import ServiceCard from '../Service/ServiceCard'

function Project(){

    const {id} = useParams()
    
    const [project, setProject] = useState({})
    const [services, setServices] = useState([])
    const [showProjectFrom, setShowProjectForm] = useState(false)
    const [showServiceFrom, setShowServiceForm] = useState(false)
    const [message, setMessage] = useState()
    const [type, setType] = useState()

    useEffect(() => {
        fetch(`http://localhost:5000/projects/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        })
        .then((resp) => resp.json())
        .then((data) => {
            setServices(data.services)
            setProject(data)
        })
        .catch((err) => console.log(err))

    }, [id] )

    function editPost(project) {    
        setMessage("")
        setType("")


        if(project.budget < project.cost) {
            setMessage("O Orçamento não pode ser menor que o custo do serviço!")
            setType("error")
            return false
        }

        fetch(`http://localhost:5000/projects/${project.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(project)
        })
        .then((resp) => resp.json())
        .then((data) => {
            
            setProject(data)
            setShowProjectForm(false)
            setMessage("Projeto Atualizado!")
            setType("sucess")

    
        })
        .catch((err) => console.log(err))
    }

    function toggleProjectForm() {
        setShowProjectForm(!showProjectFrom)
    }


    function toggleServiceForm() {
        setShowServiceForm(!showServiceFrom)
    }

    function removeService(id, cost) {
        
        const serviceUpdate = project.services.filter(
            (service => service.id !== id)
        )

        const projectUpdated = project

        projectUpdated.services = serviceUpdate
        projectUpdated.cost = parseFloat(projectUpdated.cost) - parseFloat(cost)

        fetch(`http://localhost:5000/projects/${project.id}`, {
            method: "PATCH",
            headers: {
                "Content-type": "Application/json"
            },
            body: JSON.stringify(projectUpdated)
        })
        .then((resp) => resp.json())
        .then((data) => {
            setProject(projectUpdated)
            setServices(serviceUpdate)
            setMessage("Serviço removido com sucessso!")
        })
        .catch((err) => console.log(err))

    }

    function createService(project) {

        setMessage("")
        setType("")

        const lastService = project.services[project.services.length - 1]

        lastService.id = uuidv4()

        const lastServiceCost = lastService.cost

        const newCost = parseFloat(project.cost) + parseFloat(lastServiceCost)

        if(newCost > parseFloat(project.budget)) {
            setMessage("Orçamento ultrapassado, verifique o valor do serviço!")
            setType("error")
            project.services.pop()
            return false
        }

        project.cost = newCost

        fetch(`http://localhost:5000/projects/${project.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(project)
        })
        .then((resp) => resp.json())
        .then((data) => {
            
            setShowServiceForm(false)

        })
        .catch((err) => console.log(err))
        
    }

    return(
        <>
        {project.name ? (
            <div className={styles.project_details}>
                <Container customClass="column">
                    {message && <Message type={type} msg={message}/>}
                    <div className={styles.details_container}>
                        <h1>Projeto: {project.name}</h1>
                        <button onClick={toggleProjectForm} className={styles.btn}>
                        {!showProjectFrom ? "Editar Projeto" : "Fechar"}
                        </button>
                        {!showProjectFrom ? (
                            <div className={styles.project_info}>
                                <p>
                                    <span>Categoria:</span> {project.category.name}
                                </p>
                                <p>
                                    <span>Total de Orçamento</span> R${project.budget}
                                </p>
                                <p>
                                    <span>Total Utilizado</span> R${project.cost}
                                </p>
                            </div>
                        ) : (
                            <div className={styles.project_info}>
                                <ProjectForm handleSubmit={editPost} btnText="Concluir Edição" projectData={project}/>
                            </div>
                        )}
                    </div>
                    <div className={styles.service_form_container}>
                            <h2>Adicione um serviço:</h2>
                            <button onClick={toggleServiceForm} className={styles.btn}>
                                {!showServiceFrom ? "Adicionar serviço" : "Fechar"}
                            </button>
                            <div className={styles.project_info}>
                                {showServiceFrom && (
                                    <ServiceForm
                                        handleSubmit={createService}
                                        btnText="Adicionar Serviço"
                                        projectData={project}
                                    />
                                )}
                            </div>
                    </div>
                    <h2>Serviços:</h2>
                    <Container customClass="start">
                        {services.length > 0 && services.map((service) => (
                            <ServiceCard 
                                id={service.id}
                                name={service.name}
                                cost={service.cost}
                                description={service.description}
                                key={service.id}
                                handleRemove={removeService}
                            />
                        ))}
                        {services.length ===0 && <p>Não há servicos cadastrados</p>}
                    </Container>
                </Container>
            </div>
        ) : (
            <Loading />
        )}
        </>
    )
}

export default Project

