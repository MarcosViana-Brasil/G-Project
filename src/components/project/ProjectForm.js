import { useState, useEffect } from 'react'
// import { useFormik } from 'formik'

import Input from '../form/Input'
import Select from '../form/Select'
import SubmitButton from '../form/SubmitButton'
import styles from './ProjectForm.module.css'

export default function ProjectForm({ btnText, handleSubmit, projectData }) {
    const [categories, setCategories] = useState([])
    const [project, setProject] = useState(projectData || [])

    useEffect(() => {
        fetch('http://localhost:5000/categories', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((resp) => resp.json())
            .then((data) => {
                setCategories(data)
            })
            .catch((err) => console.error(err))
    }, [])

    const submit = (e) => {
        e.preventDefault()
        handleSubmit(project)
    }

    function handleCategory(e) {
        setProject({
            ...project,
            category: {
                id: e.target.value,
                name: e.target.options[e.target.selectedIndex].text,
            },
        })
    }

    function useFormik({ initialValues }) {
        const [values, setValues] = useState(initialValues)

        function handleChange(event) {
            const fieldName = event.target.getAttribute('name')
            const value = event.target.value
            setValues({ ...values, [fieldName]: value })
            setProject({ ...project, [fieldName]: value })
        }

        return {
            values,
            handleChange,
        }
    }

    const formik = useFormik({
        initialValues: {
            name: project.name ? project.name : '',
            budget: project.budget ? project.budget : '',
        },
    })

    return (
        <form className={styles.form} onSubmit={submit}>
            <Input
                type="text"
                text="Nome do projeto"
                name="name"
                placeholder="Insira o nome do projeto"
                handleOnChange={formik.handleChange}
                value={formik.values.name}
            />
            <Input
                type="number"
                text="Orçamento do projeto"
                name="budget"
                placeholder="Insira o orçamento total"
                handleOnChange={formik.handleChange}
                value={formik.values.budget}
            />
            <Select
                name="category_id"
                text="Selecione a categoria"
                options={categories}
                handleOnChange={handleCategory}
                value={project.category ? project.category.id : ''}
            />
            <SubmitButton text={btnText} />
        </form>
    )
}
