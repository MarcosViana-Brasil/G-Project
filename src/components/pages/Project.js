import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import Loading from '../layout/Loading'
import Container from '../layout/Container'
import ProjectForm from '../project/ProjectForm'
import styles from './Project.module.css'

export default function Project() {
    const { id } = useParams()

    const [project, setProject] = useState([])
    const [showProjectForm, setShowProjectForm] = useState([false])

    // const [nomeProjeto, setNomeProjeto] = useState('')
    // const [budgetProjeto, setBudgetProjeto] = useState('')
    // const [categoryProjeto, setCategoryProjeto] = useState('')
    // const [atualizaProjeto, setAtualizaProjeto] = useState(false)

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
                    // setNomeProjeto(data.name)
                    // setBudgetProjeto(data.budget)
                    // setCategoryProjeto(data.category.name)
                })
                .catch((err) => console.error(err))
        }, 300)
    }, [id])

    function toggleProjectForm() {
        setShowProjectForm(!showProjectForm)
    }

    function editPost(project) {
        // if (
        //     project.name !== nomeProjeto ||
        //     project.budget !== budgetProjeto ||
        //     project.category.name !== categoryProjeto
        // ) {
        //     setAtualizaProjeto(true)
        // }

        if (project.budget < project.cost) {
            showMessage(
                'O orçamento não pode ser menor que o custo do projeto...'
            )
            return false
        }

        // if (atualizaProjeto) {
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
        // } else {
        //     showMessage('Não houve alteração no projeto...')
        // }
    }

    function showMessage(message) {
        if (message) {
            return alert(message)
        }
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
                    </Container>
                </div>
            ) : (
                <Loading />
            )}
        </>
    )
}
