import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { parse, v4 as uuidv4 } from 'uuid'

import Loading from '../layout/Loading'
import Container from '../layout/Container'
import ProjectForm from '../project/ProjectForm'
import ServiceForm from '../service/ServiceForm'
import styles from './Project.module.css'

export default function Project() {
    const { id } = useParams()

    const [project, setProject] = useState([])
    const [showProjectForm, setShowProjectForm] = useState(false)
    const [showServiceForm, setShowServiceForm] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            fetch(`http://localhost:5000/projects/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((resp) => resp.json())
                .then((data) => {
                    setProject(data)
                })
                .catch((err) => console.error(err))
        }, 300)
    }, [id])

    function toggleProjectForm() {
        setShowProjectForm(!showProjectForm)
    }

    function toggleServiceForm() {
        setShowServiceForm(!showServiceForm)
    }

    function editPost(project) {
        if (project.budget < project.cost) {
            showMessage(
                'O orçamento não pode ser menor que o custo do projeto...'
            )
            return false
        }

        fetch(`http://localhost:5000/projects/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(project),
        })
            .then((resp) => resp.json())
            .then((data) => {
                setProject(data)
                setShowProjectForm(false)
                showMessage('Projeto atualizado com sucesso...')
            })
            .catch((err) => console.error(err))
    }

    function showMessage(message) {
        if (message) {
            return alert(message)
        }
    }

    function createService(project) {
        const lastService = project.services[project.services.length - 1]

        lastService.id = uuidv4()

        const lastServiceCost = lastService.cost

        const newCost = parseFloat(project.cost) + parseFloat(lastServiceCost)

        if (newCost > parseFloat(project.budget)) {
            showMessage(
                'Valor do orçamento ultrapassado, verifique o valor do serviço...'
            )
            project.services.pop()
            return false
        }

        project.cost = newCost

        fetch(`http://localhost:5000/projects/${project.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(project),
        })
            .then((resp) => resp.json())
            .then((data) => {
                console.log(data)
                // setShowProjectForm(false)
                //showMessage('Projeto atualizado com sucesso...')
            })
            .catch((err) => console.error(err))
    }

    return (
        <>
            {project.name ? (
                <div className={styles.project_details}>
                    <Container className="column">
                        <div className={styles.details_container}>
                            <h1>Projeto: {project.name}</h1>
                            <button
                                className={styles.btn}
                                onClick={toggleProjectForm}
                            >
                                {!showProjectForm ? 'Editar projeto' : 'Fechar'}
                            </button>
                            {!showProjectForm ? (
                                <div className={styles.project_info}>
                                    <p>
                                        <span>Categoria:</span>&nbsp;
                                        {project.category.name}
                                    </p>
                                    <p>
                                        <span>Total de Orçamento:</span> R$
                                        {project.budget}
                                    </p>
                                    <p>
                                        <span>Total utilizado:</span> R$
                                        {project.cost}
                                    </p>
                                </div>
                            ) : (
                                <div className={styles.project_info}>
                                    <ProjectForm
                                        handleSubmit={editPost}
                                        btnText="Concluir edição"
                                        projectData={project}
                                    />
                                </div>
                            )}
                        </div>

                        <div className={styles.service_form_container}>
                            <h2>Adicione um serviço</h2>
                            <button
                                className={styles.btn}
                                onClick={toggleServiceForm}
                            >
                                {!showServiceForm
                                    ? 'Adicione um serviço'
                                    : 'Fechar'}
                            </button>
                            <div className={styles.project_info}>
                                {showServiceForm && (
                                    <ServiceForm
                                        handleSubmit={createService}
                                        btnText="Adicionar serviço"
                                        projectData={project}
                                    />
                                )}
                            </div>
                        </div>

                        <h2>Serviços</h2>
                        <Container customClass="start">
                            <p>Itens de Serviços</p>
                        </Container>
                    </Container>
                </div>
            ) : (
                <Loading />
            )}
        </>
    )
}
